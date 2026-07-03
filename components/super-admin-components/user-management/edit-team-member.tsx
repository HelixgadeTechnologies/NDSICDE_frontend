"use client";

import { UserDetails } from "@/types/team-members";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import TagInput from "@/ui/form/tag-input";
import { useUserManagementState } from "@/store/super-admin-store/user-management-store";
import { fetchRoles, RoleData } from "@/lib/api/roles";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { updateUser } from "@/lib/api/user-management";
import { useRoleStore } from "@/store/role-store";
import { useProjects } from "@/context/ProjectsContext";
import { toast } from "react-toastify";
import {
  ACTIVITY_KPI_APPROVAL_ROLE,
  RR_APPROVAL_ROLE,
  getActivityKpiApprovalNumber,
  getActivityKpiApprovalValue,
  getRetirementApprovalNumber,
  getRetirementApprovalValue,
} from "@/utils/team-member-utility";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetails;
  onEdit: () => void;
};

const ALL_LABEL = "All";

export default function EditTeamMember({
  isOpen,
  onClose,
  user,
  onEdit,
}: EditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);

  const { token } = useRoleStore();
  const { projects, projectOptions } = useProjects();

  const {
    fullName,
    email,
    department,
    phoneNumber,
    roleId,
    designation,
    status,
    requestRetirementApprovalRole,
    activityKpiApprovalRole,
    setField,
    resetForm,
  } = useUserManagementState();

  // Tags shown in the UI — either ["All"] or one/more project names
  const [selectedProjectTags, setSelectedProjectTags] = useState<string[]>([]);

  // name-to-id and id-to-name lookups
  const projectNameToId = useMemo(
    () => new Map(projects.map((p) => [p.projectName, p.projectId])),
    [projects],
  );
  const projectIdToName = useMemo(
    () => new Map(projects.map((p) => [p.projectId, p.projectName])),
    [projects],
  );

  const tagOptions = useMemo(
    () => [ALL_LABEL, ...projectOptions.map((o) => o.label)],
    [projectOptions],
  );

  /** Comma-separated IDs derived from the selected tags */
  const assignedProjectIdString = useMemo(() => {
    if (selectedProjectTags.includes(ALL_LABEL)) {
      return projects.map((p) => p.projectId).join(",");
    }
    return selectedProjectTags
      .map((name) => projectNameToId.get(name) ?? "")
      .filter(Boolean)
      .join(",");
  }, [selectedProjectTags, projects, projectNameToId]);

  const handleProjectTagChange = (tags: string[]) => {
    const lastAdded = tags[tags.length - 1];
    if (lastAdded === ALL_LABEL) {
      setSelectedProjectTags([ALL_LABEL]);
      return;
    }
    if (selectedProjectTags.includes(ALL_LABEL) && tags.length > 1) {
      return;
    }
    setSelectedProjectTags(tags.filter((t) => t !== ALL_LABEL));
  };

  // Fetch roles + prefill form when the modal opens; reset on close.
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      resetForm();
      setSelectedProjectTags([]);
      return;
    }

    fetchRoles()
      .then(setRoles)
      .catch((err) => console.error("Failed to load roles:", err));

    // Prefill scalar fields from the user record
    const u = user as UserDetails & {
      designation?: string;
      activityKpiApproval?: number;
      retirementApproval?: number;
    };
    setField("fullName", u.fullName || "");
    setField("email", u.email || "");
    setField("department", u.department || "");
    setField("phoneNumber", u.phoneNumber || "");
    setField("roleId", u.roleId || "");
    setField("designation", u.designation || u.roleName || "");
    setField("status", u.status || "Active");
    setField(
      "activityKpiApprovalRole",
      getActivityKpiApprovalValue(u.activityKpiApproval),
    );
    setField(
      "requestRetirementApprovalRole",
      getRetirementApprovalValue(u.retirementApproval),
    );
  }, [isOpen, user, setField, resetForm]);

  // Prefill assigned project tags once both the user's IDs and project list are available
  useEffect(() => {
    if (!isOpen) return;
    const idsCsv = user.assignedProjectId ?? "";
    if (!idsCsv) {
      setSelectedProjectTags([]);
      return;
    }
    const ids = idsCsv.split(",").map((s) => s.trim()).filter(Boolean);
    // If the user has every project, show the "All" chip
    if (projects.length > 0 && ids.length === projects.length) {
      setSelectedProjectTags([ALL_LABEL]);
      return;
    }
    const names = ids
      .map((id) => projectIdToName.get(id))
      .filter((n): n is string => Boolean(n));
    setSelectedProjectTags(names);
  }, [isOpen, user.assignedProjectId, projects, projectIdToName]);

  const designationOptions = useMemo(
    () => roles.map((r) => ({ label: r.roleName, value: r.roleId })),
    [roles],
  );

  const departments = [
    { label: "Finance", value: "Finance" },
    { label: "Admin", value: "Admin" },
    { label: "Programs", value: "Programs" },
  ];

  const handleDesignationChange = (selectedRoleId: string) => {
    setField("roleId", selectedRoleId);
    const matched = roles.find((r) => r.roleId === selectedRoleId);
    setField("designation", matched?.roleName ?? "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!token) {
      setError("Authentication token not available");
      setIsSubmitting(false);
      return;
    }

    try {
      // Signature is intentionally omitted — users manage their own signature
      // from their settings page, so an admin edit must not overwrite it.
      await updateUser(
        user.userId,
        {
          fullName,
          email,
          roleId,
          designation,
          department,
          phoneNumber,
          status,
          assignedProjectId: assignedProjectIdString,
          activityKpiApproval: getActivityKpiApprovalNumber(activityKpiApprovalRole),
          retirementApproval: getRetirementApprovalNumber(requestRetirementApprovalRole),
        },
        token,
      );
      toast.success("User updated successfully");
      onEdit();
      onClose();
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Failed to update user";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <Heading
        heading="Edit Team Member"
        subtitle={`Update the details for ${user.fullName}`}
      />
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-2 my-4 gap-5">
          <TextInput
            value={fullName}
            label="Full Name"
            name="fullName"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setField("fullName", e.target.value)
            }
          />
          <TextInput
            value={email}
            label="Email Address"
            name="email"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setField("email", e.target.value)
            }
          />
          <DropDown
            label="Department"
            options={departments}
            name="department"
            value={department}
            onChange={(value: string) => setField("department", value)}
          />
          <DropDown
            label="Designation"
            options={designationOptions}
            name="roleId"
            value={roleId}
            placeholder="Select designation"
            onChange={handleDesignationChange}
          />
          <DropDown
            label="Request and Retirement Approval Role"
            options={RR_APPROVAL_ROLE}
            name="requestRetirementApprovalRole"
            value={requestRetirementApprovalRole}
            onChange={(value: string) =>
              setField("requestRetirementApprovalRole", value)
            }
          />
          <DropDown
            label="Activity & KPI Report Approval"
            options={ACTIVITY_KPI_APPROVAL_ROLE}
            name="activityKpiApprovalRole"
            value={activityKpiApprovalRole}
            onChange={(value: string) =>
              setField("activityKpiApprovalRole", value)
            }
          />
          <TextInput
            value={phoneNumber}
            label="Phone Number"
            name="phoneNumber"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setField("phoneNumber", e.target.value)
            }
          />
          <DropDown
            label="Status"
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
            name="status"
            value={status}
            onChange={(value: string) => setField("status", value)}
          />
        </div>
        <div className="col-span-2">
          <TagInput
            label="Assigned Projects"
            placeholder={
              selectedProjectTags.includes(ALL_LABEL)
                ? "All projects selected"
                : "Select projects…"
            }
            value={selectedProjectTags}
            options={
              selectedProjectTags.includes(ALL_LABEL)
                ? [] // lock further selection when "All" is chosen
                : tagOptions
            }
            onChange={handleProjectTagChange}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex w-full mt-6">
          <Button
            content="Save Changes"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
}

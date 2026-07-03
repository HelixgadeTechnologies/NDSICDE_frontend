"use client";

import { useUserManagementState } from "@/store/super-admin-store/user-management-store";
import { ChangeEvent, useMemo, useState, useEffect } from "react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import TagInput from "@/ui/form/tag-input";
import { useRoleStore } from "@/store/role-store";
import { createUser } from "@/lib/api/user-management";
import { useProjects } from "@/context/ProjectsContext";
import { fetchRoles, RoleData } from "@/lib/api/roles";
import {
  ACTIVITY_KPI_APPROVAL_ROLE,
  getActivityKpiApprovalNumber,
  getRetirementApprovalNumber,
} from "@/utils/team-member-utility";
import { toast } from "react-toastify";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ALL_LABEL = "All";

export default function AddTeamMember({ isOpen, onClose }: AddProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      return;
    }
    fetchRoles()
      .then(setRoles)
      .catch((err) => console.error("Failed to load roles:", err));
  }, [isOpen]);

  const designationOptions = useMemo(
    () => roles.map((r) => ({ label: r.roleName, value: r.roleId })),
    [roles],
  );

  // Tags shown in the UI — either ["All"] or one/more project names
  const [selectedProjectTags, setSelectedProjectTags] = useState<string[]>([]);
  const { projects, projectOptions } = useProjects();

  // name-to-id lookup map
  const projectNameToId = useMemo(
    () => new Map(projects.map((p) => [p.projectName, p.projectId])),
    [projects],
  );

  // Options exposed to TagInput: "All" first, then every project name
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
    // If "All" was just added, keep only "All"
    if (lastAdded === ALL_LABEL) {
      setSelectedProjectTags([ALL_LABEL]);
      return;
    }
    // If the user is removing "All", just update normally
    // Don't allow adding individual projects when "All" is already selected
    if (selectedProjectTags.includes(ALL_LABEL) && tags.length > 1) {
      return;
    }
    setSelectedProjectTags(tags.filter((t) => t !== ALL_LABEL));
  };

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
  } = useUserManagementState();
  const { token } = useRoleStore();

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

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication token not available");
      setIsLoading(false);
      return;
    }

    try {
      // The new user adds their own signature later from their settings page,
      // so it is not part of this form anymore.
      const userData = {
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
      };

      await createUser(userData, token);

      onClose();
      toast.success('User Created!')
      window.dispatchEvent(new CustomEvent("teamMemberUpdated"));
    } catch (error) {
      console.error(error);
      setError("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <Heading
        heading="Add New Team Member"
        subtitle="Fill in the details to add a new team member"
      />
      <form onSubmit={addUser}>
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
            isLoading={isLoading}
            isDisabled={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
}

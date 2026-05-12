"use client";

import { useUserManagementState } from "@/store/super-admin-store/user-management-store";
import { ChangeEvent, useMemo, useState, useEffect } from "react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import TagInput from "@/ui/form/tag-input";
import FileUploader from "@/ui/form/file-uploader";
import { useRoleStore } from "@/store/role-store";
import { createUser } from "@/lib/api/user-management";
import { useProjects } from "@/context/ProjectsContext";
import { ACTIVITY_KPI_APPROVAL_ROLE, RR_APPROVAL_ROLE, TEAM_DESIGNATIONS } from "@/utils/team-member-utility";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ALL_LABEL = "All";

export default function AddTeamMember({ isOpen, onClose }: AddProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [signatureFiles, setSignatureFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSignatureFiles([]);
      setError(null);
    }
  }, [isOpen]);

  // Tags shown in the UI — either ["All"] or one/more project names
  const [selectedProjectTags, setSelectedProjectTags] = useState<string[]>([]);
  const { projects, projectOptions } = useProjects();

  // name-to-id lookup map
  const projectNameToId = useMemo(
    () => new Map(projects.map((p) => [p.projectName, p.projectId])),
    [projects]
  );

  // Options exposed to TagInput: "All" first, then every project name
  const tagOptions = useMemo(
    () => [ALL_LABEL, ...projectOptions.map((o) => o.label)],
    [projectOptions]
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
    status,
    assignedProjects,
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
      // Prepare the data for API call
      const userData = {
        fullName,
        email,
        roleId,
        department,
        phoneNumber,
        status,
        assignedProjectId: assignedProjectIdString,
        requestRetirementApprovalRole,
        activityKpiApprovalRole,
      };

      const response = await createUser(userData, token);

      onClose();
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
        {step === 1 ? (
          <>
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
            options={TEAM_DESIGNATIONS}
            name="roleId"
            value={roleId}
            placeholder="Select designation"
            onChange={(value: string) => setField("roleId", value)}
          />
          <DropDown
          label="Request and Retirement Approval Role"
          options={RR_APPROVAL_ROLE}
          name="requestRetirementApprovalRole"
          value={requestRetirementApprovalRole}
          onChange={(value: string) => setField("requestRetirementApprovalRole", value)}
          />
          <DropDown
          label="Activity & KPI Report Approval"
          options={ACTIVITY_KPI_APPROVAL_ROLE}
          name="activityKpiApprovalRole"
          value={activityKpiApprovalRole}
          onChange={(value: string) => setField("activityKpiApprovalRole", value)}
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
        </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <div className="flex w-full mt-6">
              <Button content="Next" type="button" onClick={() => setStep(2)} />
            </div>
          </>
        ) : (
          <>
            <div className="my-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload User's Signature</h3>
              <FileUploader
                maxFiles={1}
                multiple={false}
                autoUpload={false}
                onFilesChange={(files) => setSignatureFiles(files)}
              />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <div className="flex gap-4 mt-6">
              <div className="w-1/2">
                <Button content="Back" isSecondary type="button" onClick={() => setStep(1)} />
              </div>
              <div className="w-1/2">
                <Button
                  content="Save Changes"
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                />
              </div>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

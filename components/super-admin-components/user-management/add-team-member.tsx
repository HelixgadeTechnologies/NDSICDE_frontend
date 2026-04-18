"use client";

import { useUserManagementState } from "@/store/super-admin-store/user-management-store";
import { ChangeEvent, useEffect, useState } from "react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import TagInput from "@/ui/form/tag-input";
import { useRoleStore } from "@/store/role-store";
import { createUser } from "@/lib/api/user-management";
import { useProjects } from "@/context/ProjectsContext";
import { TEAM_DESIGNATIONS } from "@/utils/team-member-utility";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTeamMember({ isOpen, onClose }: AddProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layerOfApproval, setLayerOfApproval] = useState<string>("");
  const { projectOptions } = useProjects();

  const {
    fullName,
    email,
    department,
    phoneNumber,
    roleId,
    status,
    assignedProjects,
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
        assignedProjectId: assignedProjects[0] || "",
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
        <div className="grid grid-cols-2 my-4 gap-4">
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
            <DropDown
              label="Assigned Projects"
              options={projectOptions}
              name="assignedProjects"
              value={assignedProjects[0] || ""}
              onChange={(value: string) => setField("assignedProjects", [value])}
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <Button
          content="Save Changes"
          isLoading={isLoading}
          isDisabled={isLoading}
        />
      </form>
    </Modal>
  );
}

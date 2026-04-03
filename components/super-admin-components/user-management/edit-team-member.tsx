"use client";

import { UserDetails } from "@/types/team-members";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import { useUserManagementState } from "@/store/super-admin-store/user-management-store";
import { fetchRoles } from "@/lib/api/roles";
import { DropdownOption } from "@/types/project-management-types";
import { ChangeEvent, useEffect, useState } from "react";
import TagInput from "@/ui/form/tag-input";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetails;
  onEdit: () => void;
};

export default function EditTeamMember({
  isOpen,
  onClose,
  user,
  onEdit,
}: EditProps) {
  const {
    fullName,
    email,
    department,
    phoneNumber,
    roleId,
    status,
    // assignedProjects,
    setField,
    resetForm,
  } = useUserManagementState();

  useEffect(() => {
    if (isOpen && user) {
      setField("fullName", user.fullName || "");
      setField("email", user.email || "");
      setField("department", user.department || "");
      setField("phoneNumber", user.phoneNumber || "");
      setField("roleId", user.roleId || "");
      setField("status", user.status || "Active");
    }

    // Cleanup when modal closes
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, user, setField, resetForm]);

  const [roleOptions, setRoleOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await fetchRoles();
        const transformedRoles = rolesData.map((role) => ({
          label: role.roleName,
          value: role.roleId
        }));
        setRoleOptions(transformedRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const departmentOptions = [
    { label: "Banking", value: "Banking" },
    { label: "Agriculture", value: "Agriculture" },
    { label: "Finance", value: "Finance" },
    { label: "IT support", value: "IT support" },
    { label: "Operations", value: "Operations" },
    { label: "Management", value: "Management" },
  ];

  const options = [
    "Healthcare Initiative",
    "Education Program",
    "Clean Water Project",
    "Clean Water One",
  ];

  const handleEdit = () => {
    onEdit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <Heading
        heading="User Profile"
        subtitle={`Detailed information about ${user.fullName}`}
      />
      <form action="">
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
            label="Role"
            options={roleOptions}
            name="role"
            value={roleId}
            onChange={(value: string) => setField("roleId", value)}
          />
          <DropDown
            label="Department"
            options={departmentOptions}
            name="department"
            value={department}
            onChange={(value: string) => setField("department", value)}
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
            options={statusOptions}
            name="status"
            value={status}
            onChange={(value: string) => setField("status", value)}
          />
          <div className="col-span-2">
            <TagInput
              label="Assigned Projects"
              options={options}
              tags={[]}
              onChange={() => setField("assignedProjects", [])}
            />
          </div>
        </div>
        <Button content="Save Changes" onClick={handleEdit} />
      </form>
    </Modal>
  );
}

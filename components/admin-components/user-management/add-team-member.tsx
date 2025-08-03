"use client";

import { useUserManagementState } from "@/store/admin-store/user-management-store";
import { ChangeEvent } from "react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import TagInput from "@/ui/form/tag-input";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTeamMember({ isOpen, onClose }: AddProps) {
  const {
    fullName,
    emailAddress,
    department,
    phoneNumber,
    role,
    status,
    // assignedProjects,
    setField,
  } = useUserManagementState();

  const options = [
    "Healthcare Initiative",
    "Education Program",
    "Clean Water Project",
    "Clean Water One",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <Heading
        heading="Add New Team Member"
        subtitle="Fill in the details to add a new team member"
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
            value={emailAddress}
            label="Email Address"
            name="emailAddress"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setField("emailAddress", e.target.value)
            }
          />
          <DropDown
            label="Role"
            options={[]}
            name="role"
            value={role}
            onChange={(value: string) => setField("role", value)}
          />
          <DropDown
            label="Department"
            options={[]}
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
            options={[]}
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
        <Button content="Save Changes" />
      </form>
    </Modal>
  );
}

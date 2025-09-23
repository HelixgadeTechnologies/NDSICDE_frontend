"use client";

import { ProjectTeamDetails } from "@/types/project-management-types";
import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
  member: ProjectTeamDetails;
};

export default function EditProjectTeamModal({ isOpen, onClose }: EditProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
        <Heading heading="Project Team Member" className="text-center" />
        <div className="space-y-6">
          <TextInput
            name="email"
            value=""
            onChange={() => {}}
            placeholder="Enter Email Address"
            label="Email Address"
            isBigger
          />
          <DropDown
            name="role"
            label="Role"
            placeholder="Enter Role"
            options={[]}
            value=""
            onChange={() => {}}
            isBigger
          />
            <Button
              content="Save"
              onClick={onClose}
            />
        </div>
      </Modal>
    </>
  );
}

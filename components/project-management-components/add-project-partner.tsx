"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { useState } from "react";
import { Icon } from "@iconify/react";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddProjectPartnerModal({ isOpen, onClose }: AddProps) {
  const [successModal, setSuccessModal] = useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
        <Heading heading="Project Team Member" className="text-center" />
        <div className="space-y-6">
          <TextInput
            name="partnerOrganizationName"
            value=""
            onChange={() => {}}
            placeholder="---"
            label="Partner Organization Name"
            isBigger
          />
           <DropDown
            name="contactEmail"
            label="Contact Person Email Address"
            placeholder="user@gmail.com"
            options={[]}
            value=""
            onChange={() => {}}
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
          <div className="flex items-center gap-6">
            <Button content="Cancel" isSecondary onClick={onClose} />
            <Button
              content="Add Project Partners"
              onClick={() => {onClose(); setSuccessModal(true)}}
            />
          </div>
        </div>
      </Modal>

      <Modal isOpen={successModal} onClose={() => setSuccessModal(false)}>
        <div className="flex justify-center primary mb-4">
          <Icon icon={"simple-line-icons:check"} width={96} height={96} />
        </div>
        <Heading
          heading="Congratulations!"
          subtitle="Partner added successfully"
          className="text-center"
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button content="Close" onClick={() => setSuccessModal(false)} />
        </div>
      </Modal>
    </>
  );
}

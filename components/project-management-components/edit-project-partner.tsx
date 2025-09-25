"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
// import { useState } from "react";
// import { Icon } from "@iconify/react";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditProjectPartnerModal({ isOpen, onClose }: EditProps) {
//   const [successModal, setSuccessModal] = useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
        <Heading heading="Edit Project Partner" className="text-center" />
        <div className="space-y-6 mt-6">
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
            <Button
              content="Save"
              onClick={onClose}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

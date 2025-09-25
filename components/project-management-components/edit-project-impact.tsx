"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TagInput from "@/ui/form/tag-input";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditProjectImpactModal({ isOpen, onClose }: EditProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
        <Heading heading="Edit Project Impact" className="text-center" />
        <div className="space-y-6 mt-6">
          <TextInput
            name="projectImpactstatement"
            value=""
            onChange={() => {}}
            placeholder="---"
            label="Project Impact Statement"
            isBigger
          />
           <DropDown
            name="thematicAreas"
            label="Thematic Areas"
            placeholder="Environment"
            options={[]}
            value=""
            onChange={() => {}}
            isBigger
          />
          <TagInput
          label="Responsible Person(s)"
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

"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function EditProjectOutputModal({
  isOpen,
  onClose,
}: EditProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <Heading heading="Edit Project Outcome" className="text-center" />
      <div className="space-y-6 mt-6">
        <TextInput
          label="Project Impact Statement"
          value=""
          name="projectImpactStatement"
          onChange={() => {}}
          placeholder="---"
        />
        <DropDown
          label="Linked to Outcome"
          name="linkedToOutcome"
          onChange={() => {}}
          options={[]}
          value=""
        />
        <DropDown
          label="Thematic Areas"
          name="thematicAreas"
          onChange={() => {}}
          options={[]}
          value=""
        />
        <Button content="Save" />
      </div>
    </Modal>
  );
}

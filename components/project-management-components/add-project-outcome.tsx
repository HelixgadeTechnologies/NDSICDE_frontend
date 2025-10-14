"use client";

import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";

type AddProps = {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddProjectOutcomeModal({
    isOpen,
    onClose,
}: AddProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
            <Heading heading="Add Project Outcome" className="text-center"/>
            <div className="space-y-6 mt-6">
                <TextInput
                label="Project Outcome Statement"
                value=""
                name="projectOutcomeStatement"
                onChange={() => {}}
                placeholder="---"
                />
                <DropDown
                label="Outcome Type"
                name="outcomeType"
                onChange={() => {}}
                options={[]}
                value=""
                />
                <DropDown
                label="Linked to Impact"
                name="linkedToImpact"
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
                <TagInput label="Responsible Person(s)"/>
                <div className="flex items-center gap-6">
                    <Button content="Cancel" isSecondary onClick={onClose} />
                    <Button content="Add Project Outcome" />
                </div>
            </div>
        </Modal>
    )
}
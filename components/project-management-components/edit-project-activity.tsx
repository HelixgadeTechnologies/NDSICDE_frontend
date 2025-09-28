"use client";

import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import RadioInput from "@/ui/form/radio";
import DropDown from "@/ui/form/select-dropdown";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditProjectActivity({ isOpen, onClose }: EditProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
        <Heading heading="Project Activities, Format and Attributes" />
        <div className="space-y-6 h-[450px] custom-scrollbar overflow-y-auto overflow-x-hidden pr-5 my-5">
          <TextInput
            name="activityStatement"
            value=""
            onChange={() => {}}
            label="Activity Statement"
            isBigger
          />
          <DropDown
            name="linkedToOutput"
            label="Linked to Output"
            placeholder="---"
            options={[]}
            value=""
            onChange={() => {}}
            isBigger
          />
           <TextInput
            name="activityTotalBudget"
            value=""
            onChange={() => {}}
            label="Activity Total Budget"
            isBigger
          />
          <TagInput label="Responsible Persons" />
          <div className="flex items-center gap-2">
            <DateInput label="Activity Start Date" />
            <DateInput label="Activity End Date" />
          </div>
           <TextInput
            name="activityFrequency"
            value=""
            onChange={() => {}}
            label="Activity Frequency"
            isBigger
          />
          <div className="space-y-1">
            <p className="text-sm text-gray-900 font-medium">Sub-Activity</p>
            <div className="flex items-center gap-2">
                <RadioInput
                label="One Off"
                name="subActivity"
                value=""
                onChange={() => {}}
                is_checked
                />
                <RadioInput
                label="Multiple"
                name="subActivity"
                value=""
                onChange={() => {}}
                is_checked
                />
            </div>
          </div>
        </div>
         <Button content="Add Project Activities" onClick={onClose} />
      </Modal>
    </>
  );
}

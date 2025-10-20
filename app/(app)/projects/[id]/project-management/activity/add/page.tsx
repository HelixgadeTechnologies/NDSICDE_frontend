"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import RadioInput from "@/ui/form/radio";
import DropDown from "@/ui/form/select-dropdown";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";

export default function AddProjectActivity() {
  return (
    <div className="w-[624px]">
      <CardComponent>
        <Heading
          heading="Project Activities, Format and Attributes"
          className="text-center"
        />
        <div className="space-y-6">
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

          {/* this text area and date should only show when "multiple" radio option is selected */}
          <TextareaInput
            label="Describe Action"
            name="describeAction"
            value=""
            onChange={() => {}}
          />
          <DateInput label="Delivery Date (This date must be within the linked activity start and end date" />
          <div className="flex justify-end">
            <p className="primary text-sm cursor-pointer">Add Delivery Date</p>
          </div>
          <Button content="Add Project Activities" />
        </div>
      </CardComponent>
    </div>
  );
}

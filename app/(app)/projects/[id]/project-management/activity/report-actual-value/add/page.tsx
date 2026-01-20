"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";

export default function AddActivityReport() {
  return (
    <div className="w-156">
      <CardComponent>
        <Heading
          heading="Activity Reporting Format and Attributes"
          className="text-center"
        />
        <div className="space-y-6 my-6">
          <TextInput
            name="activityStatement"
            label="Activity Statement"
            value=""
            onChange={() => {}}
          />
          <TextInput
            name="linkedToOutput"
            label="Linked to Output"
            value=""
            onChange={() => {}}
          />
          <TextInput
            name="activityTotalBudget"
            label="Activity Total Budget"
            value=""
            onChange={() => {}}
          />
          <TagInput label="Responsible Person(s)" />
          <p className="text-gray-900 font-bold text-base">
            Activity Frequency{" "}
          </p>
          <TagInput label="Type" />
          <TextareaInput 
          label="Description"
          name="description"
          value=""
          onChange={() => {}}
          />
          <TextareaInput 
          label="Described Action/sub-activity"
          name="describedAction"
          value=""
          onChange={() => {}}
          />
          <div className="flex items-center gap-2">
            <DateInput label="Activity Actual Start Date" />
            <DateInput label="Activity Actual End Date" />
          </div>
           <TextInput
            name="actualCost"
            label="Activity Actual Cost (N)"
            value=""
            onChange={() => {}}
          />
           <TextareaInput 
          label="Activity Narrative"
          name="actualNarrative"
          value=""
          onChange={() => {}}
          />
          <div className="flex items-center gap-8">
            <Button content="Cancel" isSecondary />
            <Button content="Add" />
          </div>
        </div>
      </CardComponent>
    </div>
  );
}

"use client";

import CardComponent from "@/ui/card-wrapper";
import FileUploader from "@/ui/form/file-uploader";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";

export default function AddNewKPIForm() {
  return (
    <CardComponent>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DropDown
            value=""
            name=""
            label="Strategic Objective"
            placeholder="Select Strategic Objective"
            onChange={() => {}}
            options={[]}
            isBigger
          />
          <TextInput
            value=""
            name=""
            label="KPI Name"
            placeholder="Enter KPI Name"
            onChange={() => {}}
            isBigger
          />
          <DropDown
            value=""
            name=""
            label="KPI Type"
            placeholder="Select KPI Type"
            onChange={() => {}}
            options={[]}
            isBigger
          />
          <TextInput
            value=""
            name=""
            label="Baseline"
            placeholder="Enter Baseline"
            onChange={() => {}}
            isBigger
          />
          <TextInput
            value=""
            name=""
            label="Target"
            placeholder="Enter Target"
            onChange={() => {}}
            isBigger
          />
        </div>
        <TextareaInput
          label="Narrative/Observations"
          value=""
          name=""
          placeholder="Provide context or explanations for the KPI values"
          onChange={() => {}}
        />
        <Heading heading="Supporting Evidence" subtitle="Attach files to support your activity report" />
        <FileUploader/>
        <div className="w-[290px] mx-auto">
            <Button content="Submit KPI Report" icon="fluent:clipboard-bullet-list-ltr-16-regular" />
        </div>
      </form>
    </CardComponent>
  );
}

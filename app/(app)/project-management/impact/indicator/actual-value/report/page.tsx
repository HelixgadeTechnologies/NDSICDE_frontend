"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import FileUploader from "@/ui/form/file-uploader";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";

export default function ReportActualValue() {
  return (
    <section className="w-[624px]">
      <CardComponent>
        <Heading
          heading="Indicator Reporting Format and Attributes"
          className="text-center"
        />
        <form className="space-y-6 my-6">
          <TagInput label="Indicator Source" />
          <TagInput label="Thematic Area/Pillar" />
          <TagInput label="Indicator Statement" />
          <TagInput label="Responsible Person(s)" />
          <TagInput label="Disaggregation Type" />
          <div className="space-y-6">
            <Heading heading="Actual Value (s)" sm />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p className="text-sm font-medium">Actual Date</p>
              <DateInput />
              <p className="text-sm font-medium">Cummulative Actual</p>
              <TextInput
                name="cummulativeActual"
                value=""
                onChange={() => {}}
              />
              <p className="text-sm font-medium">Actual Narrative</p>
              <TextareaInput
                name="actualNarrative"
                value=""
                onChange={() => {}}
              />
            </div>
          </div>
          <FileUploader />
          <div className="flex items-center gap-6">
            <Button content="Cancel" isSecondary />
            <div className="w-full">
                <Button
                content="Add"
                href="/project-management/impact/indicator/actual-value/view"
                />
            </div>
          </div>
        </form>
      </CardComponent>
    </section>
  );
}

"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import FileUploader from "@/ui/form/file-uploader";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import DropDown from "@/ui/form/select-dropdown";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import { useState } from "react";

export default function ReportActualValue() {
  const [formData, setFormData] = useState({
    indicatorSource: "",
    thematicArea: "",
    statement: "",
    responsiblePersons: [] as string[],
    disaggregationType: "",
    actualDate: "",
    cummulativeActual: "",
    actualNarrative: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="w-156">
      <CardComponent>
        <Heading
          heading="Indicator Reporting Format and Attributes"
          className="text-center"
        />
        <form className="space-y-6 my-6">
          <TagInput 
            label="Indicator Source" 
            value={formData.indicatorSource ? [formData.indicatorSource] : []}
            onChange={(tags) => handleInputChange("indicatorSource", tags[0])}
          />
          <DropDown 
            label="Thematic Area/Pillar" 
            name="thematicArea"
            value={formData.thematicArea}
            options={THEMATIC_AREAS_OPTIONS}
            onChange={(val) => handleInputChange("thematicArea", val)}
            isBigger
          />
          <TextInput 
            label="Indicator Statement" 
            name="statement"
            value={formData.statement}
            onChange={(e) => handleInputChange("statement", e.target.value)}
            isBigger
          />
          <TagInput 
            label="Responsible Person(s)" 
            value={formData.responsiblePersons}
            onChange={(tags) => handleInputChange("responsiblePersons", tags)}
          />
          <TextInput 
            label="Disaggregation Type" 
            name="disaggregationType"
            value={formData.disaggregationType}
            onChange={(e) => handleInputChange("disaggregationType", e.target.value)}
            isBigger
          />
          <div className="space-y-6">
            <Heading heading="Actual Value (s)" sm />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p className="text-sm font-medium">Actual Date</p>
              <DateInput 
                value={formData.actualDate}
                onChange={(val) => handleInputChange("actualDate", val)}
              />
              <p className="text-sm font-medium">Cummulative Actual</p>
              <TextInput
                name="cummulativeActual"
                value={formData.cummulativeActual}
                onChange={(e) => handleInputChange("cummulativeActual", e.target.value)}
              />
              <p className="text-sm font-medium">Actual Narrative</p>
              <TextareaInput
                name="actualNarrative"
                value={formData.actualNarrative}
                onChange={(e) => handleInputChange("actualNarrative", e.target.value)}
              />
            </div>
          </div>
          <FileUploader />
          <div className="flex items-center gap-6">
            <Button content="Cancel" isSecondary />
            <div className="w-full">
                <Button
                content="Add"
                onClick={() => console.log("Submitting report:", formData)}
                />
            </div>
          </div>
        </form>
      </CardComponent>
    </section>
  );
}

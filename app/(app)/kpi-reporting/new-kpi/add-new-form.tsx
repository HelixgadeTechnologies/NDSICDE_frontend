"use client";

import CardComponent from "@/ui/card-wrapper";
import FileUploader from "@/ui/form/file-uploader";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import { useKPIReportState } from "@/store/partners-store/kpi-report-store";

export default function AddNewKPIForm() {
  const {
    strategicObjective,
    kpiName,
    kpiType,
    baseline,
    target,
    narrative,
    setField,
  } = useKPIReportState();
  return (
    <CardComponent>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DropDown
            value={strategicObjective}
            name="strategicObjective"
            label="Strategic Objective"
            placeholder="Select Strategic Objective"
            onChange={(value: string) => setField("strategicObjective", value)}
            options={[]}
            isBigger
          />
          <TextInput
            value={kpiName}
            name="kpiName"
            label="KPI Name"
            placeholder="Enter KPI Name"
            onChange={(e) => setField("kpiName", e.target.value)}
            isBigger
          />
          <DropDown
            value={kpiType}
            name="kpiType"
            label="KPI Type"
            placeholder="Select KPI Type"
            onChange={(value: string) => setField("kpiType", value)}
            options={[]}
            isBigger
          />
          <TextInput
            value={baseline}
            name="baseline"
            label="Baseline"
            placeholder="Enter Baseline"
            onChange={(e) => setField("baseline", e.target.value)}
            isBigger
          />
          <TextInput
            value={target}
            name="target"
            label="Target"
            placeholder="Enter Target"
            onChange={(e) => setField("target", e.target.value)}
            isBigger
          />
        </div>
        <TextareaInput
          label="Narrative/Observations"
          value={narrative}
          name="narrative"
          placeholder="Provide context or explanations for the KPI values"
          onChange={(e) => setField("narrative", e.target.value)}
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

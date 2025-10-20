"use client";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import TagInput from "@/ui/form/tag-input";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import RadioInput from "@/ui/form/radio";
import DateInput from "@/ui/form/date-input";
import DisaggregationComponent from "@/ui/disaggregation-component";
import IndicatorSourceSelector, { IndicatorSourceData } from "@/ui/indicator-source-selector";
import { useState } from "react";

export default function AddImpactIndicator() {
  const [indicatorSourceData, setIndicatorSourceData] = useState<IndicatorSourceData | null>(null);
  
    const handleIndicatorSourceChange = (data: IndicatorSourceData) => {
      setIndicatorSourceData(data);
      console.log("Indicator Source Data:", data);
    };
  return (
    <div className="border border-[#E4E7EC] pt-8 px-6 pb-6 rounded-[10px] bg-white w-[624px]">
      <Heading heading="Add Outcome Indicator" className="text-center" />
      <form className="space-y-6 my-8">
        {/* indicator source */}
       <IndicatorSourceSelector 
          onChange={handleIndicatorSourceChange}
          thematicAreaOptions={[]}
          indicatorStatementOptions={[]}
        />

        {/* link to indicator sdn */}
        <DropDown
          label="Link Indicator to SDN Org KPIs (Optional)"
          value=""
          name="link"
          placeholder="---"
          onChange={() => {}}
          options={[]}
          isBigger
        />

        {/* indicator definition */}
        <TextInput
          label="Indicator Definition (Optional)"
          value=""
          name="indicatorDefinition"
          placeholder="---"
          onChange={() => {}}
          isBigger
        />

        {/* specific area */}
        <DropDown
          label="Specific Area"
          value=""
          name="specificArea"
          placeholder="---"
          onChange={() => {}}
          options={[]}
          isBigger
        />

        {/* unit of measurement */}
        <DropDown
          label="Unit of Measurement"
          value=""
          name="unitOfMeasurement"
          placeholder="---"
          onChange={() => {}}
          options={[]}
          isBigger
        />

        {/* items in measurement */}
        <DropDown
          label="Items in Measurement"
          value=""
          name="itemsInMeasurement"
          placeholder="---"
          onChange={() => {}}
          options={[]}
          isBigger
        />

        {/* checkboxes */}
        <DisaggregationComponent />

        {/* baseline */}
        <div className="space-y-1">
          <p className="text-gray-900 text-sm font-medium mb-3">Baseline</p>
          {/* baseline date */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium w-full">Baseline Date</p>
            <DateInput />
          </div>
          {/* cumulative value */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium w-full">Cumulative Value</p>
            <div className="w-full">
              <TextInput
                placeholder="200"
                value=""
                name="cumulativeValue"
                onChange={() => {}}
              />
            </div>
          </div>
          {/* baseline narrative */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium w-full">Baseline Narrative</p>
            <div className="w-full">
              <TextareaInput
                placeholder="---"
                value=""
                name="baselineNarrative"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>

        {/* add target */}
        <div className="space-y-1">
          <p className="primary text-sm font-medium mb-3">Add Target</p>
          {/* target date */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium w-full">Target Date</p>
            <DateInput />
          </div>
          {/* cumulative target */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium w-full">Cumulative Target</p>
            <div className="w-full">
              <TextInput
                placeholder="200"
                value=""
                name="cumulativeTarget"
                onChange={() => {}}
              />
            </div>
          </div>
          {/* target narrative */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium w-full">Target Narrative</p>
            <div className="w-full">
              <TextareaInput
                placeholder="---"
                value=""
                name="targetNarrative"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>

        {/* target type */}
        <div className="space-y-1">
          <p className="text-[#101928] text-sm font-medium">Target Type</p>
          <div className="flex items-center gap-2">
            <RadioInput
              label="Cumulative"
              value="cumulative"
              name="targetType"
              is_checked
              onChange={() => {}}
            />
            <RadioInput
              label="Periodic"
              value="periodic"
              name="targetType"
              is_checked
              onChange={() => {}}
            />
          </div>
        </div>

        <TagInput label="Responsible Person(s)" />

        {/* buttons */}
        <div className="flex items-center gap-8">
          <Button content="Cancel" isSecondary />
          <Button content="Add" />
        </div>
      </form>
    </div>
  );
}

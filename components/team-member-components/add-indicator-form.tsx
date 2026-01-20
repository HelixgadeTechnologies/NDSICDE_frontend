"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Icon } from "@iconify/react";
import IndicatorSourceSelector, {
  IndicatorSourceData,
} from "@/ui/indicator-source-selector";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import DisaggregationComponent from "@/ui/disaggregation-component";
import DateInput from "@/ui/form/date-input";
import TextareaInput from "@/ui/form/textarea";
import RadioInput from "@/ui/form/radio";
import TagInput from "@/ui/form/tag-input";
import Button from "@/ui/form/button";

// Target type definition (single target now)
type Target = {
  targetDate: string;
  cumulativeTarget: string;
  targetNarrative: string;
};

export default function AddIndicatorForm() {
  // Form state
  const [indicatorSourceData, setIndicatorSourceData] = useState<IndicatorSourceData | null>(null);
  const [linkKpiToSdnOrgKpi, setLinkKpiToSdnOrgKpi] = useState("");
  const [definition, setDefinition] = useState("");
  const [specificArea, setSpecificArea] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [itemInMeasure, setItemInMeasure] = useState("");
  const [disaggregationId, setDisaggregationId] = useState("");
  const [baseLineDate, setBaseLineDate] = useState("");
  const [cumulativeValue, setCumulativeValue] = useState("");
  const [baselineNarrative, setBaselineNarrative] = useState("");
  const [targetType, setTargetType] = useState("cumulative");
  const [responsiblePersons, setResponsiblePersons] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [resultTypeId, setResultTypeId] = useState("360e3b36-e541-464e-90e0-e3ee3095a139");

  // Single target state
  const [target, setTarget] = useState<Target>({
    targetDate: "",
    cumulativeTarget: "",
    targetNarrative: "",
  });

  // Handle indicator source data
  const handleIndicatorSourceChange = (data: IndicatorSourceData) => {
    setIndicatorSourceData(data);
    console.log("Indicator Source Data:", data);
  };

  // Handle tag input change
  const handleTagsChange = (tags: string[]) => {
    setResponsiblePersons(tags);
  };

  // Handle target changes
  const handleTargetChange = (field: keyof Target, value: string) => {
    setTarget(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sample options for dropdowns (only the ones you requested)
  const unitOfMeasurementOptions = [
    { label: "Percentage", value: "Percentage" },
    { label: "Number", value: "Number" },
    { label: "Ratio", value: "Ratio" },
    { label: "Score", value: "Score" },
    { label: "Count", value: "Count" },
    { label: "Hours", value: "Hours" },
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  const sdnKpiOptions = [
    { label: "KPI-001", value: "KPI-001" },
    { label: "KPI-002", value: "KPI-002" },
    { label: "KPI-003", value: "KPI-003" },
    { label: "KPI-004", value: "KPI-004" },
    { label: "KPI-005", value: "KPI-005" },
  ];

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the payload
    const payload = {
      isCreate: true,
      data: {
        indicatorId: `uuid-${Math.random().toString(36).substr(2, 9)}`, // Generate random ID for now
        indicatorSource: indicatorSourceData?.indicatorSource === "organizational-kpi" 
          ? "Organization KPI" 
          : indicatorSourceData?.indicatorSource === "custom-indicator"
            ? "Custom Indicator"
            : null,
        thematicAreasOrPillar: indicatorSourceData?.indicatorSource === "organizational-kpi" 
          ? indicatorSourceData?.thematicAreaPillar 
          : "",
        statement: indicatorSourceData?.indicatorSource === "custom-indicator"
            ? indicatorSourceData?.customIndicatorStatement
            : "",
        linkKpiToSdnOrgKpi: linkKpiToSdnOrgKpi,
        definition: definition,
        specificArea: specificArea,
        unitOfMeasure: unitOfMeasure,
        itemInMeasure: itemInMeasure,
        disaggregationId: disaggregationId,
        baseLineDate: baseLineDate ? `${baseLineDate}T00:00:00Z` : "",
        cumulativeValue: cumulativeValue,
        baselineNarrative: baselineNarrative,
        targetDate: target.targetDate ? `${target.targetDate}T00:00:00Z` : "",
        cumulativeTarget: target.cumulativeTarget || "",
        targetNarrative: target.targetNarrative || "",
        targetType: targetType === "cumulative" ? "Cumulative" : "Periodic",
        responsiblePersons: responsiblePersons.join(", "),
        result: result || `uuid-${Math.random().toString(36).substr(2, 9)}`,
        resultTypeId: resultTypeId
      }
    };

    console.log("Form Payload:", JSON.stringify(payload, null, 2));
    
    // Here you would typically send the payload to an API
    // fetch('YOUR_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // })
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-8 max-w-4xl mx-auto p-6">
      {/* indicator source */}
      <IndicatorSourceSelector
        onChange={handleIndicatorSourceChange}
        thematicAreaOptions={[]} // Removed options since it's text input
        indicatorStatementOptions={[]} // Removed options since it's text input
      />

      {/* link to indicator sdn - KEEP as dropdown */}
      <DropDown
        label="Link Indicator to SDN Org KPIs (Optional)"
        value={linkKpiToSdnOrgKpi}
        name="linkKpiToSdnOrgKpi"
        placeholder="---"
        onChange={(value) => setLinkKpiToSdnOrgKpi(value)}
        options={sdnKpiOptions}
        isBigger
      />

      {/* indicator definition - CHANGED to text input */}
      <TextInput
        label="Indicator Definition (Optional)"
        value={definition}
        name="definition"
        placeholder="Enter indicator definition"
        onChange={(e) => setDefinition(e.target.value)}
        isBigger
      />

      {/* specific area - CHANGED to text input */}
      <TextInput
        label="Specific Area"
        value={specificArea}
        name="specificArea"
        placeholder="Enter specific area"
        onChange={(e) => setSpecificArea(e.target.value)}
        isBigger
      />

      {/* unit of measurement - KEEP as dropdown */}
      <DropDown
        label="Unit of Measurement"
        value={unitOfMeasure}
        name="unitOfMeasure"
        placeholder="Select unit of measurement"
        onChange={(value) => setUnitOfMeasure(value)}
        options={unitOfMeasurementOptions}
        isBigger
      />

      {/* items in measurement - CHANGED to text input */}
      <TextInput
        label="Items in Measurement"
        value={itemInMeasure}
        name="itemInMeasure"
        placeholder="Enter items in measurement"
        onChange={(e) => setItemInMeasure(e.target.value)}
        isBigger
      />

      {/* checkboxes */}
      <DisaggregationComponent 
        onChange={(value: SetStateAction<string>) => setDisaggregationId(value)}
      />

      {/* baseline */}
      <div className="space-y-1 my-2 rounded-lg">
        <p className="text-gray-900 text-sm font-medium mb-3">Baseline</p>
        {/* baseline date */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <p className="text-sm font-medium w-1/3">Baseline Date</p>
          <div className="w-2/3">
            <DateInput
              value={baseLineDate}
              onChange={(value) => setBaseLineDate(value)}
            />
          </div>
        </div>
        {/* cumulative value */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <p className="text-sm font-medium w-1/3">Cumulative Value</p>
          <div className="w-2/3">
            <TextInput
              placeholder="30%"
              value={cumulativeValue}
              name="cumulativeValue"
              onChange={(e) => setCumulativeValue(e.target.value)}
            />
          </div>
        </div>
        {/* baseline narrative */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium w-1/3">Baseline Narrative</p>
          <div className="w-2/3">
            <TextareaInput
              placeholder="Enter baseline narrative"
              value={baselineNarrative}
              name="baselineNarrative"
              onChange={(e) => setBaselineNarrative(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SINGLE TARGET SECTION */}
      <div className="space-y-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-900 text-sm font-medium">Target</span>
        </div>

        {/* target date */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium w-1/3">Target Date</p>
          <div className="w-2/3">
            <DateInput
              value={target.targetDate}
              onChange={(value) => handleTargetChange('targetDate', value)}
            />
          </div>
        </div>
        
        {/* cumulative target */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium w-1/3">Cumulative Target</p>
          <div className="w-2/3">
            <TextInput
              placeholder="80%"
              value={target.cumulativeTarget}
              name="cumulativeTarget"
              onChange={(e) => handleTargetChange('cumulativeTarget', e.target.value)}
            />
          </div>
        </div>
        
        {/* target narrative */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium w-1/3">Target Narrative</p>
          <div className="w-2/3">
            <TextareaInput
              placeholder="Enter target narrative"
              value={target.targetNarrative}
              name="targetNarrative"
              onChange={(e) => handleTargetChange('targetNarrative', e.target.value)}
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
            is_checked={targetType === "cumulative"}
            onChange={() => setTargetType("cumulative")}
          />
          <RadioInput
            label="Periodic"
            value="periodic"
            name="targetType"
            is_checked={targetType === "periodic"}
            onChange={() => setTargetType("periodic")}
          />
        </div>
      </div>

      <TagInput 
        label="Responsible Person(s)" 
        onChange={handleTagsChange}
      />

      {/* buttons */}
      <div className="flex items-center gap-8 pt-4">
        <Button 
          content="Cancel" 
          isSecondary 
          type="button"
        />
        <Button 
          content="Add Indicator" 
          onClick={() => {}}
        />
      </div>
    </form>
  );
}
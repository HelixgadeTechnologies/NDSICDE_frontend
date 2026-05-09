"use client";

import { useState, useEffect } from "react";
import DropDown from "@/ui/form/select-dropdown";
import RadioInput from "@/ui/form/radio";
import TextInput from "@/ui/form/text-input";

type IndicatorSource = "organizational-kpi" | "custom-indicator" | null;

export interface IndicatorSourceData {
  indicatorSource: string;
  thematicAreasOrPillar: string | null;
  statement: string | null;
  linkKpiToSdnOrgKpi: string | null;
}


interface IndicatorSourceSelectorProps {
  onChange: (data: IndicatorSourceData) => void;
  thematicAreaOptions?: Array<{ label: string; value: string }>;
  initialValues?: Partial<IndicatorSourceData>;
  kpiOptions?: Array<{ label: string; value: string }>;
  isLoadingKpis?: boolean;
}


export default function IndicatorSourceSelector({
  onChange,
  thematicAreaOptions = [],
  initialValues,
  kpiOptions = [],
  isLoadingKpis = false,
}: IndicatorSourceSelectorProps) {

  const [selectedSource, setSelectedSource] = useState<"organizational-kpi" | "custom-indicator" | null>(
    initialValues?.indicatorSource === "organizational-kpi" || initialValues?.indicatorSource === "custom-indicator" 
      ? initialValues.indicatorSource 
      : null
  );
  
  const [thematicAreaPillar, setThematicAreaPillar] = useState<string | null>(
    initialValues?.thematicAreasOrPillar !== undefined && initialValues?.thematicAreasOrPillar !== null
      ? initialValues.thematicAreasOrPillar
      : null
  );
  
  const [customIndicatorStatement, setCustomIndicatorStatement] = useState<string | null>(
    initialValues?.statement !== undefined && initialValues?.statement !== null
      ? initialValues.statement
      : null
  );

  const [linkKpiToSdnOrgKpi, setLinkKpiToSdnOrgKpi] = useState<string | null>(
    initialValues?.linkKpiToSdnOrgKpi !== undefined && initialValues?.linkKpiToSdnOrgKpi !== null
      ? initialValues.linkKpiToSdnOrgKpi
      : null
  );


  // Notify parent of changes
  useEffect(() => {
    let indicatorSourceValue = "";
    let thematicAreaValue: string | null = null;
    let statementValue: string | null = null;
    let linkKpiValue: string | null = null;

    if (selectedSource === "organizational-kpi") {
      indicatorSourceValue = "Organization KPI";
      thematicAreaValue = thematicAreaPillar;
      statementValue = null;
      linkKpiValue = linkKpiToSdnOrgKpi;
    } else if (selectedSource === "custom-indicator") {
      indicatorSourceValue = "Custom Indicator";
      thematicAreaValue = null;
      statementValue = customIndicatorStatement;
      linkKpiValue = null;
    }

    const data: IndicatorSourceData = {
      indicatorSource: indicatorSourceValue,
      thematicAreasOrPillar: thematicAreaValue,
      statement: statementValue,
      linkKpiToSdnOrgKpi: linkKpiValue,
    };
    onChange(data);
  }, [selectedSource, thematicAreaPillar, customIndicatorStatement, linkKpiToSdnOrgKpi, onChange]);


  const handleSourceSelect = (source: "organizational-kpi" | "custom-indicator") => {
    if (selectedSource === source) {
      // Deselect if clicking the same source
      setSelectedSource(null);
      setThematicAreaPillar(null);
      setCustomIndicatorStatement(null);
    } else {
      // Select new source
      setSelectedSource(source);
      if (source === "organizational-kpi") {
        setCustomIndicatorStatement(null);
      } else {
        setThematicAreaPillar(null);
        setLinkKpiToSdnOrgKpi(null);
      }
    }
  };


  const handleThematicAreaChange = (value: string | React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = typeof value === 'string' ? value : value.target.value;
    // Set to null if empty string, otherwise keep the value
    setThematicAreaPillar(newValue.trim() === "" ? null : newValue);
  };

  const handleCustomIndicatorChange = (value: string | React.ChangeEvent<HTMLInputElement>) => {
    const newValue = typeof value === 'string' ? value : value.target.value;
    // Set to null if empty string, otherwise keep the value
    setCustomIndicatorStatement(newValue.trim() === "" ? null : newValue);
  };

  return (
    <div className="space-y-4">
      {/* Indicator Source Selection - Radio Buttons */}
      <div className="space-y-1">
        <p className="text-[#101928] text-sm font-medium">Indicator Source</p>
        <div className="flex items-center gap-2">
          <RadioInput
            label="Organization KPI"
            value="organizational-kpi"
            name="indicatorSource"
            is_checked={selectedSource === "organizational-kpi"}
            onChange={() => handleSourceSelect("organizational-kpi")}
          />
          <RadioInput
            label="Custom Indicator"
            value="custom-indicator"
            name="indicatorSource"
            is_checked={selectedSource === "custom-indicator"}
            onChange={() => handleSourceSelect("custom-indicator")}
          />
        </div>
      </div>

      {/* Conditional Rendering Based on Selection */}
      {selectedSource === "organizational-kpi" && (
        <div className="space-y-4 mt-4">
          <DropDown
            label="Thematic Area/Pillar"
            value={thematicAreaPillar || ""} // Convert null to empty string for UI
            name="thematicAreasOrPillar"
            placeholder="Select Thematic Area"
            onChange={handleThematicAreaChange}
            options={thematicAreaOptions}
            isBigger
          />
          <DropDown
            label="SDN Org KPIs"
            value={linkKpiToSdnOrgKpi || ""}
            name="linkKpiToSdnOrgKpi"
            placeholder={isLoadingKpis ? "Loading KPIs..." : "Select a KPI"}
            onChange={(val) => setLinkKpiToSdnOrgKpi(val as string)}
            options={kpiOptions}
            isBigger
          />
        </div>

      )}

      {selectedSource === "custom-indicator" && (
        <div className="space-y-4 mt-4">
          <TextInput
            label="Indicator Statement"
            value={customIndicatorStatement || ""} // Convert null to empty string for UI
            name="statement"
            placeholder="Enter indicator statement"
            onChange={handleCustomIndicatorChange}
            isBigger
          />
        </div>
      )}

      {/* Show message when no source is selected */}
      {!selectedSource && (
        <div className="text-gray-500 text-sm italic mt-2">
          Please select an indicator source above to continue
        </div>
      )}
    </div>
  );
}
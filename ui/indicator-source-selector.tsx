"use client";

import { useState, useEffect } from "react";
import DropDown from "@/ui/form/select-dropdown";
import RadioInput from "@/ui/form/radio";
import TextInput from "@/ui/form/text-input";

type IndicatorSource = "organizational-kpi" | "custom-indicator" | null;

export interface IndicatorSourceData {
  indicatorSource: IndicatorSource;
  thematicAreaPillar: string;
  // indicatorStatement: string;
  customIndicatorStatement?: string;
}

interface IndicatorSourceSelectorProps {
  onChange: (data: IndicatorSourceData) => void;
  thematicAreaOptions?: Array<{ label: string; value: string }>;
  indicatorStatementOptions?: Array<{ label: string; value: string }>;
  initialValues?: Partial<IndicatorSourceData>;
}

export default function IndicatorSourceSelector({
  onChange,
  thematicAreaOptions = [],
  initialValues,
}: IndicatorSourceSelectorProps) {
  const [selectedSource, setSelectedSource] = useState<"organizational-kpi" | "custom-indicator" | null>(
    initialValues?.indicatorSource === "organizational-kpi" || initialValues?.indicatorSource === "custom-indicator" 
      ? initialValues.indicatorSource 
      : null
  );
  const [thematicAreaPillar, setThematicAreaPillar] = useState(
    initialValues?.thematicAreaPillar || ""
  );
  const [customIndicatorStatement, setCustomIndicatorStatement] = useState(
    initialValues?.customIndicatorStatement || ""
  );

  // Notify parent of changes
  useEffect(() => {
    const data: IndicatorSourceData = {
      indicatorSource: selectedSource,
      thematicAreaPillar: selectedSource === "organizational-kpi" ? thematicAreaPillar : "",
      customIndicatorStatement: selectedSource === "custom-indicator" ? customIndicatorStatement : "",
      // indicatorStatement: ""
    };
    onChange(data);
  }, [selectedSource, thematicAreaPillar, customIndicatorStatement]);

  const handleSourceSelect = (source: "organizational-kpi" | "custom-indicator") => {
    if (selectedSource === source) {
      // Deselect if clicking the same source
      setSelectedSource(null);
      setThematicAreaPillar("");
      setCustomIndicatorStatement("");
    } else {
      // Select new source
      setSelectedSource(source);
      if (source === "organizational-kpi") {
        setCustomIndicatorStatement("");
      } else {
        setThematicAreaPillar("");
      }
    }
  };

  const handleThematicAreaChange = (value: string | React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = typeof value === 'string' ? value : value.target.value;
    setThematicAreaPillar(newValue);
  };

  const handleCustomIndicatorChange = (value: string | React.ChangeEvent<HTMLInputElement>) => {
    const newValue = typeof value === 'string' ? value : value.target.value;
    setCustomIndicatorStatement(newValue);
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
        <div className="space-y-4 border-l-2 border-blue-500 pl-4 mt-4">
          <DropDown
            label="Thematic Area/Pillar"
            value={thematicAreaPillar}
            name="thematicAreaPillar"
            placeholder="Select Thematic Area"
            onChange={handleThematicAreaChange}
            options={thematicAreaOptions}
            isBigger
          />
        </div>
      )}

      {selectedSource === "custom-indicator" && (
        <div className="space-y-4 border-l-2 border-green-500 pl-4 mt-4">
          <TextInput
            label="Custom Indicator Statement"
            value={customIndicatorStatement}
            name="customIndicatorStatement"
            placeholder="Enter custom indicator statement"
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
"use client";

import { useState, useEffect, FormEvent } from "react";
import DropDown from "@/ui/form/select-dropdown";
import RadioInput from "@/ui/form/radio";
import TextInput from "@/ui/form/text-input";

type IndicatorSource = "organizational-kpi" | "custom-indicator";

export interface IndicatorSourceData {
  indicatorSource: IndicatorSource;
  thematicAreaPillar: string;
  indicatorStatement: string;
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
  indicatorStatementOptions = [],
  initialValues,
}: IndicatorSourceSelectorProps) {
  const [indicatorSource, setIndicatorSource] = useState<IndicatorSource>(
    initialValues?.indicatorSource || "organizational-kpi"
  );
  const [thematicAreaPillar, setThematicAreaPillar] = useState(
    initialValues?.thematicAreaPillar || ""
  );
  const [indicatorStatement, setIndicatorStatement] = useState(
    initialValues?.indicatorStatement || ""
  );

  // Filter indicator statements based on selected thematic area
  const filteredIndicatorStatements = indicatorStatementOptions.filter(
    (option) => {
      // Add your filtering logic here based on thematicAreaPillar
      // For now, returning all options - you can customize this
      return true;
    }
  );

  // Notify parent of changes
  useEffect(() => {
    onChange({
      indicatorSource,
      thematicAreaPillar,
      indicatorStatement,
    });
  }, [indicatorSource, thematicAreaPillar, indicatorStatement]);

  const handleIndicatorSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSource = e.target.value as IndicatorSource;
    setIndicatorSource(newSource);
    
    // Reset thematic area and indicator statement when switching modes
    if (newSource === "custom-indicator") {
      setThematicAreaPillar("");
      setIndicatorStatement("");
    }
  };

  const handleThematicAreaChange = (value: string | React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = typeof value === 'string' ? value : value.target.value;
    setThematicAreaPillar(newValue);
    // Reset indicator statement when thematic area changes
    setIndicatorStatement("");
  };

  const handleIndicatorStatementChange = (value: string | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newValue = typeof value === 'string' ? value : value.target.value;
    setIndicatorStatement(newValue);
  };

  return (
    <div className="space-y-4">
      {/* Indicator Source */}
      <div className="space-y-1">
        <p className="text-[#101928] text-sm font-medium">Indicator Source</p>
        <div className="flex items-center gap-2">
          <RadioInput
            label="Organization KPI"
            value="organizational-kpi"
            name="indicatorSource"
            is_checked={indicatorSource === "organizational-kpi"}
            onChange={handleIndicatorSourceChange}
          />
          <RadioInput
            label="Custom Indicator"
            value="custom-indicator"
            name="indicatorSource"
            is_checked={indicatorSource === "custom-indicator"}
            onChange={handleIndicatorSourceChange}
          />
        </div>
      </div>

      {/* Thematic Area/Pillar */}
      <DropDown
        label="Thematic Area/Pillar"
        value={thematicAreaPillar}
        name="thematicAreaPillar"
        placeholder={indicatorSource === "custom-indicator" ? '---' : 'Enter Thematic Area'}
        onChange={handleThematicAreaChange}
        options={thematicAreaOptions}
        isBigger
        isDisabled={indicatorSource === "custom-indicator"}
      />

      {/* Indicator Statement - Conditional rendering based on source */}
      {indicatorSource === "organizational-kpi" ? (
        <DropDown
          label="Indicator Statement"
          value={indicatorStatement}
          name="indicatorStatement"
          placeholder={!thematicAreaPillar ? '---' : 'Select indicator statement'}
          onChange={handleIndicatorStatementChange}
          options={filteredIndicatorStatements}
          isBigger
          isDisabled={!thematicAreaPillar}
        />
      ) : (
        <TextInput
          label="Custom Indicator Statement"
          value={indicatorStatement}
          name="indicatorStatement"
          placeholder="Enter custom indicator statement"
          onChange={handleIndicatorStatementChange}
        />
      )}
    </div>
  );
}
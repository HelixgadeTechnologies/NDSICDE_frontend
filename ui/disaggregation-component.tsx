"use client";

import { useState, ChangeEvent } from "react";
import Checkbox from "@/ui/form/checkbox";
import DropDown from "./form/select-dropdown";
import TextInput from "./form/text-input";
import naija from "naija-state-local-government";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";

const checkboxLabels = [
  "Gender & Social Inclusion",
  "Age",
  "State",
  "Year",
  "Thematic Area",
  "Donor Type",
  "Policy Action Type",
  "Institution Type",
  "Sector",
  "None",
];

type DisaggItem = {
  type: string;
  category: string;
  target: number;
};

type DisaggregationComponentProps = {
  onChange?: (value: string) => void;
  onDisaggregationIdChange?: (id: string) => void; // New prop for disaggregationId
};

export default function DisaggregationComponent({ 
  onChange, 
  onDisaggregationIdChange 
}: DisaggregationComponentProps) {
  const [checkboxes, setCheckboxes] = useState<boolean[]>(
    Array(checkboxLabels.length).fill(false)
  );

  const [singleValues, setSingleValues] = useState<Record<string, string>>({});

  const notifyChange = (currentCheckboxes: boolean[], currentSingleValues: Record<string, string>) => {
    if (!onChange) return;

    const items: DisaggItem[] = [];

    checkboxLabels.forEach((label, index) => {
      const isChecked = currentCheckboxes[index];
      if (!isChecked || label === "None") return;

      if (label === "Gender & Social Inclusion") {
        items.push({ type: "Gender & Social Inclusion", category: "Male", target: 0 });
        items.push({ type: "Gender & Social Inclusion", category: "Female", target: 0 });
        items.push({ type: "Gender & Social Inclusion", category: "PwDs", target: 0 });
      } else if (label === "Age") {
        items.push({ type: "Age", category: "Below 18", target: 0 });
        items.push({ type: "Age", category: "18-35", target: 0 });
        items.push({ type: "Age", category: "36-50", target: 0 });
        items.push({ type: "Age", category: "50+", target: 0 });
      } else {
        items.push({ type: label, category: currentSingleValues[label] || "", target: 0 });
      }
    });

    onChange(JSON.stringify(items));
  };

  const toggleCheckbox = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    const isNoneCheckbox = index === checkboxLabels.length - 1;
    const clickedLabel = checkboxLabels[index];

    // Notify parent about the disaggregationId (clicked checkbox label)
    if (onDisaggregationIdChange) {
      onDisaggregationIdChange(clickedLabel);
    }

    if (isNoneCheckbox) {
      const newNoneState = !updatedCheckboxes[index];
      // If none is checked, uncheck everything else
      const newCheckboxes = Array(checkboxLabels.length)
          .fill(false)
          .map((_, i) => (i === index ? newNoneState : false));
      
      setCheckboxes(newCheckboxes);
      notifyChange(newCheckboxes, singleValues);
    } else {
      updatedCheckboxes[index] = !updatedCheckboxes[index];
      updatedCheckboxes[checkboxLabels.length - 1] = false; // Uncheck "None"
      setCheckboxes(updatedCheckboxes);
      notifyChange(updatedCheckboxes, singleValues);
    }
  };

  const handleSingleInputChange = (label: string, val: string) => {
    const newValues = { ...singleValues, [label]: val };
    setSingleValues(newValues);
    notifyChange(checkboxes, newValues);
  };

  // Get checked labels (except None)
  const checkedLabels = checkboxLabels.filter(
    (_, index) => checkboxes[index] && checkboxLabels[index] !== "None"
  );

  const renderInput = (label: string) => {
    const val = singleValues[label] || "";

    if (label === "Gender & Social Inclusion") {
      return (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Gender & Social Inclusion Categories</p>
          <div className="flex gap-4 items-center">
            <div className="flex-1 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-sm">Male</div>
            <div className="flex-1"><TextInput name="target-male" value="" placeholder="Target" onChange={() => {}} /></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-sm">Female</div>
            <div className="flex-1"><TextInput name="target-female" value="" placeholder="Target" onChange={() => {}} /></div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-sm">PwDs</div>
            <div className="flex-1"><TextInput name="target-pwds" value="" placeholder="Target" onChange={() => {}} /></div>
          </div>
        </div>
      );
    }

    if (label === "Age") {
      const ranges = ["Below 18", "18-35", "36-50", "50+"];
      return (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Age Ranges</p>
          {ranges.map(range => (
            <div key={range} className="flex gap-4 items-center">
              <div className="flex-1 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-sm">{range}</div>
              <div className="flex-1"><TextInput name={`target-${range}`} value="" placeholder="Target" onChange={() => {}} /></div>
            </div>
          ))}
        </div>
      );
    }

    if (label === "State") {
      const stateOptions = naija.states().map((s: string) => ({ label: s, value: s }));
      return (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <DropDown
              name="state"
              value={val}
              onChange={(v) => handleSingleInputChange(label, v)}
              options={stateOptions}
            />
          </div>
          <div className="flex-1">
            <TextInput name="target-state" value="" placeholder="Target" onChange={() => {}} />
          </div>
        </div>
      );
    }

    if (label === "Year") {
      const yearOptions = Array.from({ length: 12 }, (_, i) => ({
        label: `${2015 + i}${i === 11 ? '+' : ''}`,
        value: `${2015 + i}${i === 11 ? '+' : ''}`,
      }));
      return (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <DropDown
              name="year"
              value={val}
              onChange={(v) => handleSingleInputChange(label, v)}
              options={yearOptions}
            />
          </div>
          <div className="flex-1">
            <TextInput name="target-year" value="" placeholder="Target" onChange={() => {}} />
          </div>
        </div>
      );
    }

    if (label === "Thematic Area") {
      return (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <DropDown
              name="thematic-area"
              value={val}
              onChange={(v) => handleSingleInputChange(label, v)}
              options={THEMATIC_AREAS_OPTIONS}
            />
          </div>
          <div className="flex-1">
            <TextInput name="target-thematic" value="" placeholder="Target" onChange={() => {}} />
          </div>
        </div>
      );
    }

    if (label === "Donor Type") {
      const options = [
        { label: "Bilateral", value: "Bilateral" },
        { label: "Multilateral", value: "Multilateral" },
      ];
      return (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <DropDown
              name="donor-type"
              value={val}
              onChange={(v) => handleSingleInputChange(label, v)}
              options={options}
            />
          </div>
          <div className="flex-1">
            <TextInput name="target-donor" value="" placeholder="Target" onChange={() => {}} />
          </div>
        </div>
      );
    }

    if (label === "Policy Action Type") {
      const options = [
        { label: "Legislative", value: "Legislative" },
        { label: "Administrative", value: "Administrative" },
      ];
      return (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <DropDown
              name="policy-action"
              value={val}
              onChange={(v) => handleSingleInputChange(label, v)}
              options={options}
            />
          </div>
          <div className="flex-1">
            <TextInput name="target-policy" value="" placeholder="Target" onChange={() => {}} />
          </div>
        </div>
      );
    }

    if (label === "Institution Type") {
      const options = [
        "MDAs", "Legislators", "Executive", "Community Leadership", "CDC", "Regional Body", "LGA Council", "CSOs"
      ].map(o => ({ label: o, value: o }));
      return (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <DropDown
              name="institution-type"
              value={val}
              onChange={(v) => handleSingleInputChange(label, v)}
              options={options}
            />
          </div>
          <div className="flex-1">
            <TextInput name="target-institution" value="" placeholder="Target" onChange={() => {}} />
          </div>
        </div>
      );
    }

    if (label === "Sector") {
      const options = [
        "Environment", "Economy", "Climate Change", "Health", "Education"
      ].map(o => ({ label: o, value: o }));
      return (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <DropDown
              name="sector"
              value={val}
              onChange={(v) => handleSingleInputChange(label, v)}
              options={options}
            />
          </div>
          <div className="flex-1">
            <TextInput name="target-sector" value="" placeholder="Target" onChange={() => {}} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <h4 className="font-bold leading-7 text-base">Disaggregation</h4>

      {/* Checkbox Section */}
      <div className="grid grid-cols-2 gap-2">
        {checkboxLabels.map((label, index) => (
          <Checkbox
            key={index}
            label={label}
            name={label}
            isChecked={checkboxes[index]}
            onChange={() => toggleCheckbox(index)}
          />
        ))}
      </div>

      {/* Inputs Section (below all checkboxes) */}
      {checkedLabels.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {checkedLabels.map((label) => (
            <div key={label}>{renderInput(label)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
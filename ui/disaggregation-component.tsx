"use client";

import { useState, ChangeEvent } from "react";
import Checkbox from "@/ui/form/checkbox";
import DropDown from "./form/select-dropdown";
import TextInput from "./form/text-input";

const checkboxLabels = [
  "Department",
  "State",
  "Product",
  "Tenure",
  "Gender",
  "Age",
  "None",
];

type DisaggregationComponentProps = {
  onChange?: (value: string) => void;
};

export default function DisaggregationComponent({ onChange }: DisaggregationComponentProps) {
  const [checkboxes, setCheckboxes] = useState<boolean[]>(
    Array(checkboxLabels.length).fill(false)
  );

  const [values, setValues] = useState<Record<string, string>>({});

  const notifyChange = (currentCheckboxes: boolean[], currentValues: Record<string, string>) => {
    if (!onChange) return;

    // Filter values to include only checked fields
    const activeValues: Record<string, string> = {};
    checkboxLabels.forEach((label, index) => {
      const isChecked = currentCheckboxes[index];
      const isNone = label === "None";
      
      if (isChecked && !isNone) {
        activeValues[label] = currentValues[label] || "";
      }
    });

    onChange(JSON.stringify(activeValues));
  };

  const toggleCheckbox = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    const isNoneCheckbox = index === checkboxLabels.length - 1;

    if (isNoneCheckbox) {
      const newNoneState = !updatedCheckboxes[index];
      // If none is checked, uncheck everything else
      const newCheckboxes = Array(checkboxLabels.length)
          .fill(false)
          .map((_, i) => (i === index ? newNoneState : false));
      
      setCheckboxes(newCheckboxes);
      // We don't necessarily clear values, but notifyChange will filter them out
      notifyChange(newCheckboxes, values);
    } else {
      updatedCheckboxes[index] = !updatedCheckboxes[index];
      updatedCheckboxes[checkboxLabels.length - 1] = false; // Uncheck "None"
      setCheckboxes(updatedCheckboxes);
      notifyChange(updatedCheckboxes, values);
    }
  };

  const handeInputChange = (label: string, val: string) => {
    const newValues = { ...values, [label]: val };
    setValues(newValues);
    notifyChange(checkboxes, newValues);
  };

  // Get checked labels (except None)
  const checkedLabels = checkboxLabels.filter(
    (_, index) => checkboxes[index] && checkboxLabels[index] !== "None"
  );

  const renderInput = (label: string) => {
    const value = values[label] || "";
    
    switch (label) {
      case "Gender":
        return (
          <DropDown
            name="gender"
            label="Gender"
            value={value}
            onChange={(val) => handeInputChange(label, val)}
            options={[
              { label: "Female", value: "Female" },
              { label: "Male", value: "Male" },
            ]}
          />
        );
      case "Age":
        return (
          <TextInput
            name="age"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handeInputChange(label, e.target.value)}
            placeholder="Enter age"
            label="Age"
          />
        );
      case "Department":
      case "State":
      case "Product":
      case "Tenure":
        // Using Generic DropDown with empty options as placeholder
        return (
          <DropDown
            name={label.toLowerCase()}
            value={value}
            onChange={(val) => handeInputChange(label, val)}
            options={[]} 
            label={label}
          />
        );
      default:
        return null;
    }
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

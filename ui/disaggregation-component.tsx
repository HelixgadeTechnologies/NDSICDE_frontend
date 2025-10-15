"use client";

import { JSX, useState } from "react";
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

// Content to show when each checkbox is checked
const checkboxContent: Record<string, JSX.Element> = {
  Department: (
    <DropDown
    name="department"
    value=""
    onChange={() => {}}
    options={[]}
    />
  ),
  State: (
    <DropDown
    name="state"
    value=""
    onChange={() => {}}
    options={[]}
    />
  ),
  Product: (
    <DropDown
    name="product"
    value=""
    onChange={() => {}}
    options={[]}
    />
  ),
  Tenure: (
    <DropDown
    name="tenure"
    value=""
    onChange={() => {}}
    options={[]}
    />
  ),
  Gender: (
    <DropDown
    name="gender"
    value=""
    onChange={() => {}}
    options={[
        { label: "Female", value: "Female" },
        { label: "Male", value: "Male" },
    ]}
    />
  ),
  Age: (
    <TextInput
    name="age"
    value=""
    onChange={() => {}}
    placeholder="Enter age"
    />
  ),
};

export default function DisaggregationComponent() {
  const [checkboxes, setCheckboxes] = useState<boolean[]>(
    Array(checkboxLabels.length).fill(false)
  );

  const toggleCheckbox = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    const isNoneCheckbox = index === checkboxLabels.length - 1;

    if (isNoneCheckbox) {
      // If "None" is clicked, uncheck all others and toggle "None"
      const newNoneState = !updatedCheckboxes[index];
      setCheckboxes(Array(checkboxLabels.length).fill(false).map((_, i) => 
        i === index ? newNoneState : false
      ));
    } else {
      // If any other checkbox is clicked, uncheck "None" and toggle the clicked one
      updatedCheckboxes[index] = !updatedCheckboxes[index];
      updatedCheckboxes[checkboxLabels.length - 1] = false; // Uncheck "None"
      setCheckboxes(updatedCheckboxes);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-bold leading-7 text-base">Disaggregation</h4>
      <div className="grid grid-cols-2 gap-2">
        {checkboxLabels.map((label, index) => (
          <div key={index} className="space-y-2">
            <Checkbox
              label={label}
              name={label}
              isChecked={checkboxes[index]}
              onChange={() => toggleCheckbox(index)}
            />
            {checkboxes[index] && checkboxContent[label]}
          </div>
        ))}
      </div>
    </div>
  );
}
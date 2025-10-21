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

const checkboxContent: Record<string, JSX.Element> = {
  Department: (
    <DropDown name="department" value="" onChange={() => {}} options={[]} label="Department" />
  ),
  State: <DropDown name="state" value="" onChange={() => {}} options={[]} label="State" />,
  Product: <DropDown name="product" value="" onChange={() => {}} options={[]} label="Product" />,
  Tenure: <DropDown name="tenure" value="" onChange={() => {}} options={[]} label="Tenure" />,
  Gender: (
    <DropDown
      name="gender"
      label="Gender"
      value=""
      onChange={() => {}}
      options={[
        { label: "Female", value: "Female" },
        { label: "Male", value: "Male" },
      ]}
    />
  ),
  Age: <TextInput name="age" value="" onChange={() => {}} placeholder="Enter age" label="Age" />,
};

export default function DisaggregationComponent() {
  const [checkboxes, setCheckboxes] = useState<boolean[]>(
    Array(checkboxLabels.length).fill(false)
  );

  const toggleCheckbox = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    const isNoneCheckbox = index === checkboxLabels.length - 1;

    if (isNoneCheckbox) {
      const newNoneState = !updatedCheckboxes[index];
      setCheckboxes(
        Array(checkboxLabels.length)
          .fill(false)
          .map((_, i) => (i === index ? newNoneState : false))
      );
    } else {
      updatedCheckboxes[index] = !updatedCheckboxes[index];
      updatedCheckboxes[checkboxLabels.length - 1] = false; // Uncheck "None"
      setCheckboxes(updatedCheckboxes);
    }
  };

  // Get checked labels (except None)
  const checkedLabels = checkboxLabels.filter(
    (_, index) => checkboxes[index] && _ !== "None"
  );

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
            <div key={label}>{checkboxContent[label]}</div>
          ))}
        </div>
      )}
    </div>
  );
}

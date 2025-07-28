"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Checkbox from "@/ui/form/checkbox";
import { useStrategicObjectivesAndKPIsState } from "@/store/strategic-objectives-kpi-store";
import Button from "@/ui/form/button";

type AddKPIFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddKPIModal({ isOpen, onClose }: AddKPIFormProps) {
  const {
    kpiStatement,
    kpiDefinition,
    kpiType,
    specificArea,
    unitOfMeasurement,
    itemInMeasure,
    checkboxes,
    checkboxLabels,
    toggleCheckbox,
    // setAllCheckboxes,
    setField,
  } = useStrategicObjectivesAndKPIsState();

  //   const allChecked = checkboxes.every((val) => val);
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="550px">
      <Heading
        heading="Add New KPI"
        subtitle="Create a new key performance indicator for your organization"
      />
      <div className="overflow-y-auto h-[450px] custom-scrollbar p-2.5">
        <form action="" className="space-y-4 my-4">
          <TextInput
            name="kpiStatement"
            value={kpiStatement}
            label="KPI Statement"
            onChange={(e) => setField("kpiStatement", e.target.value)}
          />
          <TextInput
            name="kpiDefinition"
            value={kpiDefinition}
            label="KPI Definition"
            onChange={(e) => setField("kpiDefinition", e.target.value)}
          />
          <DropDown
            name="kpiType"
            label="KPI Type"
            placeholder="Output"
            value={kpiType}
            onChange={(value: string) => setField("kpiType", value)}
            options={[]}
          />
          <DropDown
            name="specificArea"
            label="Specific Area"
            placeholder="Training"
            value={specificArea}
            onChange={(value: string) => setField("specificArea", value)}
            options={[]}
          />
          <TextInput
            name="unitOfMeasurement"
            value={unitOfMeasurement}
            label="Unit of Measurement"
            onChange={(e) => setField("unitOfMeasurement", e.target.value)}
          />
          <DropDown
            name="itemInMeasure"
            label="Item in Measure"
            placeholder="Infrastructure"
            value={itemInMeasure}
            onChange={(value: string) => setField("itemInMeasure", value)}
            options={[]}
          />
          {/* checkboxes */}
          <div className="space-y-4">
            <h4 className="font-bold leading-7 text-base">Disagreggation</h4>
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
              {/* <Checkbox
            label="None"
            isChecked={allChecked}
            name="none"
            onChange={() => setAllCheckboxes(false)}
            /> */}
            </div>
          </div>

          <TextInput
            label="Baseline"
            value=""
            name="baseline"
            onChange={() => {}}
          />
          <TextInput
            label="Target"
            value=""
            name="baseline"
            onChange={() => {}}
          />
          <Button content="Add KPI" />
        </form>
      </div>
    </Modal>
  );
}

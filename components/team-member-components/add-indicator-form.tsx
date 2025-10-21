import { Icon } from "@iconify/react";
import { useState } from "react";
import IndicatorSourceSelector, {
  IndicatorSourceData,
} from "../../ui/indicator-source-selector";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import DisaggregationComponent from "@/ui/disaggregation-component";
import DateInput from "@/ui/form/date-input";
import TextareaInput from "@/ui/form/textarea";
import RadioInput from "@/ui/form/radio";
import TagInput from "@/ui/form/tag-input";
import Button from "@/ui/form/button";

// Target type definition
type Target = {
  id: number;
  targetDate: string;
  cumulativeTarget: string;
  targetNarrative: string;
};

type TargetComponentProps = {
  target: Target;
  index: number;
  onRemove: (id: number) => void;
  onChange: (id: number, field: keyof Target, value: string) => void;
  showRemove: boolean;
};

function TargetComponent({
  target,
  index,
  onRemove,
  onChange,
  showRemove,
}: TargetComponentProps) {
  return (
    <div className="space-y-3 rounded-lg relative">
      {showRemove && (
        <button
          type="button"
          onClick={() => onRemove(target.id)}
          className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
          title="Remove target">
          <Icon icon="material-symbols:close-rounded" height={20} width={20} />
        </button>
      )}

      <p className="text-sm font-medium text-gray-700">Target {index + 1}</p>

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
  );
}

export default function AddIndicatorForm() {
  const [indicatorSourceData, setIndicatorSourceData] =
    useState<IndicatorSourceData | null>(null);

  const handleIndicatorSourceChange = (data: IndicatorSourceData) => {
    setIndicatorSourceData(data);
    console.log("Indicator Source Data:", data, indicatorSourceData);
  };
  const [targets, setTargets] = useState<Target[]>([
    {
      id: 1,
      targetDate: "",
      cumulativeTarget: "",
      targetNarrative: "",
    },
  ]);

  const addTarget = () => {
    const newId = Math.max(...targets.map((t) => t.id), 0) + 1;
    setTargets([
      ...targets,
      {
        id: newId,
        targetDate: "",
        cumulativeTarget: "",
        targetNarrative: "",
      },
    ]);
  };

  const removeTarget = (id: number) => {
    setTargets(targets.filter((target) => target.id !== id));
  };

  const updateTarget = (id: number, field: keyof Target, value: string) => {
    setTargets(
      targets.map((target) =>
        target.id === id ? { ...target, [field]: value } : target
      )
    );
  };

  return (
    <div className="space-y-6 my-8 max-w-4xl mx-auto p-6">
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

      {/* add target - now with multiple targets support */}
      <div className="space-y-3">
        <button
          onClick={addTarget}
          className="primary text-sm font-medium mb-3 cursor-pointer">
          Add Target
        </button>

        {targets.map((target, index) => (
          <TargetComponent
            key={target.id}
            target={target}
            index={index}
            onRemove={removeTarget}
            onChange={updateTarget}
            showRemove={targets.length > 1}
          />
        ))}

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
            is_checked={false}
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
    </div>
  );
}

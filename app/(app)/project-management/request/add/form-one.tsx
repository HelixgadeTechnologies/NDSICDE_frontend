"use client";

import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";

type FormOneProps = {
  onNext: () => void;
};

export default function FormOne({ onNext }: FormOneProps) {

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Financial Request and Retirement" className="text-center" />
        <TextInput label="Staff" name="staff" value="" onChange={() => {}} />
        <DropDown
          label="Output"
          name="output"
          value=""
          onChange={() => {}}
          options={[]}
        />
        <DropDown
          label="Activity Title"
          name="activityTitle"
          value=""
          onChange={() => {}}
          options={[]}
        />
        <TextInput
          label="Activity Budget Code"
          name="activityBudgetCode"
          value=""
          onChange={() => {}}
        />
        <DropDown
          label="Activity Location(s)"
          name="activityLocation"
          value=""
          onChange={() => {}}
          options={[]}
        />
        <TextareaInput
          label="Activity Purpose/Description"
          name="activityDescription"
          value=""
          onChange={() => {}}
        />
        <div className="flex items-center gap-2">
          <DateInput label="Activity Start Date" />
          <DateInput label="Activity End Date" />
        </div>
        <div className="space-y-2">
          <p className="text-sm primary">Add Budget Line Item</p>
          <TextareaInput
            label="Activity Line Description"
            name="activityLineDescription"
            value=""
            onChange={() => {}}
          />
        </div>
        <TextInput
          label="Quantity"
          name="quantity"
          value=""
          onChange={() => {}}
        />
        <TextInput
          label="Frequency"
          name="frequency"
          value=""
          onChange={() => {}}
        />
        <TextInput
          label="Unit Cost (₦)"
          name="unitCost"
          value=""
          onChange={() => {}}
        />
        <TextInput
          label="Budget Code"
          name="budgetCode"
          value=""
          onChange={() => {}}
        />
        <TextInput
          label="Total (₦) - this will automatically Qty*Frq*Unit cost"
          name="total"
          value=""
          onChange={() => {}}
        />

        {/* buttons */}
        <div className="flex gap-8 items-center">
          <div className="w-2/5">
            <Button
              isSecondary
              content="Cancel"
              href="/project-management/request"
            />
          </div>
          <div className="w-3/5">
            <Button content="Next" onClick={onNext} />
          </div>
        </div>
      </form>
    </section>
  );
}

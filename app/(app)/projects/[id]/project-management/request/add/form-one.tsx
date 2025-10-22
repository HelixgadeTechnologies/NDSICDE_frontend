"use client";

import { useState } from "react";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";
import { Icon } from "@iconify/react";

type BudgetLine = {
  id: number;
  activityLineDescription: string;
  quantity: string;
  frequency: string;
  unitCost: string;
  total: string;
};

type BudgetLineComponentProps = {
  budgetLine: BudgetLine;
  index: number;
  onRemove: (id: number) => void;
  onChange: (id: number, field: keyof BudgetLine, value: string) => void;
  showRemove: boolean;
};

function BudgetLineComponent({ budgetLine, index, onRemove, onChange, showRemove }: BudgetLineComponentProps) {
 // Calculate total with proper number conversion and validation
  const quantity = parseFloat(budgetLine.quantity) || 0;
  const frequency = parseFloat(budgetLine.frequency) || 0;
  const unitCost = parseFloat(budgetLine.unitCost) || 0;
  const total = quantity * frequency * unitCost;

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <TextInput
          label={index === 0 ? "Activity Description" : ""}
          name={`activityLineDescription-${budgetLine.id}`}
          value={budgetLine.activityLineDescription}
          onChange={(e) => onChange(budgetLine.id, 'activityLineDescription', e.target.value)}
          placeholder="Description"
        />
      </div>
      
      <div className="w-24">
        <TextInput
          label={index === 0 ? "Quantity" : ""}
          name={`quantity-${budgetLine.id}`}
          value={budgetLine.quantity}
          onChange={(e) => onChange(budgetLine.id, 'quantity', e.target.value)}
          placeholder="Qty"
        />
      </div>
      
      <div className="w-28">
        <TextInput
          label={index === 0 ? "Frequency" : ""}
          name={`frequency-${budgetLine.id}`}
          value={budgetLine.frequency}
          onChange={(e) => onChange(budgetLine.id, 'frequency', e.target.value)}
          placeholder="Freq"
        />
      </div>
      
      <div className="w-32">
        <TextInput
          label={index === 0 ? "Unit Cost (₦)" : ""}
          name={`unitCost-${budgetLine.id}`}
          value={budgetLine.unitCost}
          onChange={(e) => onChange(budgetLine.id, 'unitCost', e.target.value)}
          placeholder="Unit Cost"
        />
      </div>
      
      <div className="w-32">
        <TextInput
          label={index === 0 ? "Total (Qty*Frq*Unit)" : ""}
          name={`Total-${budgetLine.id}`}
          value={total.toFixed(2)}
          onChange={(e) => onChange(budgetLine.id, 'total', e.target.value)}
          placeholder="0.00"
        />
      </div>

      {showRemove && (
        <button
          type="button"
          onClick={() => onRemove(budgetLine.id)}
          className="mb-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          title="Remove line"
        >
          <Icon icon={"material-symbols:close-rounded"} height={20} width={20} />
        </button>
      )}
    </div>
  );
}

type FormOneProps = {
  onNext: () => void;
};

export default function FormOne({ onNext }: FormOneProps) {
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([
    {
      id: 1,
      activityLineDescription: "",
      quantity: "",
      frequency: "",
      unitCost: "",
      total: "",
    },
  ]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const addBudgetLine = () => {
    const newId = Math.max(...budgetLines.map(bl => bl.id), 0) + 1;
    setBudgetLines([
      ...budgetLines,
      {
        id: newId,
        activityLineDescription: "",
        quantity: "",
        frequency: "",
        unitCost: "",
        total: "",
      },
    ]);
  };

  const removeBudgetLine = (id: number) => {
    setBudgetLines(budgetLines.filter(line => line.id !== id));
  };

  const updateBudgetLine = (id: number, field: keyof BudgetLine, value: string) => {
    setBudgetLines(
      budgetLines.map(line =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
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

        {/* Budget Line Items */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Line Items
          </label>
          {budgetLines.map((budgetLine, index) => (
            <BudgetLineComponent
              key={budgetLine.id}
              budgetLine={budgetLine}
              index={index}
              onRemove={removeBudgetLine}
              onChange={updateBudgetLine}
              showRemove={budgetLines.length > 1}
            />
          ))}
          
          <button
            type="button"
            onClick={addBudgetLine}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Icon icon={"ic:round-plus"} height={18} width={18} />
            Add Budget Line Item
          </button>
        </div>

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
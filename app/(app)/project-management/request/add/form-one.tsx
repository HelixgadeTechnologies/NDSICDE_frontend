"use client";

import { useState } from "react";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";

type BudgetLine = {
  id: number;
  activityLineDescription: string;
  quantity: string;
  frequency: string;
  unitCost: string;
  budgetCode: string;
  total: string;
};

type BudgetLineComponentProps = {
  budgetLine: BudgetLine;
  index: number;
  onRemove: (id: number) => void;
  onChange: (id: number, field: keyof BudgetLine, value: string) => void;
};

function BudgetLineComponent({ budgetLine, index, onRemove, onChange }: BudgetLineComponentProps) {
  const calculateTotal = () => {
    const qty = parseFloat(budgetLine.quantity) || 0;
    const frq = parseFloat(budgetLine.frequency) || 0;
    const unit = parseFloat(budgetLine.unitCost) || 0;
    return (qty * frq * unit).toFixed(2);
  };

  return (
    <div className="space-y-4 p-4 rounded-lg relative">
      <div className="flex justify-between items-center">
        <p className="text-sm primary font-semibold">Budget Line Item #{index + 1}</p>
        {index > 0 && (
          <button
            type="button"
            onClick={() => onRemove(budgetLine.id)}
            className="text-red-500 text-sm hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
      
      <TextareaInput
        label="Activity Line Description"
        name={`activityLineDescription-${budgetLine.id}`}
        value={budgetLine.activityLineDescription}
        onChange={(e) => onChange(budgetLine.id, 'activityLineDescription', e.target.value)}
      />
      
      <TextInput
        label="Quantity"
        name={`quantity-${budgetLine.id}`}
        value={budgetLine.quantity}
        onChange={(e) => onChange(budgetLine.id, 'quantity', e.target.value)}
      />
      
      <TextInput
        label="Frequency"
        name={`frequency-${budgetLine.id}`}
        value={budgetLine.frequency}
        onChange={(e) => onChange(budgetLine.id, 'frequency', e.target.value)}
      />
      
      <TextInput
        label="Unit Cost (₦)"
        name={`unitCost-${budgetLine.id}`}
        value={budgetLine.unitCost}
        onChange={(e) => onChange(budgetLine.id, 'unitCost', e.target.value)}
      />
      
      <TextInput
        label="Budget Code"
        name={`budgetCode-${budgetLine.id}`}
        value={budgetLine.budgetCode}
        onChange={(e) => onChange(budgetLine.id, 'budgetCode', e.target.value)}
      />
      
      <TextInput
        label="Total (₦) - Automatically calculated (Qty × Frq × Unit cost)"
        name={`total-${budgetLine.id}`}
        value={calculateTotal()}
        onChange={() => {}}
        isDisabled
      />
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
      budgetCode: "",
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
        budgetCode: "",
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
        <div className="space-y-4">
          {budgetLines.map((budgetLine, index) => (
            <BudgetLineComponent
              key={budgetLine.id}
              budgetLine={budgetLine}
              index={index}
              onRemove={removeBudgetLine}
              onChange={updateBudgetLine}
            />
          ))}
          
          <Button
            isSecondary
            content="+ Add Budget Line Item"
            onClick={addBudgetLine}
          />
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
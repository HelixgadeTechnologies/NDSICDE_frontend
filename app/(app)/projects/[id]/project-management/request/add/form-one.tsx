"use client";

import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";
import { toast } from "react-toastify";
import { RequestFormData } from "./page";
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";

type FormOneProps = {
  onNext: () => void;
  formData: RequestFormData;
  updateFormData: (data: Partial<RequestFormData>) => void;
};

export default function FormOne({ onNext, formData, updateFormData }: FormOneProps) {
  const [outputsOptions, setOutputsOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchOutputs = async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outputs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const data = res.data?.data || [];
        const options = data.map((item: any) => ({
          label: item.outputStatement,
          value: item.outputId,
        }));
        setOutputsOptions(options);
      } catch (error) {
        console.error("Error fetching outputs:", error);
      }
    };
    fetchOutputs();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.staff || !formData.activityTitle || !formData.activityPurposeDescription || !formData.activityStartDate || !formData.activityEndDate || !formData.activityLineDescription) {
      toast.error("Please fill in all required fields.");
      return;
    }
    onNext();
  };

  const total = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.frequency) || 0) * (parseFloat(formData.unitCost) || 0);

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Financial Request and Retirement" className="text-center" />
        <TextInput 
          label="Staff" 
          name="staff" 
          value={formData.staff} 
          onChange={(e) => updateFormData({ staff: e.target.value })} 
        />
        <DropDown
          label="Output"
          name="outputId"
          value={formData.outputId}
          onChange={(value) => updateFormData({ outputId: value })}
          options={outputsOptions}
        />
        <TextInput
          label="Activity Title"
          name="activityTitle"
          value={formData.activityTitle}
          onChange={(e) => updateFormData({ activityTitle: e.target.value })}
        />
        <TextInput
          label="Activity Budget Code"
          name="activityBudgetCode"
          value={formData.activityBudgetCode}
          onChange={(e) => updateFormData({ activityBudgetCode: e.target.value })}
        />
        <TextInput
          label="Activity Location(s)"
          name="activityLocation"
          value={formData.activityLocation}
          onChange={(e) => updateFormData({ activityLocation: e.target.value })}
        />
        <TextareaInput
          label="Activity Purpose/Description"
          name="activityPurposeDescription"
          value={formData.activityPurposeDescription}
          onChange={(e) => updateFormData({ activityPurposeDescription: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <DateInput 
            label="Activity Start Date" 
            value={formData.activityStartDate} 
            onChange={(date) => updateFormData({ activityStartDate: date })} 
          />
          <DateInput 
            label="Activity End Date" 
            value={formData.activityEndDate} 
            onChange={(date) => updateFormData({ activityEndDate: date })} 
          />
        </div>

        {/* Budget Line Items */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Line Items
          </label>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <TextInput
                label="Activity Description"
                name="activityLineDescription"
                value={formData.activityLineDescription}
                onChange={(e) => updateFormData({ activityLineDescription: e.target.value })}
                placeholder="Description"
              />
            </div>
            
            <div className="w-24">
              <TextInput
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={(e) => updateFormData({ quantity: e.target.value, total: ((parseFloat(e.target.value) || 0) * (parseFloat(formData.frequency) || 0) * (parseFloat(formData.unitCost) || 0)).toString() })}
                placeholder="Qty"
              />
            </div>
            
            <div className="w-28">
              <TextInput
                label="Frequency"
                name="frequency"
                value={formData.frequency}
                onChange={(e) => updateFormData({ frequency: e.target.value, total: ((parseFloat(formData.quantity) || 0) * (parseFloat(e.target.value) || 0) * (parseFloat(formData.unitCost) || 0)).toString() })}
                placeholder="Freq"
              />
            </div>
            
            <div className="w-32">
              <TextInput
                label="Unit Cost (₦)"
                name="unitCost"
                value={formData.unitCost}
                onChange={(e) => updateFormData({ unitCost: e.target.value, total: ((parseFloat(formData.quantity) || 0) * (parseFloat(formData.frequency) || 0) * (parseFloat(e.target.value) || 0)).toString() })}
                placeholder="Unit Cost"
              />
            </div>
            
            <div className="w-32">
              <TextInput
                label="Total (Qty*Frq*Unit)"
                name="Total"
                value={total.toFixed(2)}
                onChange={() => {}}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* buttons */}
        <div className="flex gap-8 items-center mt-5">
          <div className="w-2/5">
            <Button
              isSecondary
              content="Cancel"
              onClick={() => window.history.back()}
            />
          </div>
          <div className="w-3/5">
            <Button content="Next" onClick={handleNext} />
          </div>
        </div>
      </form>
    </section>
  );
}
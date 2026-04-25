"use client";

import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import TagInput from "@/ui/form/tag-input";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";
import { toast } from "react-toastify";
import { RequestFormData } from "./page";
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { Icon } from "@iconify/react";
import naija from "naija-state-local-government";

type FormOneProps = {
  onNext: () => void;
  formData: RequestFormData;
  updateFormData: (data: Partial<RequestFormData>) => void;
};

export default function FormOne({ onNext, formData, updateFormData }: FormOneProps) {
  const [outputsOptions, setOutputsOptions] = useState<{ label: string; value: string }[]>([]);
  const [activitiesOptions, setActivitiesOptions] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

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

    const fetchActivities = async () => {
      setIsLoadingActivities(true);
      try {
        const token = getToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activities`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let activitiesData = [];
        if (Array.isArray(response.data)) {
          activitiesData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          activitiesData = response.data.data;
        } else if (response.data?.data) {
          activitiesData = [response.data.data];
        }

        const transformedOptions = activitiesData
          .map((act: any) => {
            const statement = act.activityStatement;
            if (!statement) return null;
            return {
              label: statement,
              value: statement,
            };
          })
          .filter((option: any) => option !== null);

        // Remove duplicates
        const uniqueOptions = Array.from(
          new Map(transformedOptions.map((item: any) => [item.value, item])).values()
        ) as { label: string; value: string }[];

        setActivitiesOptions(uniqueOptions);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchOutputs();
    fetchActivities();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };


  const handleNext = () => {
    // Basic validation
    if (!formData.staff || !formData.activityTitle || !formData.activityPurposeDescription || !formData.activityStartDate || !formData.activityEndDate || !formData.budgetLineItems?.[0]?.activityLineDescription) {
      toast.error("Please fill in all required fields.");
      return;
    }
    onNext();
  };

  const handleAddLineItem = () => {
    updateFormData({
      budgetLineItems: [
        ...(formData.budgetLineItems || []),
        { activityLineDescription: "", quantity: "", frequency: "", unitCost: "", total: "0" }
      ]
    });
  };

  const handleRemoveLineItem = (index: number) => {
    const newItems = formData.budgetLineItems.filter((_, i) => i !== index);
    updateFormData({ budgetLineItems: newItems });
  };

  const updateLineItem = (index: number, field: keyof typeof formData.budgetLineItems[0], value: string) => {
    const newItems = [...formData.budgetLineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate total
    if (['quantity', 'frequency', 'unitCost'].includes(field)) {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const freq = parseFloat(newItems[index].frequency) || 0;
      const cost = parseFloat(newItems[index].unitCost) || 0;
      newItems[index].total = (qty * freq * cost).toString();
    }
    
    updateFormData({ budgetLineItems: newItems });
  };

  const totalSum = formData.budgetLineItems?.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0) || 0;

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Financial Request Form" className="text-center" />
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
        <DropDown
          label="Activity Title"
          name="activityTitle"
          value={formData.activityTitle}
          placeholder={isLoadingActivities ? "Loading activities..." : "Select an activity title"}
          onChange={(value) => updateFormData({ activityTitle: value })}
          options={activitiesOptions}
        />
        <TextInput
          label="Activity Budget Code"
          name="activityBudgetCode"
          value={formData.activityBudgetCode}
          onChange={(e) => updateFormData({ activityBudgetCode: e.target.value })}
          placeholder="Enter budget code (numbers and periods only)"
        />
        <TagInput
          label="Activity Location(s)"
          value={formData.activityLocation ? formData.activityLocation.split(",").map(s => s.trim()).filter(Boolean) : []}
          onChange={(tags) => updateFormData({ activityLocation: tags.join(", ") })}
          options={naija.states()}
          placeholder="Select states and press Enter"
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
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Budget Line Items
            </label>
            <button
              type="button"
              onClick={handleAddLineItem}
              className="text-sm flex items-center gap-1 text-[#D2091E] font-medium hover:text-[#a00014] transition-colors"
            >
              <Icon icon="mdi:plus" className="text-lg" /> Add Row
            </button>
          </div>
          
          {formData.budgetLineItems?.map((item, index) => (
            <div key={index} className="flex gap-2 items-start relative w-full">
              <div className="flex-1">
                <TextInput
                  label={index === 0 ? "Activity Description" : ""}
                  name={`activityLineDescription-${index}`}
                  value={item.activityLineDescription}
                  onChange={(e) => updateLineItem(index, 'activityLineDescription', e.target.value)}
                  placeholder="Description"
                />
              </div>
              
              <div className="w-24">
                <TextInput
                  label={index === 0 ? "Quantity" : ""}
                  name={`quantity-${index}`}
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                />
              </div>
              
              <div className="w-28">
                <TextInput
                  label={index === 0 ? "Frequency" : ""}
                  name={`frequency-${index}`}
                  value={item.frequency}
                  onChange={(e) => updateLineItem(index, 'frequency', e.target.value)}
                  placeholder="Freq"
                />
              </div>
              
              <div className="w-32">
                <TextInput
                  label={index === 0 ? "Unit Cost (₦)" : ""}
                  name={`unitCost-${index}`}
                  value={item.unitCost}
                  onChange={(e) => updateLineItem(index, 'unitCost', e.target.value)}
                  placeholder="Unit Cost"
                />
              </div>
              
              <div className="w-32">
                <TextInput
                  label={index === 0 ? "Total" : ""}
                  name={`total-${index}`}
                  value={Number(item.total || 0).toFixed(2)}
                  onChange={() => {}}
                  placeholder="0.00"
                />
              </div>

              {formData.budgetLineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLineItem(index)}
                  className={`text-red-500 hover:text-red-700 transition-colors ${index === 0 ? "mt-[34px]" : "mt-3"}`}
                >
                  <Icon icon="mdi:close-circle" className="text-xl" />
                </button>
              )}
            </div>
          ))}
          
          <div className="flex justify-end pt-2">
            <div className="text-right pt-2 w-[280px]">
              <span className="text-sm text-gray-500 mr-4">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">₦ {totalSum.toFixed(2)}</span>
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
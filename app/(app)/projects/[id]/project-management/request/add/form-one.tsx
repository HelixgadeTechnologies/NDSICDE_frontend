"use client";

import { useState, useEffect } from "react";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import DateInput from "@/ui/form/date-input";
import Button from "@/ui/form/button";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/form/textarea";
import { Icon } from "@iconify/react";
import { useForm } from "@/context/ProjectRequestContext";
import { useParams } from "next/navigation";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import toast from "react-hot-toast";

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
  onNext?: () => void;
};

type OutputOption = {
  label: string;
  value: string;
};

export default function FormOne({ onNext }: FormOneProps) {
  const { formData, updateFormData, setActiveStep } = useForm();
  const params = useParams();
  const projectId = params?.id as string || "";
  const token = getToken();
  
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

  const [outputOptions, setOutputOptions] = useState<OutputOption[]>([]);
  const [isLoadingOutputs, setIsLoadingOutputs] = useState(false);

  // Initialize form with projectId and fetch outputs
  useEffect(() => {
    updateFormData({ projectId });
    fetchOutputs();
  }, [projectId]);

  // Fetch outputs from API
  const fetchOutputs = async () => {
    setIsLoadingOutputs(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outputs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Outputs API response:", response.data);

      // Extract data based on API response structure
      let outputsData = [];
      if (Array.isArray(response.data)) {
        outputsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        outputsData = response.data.data;
      } else if (response.data?.data) {
        outputsData = [response.data.data];
      }

      // Transform data for dropdown - use outputStatement as label, outputId as value
      const transformedOptions: OutputOption[] = outputsData
        .filter((output: any) => output.outputId && output.outputStatement)
        .map((output: any) => ({
          label: output.outputStatement,
          value: output.outputId,
        }));

      // Add a default option
      const optionsWithDefault = [
        { label: "Select an output", value: "" },
        ...transformedOptions,
      ];

      setOutputOptions(optionsWithDefault);
    } catch (error: any) {
      console.error("Error fetching outputs:", error);
      toast.error("Failed to load outputs. Please try again.");
      
      // Fallback empty options
      setOutputOptions([{ label: "Select an output", value: "" }]);
    } finally {
      setIsLoadingOutputs(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Handle input changes for regular form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (['activityBudgetCode', 'quantity', 'frequency', 'unitCost', 'budgetCode', 'total'].includes(name)) {
      const numValue = value === '' ? 0 : parseFloat(value) || 0;
      updateFormData({ [name]: numValue });
    } else {
      updateFormData({ [name]: value });
    }
  };

  // Handle date changes
  const handleDateChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };

  // Handle dropdown changes
  const handleDropdownChange = (name: string, value: string) => {
    updateFormData({ [name]: value });
  };

  // Handle budget line operations
  const addBudgetLine = () => {
    const newId = Math.max(...budgetLines.map(bl => bl.id), 0) + 1;
    const newBudgetLines = [
      ...budgetLines,
      {
        id: newId,
        activityLineDescription: "",
        quantity: "",
        frequency: "",
        unitCost: "",
        total: "",
      },
    ];
    setBudgetLines(newBudgetLines);
    saveBudgetLinesToContext(newBudgetLines);
  };

  const removeBudgetLine = (id: number) => {
    const newBudgetLines = budgetLines.filter(line => line.id !== id);
    setBudgetLines(newBudgetLines);
    saveBudgetLinesToContext(newBudgetLines);
  };

  const updateBudgetLine = (id: number, field: keyof BudgetLine, value: string) => {
    const newBudgetLines = budgetLines.map(line =>
      line.id === id ? { ...line, [field]: value } : line
    );
    setBudgetLines(newBudgetLines);
    saveBudgetLinesToContext(newBudgetLines);
  };

  // Save budget lines to form context
  const saveBudgetLinesToContext = (lines: BudgetLine[]) => {
    const formattedBudgetLines = lines.map(line => ({
      activityLineDescription: line.activityLineDescription,
      quantity: parseFloat(line.quantity) || 0,
      frequency: parseFloat(line.frequency) || 0,
      unitCost: parseFloat(line.unitCost) || 0,
      total: parseFloat(line.total) || (parseFloat(line.quantity) || 0) * (parseFloat(line.frequency) || 0) * (parseFloat(line.unitCost) || 0),
    }));

    // Calculate total of all budget lines
    const total = formattedBudgetLines.reduce((sum, line) => sum + line.total, 0);

    updateFormData({ 
      budgetLines: formattedBudgetLines,
      total: total,
      // For backward compatibility with single line payload
      activityLineDescription: formattedBudgetLines[0]?.activityLineDescription || "",
      quantity: formattedBudgetLines[0]?.quantity || 0,
      frequency: formattedBudgetLines[0]?.frequency || 0,
      unitCost: formattedBudgetLines[0]?.unitCost || 0,
    });
  };

  const handleNext = () => {
    // Save budget lines one final time before moving to next step
    saveBudgetLinesToContext(budgetLines);
    
    // Validate required fields
    if (!formData.staff) {
      toast.error("Please enter staff name");
      return;
    }
    
    if (!formData.outputId) {
      toast.error("Please select an output");
      return;
    }
    
    if (!formData.activityTitle) {
      toast.error("Please enter an activity title");
      return;
    }
    
    if (onNext) {
      onNext();
    } else {
      setActiveStep(2);
    }
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <Heading heading="Financial Request and Retirement" className="text-center" />
        
        <TextInput 
          label="Staff *" 
          name="staff" 
          value={formData.staff} 
          onChange={handleInputChange}
          placeholder="Enter staff name"
        />
        
        <DropDown
          label="Output *"
          name="outputId"
          value={formData.outputId}
          onChange={(value) => handleDropdownChange("outputId", value)}
          options={outputOptions}
          placeholder={isLoadingOutputs ? "Loading outputs..." : "Select output"}
        />
        
        <TextInput
          label="Activity Title *"
          name="activityTitle"
          value={formData.activityTitle}
          onChange={handleInputChange}
          placeholder="Enter activity title"
        />
        
        <TextInput
          label="Activity Budget Code"
          name="activityBudgetCode"
          value={formData.activityBudgetCode.toString()}
          onChange={handleInputChange}
          placeholder="Enter budget code"
        />
        
        <TextInput
          label="Activity Location(s)"
          name="activityLocation"
          value={formData.activityLocation}
          onChange={handleInputChange}
          placeholder="Enter location(s)"
        />
        
        <TextareaInput
          label="Activity Purpose/Description"
          name="activityPurposeDescription"
          value={formData.activityPurposeDescription}
          onChange={handleInputChange}
          placeholder="Describe the purpose of this activity"
        />
        
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <DateInput 
              label="Activity Start Date" 
              // name="activityStartDate"
              value={formData.activityStartDate}
              onChange={(value) => handleDateChange("activityStartDate", value)}
            />
          </div>
          <div className="flex-1">
            <DateInput 
              label="Activity End Date" 
              // name="activityEndDate"
              value={formData.activityEndDate}
              onChange={(value) => handleDateChange("activityEndDate", value)}
            />
          </div>
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
          
          {budgetLines.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Budget:</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₦{formData.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* buttons */}
        <div className="flex gap-8 items-center">
          <div className="w-2/5">
            <Button
              isSecondary
              content="Cancel"
              href="/projects/1/project-management/request"
            />
          </div>
          <div className="w-3/5">
            <Button 
              content="Next" 
              onClick={handleNext}
              isDisabled={!formData.staff || !formData.outputId || !formData.activityTitle}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
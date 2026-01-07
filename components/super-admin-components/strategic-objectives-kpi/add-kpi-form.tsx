"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import { useState, FormEvent } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";

type AddKPIFormProps = {
  isOpen: boolean;
  onClose: () => void;
  strategicObjectiveId: string;
};

type KPIFormData = {
  kpiStatement: string;
  kpiDefinition: string;
  kpiType: string;
  specificArea: string;
  unitOfMeasurement: string;
  itemInMeasure: string;
  disaggregation: string;
  baseline: string;
  target: string;
};

export default function AddKPIModal({ 
  isOpen, 
  onClose, 
  strategicObjectiveId 
}: AddKPIFormProps) {
  const token = getToken();
  const [formData, setFormData] = useState<KPIFormData>({
    kpiStatement: "",
    kpiDefinition: "",
    kpiType: "",
    specificArea: "",
    unitOfMeasurement: "",
    itemInMeasure: "",
    disaggregation: "",
    baseline: "",
    target: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof KPIFormData, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      const payload = {
        isCreate: true,
        data: { ...formData, strategicObjectiveId }
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpi`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("KPI added successfully:", response.data);
        // Reset form
        setFormData({
          kpiStatement: "",
          kpiDefinition: "",
          kpiType: "",
          specificArea: "",
          unitOfMeasurement: "",
          itemInMeasure: "",
          disaggregation: "",
          baseline: "",
          target: "",
        });
        // Close modal
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to add KPI";
      console.error("Add KPI error:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="550px">
      <Heading
        heading="Add New KPI"
        subtitle="Create a new key performance indicator for your organization"
      />
      <div className="overflow-y-auto h-[450px] custom-scrollbar p-2.5">
        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <TextInput
            name="kpiStatement"
            value={formData.kpiStatement}
            label="KPI Statement"
            onChange={(e) => handleInputChange("kpiStatement", e.target.value)}
          />
          <TextInput
            name="kpiDefinition"
            value={formData.kpiDefinition}
            label="KPI Definition"
            onChange={(e) => handleInputChange("kpiDefinition", e.target.value)}
          />
          <DropDown
            name="kpiType"
            label="KPI Type"
            placeholder="Output"
            value={formData.kpiType}
            onChange={(value: string) => handleInputChange("kpiType", value)}
            options={[
              { label: "Output", value: "Output"},
              { label: "Impact", value: "Impact"},
              { label: "Outcome", value: "Outcome"},
              { label: "Input", value: "Input"},
            ]}
          />
          <DropDown
            name="specificArea"
            label="Specific Area"
            placeholder="Training"
            value={formData.specificArea}
            onChange={(value: string) => handleInputChange("specificArea", value)}
            options={[
              { label: "Training", value: "Training" },
            ]}
          />
          <TextInput
            name="unitOfMeasurement"
            value={formData.unitOfMeasurement}
            label="Unit of Measurement"
            onChange={(e) => handleInputChange("unitOfMeasurement", e.target.value)}
          />
          <DropDown
            name="itemInMeasure"
            label="Item in Measure"
            placeholder="Infrastructure"
            value={formData.itemInMeasure}
            onChange={(value: string) => handleInputChange("itemInMeasure", value)}
            options={[
              { label: "Infrastructure", value: "Infrastructure" },
            ]}
          />
          <DropDown
            name="disaggregation"
            label="Disaggregation"
            placeholder="Age"
            value={formData.disaggregation}
            onChange={(value: string) => handleInputChange("disaggregation", value)}
            options={[
              { label: "Department", value: "Department" },
              { label: "State", value: "State" },
              { label: "Product", value: "Product" },
              { label: "Tenure", value: "Tenure" },
              { label: "Gender", value: "Gender" },
              { label: "Age", value: "Age" },
              { label: "None", value: "None" },
            ]}
          />
          <TextInput
            label="Baseline"
            value={formData.baseline}
            name="baseline"
            onChange={(e) => handleInputChange("baseline", e.target.value)}
          />
          <TextInput
            label="Target"
            value={formData.target}
            name="target"
            onChange={(e) => handleInputChange("target", e.target.value)}
          />
          <Button 
            content={isSubmitting ? "Adding KPI..." : "Add KPI"} 
            isDisabled={isSubmitting}
          />
        </form>
      </div>
    </Modal>
  );
}
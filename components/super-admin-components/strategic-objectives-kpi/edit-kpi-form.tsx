"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-hot-toast";

type KPI = {
  baseLine: string;
  createAt: string;
  definition: string;
  disaggregation: string;
  itemInMeasure: string;
  kpiId: string;
  specificAreas: string;
  statement: string;
  strategicObjectiveId: string;
  target: string;
  type: string;
  unitOfMeasure: string;
  updateAt: string;
};

type EditKPIModalProps = {
  isOpen: boolean;
  onClose: () => void;
  kpiData: KPI | null;
  onSuccess?: () => void;
};

type KPIFormData = {
  kpiId: string;
  statement: string;
  definition: string;
  type: string;
  specificAreas: string;
  unitOfMeasure: string;
  itemInMeasure: string;
  disaggregation: string;
  baseLine: string;
  target: string;
  strategicObjectiveId: string;
};

export default function EditKPIModal({ 
  isOpen, 
  onClose, 
  kpiData,
  onSuccess
}: EditKPIModalProps) {
  const token = getToken();
  const [formData, setFormData] = useState<KPIFormData>({
    kpiId: "",
    statement: "",
    definition: "",
    type: "",
    specificAreas: "",
    unitOfMeasure: "",
    itemInMeasure: "",
    disaggregation: "",
    baseLine: "",
    target: "",
    strategicObjectiveId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when kpiData changes
  useEffect(() => {
    if (kpiData) {
      setFormData({
        kpiId: kpiData.kpiId,
        statement: kpiData.statement,
        definition: kpiData.definition,
        type: kpiData.type,
        specificAreas: kpiData.specificAreas,
        unitOfMeasure: kpiData.unitOfMeasure,
        itemInMeasure: kpiData.itemInMeasure,
        disaggregation: kpiData.disaggregation,
        baseLine: kpiData.baseLine,
        target: kpiData.target,
        strategicObjectiveId: kpiData.strategicObjectiveId,
      });
    }
  }, [kpiData]);

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
        isCreate: false,
        data: formData
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
        console.log("KPI updated successfully:", response.data);
        toast.success("KPI updated successfully!");
        
        // Call onSuccess to refresh the table
        if (onSuccess) {
          onSuccess();
        }
        
        // Close modal
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update KPI";
      console.error("Update KPI error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="550px">
      <Heading
        heading="Edit KPI"
        subtitle="Update the key performance indicator details"
      />
      <div className="overflow-y-auto h-112.5 custom-scrollbar p-2.5">
        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <TextInput
            name="statement"
            value={formData.statement}
            label="KPI Statement"
            onChange={(e) => handleInputChange("statement", e.target.value)}
          />
          <TextInput
            name="definition"
            value={formData.definition}
            label="KPI Definition"
            onChange={(e) => handleInputChange("definition", e.target.value)}
          />
          <DropDown
            name="type"
            label="KPI Type"
            placeholder="Select Type"
            value={formData.type}
            onChange={(value: string) => handleInputChange("type", value)}
            options={[
              { label: "Output", value: "Output"},
              { label: "Impact", value: "Impact"},
              { label: "Outcome", value: "Outcome"},
              { label: "Input", value: "Input"},
            ]}
          />
          <DropDown
            name="specificAreas"
            label="Specific Area"
            placeholder="Select Area"
            value={formData.specificAreas}
            onChange={(value: string) => handleInputChange("specificAreas", value)}
            options={[
              { label: "Training", value: "Training" },
            ]}
          />
          <TextInput
            name="unitOfMeasure"
            value={formData.unitOfMeasure}
            label="Unit of Measurement"
            onChange={(e) => handleInputChange("unitOfMeasure", e.target.value)}
          />
          <DropDown
            name="itemInMeasure"
            label="Item in Measure"
            placeholder="Select Item"
            value={formData.itemInMeasure}
            onChange={(value: string) => handleInputChange("itemInMeasure", value)}
            options={[
              { label: "Infrastructure", value: "Infrastructure" },
            ]}
          />
          <DropDown
            name="disaggregation"
            label="Disaggregation"
            placeholder="Select Disaggregation"
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
            value={formData.baseLine}
            name="baseLine"
            onChange={(e) => handleInputChange("baseLine", e.target.value)}
          />
          <TextInput
            label="Target"
            value={formData.target}
            name="target"
            onChange={(e) => handleInputChange("target", e.target.value)}
          />
          <Button 
            content={isSubmitting ? "Updating KPI..." : "Update KPI"} 
            isDisabled={isSubmitting}
          />
        </form>
      </div>
    </Modal>
  );
}
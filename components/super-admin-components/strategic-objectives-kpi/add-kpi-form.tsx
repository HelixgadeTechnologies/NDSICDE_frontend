"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import { useState, FormEvent } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";

type AddKPIFormProps = {
  isOpen: boolean;
  onClose: () => void;
  strategicObjectiveId: string;
  onSuccess?: () => void; // Add this to refresh the table
};

type KPIFormData = {
  statement: string;
  definition: string;
  type: string;
  specificAreas: string;
  unitOfMeasure: string;
  itemInMeasure: string;
  disaggregation: string;
  baseLine: string;
  target: string;
};

export default function AddKPIModal({
  isOpen,
  onClose,
  strategicObjectiveId,
  onSuccess,
}: AddKPIFormProps) {
  const token = getToken();
  const [formData, setFormData] = useState<KPIFormData>({
    statement: "",
    definition: "",
    type: "",
    specificAreas: "",
    unitOfMeasure: "",
    itemInMeasure: "",
    disaggregation: "",
    baseLine: "",
    target: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof KPIFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const payload = {
        isCreate: true,
        data: {
          ...formData,
          strategicObjectiveId,
        },
      };


      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpi`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {

        toast.success("KPI added successfully!");

        // Reset form
        setFormData({
          statement: "",
          definition: "",
          type: "",
          specificAreas: "",
          unitOfMeasure: "",
          itemInMeasure: "",
          disaggregation: "",
          baseLine: "",
          target: "",
        });

        // Call onSuccess to refresh the table
        if (onSuccess) {
          onSuccess();
        }

        // Close modal
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to add KPI";
      console.error("Add KPI error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(errorMessage);
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
              { label: "Output", value: "Output" },
              { label: "Impact", value: "Impact" },
              { label: "Outcome", value: "Outcome" },
            ]}
          />
          <DropDown
            name="specificAreas"
            label="Specific Area"
            placeholder="Select Area"
            value={formData.specificAreas}
            onChange={(value: string) =>
              handleInputChange("specificAreas", value)
            }
            options={[{ label: "Training", value: "Training" }]}
          />
          <DropDown
            name="unitOfMeasure"
            value={formData.unitOfMeasure}
            label="Unit of Measurement"
            placeholder="Select Unit"
            options={[
              { label: "Number", value: "Number" },
              { label: "Percentage of", value: "Percentage of" },
              { label: "Percentage Change", value: "Percentage Change" },
              { label: "Status of", value: "Status of" },
            ]}
            onChange={(value: string) =>
              handleInputChange("unitOfMeasure", value)
            }
          />
          <DropDown
            name="itemInMeasure"
            label="Item in Measure"
            placeholder="Select Item"
            value={formData.itemInMeasure}
            onChange={(value: string) =>
              handleInputChange("itemInMeasure", value)
            }
            options={[{ label: "Infrastructure", value: "Infrastructure" }]}
          />
          <DropDown
            name="disaggregation"
            label="Disaggregation"
            placeholder="Select Disaggregation"
            value={formData.disaggregation}
            onChange={(value: string) =>
              handleInputChange("disaggregation", value)
            }
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
            content={isSubmitting ? "Adding KPI..." : "Add KPI"}
            isDisabled={isSubmitting}
          />
        </form>
      </div>
    </Modal>
  );
}

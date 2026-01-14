"use client";

import { getToken } from "@/lib/api/credentials";
import {
  DropdownOption,
  ProjectOutputTypes,
} from "@/types/project-management-types";
import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: ProjectOutputTypes;
};

export default function ProjectOutputModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  initialData,
}: AddProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOutcome, setIsLoadingOutcome] = useState(false);
  const [responsiblePersons, setResponsiblePersons] = useState<string[]>([]);
  const [outcomeOptions, setOutcomeOptions] = useState<DropdownOption[]>([]);
  const hasInitializedRef = useRef(false);

  const params = useParams();
  const projectId = (params.id as string) || "";
  const token = getToken();

  // form data
  const [formData, setFormData] = useState({
    outputStatement: "",
    thematicAreas: "",
    outcomeId: "",
  });

  // fetch outcomes when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchOutcome();
    }
  }, [isOpen]);

  // initialize form when modal opens and mode changes
  useEffect(() => {
    if (isOpen && !hasInitializedRef.current) {
      if (mode === "edit" && initialData) {
        // prefill form with existing data
        setFormData({
          outputStatement: initialData.outputStatement || "",
          thematicAreas: initialData.thematicAreas || "",
          outcomeId: initialData.outcomeId || "",
        });

        // parse responsible persons from comma-separated strings
        if (initialData.responsiblePerson) {
          const persons = initialData.responsiblePerson
            .split(",")
            .map((person) => person.trim())
            .filter((person) => person.length > 0);
          setResponsiblePersons(persons);
        }
        hasInitializedRef.current = true;
      } else if (mode === "create") {
        resetForm();
        hasInitializedRef.current = true;
      }
    }
  }, [mode, initialData, isOpen]);

  // Reset hasInitializedRef when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasInitializedRef.current = false;
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      outputStatement: "",
      outcomeId: "",
      thematicAreas: "",
    });
    setResponsiblePersons([]);
  };

  // fetch outcomes for dropdown
  const fetchOutcome = async () => {
    setIsLoadingOutcome(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outcomes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Outcomes API response:", response.data);

      // extract data based on API response structure
      let outcomesData = [];
      if (Array.isArray(response.data)) {
        outcomesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        outcomesData = response.data.data;
      } else if (response.data?.data) {
        outcomesData = [response.data.data];
      }

      console.log("Processed outcomes data:", outcomesData);

      // transform data for dropdown - adjust property names based on your actual API response
      const transformedOptions: DropdownOption[] = outcomesData
        .map((outcome: any) => {
          // Try different possible property names
          const statement = 
            outcome.outcomeStatement || 
            `Outcome`;
          
          const id = 
            outcome.outcomeId || 
            "";

          return {
            label: statement,
            value: id,
          };
        })
        .filter((option: any): option is DropdownOption => option !== null);

      console.log("Transformed options:", transformedOptions);

      // Filter out invalid options
      const validOptions = transformedOptions.filter(
        (option) => option.value && option.label
      );

      // Add a default option at the beginning
      const optionsWithDefault = [
        { label: "Select an outcome", value: "" },
        ...validOptions,
      ];

      setOutcomeOptions(optionsWithDefault);

      // If editing and we have an initial outcomeId, ensure it's selected
      if (mode === "edit" && initialData?.outcomeId && optionsWithDefault.length > 0) {
        const outcomeExists = optionsWithDefault.some(
          (option) => option.value === initialData.outcomeId
        );
        
        if (!outcomeExists && initialData.outcomeId) {
          // Add the missing outcome from initialData
          setOutcomeOptions(prev => [
            ...prev,
            {
              label: initialData.outputStatement || "Selected Outcome",
              value: initialData.outcomeId
            }
          ]);
        }
      }
    } catch (error: any) {
      console.error("Error fetching outcomes:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      }
      toast.error("Failed to load outcomes. Please try again.");
    } finally {
      setIsLoadingOutcome(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle dropdown changes
  const handleDropdownChange = (value: string) => {
    console.log(`Dropdown changed: value="${value}"`);
    setFormData((prev) => ({
      ...prev,
      outcomeId: value,
    }));
  };

  // Handle tag input for responsible persons
  const handleResponsiblePersonsChange = (tags: string[]) => {
    setResponsiblePersons(tags);
  };

  // form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.outputStatement.trim()) {
      toast.error("Please enter an output statement");
      return;
    }

    if (!formData.thematicAreas.trim()) {
      toast.error("Please enter a thematic area");
      return;
    }

    if (responsiblePersons.length === 0) {
      toast.error("Please add at least one responsible person");
      return;
    }

    if (!formData.outcomeId) {
      toast.error("Please select an outcome");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing. Please try again");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload matching your example structure
      const payload = {
        isCreate: mode === "create",
        payload: {
          outputId: mode === "edit" ? initialData?.outputId || "" : "",
          outputStatement: formData.outputStatement,
          outcomeId: formData.outcomeId,
          thematicAreas: formData.thematicAreas,
          responsiblePerson: responsiblePersons.join(", "),
          projectId: projectId,
        },
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      toast.success(
        `Project output ${mode === "create" ? "added" : "updated"} successfully!`
      );

      // Reset and close
      resetForm();
      onClose();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting output:", error);

      // Detailed error logging
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
        toast.error(`Failed to ${mode === "create" ? "add" : "update"}: ${errorMessage}`);
      } else {
        toast.error(
          `Failed to ${mode === "create" ? "add" : "update"} project output`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} maxWidth="600px">
      <Heading 
        heading={mode === "create" ? "Add Project Output" : "Edit Project Output"} 
        className="text-center" 
      />
      <div className="space-y-6 mt-6">
        <TextInput
          label="Project Output Statement"
          value={formData.outputStatement}
          name="outputStatement"
          onChange={handleInputChange}
          placeholder="Enter output statement"
        />

        <DropDown
          label="Linked to Outcome"
          name="outcomeId"
          onChange={handleDropdownChange}
          options={outcomeOptions}
          value={formData.outcomeId}
          placeholder={isLoadingOutcome ? "Loading..." : "Select an outcome"}
        />

        <TextInput
          label="Thematic Areas"
          name="thematicAreas"
          onChange={handleInputChange}
          value={formData.thematicAreas}
          placeholder="Enter thematic area"
        />

        <TagInput
          label="Responsible Person(s)"
          tags={responsiblePersons}
          onChange={handleResponsiblePersonsChange}
          placeholder="Add responsible person and press Enter"
        />

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            content="Cancel"
            isSecondary
            onClick={handleModalClose}
            isDisabled={isSubmitting}
          />
          <Button
            content={mode === "create" ? "Add Output" : "Update Output"}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
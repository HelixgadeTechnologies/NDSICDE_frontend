"use client";

import { getToken } from "@/lib/api/credentials";
import { fetchResultTypes } from "@/lib/api/result-types";
import { DropdownOption, ProjectOutcomeTypes } from "@/types/project-management-types";
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
  initialData?: ProjectOutcomeTypes;
};

export default function ProjectOutcomeModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  initialData,
}: AddProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResultTypes, setIsLoadingResultTypes] = useState(false);
  const [isLoadingImpacts, setIsLoadingImpacts] = useState(false);
  const [outcomeResultTypeId, setOutcomeResultTypeId] = useState<string>("");
  const [responsiblePersons, setResponsiblePersons] = useState<string[]>([]);
  const [impactOptions, setImpactOptions] = useState<DropdownOption[]>([]);
  const hasInitializedRef = useRef(false);

  const params = useParams();
  const projectId = (params.id as string) || "";
  const token = getToken();

  // form data
  const [formData, setFormData] = useState({
    outcomeStatement: "",
    outcomeType: "",
    impactId: "",
    thematicAreas: "", 
  });

  // Fetch impacts when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchImpact();
      loadOutcomeResultType();
    }
  }, [isOpen]);

  // Initialize form when modal opens and mode changes
  useEffect(() => {
    if (isOpen && !hasInitializedRef.current) {
      if (mode === "edit" && initialData) {
        // Pre-fill form with existing data
        setFormData({
          outcomeStatement: initialData.outcomeStatement || "",
          outcomeType: initialData.outcomeType || "",
          impactId: initialData.impactId || "",
          thematicAreas: initialData.thematicAreas || "",
        });

        // Parse responsible persons from comma-separated string
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
      outcomeStatement: "",
      outcomeType: "",
      impactId: "",
      thematicAreas: "",
    });
    setResponsiblePersons([]);
    setOutcomeResultTypeId("");
  };

  // Load outcome result type
  const loadOutcomeResultType = async () => {
    setIsLoadingResultTypes(true);
    try {
      const types = await fetchResultTypes();
      const outcomeType = types.find(
        (type) => type.resultName.toLowerCase() === "outcome"
      );

      if (!outcomeType) {
        toast.error("Outcome result type not found. Please contact support");
        return;
      }

      setOutcomeResultTypeId(outcomeType.resultTypeId);
    } catch (error) {
      console.error("Error loading result types: ", error);
      toast.error("Failed to load result types");
    } finally {
      setIsLoadingResultTypes(false);
    }
  };

  // Fetch impacts for dropdown
  const fetchImpact = async () => {
    setIsLoadingImpacts(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/impacts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract data based on API response structure
      let impactsData = [];
      if (Array.isArray(response.data)) {
        impactsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        impactsData = response.data.data;
      } else if (response.data?.data) {
        impactsData = [response.data.data];
      }

      // Transform data for dropdown
      const transformedOptions: DropdownOption[] = impactsData.map(
        (impact: any) => ({
          label: impact.statement || `Impact`,
          value: impact.impactId || "",
        })
      );

      // Filter out invalid options
      const validOptions = transformedOptions.filter(
        (option) => option.value && option.label
      );

      // Add a default option at the beginning
      const optionsWithDefault = [
        { label: "Select an impact", value: "" },
        ...validOptions,
      ];

      setImpactOptions(optionsWithDefault);
    } catch (error) {
      console.error("Error fetching impacts:", error);
      toast.error("Failed to load impacts. Please try again.");
    } finally {
      setIsLoadingImpacts(false);
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
  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle tag input for responsible persons
  const handleResponsiblePersonsChange = (tags: string[]) => {
    setResponsiblePersons(tags);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.outcomeStatement.trim()) {
      toast.error("Please enter an outcome statement");
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

    if (!formData.impactId) {
      toast.error("Please select an impact");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing. Please try again");
      return;
    }

    if (!outcomeResultTypeId) {
      toast.error("Outcome result type is required. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload matching your example
      const payload = {
        isCreate: mode === "create",
        data: {
          outcomeId: mode === "edit" ? initialData?.outcomeId || "" : "",
          outcomeStatement: formData.outcomeStatement,
          outcomeType: formData.outcomeType,
          impactId: formData.impactId,
          thematicAreas: formData.thematicAreas, // Changed to match payload
          responsiblePerson: responsiblePersons.join(", "),
          projectId: projectId,
          resultTypeId: outcomeResultTypeId,
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outcome`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `Project outcome ${mode === "create" ? "added" : "updated"} successfully!`
      );

      // Reset and close
      resetForm();
      onClose();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting outcome:", error);

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
          `Failed to ${mode === "create" ? "add" : "update"} project outcome`
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
        heading={mode === "create" ? "Add Project Outcome" : "Edit Project Outcome"}
        className="text-center"
      />
      <div className="space-y-6 mt-6">
        <TextInput
          label="Project Outcome Statement"
          value={formData.outcomeStatement}
          name="outcomeStatement"
          onChange={handleInputChange}
          placeholder="Enter outcome statement"
        />

        <TextInput
          label="Outcome Type"
          name="outcomeType"
          onChange={handleInputChange}
          value={formData.outcomeType}
          placeholder="Enter outcome type"

        />

        <DropDown
          label="Linked to Impact"
          name="impactId"
          onChange={(value) => handleDropdownChange("impactId", value)}
          options={impactOptions}
          value={formData.impactId}
          placeholder={isLoadingImpacts? "Loading..." :"Select an impact"}
        />

        <TextInput
          label="Thematic Areas"
          name="thematicAreas" // Changed to match payload
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
            content={mode === "create" ? "Add Outcome" : "Update Outcome"}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
"use client";

import Button from "@/ui/form/button";
import TextInput from "@/ui/form/text-input";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import TagInput from "@/ui/form/tag-input";
import axios from "axios";
import { useParams } from "next/navigation";
import { getToken } from "@/lib/api/credentials";
import toast from "react-hot-toast";
import {
  fetchResultTypes,
} from "@/lib/api/result-types";
import { ProjectImpactTypes } from "@/types/project-management-types";


type AddProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: ProjectImpactTypes;
};

export default function ProjectImpactModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  initialData,
}: AddProps) {
  const [successModal, setSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResultTypes, setIsLoadingResultTypes] = useState(false);
  const [impactResultTypeId, setImpactResultTypeId] = useState<string>("");
  const [responsiblePersons, setResponsiblePersons] = useState<string[]>([]);
  const [currentImpactId, setCurrentImpactId] = useState<string>("");
  const hasInitializedRef = useRef(false);

  const params = useParams();
  const projectId = (params?.id as string) || "";
  const token = getToken() || undefined;

  const [formData, setFormData] = useState({
    statement: "",
    thematicArea: "",
  });

  // Initialize form with initialData when in edit mode and modal opens
  useEffect(() => {
    if (isOpen && !hasInitializedRef.current) {
      if (mode === "edit" && initialData) {
        console.log("Prefilling form with initialData:", initialData);
        
        // Pre-fill form with existing data
        setFormData({
          statement: initialData.statement || "",
          thematicArea: initialData.thematicArea || "",
        });

        // Set the impact ID for edit mode
        setCurrentImpactId(initialData.impactId || "");

        // Parse responsible persons from comma-separated string
        if (initialData.responsiblePerson) {
          const persons = initialData.responsiblePerson
            .split(",")
            .map(person => person.trim())
            .filter(person => person.length > 0);
          console.log("Parsed responsible persons:", persons);
          setResponsiblePersons(persons);
        } else {
          setResponsiblePersons([]);
        }

        hasInitializedRef.current = true;
      } else if (mode === "create") {
        // Reset form for create mode
        console.log("Resetting form for create mode");
        resetForm();
        hasInitializedRef.current = true;
      }
    }
  }, [mode, initialData, isOpen]);

  // Fetch result types when modal opens - needed for both create and edit modes
  useEffect(() => {
    if (isOpen) {
      loadImpactResultType();
    }
  }, [isOpen]);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      statement: "",
      thematicArea: "",
    });
    setResponsiblePersons([]);
    setCurrentImpactId("");
    setImpactResultTypeId("");
  };

  // Load result types and find the "Impact" type (needed for both create and edit)
  const loadImpactResultType = async () => {
    setIsLoadingResultTypes(true);
    try {
      const types = await fetchResultTypes();

      const impactType = types.find(
        (type) => type.resultName.toLowerCase() === "impact"
      );

      if (!impactType) {
        toast.error("Impact result type not found. Please contact support.");
        return;
      }

      setImpactResultTypeId(impactType.resultTypeId);
    } catch (error) {
      console.error("Error loading result types:", error);
      toast.error("Failed to load result types");
    } finally {
      setIsLoadingResultTypes(false);
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

  // Handle tag input for responsible persons
  const handleResponsiblePersonsChange = (tags: string[]) => {
    setResponsiblePersons(tags);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.statement.trim()) {
      toast.error("Please enter an impact statement");
      return;
    }

    if (!formData.thematicArea.trim()) {
      toast.error("Please enter a thematic area");
      return;
    }

    if (responsiblePersons.length === 0) {
      toast.error("Please add at least one responsible person");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing. Please try again");
      return;
    }

    if (!impactResultTypeId) {
      toast.error("Impact result type is required. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const impactId = mode === "edit" ? (initialData?.impactId || currentImpactId) : "";

      const payload = {
        isCreate: mode === "create",
        data: {
          impactId: impactId,
          statement: formData.statement,
          thematicArea: formData.thematicArea,
          responsiblePerson: responsiblePersons.join(", "),
          projectId: projectId,
          resultTypeId: impactResultTypeId, // Should be same for both create and edit
        }
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/impact`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Project impact ${mode === 'create' ? 'added' : 'updated'} successfully!`);

      // Close modal and show success
      onClose();
      setSuccessModal(true);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'adding' : 'updating'} project impact:`, error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Failed to ${mode === 'create' ? 'add' : 'update'} impact: ${errorMessage}`);
      } else {
        toast.error(`Failed to ${mode === 'create' ? 'add' : 'update'} project impact`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close - reset form
  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setSuccessModal(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} maxWidth="600px">
        <div className="flex justify-between items-start mb-4">
          <Heading 
            heading={mode === "create" ? "Add Project Impact" : "Edit Project Impact"} 
          />
        </div>

        <div className="space-y-6 mt-6">
          <TextInput
            name="statement"
            value={formData.statement}
            onChange={handleInputChange}
            placeholder="Improve access to clean water"
            label="Project Impact Statement"
            isBigger
          />

          <TextInput
            name="thematicArea"
            value={formData.thematicArea}
            onChange={handleInputChange}
            placeholder="Health & Sanitation"
            label="Thematic Area"
            isBigger
          />

          <TagInput
            label="Responsible Person"
            placeholder="Add responsible person and press Enter"
            onChange={handleResponsiblePersonsChange}
            value={responsiblePersons}
          />

          <div className="flex items-center gap-6">
            <Button
              content="Cancel"
              isSecondary
              onClick={handleModalClose}
              isDisabled={isSubmitting}
            />
            <Button
              content={isSubmitting ? 
                (mode === "create" ? "Adding..." : "Updating...") : 
                (mode === "create" ? "Add Project Impact" : "Update Project Impact")}
              onClick={handleSubmit}
              isDisabled={isSubmitting || isLoadingResultTypes || !impactResultTypeId}
              icon={isSubmitting ? "eos-icons:loading" : undefined}
            />
          </div>
        </div>
      </Modal>

      <Modal isOpen={successModal} onClose={handleSuccessModalClose}>
        <div className="flex justify-center primary mb-4">
          <Icon icon={"simple-line-icons:check"} width={96} height={96} />
        </div>
        <Heading
          heading="Congratulations!"
          subtitle={`Project Impact ${mode === 'create' ? 'added' : 'updated'} successfully`}
          className="text-center"
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button content="Close" onClick={handleSuccessModalClose} />
        </div>
      </Modal>
    </>
  );
}
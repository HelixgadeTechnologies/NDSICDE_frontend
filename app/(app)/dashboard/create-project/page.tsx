"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import Button from "@/ui/form/button";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import DateInput from "@/ui/form/date-input";
import TagInput from "@/ui/form/tag-input";
import stateAndLgaData from "@/lib/config/stateAndLg.json";
import { CreateProjectFormDataType } from "@/types/admin-types";
import axios from "axios";
import {
  CURRENCY_OPTIONS,
  COUNTRY_OPTIONS,
  THEMATIC_AREAS,
} from "@/lib/config/admin-settings";
import { Loader2 } from "lucide-react";
import { useRoleStore } from "@/store/role-store";
import { convertDateToISO8601 } from "@/utils/dates-format-utility";
import { getStrategicObjectives } from "@/lib/api/admin-api-calls";

type FormOneProps = {
  onClick: () => void;
  formData: CreateProjectFormDataType;
  updateFormData: (data: Partial<CreateProjectFormDataType>) => void;
};

type FormTwoProps = {
  onClick: () => void;
  onNext: () => void;
  formData: CreateProjectFormDataType;
  updateFormData: (data: Partial<CreateProjectFormDataType>) => void;
  strategicObjectives: Array<{ label: string; value: string }>;
  isLoadingSO: boolean;
  errorSO: string | null;
  isSubmitting: boolean;
};

function FormOne({ onClick, formData, updateFormData }: FormOneProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateProjectFormDataType, string>>
  >({});

  const validateFormOne = (): boolean => {
    const newErrors: Partial<Record<keyof CreateProjectFormDataType, string>> =
      {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    if (!formData.budgetCurrency) {
      newErrors.budgetCurrency = "Currency is required";
    }

    if (!formData.totalBudgetAmount) {
      newErrors.totalBudgetAmount = "Budget amount is required";
    } else if (
      isNaN(Number(formData.totalBudgetAmount)) ||
      Number(formData.totalBudgetAmount) <= 0
    ) {
      newErrors.totalBudgetAmount = "Please enter a valid budget amount";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateFormOne()) {
      onClick();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  const handleChange = (
    field: keyof CreateProjectFormDataType,
    value: string
  ) => {
    updateFormData({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <TextInput
          value={formData.projectName}
          label="Name of Project"
          placeholder="Enter Project name"
          name="projectName"
          onChange={(e) => handleChange("projectName", e.target.value)}
          error={errors.projectName}
        />
        <DropDown
          label="Implementing Budget Currency"
          value={formData.budgetCurrency}
          name="budgetCurrency"
          placeholder="Budget Currency"
          onChange={(value) => handleChange("budgetCurrency", value)}
          options={CURRENCY_OPTIONS}
          error={errors.budgetCurrency}
        />
        <TextInput
          value={formData.totalBudgetAmount}
          label="Total Budget Amount"
          placeholder="Enter total budget amount"
          name="totalBudgetAmount"
          onChange={(e) => handleChange("totalBudgetAmount", e.target.value)}
          error={errors.totalBudgetAmount}
        />
        <div className="flex items-center gap-4.5 w-full">
          <DateInput
            label="Start Date"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={(date) => handleChange("startDate", date)}
            error={errors.startDate}
          />
          <DateInput
            label="End Date"
            placeholder="End Date"
            value={formData.endDate}
            onChange={(date) => handleChange("endDate", date)}
            error={errors.endDate}
          />
        </div>
        <DropDown
          label="Country"
          value={formData.country}
          name="country"
          placeholder="Enter Country"
          onChange={(value) => handleChange("country", value)}
          options={COUNTRY_OPTIONS}
          error={errors.country}
        />
        <div className="flex gap-8 items-center pt-4">
          <div className="w-2/5">
            <Button isSecondary content="Cancel" href="/dashboard" />
          </div>
          <div className="w-3/5">
            <Button content="Next" onClick={handleNext} />
          </div>
        </div>
      </form>
    </section>
  );
}

function FormTwo({ 
  onClick, 
  onNext, 
  formData, 
  updateFormData, 
  strategicObjectives,
  isLoadingSO,
  errorSO,
  isSubmitting,
}: FormTwoProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateProjectFormDataType, string>>
  >({});

  const stateOptions = useMemo(() => {
    return stateAndLgaData
      .filter((item) => item.state !== "ALL")
      .map((item) => item.state);
  }, []);

  const lgaOptions = useMemo(() => {
    if (formData.targetStates.length === 0) {
      return [];
    }

    const lgas: string[] = [];
    formData.targetStates.forEach((selectedState) => {
      const stateData = stateAndLgaData.find(
        (item) => item.state === selectedState
      );
      if (stateData && stateData.lgas) {
        lgas.push(...stateData.lgas);
      }
    });

    return Array.from(new Set(lgas));
  }, [formData.targetStates]);

  const validateFormTwo = (): boolean => {
    const newErrors: Partial<Record<keyof CreateProjectFormDataType, string>> =
      {};

    if (formData.targetStates.length === 0) {
      newErrors.targetStates = "At least one state is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.strategicObjective) {
      newErrors.strategicObjective = "Strategic objective is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    onClick();
  };

  const handleSubmit = () => {
    if (validateFormTwo()) {
      onNext();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleChange = (
    field: keyof CreateProjectFormDataType,
    value: string | string[]
  ) => {
    updateFormData({ [field]: value });

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section>
      <form className="space-y-6 w-full" onSubmit={handleFormSubmit}>
        <TagInput
          label="Target States"
          tags={formData.targetStates}
          options={stateOptions}
          placeholder="Select target states"
          onChange={(states) => handleChange("targetStates", states)}
          error={errors.targetStates}
        />
        <TagInput
          label="Target Local Governments"
          placeholder="Select target local governments"
          tags={formData.targetLGAs}
          options={lgaOptions}
          onChange={(lgas) => handleChange("targetLGAs", lgas)}
        />
        <TagInput
          label="Target Communities"
          placeholder="Target Communities"
          tags={formData.targetCommunities}
          onChange={(communities) =>
            handleChange("targetCommunities", communities)
          }
        />
        <TagInput
          label="Project Thematic Area(s) or Pillar(s)"
          placeholder="Project Thematic Area(s) or Pillar(s)"
          tags={formData.thematicAreas}
          onChange={(areas) => handleChange("thematicAreas", areas)}
          options={THEMATIC_AREAS}
        />
        <TagInput
          label="Assigned Project Manager(s)"
          placeholder="Assigned Project Manager(s)"
          tags={formData.assignedManagers}
          onChange={(managers) => handleChange("assignedManagers", managers)}
        />
        <DropDown
          label="Strategic Objective"
          placeholder="Select a strategic objective"
          onChange={(value) => handleChange("strategicObjective", value)}
          options={
            isLoadingSO
              ? [{ label: "Loading objectives...", value: "" }]
              : errorSO
              ? [{ label: `Error: ${errorSO}`, value: "" }]
              : strategicObjectives.length === 0
              ? [{ label: "No objectives available", value: "" }]
              : strategicObjectives
          }
          name="strategicObjective"
          value={formData.strategicObjective}
          error={errors.strategicObjective}
          isDisabled={isLoadingSO || strategicObjectives.length === 0}
        />
        <DropDown
          value={formData.status}
          name="status"
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
            { label: "On Hold", value: "On Hold" },
            { label: "Completed", value: "Completed" },
          ]}
          onChange={(value) => handleChange("status", value)}
          label="Status"
          error={errors.status}
        />
        <div className="flex gap-6 items-center mt-8">
          <div className="w-2/5">
            <Button isSecondary content="Back" onClick={handleBack} />
          </div>
          <div className="w-3/5">
            <Button content="Create Project" onClick={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>
      </form>
    </section>
  );
}

export default function CreateNewProject() {
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { token } = useRoleStore();

  // Strategic objectives state
  const [strategicObjectives, setStrategicObjectives] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [isLoadingSO, setIsLoadingSO] = useState(false);
  const [errorSO, setErrorSO] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProjectFormDataType>({
    projectName: "",
    budgetCurrency: "",
    totalBudgetAmount: "",
    startDate: "",
    endDate: "",
    country: "",
    targetStates: [],
    targetLGAs: [],
    targetCommunities: [],
    thematicAreas: [],
    assignedManagers: [],
    strategicObjective: "",
    status: "Active",
  });

  const updateFormData = (data: Partial<CreateProjectFormDataType>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Fetch strategic objectives
 useEffect(() => {
  const fetchStrategicObjectives = async () => {
    setIsLoadingSO(true);
    setErrorSO(null);

    try {
      const result = await getStrategicObjectives(); // StrategicObjective[]

      if (!Array.isArray(result)) {
        throw new Error("Invalid strategic objectives response");
      }

      const transformedObjectives = result.map((obj) => ({
        label: obj.statement,
        value: obj.strategicObjectiveId,
      }));

      setStrategicObjectives(transformedObjectives);
    } catch (error) {
      console.error("Failed to fetch strategic objectives:", error);
      setErrorSO("Failed to load strategic objectives");
      setStrategicObjectives([]);
    } finally {
      setIsLoadingSO(false);
    }
  };

  fetchStrategicObjectives();
}, []);



  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const submitData = {
        isCreate: true,
        data: {
          projectId: "",
          projectName: formData.projectName,
          budgetCurrency: formData.budgetCurrency,
          totalBudgetAmount: formData.totalBudgetAmount,
          startDate: convertDateToISO8601(formData.startDate),
          endDate: convertDateToISO8601(formData.endDate),
          country: formData.country,
          state: formData.targetStates[0] || "",
          localGovernment: formData.targetLGAs[0] || "",
          community: formData.targetCommunities[0] || "",
          thematicAreasOrPillar: formData.thematicAreas.join(", "),
          status: formData.status,
          strategicObjectiveId: formData.strategicObjective, // Now this will be the ID
        },
      };

      console.log("Submitting project data:", submitData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/project`,
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Project created successfully:", response.data);
        openModal();
      } else {
        throw new Error(`Failed to create project: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    {
      id: 1,
      title: "Project Details",
      subtitle: "Fill out these details and get your project ready",
    },
    {
      id: 2,
      title: "Project Location",
      subtitle: "Get full control over your audience",
    },
  ];

  return (
    <section className="flex gap-6">
      <div className="w-3/5">
        <CardComponent height="100%">
          <Heading
            heading="Create New Project"
            subtitle="Fill out these details to create your project"
            className="text-center"
          />

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          {activeTab === 1 ? (
            <FormOne
              onClick={() => setActiveTab(2)}
              formData={formData}
              updateFormData={updateFormData}
            />
          ) : (
            <FormTwo
              onClick={() => setActiveTab(1)}
              onNext={handleFormSubmit}
              formData={formData}
              updateFormData={updateFormData}
              strategicObjectives={strategicObjectives}
              isLoadingSO={isLoadingSO}
              errorSO={errorSO}
              isSubmitting={isSubmitting}
            />
          )}
        </CardComponent>
      </div>

      <div className="w-2/5">
        <CardComponent height="100%">
          <div className="space-y-6">
            {tabs.map((tab) => {
              const isActive =
                activeTab === tab.id || (activeTab === 2 && tab.id <= 2);
              return (
                <div key={tab.id} className="flex gap-4 items-center">
                  <div
                    className={`h-12 w-12 rounded-full flex justify-center items-center ${
                      isActive
                        ? "bg-[#D2091E] text-white font-bold leading-5"
                        : "bg-transparent border border-[#98A2B3] text-[#98A2B3] font-medium leading-5"
                    }`}>
                    {tab.id}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[#101928] font-semibold text-base">
                      {tab.title}
                    </h4>
                    <p className="text-xs text-[#475367]">{tab.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardComponent>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isSubmitting ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin" size={40} color="red" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center primary mb-2">
              <Icon icon={"simple-line-icons:check"} width={96} height={96} />
            </div>
            <h2 className="text-[28px] font-semibold text-center text-gray-900">
              Congratulations!
            </h2>
            <p className="text-sm text-center text-gray-500">
              Project successfully created
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button href="/dashboard" content="Go to Dashboard" />
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
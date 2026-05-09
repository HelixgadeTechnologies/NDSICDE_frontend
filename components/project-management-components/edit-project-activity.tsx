"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import {
  DropdownOption,
  ProjectActivityTypes,
} from "@/types/project-management-types";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import RadioInput from "@/ui/form/radio";
import DropDown from "@/ui/form/select-dropdown";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dates-format-utility";

type SubActivity = {
  id: number;
  description: string;
  deliveryDate: string;
};

type EditProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: ProjectActivityTypes;
};

export default function EditProjectActivity({
  isOpen,
  onClose,
  onSuccess,
  mode = "edit",
  initialData,
}: EditProps) {
  const token = getToken();
  const params = useParams();
  const projectId = (params?.id as string) || "";

  const [activityType, setActivityType] = useState<"none" | "oneOff" | "multiple">(
    "oneOff",
  );
  const [subActivities, setSubActivities] = useState<SubActivity[]>([
    {
      id: 1,
      description: "",
      deliveryDate: "",
    },
  ]);
  const [outputOptions, setOutputOptions] = useState<DropdownOption[]>([]);
  const [isLoadingOutputs, setIsLoadingOutputs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responsiblePersons, setResponsiblePersons] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    activityId: "",
    activityStatement: "",
    outputId: "",
    activityTotalBudget: "",
    activityFrequency: "",
    startDate: "",
    endDate: "",
  });

  // Fetch outputs for dropdown and initialize form
  useEffect(() => {
    if (isOpen) {
      fetchOutputs();

      if (mode === "edit" && initialData) {
        // Pre-fill form with existing data
        setFormData({
          activityId: initialData.activityId || "",
          activityStatement: initialData.activityStatement || "",
          outputId: initialData.outputId || "",
          activityTotalBudget: initialData.activityTotalBudget || "",
          activityFrequency: initialData.activityFrequency || "",
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
        });

        // Parse responsible persons
        if (initialData.responsiblePerson) {
          const persons = initialData.responsiblePerson
            .split(",")
            .map((person) => person.trim())
            .filter((person) => person.length > 0);
          setResponsiblePersons(persons);
        }

        // Determine activity type and sub-activities
        if (
          initialData.subActivity &&
          initialData.subActivity.toLowerCase() === "multiple"
        ) {
          setActivityType("multiple");
          // @ts-ignore - subActivities might be in the raw response
          if (initialData.subActivities && Array.isArray(initialData.subActivities)) {
            // @ts-ignore
            setSubActivities(initialData.subActivities.map((sa: any, index: number) => ({
              id: index + 1,
              description: sa.description || "",
              deliveryDate: sa.activityDate || "",
            })));
          } else if (initialData.descriptionAction && initialData.deliveryDate) {
            setSubActivities([
              {
                id: 1,
                description: initialData.descriptionAction,
                deliveryDate: initialData.deliveryDate,
              },
            ]);
          }
        } else if (
          initialData.subActivity &&
          initialData.subActivity.toLowerCase() === "none"
        ) {
          setActivityType("none");
          setSubActivities([]);
        } else {
          setActivityType("oneOff");
          // For one-off, use the main activity data
          if (initialData.descriptionAction && initialData.deliveryDate) {
            setSubActivities([
              {
                id: 1,
                description: initialData.descriptionAction,
                deliveryDate: initialData.deliveryDate,
              },
            ]);
          }
        }
      } else {
        // Reset for create mode
        resetForm();
      }
    }
  }, [isOpen, mode, initialData]);

  const resetForm = () => {
    setFormData({
      activityId: "",
      activityStatement: "",
      outputId: "",
      activityTotalBudget: "",
      activityFrequency: "",
      startDate: "",
      endDate: "",
    });
    setResponsiblePersons([]);
    setActivityType("oneOff");
    setSubActivities([
      {
        id: 1,
        description: "",
        deliveryDate: "",
      },
    ]);
  };

  // Fetch outputs for dropdown
  const fetchOutputs = async () => {
    setIsLoadingOutputs(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outputs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );


      // Extract data based on API response structure
      let outputsData = [];
      if (Array.isArray(response.data)) {
        outputsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        outputsData = response.data.data;
      } else if (response.data?.data) {
        outputsData = [response.data.data];
      }

      // Transform data for dropdown
      const transformedOptions: DropdownOption[] = outputsData
        .map((output: any) => {
          const statement =
            output.outputStatement || output.statement || `Output`;
          const id = output.outputId || output.id || "";

          if (!id) {
            console.warn("Skipping output without ID:", output);
            return null;
          }

          return {
            label: statement,
            value: id,
          };
        })
        .filter((option: any): option is DropdownOption => option !== null);

      // Add default option
      const optionsWithDefault = [
        { label: "Select an output", value: "" },
        ...transformedOptions,
      ];

      setOutputOptions(optionsWithDefault);
    } catch (error: any) {
      console.error("Error fetching outputs:", error);
      toast.error("Failed to load outputs. Please try again.");
    } finally {
      setIsLoadingOutputs(false);
    }
  };

  const handleActivityTypeChange = (type: "none" | "oneOff" | "multiple") => {
    setActivityType(type);

    // Reset activities based on type
    if (type === "none") {
      setSubActivities([]);
    } else if (type === "oneOff") {
      setSubActivities([
        {
          id: 1,
          description: "",
          deliveryDate: "",
        },
      ]);
    } else if (type === "multiple" && subActivities.length === 0) {
      setSubActivities([
        {
          id: 1,
          description: "",
          deliveryDate: "",
        },
      ]);
    }
  };

  const addSubActivity = () => {
    const newId = Math.max(...subActivities.map((sa) => sa.id), 0) + 1;
    setSubActivities([
      ...subActivities,
      {
        id: newId,
        description: "",
        deliveryDate: "",
      },
    ]);
  };

  const removeSubActivity = (id: number) => {
    if (subActivities.length > 1) {
      setSubActivities(subActivities.filter((sa) => sa.id !== id));
    }
  };

  const updateSubActivity = (
    id: number,
    field: keyof SubActivity,
    value: string,
  ) => {
    setSubActivities(
      subActivities.map((sa) =>
        sa.id === id ? { ...sa, [field]: value } : sa,
      ),
    );
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

    setFormData((prev) => ({
      ...prev,
      outputId: value,
    }));
  };

  // Handle date changes
  const handleDateChange = (name: string, value: string) => {
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
    if (!formData.activityStatement.trim()) {
      toast.error("Please enter an activity statement");
      return;
    }

    if (!formData.outputId) {
      toast.error("Please select an output");
      return;
    }

    if (!formData.activityTotalBudget) {
      toast.error("Please enter activity total budget");
      return;
    }

    if (!formData.startDate) {
      toast.error("Please select start date");
      return;
    }

    if (!formData.endDate) {
      toast.error("Please select end date");
      return;
    }

    if (responsiblePersons.length === 0) {
      toast.error("Please add at least one responsible person");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    // Validate sub-activities if not "None"
    if (activityType !== "none") {
      for (const subActivity of subActivities) {
        if (!subActivity.description.trim()) {
          toast.error("Please describe all sub-activities");
          return;
        }
        if (!subActivity.deliveryDate) {
          toast.error("Please select delivery date for all sub-activities");
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare single payload matching the new structure
      const payload = {
        isCreate: mode === "create",
        payload: {
          activityId: mode === "edit" ? formData.activityId : "",
          activityStatement: formData.activityStatement,
          outputId: formData.outputId,
          activityTotalBudget: parseFloat(formData.activityTotalBudget) || 0,
          responsiblePerson: responsiblePersons.join(", "),
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          activityFrequency: parseInt(formData.activityFrequency) || 0,
          subActivity:
            activityType === "multiple"
              ? "Multiple"
              : activityType === "oneOff"
                ? "One Off"
                : "None",
          descriptionAction:
            activityType === "oneOff" ? subActivities[0]?.description : "N/A",
          deliveryDate:
            activityType === "oneOff"
              ? new Date(subActivities[0]?.deliveryDate).toISOString()
              : new Date().toISOString(),
          projectId: projectId,
          subActivities:
            activityType === "multiple"
              ? subActivities.map((sa) => ({
                  subActivitiesId: crypto.randomUUID(),
                  activityId: mode === "edit" ? formData.activityId : "",
                  description: sa.description,
                  activityDate: new Date(sa.deliveryDate).toISOString(),
                }))
              : [],
        },
      };

      console.log("Submitting activity payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("API Response:", response.data);

        toast.success(`Project activity ${mode === "create" ? "added" : "updated"} successfully!`),

      // Reset and close
      resetForm();
      onClose();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting activity:", error);

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
        toast.error(
          `Failed to ${mode === "create" ? "add" : "update"} activity: ${errorMessage}`,
        );
      } else {
        toast.error(
          `Failed to ${mode === "create" ? "add" : "update"} project activity`,
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

  const modalTitle =
    mode === "create" ? "Add Project Activity" : "Edit Project Activity";

  const buttonText =
    mode === "create" ? "Add Project Activity" : "Update Project Activity";

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} maxWidth="600px">
      <Heading heading={modalTitle} className="text-center" />
      <div className="space-y-6 h-112.5 custom-scrollbar overflow-y-auto overflow-x-hidden pr-5 my-5">
        <TextInput
          name="activityStatement"
          value={formData.activityStatement}
          onChange={handleInputChange}
          label="Activity Statement"
          placeholder="Enter activity statement"
          isBigger
        />

        <DropDown
          name="outputId"
          label="Linked to Output"
          placeholder={
            isLoadingOutputs ? "Loading outputs..." : "Select an output"
          }
          options={outputOptions}
          value={formData.outputId}
          onChange={handleDropdownChange}
          isBigger
        />

        <TextInput
          name="activityTotalBudget"
          value={formData.activityTotalBudget}
          onChange={handleInputChange}
          label="Activity Total Budget"
          placeholder="Enter total budget"
          isBigger
        />

        <TagInput
          label="Responsible Persons"
          tags={responsiblePersons}
          onChange={handleResponsiblePersonsChange}
          placeholder="Add responsible person and press Enter"
        />

        <div className="flex items-center gap-2">
          <DateInput
            label="Activity Start Date"
            value={formatDate(formData.startDate, "custom")}
            onChange={(value) => handleDateChange("startDate", value)}
          />
          <DateInput
            label="Activity End Date"
            value={formatDate(formData.endDate, "custom")}
            onChange={(value) => handleDateChange("endDate", value)}
          />
        </div>

        <TextInput
          name="activityFrequency"
          value={formData.activityFrequency}
          onChange={handleInputChange}
          label="Activity Frequency"
          placeholder="Enter frequency"
          isBigger
        />

        {/* Sub-Activity Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-900 font-medium">Sub-Activity</p>
            <div className="flex items-center gap-6">
              <RadioInput
                label="None"
                name="subActivity"
                value="none"
                onChange={() => handleActivityTypeChange("none")}
                is_checked={activityType === "none"}
              />
              <RadioInput
                label="One Off"
                name="subActivity"
                value="oneOff"
                onChange={() => handleActivityTypeChange("oneOff")}
                is_checked={activityType === "oneOff"}
              />
              <RadioInput
                label="Multiple"
                name="subActivity"
                value="multiple"
                onChange={() => handleActivityTypeChange("multiple")}
                is_checked={activityType === "multiple"}
              />
            </div>
          </div>

          {/* Sub-Activities List */}
          {activityType !== "none" && (
            <div className="space-y-4">
              {subActivities.map((subActivity, index) => (
                <div
                  key={subActivity.id}
                  className={`space-y-4 ${
                    activityType === "multiple" && subActivities.length > 1
                      ? "rounded-lg relative"
                      : ""
                  }`}>
                  {/* Remove button */}
                  {activityType === "multiple" && subActivities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubActivity(subActivity.id)}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white size-7 rounded-full flex items-center justify-center transition-colors shadow-md z-10"
                      title="Remove sub-activity">
                      <Icon icon="heroicons:x-mark" className="size-4" />
                    </button>
                  )}

                  <TextareaInput
                    label={
                      index === 0
                        ? "Describe Action"
                        : `Describe Action ${index + 1}`
                    }
                    name={`describeAction-${subActivity.id}`}
                    value={subActivity.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateSubActivity(
                        subActivity.id,
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="Describe the action to be taken"
                  />

                  <DateInput
                    label={
                      index === 0
                        ? "Planned Delivery Date (This date must be within the linked activity start and end date)"
                        : `Delivery Date ${index + 1}`
                    }
                    value={formatDate(subActivity.deliveryDate, "custom")}
                    onChange={(value) =>
                      updateSubActivity(subActivity.id, "deliveryDate", value)
                    }
                  />
                </div>
              ))}

              {/* Add Another Sub-Activity Button */}
              {activityType === "multiple" && (
                <button
                  type="button"
                  onClick={addSubActivity}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border-2 border-dashed border-blue-300 hover:border-blue-400 w-full justify-center">
                  <Icon icon="ic:round-plus" height={20} width={20} />
                  Add Another Sub-Activity
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 pt-4">
        <Button
          content="Cancel"
          isSecondary
          onClick={handleModalClose}
          isDisabled={isSubmitting}
        />
        <Button
          content={buttonText}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        />
      </div>
    </Modal>
  );
}

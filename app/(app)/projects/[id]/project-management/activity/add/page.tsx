"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { DropdownOption } from "@/types/project-management-types";
import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import RadioInput from "@/ui/form/radio";
import DropDown from "@/ui/form/select-dropdown";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import toast from "react-hot-toast";

type SubActivity = {
  id: number;
  description: string;
  deliveryDate: string;
};

export default function AddProjectActivity() {
  const router = useRouter();
  const params = useParams();
  const token = getToken();
  const projectId = (params?.id as string) || "";
  
  const [activityType, setActivityType] = useState<"oneOff" | "multiple">("oneOff");
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
    activityStatement: "",
    outputId: "",
    activityTotalBudget: "",
    activityFrequency: "",
    startDate: "",
    endDate: "",
  });

  // Fetch outputs for dropdown
  useEffect(() => {
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
            const statement = output.outputStatement || output.statement || `Output`;
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

    if (projectId) {
      fetchOutputs();
    }
  }, [projectId, token]);

  const handleActivityTypeChange = (type: "oneOff" | "multiple") => {
    setActivityType(type);
    
    // Reset to single activity when switching to "One Off"
    if (type === "oneOff" && subActivities.length > 1) {
      setSubActivities([subActivities[0]]);
    }
  };

  const addSubActivity = () => {
    const newId = Math.max(...subActivities.map(sa => sa.id), 0) + 1;
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
      setSubActivities(subActivities.filter(sa => sa.id !== id));
    }
  };

  const updateSubActivity = (id: number, field: keyof SubActivity, value: string) => {
    setSubActivities(
      subActivities.map(sa =>
        sa.id === id ? { ...sa, [field]: value } : sa
      )
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
    console.log(`Dropdown outputId changed to:`, value);
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

    if (!formData.activityTotalBudget.trim()) {
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

    // Validate sub-activities
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

    setIsSubmitting(true);

    try {
      // Prepare payload matching your example
      // For multiple sub-activities, we might need to send multiple payloads
      // or adjust the API to accept an array. Assuming one payload per sub-activity
      const payloads = subActivities.map((subActivity, index) => ({
        isCreate: true,
        payload: {
          activityId: "", // Empty for create
          activityStatement: formData.activityStatement,
          outputId: formData.outputId,
          activityTotalBudget: parseFloat(formData.activityTotalBudget) || 0,
          responsiblePerson: responsiblePersons.join(", "),
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          activityFrequency: parseInt(formData.activityFrequency) || 0,
          subActivity: activityType === "multiple" ? `Sub-Activity ${index + 1}` : "One Off",
          descriptionAction: subActivity.description,
          deliveryDate: new Date(subActivity.deliveryDate).toISOString(),
          projectId: projectId,
        },
      }));

      console.log("Submitting activity payloads:", JSON.stringify(payloads, null, 2));

      // Send all sub-activities
      const promises = payloads.map(payload =>
        axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      const responses = await Promise.all(promises);
      console.log("API Responses:", responses.map(r => r.data));

      toast.success(
        `Project activity${subActivities.length > 1 ? ' and sub-activities' : ''} added successfully!`
      );

      // Redirect back or to activities list
      router.back();
      
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
        toast.error(`Failed to add activity: ${errorMessage}`);
      } else {
        toast.error("Failed to add project activity");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-156">
      <CardComponent>
        <Heading
          heading="Project Activities, Format and Attributes"
          className="text-center"
        />
        <div className="space-y-6">
          <TextInput
            name="activityStatement"
            value={formData.activityStatement}
            onChange={handleInputChange}
            label="Activity Statement"
            isBigger
            placeholder="Enter activity statement"
          />
          
          <DropDown
            name="outputId"
            label="Linked to Output"
            placeholder={isLoadingOutputs ? "Loading outputs..." : "Select an output"}
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
            isBigger
            placeholder="Enter total budget"
          />
          
          <TagInput 
            label="Responsible Persons (After adding a name, press Enter key)" 
            tags={responsiblePersons}
            onChange={handleResponsiblePersonsChange}
            placeholder="Add responsible person and press Enter"
          />
          
          <div className="flex items-center gap-2">
            <DateInput 
              label="Activity Start Date" 
              value={formData.startDate}
              onChange={(value) => handleDateChange("startDate", value)}
            />
            <DateInput 
              label="Activity End Date" 
              value={formData.endDate}
              onChange={(value) => handleDateChange("endDate", value)}
            />
          </div>
          
          <TextInput
            name="activityFrequency"
            value={formData.activityFrequency}
            onChange={handleInputChange}
            label="Activity Frequency"
            isBigger
            placeholder="Enter frequency"
          />

          {/* Sub-Activity Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-900 font-medium">Sub-Activity</p>
              <div className="flex items-center gap-6">
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
            <div className="space-y-4">
              {subActivities.map((subActivity, index) => (
                <div
                  key={subActivity.id}
                  className={`space-y-4 ${
                    activityType === "multiple" && subActivities.length > 1
                      ? "rounded-lg relative"
                      : ""
                  }`}
                >
                  {/* Remove button */}
                  {activityType === "multiple" && subActivities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubActivity(subActivity.id)}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white size-7 rounded-full flex items-center justify-center transition-colors shadow-md z-10"
                      title="Remove sub-activity"
                    >
                      <Icon icon="heroicons:x-mark" className="size-4" />
                    </button>
                  )}

                  <TextareaInput
                    label={index === 0 ? "Describe Action" : `Describe Action ${index + 1}`}
                    name={`describeAction-${subActivity.id}`}
                    value={subActivity.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateSubActivity(subActivity.id, "description", e.target.value)
                    }
                    placeholder="Describe the action to be taken"
                  />

                  <DateInput
                    label={
                      index === 0
                        ? "Planned Delivery Date (This date must be within the linked activity start and end date)"
                        : `Delivery Date ${index + 1}`
                    }
                    value={subActivity.deliveryDate}
                    onChange={(value) => updateSubActivity(subActivity.id, "deliveryDate", value)}
                  />
                </div>
              ))}

              {/* Add Another Sub-Activity Button */}
              {activityType === "multiple" && (
                <button
                  type="button"
                  onClick={addSubActivity}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border-2 border-dashed border-blue-300 hover:border-blue-400 w-full justify-center"
                >
                  <Icon icon="ic:round-plus" height={20} width={20} />
                  Add Another Sub-Activity
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <Button
              content="Cancel"
              isSecondary
              onClick={handleCancel}
              isDisabled={isSubmitting}
            />
            <Button 
              content="Add Project Activity" 
              onClick={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            />
          </div>
        </div>
      </CardComponent>
    </div>
  );
}
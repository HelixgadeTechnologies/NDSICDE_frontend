"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import RadioInput from "@/ui/form/radio";
import DropDown from "@/ui/form/select-dropdown";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";

type SubActivity = {
  id: number;
  description: string;
  deliveryDate: string;
};

export default function AddProjectActivity() {
  const [activityType, setActivityType] = useState<"oneOff" | "multiple">("oneOff");
  const [subActivities, setSubActivities] = useState<SubActivity[]>([
    {
      id: 1,
      description: "",
      deliveryDate: "",
    },
  ]);

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

  const handleSubmit = () => {
    console.log("Activity Type:", activityType);
    console.log("Sub Activities:", subActivities);
    // Handle form submission here
  };

  return (
    <div className="w-[624px]">
      <CardComponent>
        <Heading
          heading="Project Activities, Format and Attributes"
          className="text-center"
        />
        <div className="space-y-6">
          <TextInput
            name="activityStatement"
            value=""
            onChange={() => {}}
            label="Activity Statement"
            isBigger
          />
          <DropDown
            name="linkedToOutput"
            label="Linked to Output"
            placeholder="---"
            options={[]}
            value=""
            onChange={() => {}}
            isBigger
          />
          <TextInput
            name="activityTotalBudget"
            value=""
            onChange={() => {}}
            label="Activity Total Budget"
            isBigger
          />
          <TagInput label="Responsible Persons" />
          <div className="flex items-center gap-2">
            <DateInput label="Activity Start Date" />
            <DateInput label="Activity End Date" />
          </div>
          <TextInput
            name="activityFrequency"
            value=""
            onChange={() => {}}
            label="Activity Frequency"
            isBigger
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
                  {/* Show number badge for multiple activities */}
                  {/* {activityType === "multiple" && subActivities.length > 1 && (
                    <div className="absolute -top-3 -left-3 bg-blue-600 text-white size-7 rounded-full flex items-center justify-center text-xs font-semibold shadow-md z-10">
                      {index + 1}
                    </div>
                  )} */}

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
                    label={index === 0 ? "Describe Action" : ""}
                    name={`describeAction-${subActivity.id}`}
                    value={subActivity.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateSubActivity(subActivity.id, "description", e.target.value)
                    }
                  />

                  <DateInput
                    label={
                      index === 0
                        ? "Planned Delivery Date (This date must be within the linked activity start and end date)"
                        : ""
                    }
                    value={subActivity.deliveryDate}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    //   updateSubActivity(subActivity.id, "deliveryDate", e.target.value)
                    // }
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
              onClick={() => window.history.back()}
            />
            <Button content="Add Project Activity" onClick={handleSubmit} />
          </div>
        </div>
      </CardComponent>
    </div>
  );
}
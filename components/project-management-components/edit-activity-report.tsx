"use client";

import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import Modal from "@/ui/popup-modal";
import TextareaInput from "@/ui/form/textarea";
import Heading from "@/ui/text-heading";
import { ProjectActivityReportTypes } from "@/types/project-management-types";
import { getToken } from "@/lib/api/credentials";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PercentageOption {
  id: string;
  label: string;
  minValue: number;
  maxValue?: number;
  isRange?: boolean;
}

const PERCENTAGE_OPTIONS: PercentageOption[] = [
  { id: "0", label: "Not Started (0%)", minValue: 0 },
  {
    id: "1",
    label: "Preliminary progress (1% - 29%)",
    minValue: 1,
    maxValue: 29,
    isRange: true,
  },
  {
    id: "30",
    label: "Mid Progress (30% - 50%)",
    minValue: 30,
    maxValue: 50,
    isRange: true,
  },
  {
    id: "51",
    label: "Advanced Progress (51% - 69%)",
    minValue: 51,
    maxValue: 69,
    isRange: true,
  },
  {
    id: "70",
    label: "Near Completion (70% - 99%)",
    minValue: 70,
    maxValue: 99,
    isRange: true,
  },
  { id: "100", label: "Fully Completed (100%)", minValue: 100 },
];

type EditActivityReportProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProjectActivityReportTypes;
  onSuccess?: () => void;
};

export default function EditActivityReport({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: EditActivityReportProps) {
  const token = getToken();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    percentageCompletion: initialData.percentageCompletion ?? 0,
    actualStartDate: initialData.actualStartDate ?? "",
    actualEndDate: initialData.actualEndDate ?? "",
    actualNarrative: initialData.actualNarrative ?? "",
  });

  // Re-sync whenever the modal opens with (potentially new) initialData
  useEffect(() => {
    if (isOpen) {
      setFormData({
        percentageCompletion: initialData.percentageCompletion ?? 0,
        actualStartDate: initialData.actualStartDate ?? "",
        actualEndDate: initialData.actualEndDate ?? "",
        actualNarrative: initialData.actualNarrative ?? "",
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (
    field: "actualStartDate" | "actualEndDate",
    date: string,
  ) => {
    const isoDate = date ? new Date(date).toISOString() : "";
    handleInputChange(field, isoDate);
  };

  const handleSubmit = async () => {
    if (!formData.actualStartDate) {
      toast.error("Please select an actual start date");
      return;
    }
    if (!formData.actualEndDate) {
      toast.error("Please select an actual end date");
      return;
    }
    if (!formData.actualNarrative.trim()) {
      toast.error("Please enter an activity narrative");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        isCreate: false,
        payload: {
          activityReportId: initialData.activityReportId,
          activityId: initialData.activityId,
          percentageCompletion: formData.percentageCompletion,
          actualStartDate: formData.actualStartDate,
          actualEndDate: formData.actualEndDate,
          actualNarrative: formData.actualNarrative,
          actualCost: initialData.actualCost ?? 0,
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity-report`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Activity report updated successfully.");
        onClose();
        onSuccess?.();
      } else {
        toast.error(
          response.data.message || "Failed to update activity report",
        );
      }
    } catch (error: any) {
      console.error("Error updating activity report:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="560px">
      <div className="space-y-6">
        <Heading heading="Edit Activity Report" />

        <div className="h-[480px] overflow-y-auto custom-scrollbar pr-2 space-y-6">
          {/* Prefilled read-only info */}
          {initialData.activityStatement && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                Activity Statement
              </p>
              <div className="w-full border border-gray-200 rounded-md p-3 text-sm bg-gray-50 text-gray-500">
                {initialData.activityStatement}
              </div>
            </div>
          )}

          {/* Percentage completion */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">
              Percent Completion (%)
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {PERCENTAGE_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="percentageCompletion"
                    id={`edit-pct-${option.id}`}
                    className="size-4 accent-(--primary)"
                    checked={
                      formData.percentageCompletion === option.minValue
                    }
                    onChange={() =>
                      handleInputChange("percentageCompletion", option.minValue)
                    }
                  />
                  <label htmlFor={`edit-pct-${option.id}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-4">
            <DateInput
              label="Actual Start Date"
              value={
                formData.actualStartDate
                  ? new Date(formData.actualStartDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(val) => handleDateChange("actualStartDate", val)}
            />
            <DateInput
              label="Actual End Date"
              value={
                formData.actualEndDate
                  ? new Date(formData.actualEndDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(val) => handleDateChange("actualEndDate", val)}
            />
          </div>

          {/* Narrative */}
          <TextareaInput
            label="Activity Narrative"
            name="actualNarrative"
            value={formData.actualNarrative}
            onChange={(e) =>
              handleInputChange("actualNarrative", e.target.value)
            }
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
          <Button
            content="Cancel"
            isSecondary
            onClick={onClose}
            isDisabled={isSubmitting}
          />
          <Button
            content={isSubmitting ? "Saving..." : "Save Changes"}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}

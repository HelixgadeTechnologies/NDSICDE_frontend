"use client";

import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import TagInput from "@/ui/form/tag-input";
import TextareaInput from "@/ui/form/textarea";
import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";
import DisaggregationComponent from "@/ui/disaggregation-component";

export type KPI = {
  kpiId: string;
  statement: string;
  definition: string;
  type: string;
  specificArea?: string;
  specificAreas?: string; // Keep for compatibility if API still sends it
  unitOfMeasure: string;
  itemInMeasure: string;
  responsiblePersons?: string;
  
  baseLineDate?: string;
  cumulativeValue: string | number;
  baselineNarrative?: string;
  
  targetDate?: string;
  cumulativeTarget: string | number;
  targetNarrative?: string;
  targetType?: string;
  
  strategicObjectiveId: string;
  disaggregation?: string;
  kpiDisaggregation?: Array<{
    type: string;
    category: string;
    baseline: string | number;
    target: string | number;
  }>;
  createAt?: string;
  updateAt?: string;
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
  specificArea: string;
  unitOfMeasure: string;
  itemInMeasure: string;
  responsiblePersons: string[];
  
  baseLineDate: string;
  cumulativeValue: string;
  baselineNarrative: string;
  
  targetDate: string;
  cumulativeTarget: string;
  targetNarrative: string;
  targetType: string;
};

const KPI_TYPE_OPTIONS = [
  { label: "Output", value: "Output" },
  { label: "Impact", value: "Impact" },
  { label: "Outcome", value: "Outcome" },
];

const UNIT_OPTIONS = [
  { label: "Number", value: "Number" },
  { label: "Percentage of", value: "Percentage of" },
  { label: "Percentage Change", value: "Percentage Change" },
  { label: "Status", value: "Status" },
];

const TARGET_TYPE_OPTIONS = [
  { label: "Incremental", value: "Incremental" },
  { label: "Cumulative", value: "Cumulative" },
];

const KPI_DISAGG_TYPES = [
  "Department",
  "State",
  "Product",
  "Tenure",
  "Gender",
  "Age",
  "None",
];

const SPECIFIC_AREA_OPTIONS = [
  { label: "Training", value: "Training" },
  { label: "Capacity Building", value: "Capacity Building" },
  { label: "Infrastructure", value: "Infrastructure" },
];

const ITEM_IN_MEASURE_OPTIONS = [
  { label: "Participants", value: "Participants" },
  { label: "Communities", value: "Communities" },
  { label: "Infrastructure", value: "Infrastructure" },
];

export default function EditKPIModal({
  isOpen,
  onClose,
  kpiData,
  onSuccess,
}: EditKPIModalProps) {
  const token = getToken();
  
  const [formData, setFormData] = useState<KPIFormData>({
    kpiId: "",
    statement: "",
    definition: "",
    type: "",
    specificArea: "",
    unitOfMeasure: "",
    itemInMeasure: "",
    responsiblePersons: [],
    baseLineDate: "",
    cumulativeValue: "",
    baselineNarrative: "",
    targetDate: "",
    cumulativeTarget: "",
    targetNarrative: "",
    targetType: "Cumulative",
  });

  const [disaggCheckboxes, setDisaggCheckboxes] = useState<boolean[]>(Array(KPI_DISAGG_TYPES.length).fill(false));
  const [disaggRows, setDisaggRows] = useState<Record<string, any>>({});
  const [disaggItems, setDisaggItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when kpiData changes
  useEffect(() => {
    if (kpiData) {
      const kd = kpiData as any;
      setFormData({
        kpiId: kd.kpiId || "",
        statement: kd.statement || "",
        definition: kd.definition || "",
        type: kd.type || "",
        specificArea: kd.specificArea || kd.specificAreas || "",
        unitOfMeasure: kd.unitOfMeasure || "",
        itemInMeasure: kd.itemInMeasure || "",
        responsiblePersons: kd.responsiblePersons ? kd.responsiblePersons.split(", ").filter(Boolean) : [],
        baseLineDate: (kd.baseLineDate || kd.baselineDate || "")?.split("T")[0] || "",
        cumulativeValue: String(kd.cumulativeValue || ""),
        baselineNarrative: kd.baselineNarrative || kd.baseLineNarrative || "",
        targetDate: (kd.targetDate || "")?.split("T")[0] || "",
        cumulativeTarget: String(kd.cumulativeTarget || ""),
        targetNarrative: kd.targetNarrative || "",
        targetType: kd.targetType || "Cumulative",
      });

      // Handle disaggregation population
      const disagg = kd.kpiDisaggregation || kd.disaggregations || [];
      if (Array.isArray(disagg) && disagg.length > 0) {
        const newCheckboxes = Array(KPI_DISAGG_TYPES.length).fill(false);
        const newRows: Record<string, any> = {};

        disagg.forEach((item: any) => {
          const typeIndex = KPI_DISAGG_TYPES.indexOf(item.type);
          if (typeIndex !== -1) {
            newCheckboxes[typeIndex] = true;
          }
          
          if (!newRows[item.type]) {
            newRows[item.type] = [];
          }
          newRows[item.type].push({
            category: item.category,
            value: item.baseline ?? item.value ?? 0,
            target: item.target ?? 0,
          });
        });

        setDisaggCheckboxes(newCheckboxes);
        setDisaggRows(newRows);
      } else {
        // Reset disaggregation if none provided
        setDisaggCheckboxes(Array(KPI_DISAGG_TYPES.length).fill(false));
        setDisaggRows({});
      }
    }
  }, [kpiData]);

  const handleInputChange = (field: keyof KPIFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDisaggregationChange = (items: any[]) => {
    setDisaggItems(items);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.statement || !formData.type || !formData.unitOfMeasure) {
      toast.error("Please fill in the required KPI details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        isCreate: false,
        data: {
          kpiId: formData.kpiId,
          statement: formData.statement,
          definition: formData.definition,
          specificArea: formData.specificArea,
          unitOfMeasure: formData.unitOfMeasure,
          itemInMeasure: formData.itemInMeasure,
          baseLineDate: formData.baseLineDate ? new Date(formData.baseLineDate).toISOString() : null,
          cumulativeValue: formData.unitOfMeasure === "Status" ? formData.cumulativeValue : (Number(formData.cumulativeValue) || 0),
          baselineNarrative: formData.baselineNarrative,
          targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : null,
          cumulativeTarget: formData.unitOfMeasure === "Status" ? formData.cumulativeTarget : (Number(formData.cumulativeTarget) || 0),
          targetNarrative: formData.targetNarrative,
          targetType: formData.targetType,
          responsiblePersons: formData.responsiblePersons.join(", "),
          type: formData.type,
          strategicObjectiveId: kpiData?.strategicObjectiveId,
          kpiDisaggregation: disaggItems.map((item) => ({
            type: item.type,
            category: item.category,
            baseline: formData.unitOfMeasure === "Status" ? item.value : (Number(item.value) || 0),
            target: formData.unitOfMeasure === "Status" ? item.target : (Number(item.target) || 0),
          })),
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

      if (response.data?.success || response.status === 200 || response.status === 201) {
        toast.success("KPI updated successfully");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to update KPI");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update KPI";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStatusType = formData.unitOfMeasure === "Status";

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="800px">
      <Heading
        heading="Edit KPI"
        subtitle="Update the key performance indicator details"
        className="mb-6"
      />
      <div className="overflow-y-auto max-h-[70vh] custom-scrollbar p-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* KPI Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <TextInput
                name="statement"
                value={formData.statement}
                label="KPI Statement"
                onChange={(e) => handleInputChange("statement", e.target.value)}
                placeholder="Enter KPI statement"
              />
            </div>
            <div className="md:col-span-2">
              <TextareaInput
                name="definition"
                value={formData.definition}
                label="KPI Definition"
                onChange={(e) => handleInputChange("definition", e.target.value)}
                placeholder="Describe the KPI and how it's measured"
              />
            </div>
            <DropDown
              name="type"
              label="KPI Type"
              placeholder="Select Type"
              value={formData.type}
              onChange={(value: string) => handleInputChange("type", value)}
              options={KPI_TYPE_OPTIONS}
            />
            <DropDown
              name="specificArea"
              value={formData.specificArea}
              label="Specific Area"
              placeholder="Select Area"
              options={SPECIFIC_AREA_OPTIONS}
              onChange={(value: string) => handleInputChange("specificArea", value)}
            />
            <DropDown
              name="unitOfMeasure"
              value={formData.unitOfMeasure}
              label="Unit of Measurement"
              placeholder="Select Unit"
              options={UNIT_OPTIONS}
              onChange={(value: string) => handleInputChange("unitOfMeasure", value)}
            />
            <DropDown
              name="itemInMeasure"
              value={formData.itemInMeasure}
              label="Item in Measure"
              placeholder="Select Item"
              options={ITEM_IN_MEASURE_OPTIONS}
              onChange={(value: string) => handleInputChange("itemInMeasure", value)}
            />
            <div className="md:col-span-2">
              <TagInput
                label="Responsible Person(s)"
                value={formData.responsiblePersons}
                onChange={(tags) => handleInputChange("responsiblePersons", tags)}
                placeholder="Add persons..."
              />
            </div>
          </div>

          {/* Setup Disaggregation */}
          <div className="border-t border-gray-100 pt-6">
            <DisaggregationComponent 
              view="setup"
              customTypes={KPI_DISAGG_TYPES}
              sharedCheckboxes={disaggCheckboxes}
              onCheckboxesChange={setDisaggCheckboxes}
            />
          </div>

          {/* Baseline Section */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">Baseline Configuration</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1.5">Baseline Date</p>
                <DateInput 
                  value={formData.baseLineDate}
                  onChange={(val) => handleInputChange("baseLineDate", val)}
                />
              </div>
              <TextInput
                label="Cumulative Baseline Value"
                value={formData.cumulativeValue}
                name="cumulativeValue"
                onChange={(e) => handleInputChange("cumulativeValue", e.target.value)}
                placeholder="0"
              />
              <div className="md:col-span-2">
                <TextareaInput
                  label="Baseline Narrative"
                  value={formData.baselineNarrative}
                  name="baselineNarrative"
                  onChange={(e) => handleInputChange("baselineNarrative", e.target.value)}
                  placeholder="Additional context about the baseline..."
                />
              </div>
            </div>
            <DisaggregationComponent 
              view="baseline"
              customTypes={KPI_DISAGG_TYPES}
              isStatusType={isStatusType}
              sharedCheckboxes={disaggCheckboxes}
              sharedRows={disaggRows}
              onRowsChange={setDisaggRows}
              onChange={handleDisaggregationChange}
              cumulativeValue={formData.cumulativeValue}
            />
          </div>

          {/* Target Section */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">Target Configuration</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1.5">Target Date</p>
                <DateInput 
                  value={formData.targetDate}
                  onChange={(val) => handleInputChange("targetDate", val)}
                />
              </div>
              <TextInput
                label="Cumulative Target Value"
                value={formData.cumulativeTarget}
                name="cumulativeTarget"
                onChange={(e) => handleInputChange("cumulativeTarget", e.target.value)}
                placeholder="0"
              />
              <DropDown
                label="Target Type"
                value={formData.targetType}
                name="targetType"
                options={TARGET_TYPE_OPTIONS}
                onChange={(val) => handleInputChange("targetType", val)}
              />
              <div className="md:col-span-2">
                <TextareaInput
                  label="Target Narrative"
                  value={formData.targetNarrative}
                  name="targetNarrative"
                  onChange={(e) => handleInputChange("targetNarrative", e.target.value)}
                  placeholder="Additional context about the target..."
                />
              </div>
            </div>
            <DisaggregationComponent 
              view="target"
              customTypes={KPI_DISAGG_TYPES}
              isStatusType={isStatusType}
              sharedCheckboxes={disaggCheckboxes}
              sharedRows={disaggRows}
              onRowsChange={setDisaggRows}
              onChange={handleDisaggregationChange}
              cumulativeTarget={formData.cumulativeTarget}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button
              content="Cancel"
              isSecondary
              onClick={onClose}
              type="button"
            />
            <Button
              content={isSubmitting ? "Updating KPI..." : "Update KPI"}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
              type="submit"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

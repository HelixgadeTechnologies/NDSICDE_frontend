"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Heading from "@/ui/text-heading";
import TextInput from "@/ui/form/text-input";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import DateInput from "@/ui/form/date-input";
import TagInput from "@/ui/form/tag-input";
import TextareaInput from "@/ui/form/textarea";
import DisaggregationComponent from "@/ui/disaggregation-component";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";
import { IndicatorDisaggregationItem } from "@/types/indicator";

type DisaggItem = Omit<
  IndicatorDisaggregationItem,
  "indicatorId" | "indicatorDisaggregationId"
>;

// KPI Type maps to the result level the KPI is tracked against.
const KPI_TYPE_OPTIONS = [
  { label: "Output", value: "Output" },
  { label: "Outcome", value: "Outcome" },
  { label: "Impact", value: "Impact" },
];

const UNIT_OPTIONS = [
  { label: "Change", value: "Change" },
  { label: "Number", value: "Number" },
  { label: "Percentage of", value: "Percentage of" },
  { label: "Percentage change", value: "Percentage change" },
  { label: "Status", value: "Status" },
];

const TARGET_TYPE_OPTIONS = [
  { label: "Cumulative", value: "Cumulative" },
  { label: "Periodic", value: "Periodic" },
];

const STATUS_OPTIONS = [
  { label: "Not started", value: "Not started" },
  { label: "In progress", value: "In progress" },
  { label: "Completed", value: "Completed" },
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

// Mirrors the project-level indicator form so categories (fixed + pick-and-add)
// resolve correctly inside DisaggregationComponent.
const KPI_DISAGG_TYPES = [
  "Gender & Social Inclusion (Sex)",
  "Age",
  "State",
  "Year",
  "Donor Type",
  "Policy Action Type",
  "Institution Type",
  "Sector",
  "None",
];

type KPIFormData = {
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

const EMPTY_FORM: KPIFormData = {
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
};

function AddKPIForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // strategicObjectiveId comes through as ?soId=<uuid>
  const strategicObjectiveId = searchParams.get("soId") ?? "";

  const token = getToken();
  const [formData, setFormData] = useState<KPIFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared disaggregation state — kept in sync across setup / baseline / target
  // exactly like the project-level indicator form.
  const [disaggCheckboxes, setDisaggCheckboxes] = useState<boolean[]>(
    Array(KPI_DISAGG_TYPES.length).fill(false),
  );
  type DisaggRow = { category: string; value: string; target: string; actual: string };
  const [disaggRows, setDisaggRows] = useState<Record<string, DisaggRow[]>>({});
  const [disaggItems, setDisaggItems] = useState<DisaggItem[]>([]);

  const isStatusType = formData.unitOfMeasure === "Status";

  const handleInputChange = <K extends keyof KPIFormData>(
    field: K,
    value: KPIFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDropdownChange =
    (field: keyof KPIFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleDisaggregationChange = (items: typeof disaggItems) => {
    setDisaggItems(items);
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setDisaggCheckboxes(Array(KPI_DISAGG_TYPES.length).fill(false));
    setDisaggRows({});
    setDisaggItems([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!strategicObjectiveId) {
      toast.error("Strategic objective is missing from the URL.");
      return;
    }

    if (!formData.statement || !formData.type || !formData.unitOfMeasure) {
      toast.error("Please fill in the required KPI details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        isCreate: true,
        data: {
          kpiId: "",
          statement: formData.statement,
          definition: formData.definition,
          specificArea: formData.specificArea,
          unitOfMeasure: formData.unitOfMeasure,
          itemInMeasure: formData.itemInMeasure,
          baseLineDate: formData.baseLineDate
            ? new Date(formData.baseLineDate).toISOString()
            : null,
          cumulativeValue: isStatusType
            ? formData.cumulativeValue
            : Number(formData.cumulativeValue) || 0,
          baselineNarrative: formData.baselineNarrative,
          targetDate: formData.targetDate
            ? new Date(formData.targetDate).toISOString()
            : null,
          cumulativeTarget: isStatusType
            ? formData.cumulativeTarget
            : Number(formData.cumulativeTarget) || 0,
          targetNarrative: formData.targetNarrative,
          targetType: formData.targetType,
          responsiblePersons: formData.responsiblePersons.join(", "),
          type: formData.type,
          strategicObjectiveId,
          kpiDisaggregation: disaggItems.map((item) => ({
            type: item.type,
            category: item.category,
            baseline: isStatusType ? item.value : Number(item.value) || 0,
            target: isStatusType ? item.target : Number(item.target) || 0,
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

      if (
        response.data?.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        toast.success("KPI added successfully");
        resetForm();
        router.push("/strategic-objectives");
      } else {
        toast.error(response.data?.message || "Failed to add KPI");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add KPI";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5 mb-8 max-w-3xl p-6">
        {/* ── KPI statement */}
        <TextInput
          label="KPI Statement"
          name="statement"
          value={formData.statement}
          placeholder="Enter KPI statement"
          onChange={(e) => handleInputChange("statement", e.target.value)}
          isBigger
        />

        {/* ── Type / Specific Area / Unit / Item grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropDown
            label="KPI Type"
            name="type"
            placeholder="Select type"
            value={formData.type}
            onChange={handleDropdownChange("type")}
            options={KPI_TYPE_OPTIONS}
            isBigger
          />
          <DropDown
            label="Specific Area"
            name="specificArea"
            placeholder="Select area"
            value={formData.specificArea}
            onChange={handleDropdownChange("specificArea")}
            options={SPECIFIC_AREA_OPTIONS}
            isBigger
          />
          <DropDown
            label="Unit of Measurement"
            name="unitOfMeasure"
            placeholder="Select unit"
            value={formData.unitOfMeasure}
            onChange={handleDropdownChange("unitOfMeasure")}
            options={UNIT_OPTIONS}
            isBigger
          />
          <DropDown
            label="Item in Measure"
            name="itemInMeasure"
            placeholder="Select item"
            value={formData.itemInMeasure}
            onChange={handleDropdownChange("itemInMeasure")}
            options={ITEM_IN_MEASURE_OPTIONS}
            isBigger
          />
        </div>

        {/* ── Definition */}
        <TextareaInput
          label="KPI Definition"
          name="definition"
          value={formData.definition}
          placeholder="Describe the KPI and how it's measured"
          onChange={(e) => handleInputChange("definition", e.target.value)}
        />

        {/* ── Disaggregation – selection only */}
        <div className="border-t border-gray-100 pt-5">
          <DisaggregationComponent
            view="setup"
            customTypes={KPI_DISAGG_TYPES}
            sharedCheckboxes={disaggCheckboxes}
            sharedRows={disaggRows}
            onCheckboxesChange={setDisaggCheckboxes}
            onRowsChange={setDisaggRows}
            onChange={handleDisaggregationChange}
            cumulativeValue={formData.cumulativeValue}
            cumulativeTarget={formData.cumulativeTarget}
          />
        </div>

        {/* ── Baseline */}
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Baseline
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1.5">
                Baseline Date
              </p>
              <DateInput
                value={formData.baseLineDate}
                onChange={(value) => handleInputChange("baseLineDate", value)}
              />
            </div>
            {isStatusType ? (
              <DropDown
                label="Cumulative Value"
                name="cumulativeValue"
                placeholder="Select status"
                value={formData.cumulativeValue}
                onChange={handleDropdownChange("cumulativeValue")}
                options={STATUS_OPTIONS}
              />
            ) : (
              <TextInput
                label="Cumulative Value"
                name="cumulativeValue"
                placeholder="e.g. 50"
                value={formData.cumulativeValue}
                onChange={(e) =>
                  handleInputChange("cumulativeValue", e.target.value)
                }
              />
            )}
          </div>

          <TextareaInput
            label="Baseline Narrative"
            name="baselineNarrative"
            value={formData.baselineNarrative}
            placeholder="Describe the baseline situation…"
            onChange={(e) =>
              handleInputChange("baselineNarrative", e.target.value)
            }
          />

          <DisaggregationComponent
            view="baseline"
            customTypes={KPI_DISAGG_TYPES}
            isStatusType={isStatusType}
            sharedCheckboxes={disaggCheckboxes}
            sharedRows={disaggRows}
            onCheckboxesChange={setDisaggCheckboxes}
            onRowsChange={setDisaggRows}
            onChange={handleDisaggregationChange}
            cumulativeValue={formData.cumulativeValue}
            cumulativeTarget={formData.cumulativeTarget}
          />
        </div>

        {/* ── Target */}
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Target
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1.5">
                Target Date
              </p>
              <DateInput
                value={formData.targetDate}
                onChange={(value) => handleInputChange("targetDate", value)}
              />
            </div>
            {isStatusType ? (
              <DropDown
                label="Cumulative Target"
                name="cumulativeTarget"
                placeholder="Select status"
                value={formData.cumulativeTarget}
                onChange={handleDropdownChange("cumulativeTarget")}
                options={STATUS_OPTIONS}
              />
            ) : (
              <TextInput
                label="Cumulative Target"
                name="cumulativeTarget"
                placeholder="e.g. 200"
                value={formData.cumulativeTarget}
                onChange={(e) =>
                  handleInputChange("cumulativeTarget", e.target.value)
                }
              />
            )}
            <DropDown
              label="Target Type"
              name="targetType"
              placeholder="Select target type"
              value={formData.targetType}
              onChange={handleDropdownChange("targetType")}
              options={TARGET_TYPE_OPTIONS}
            />
          </div>

          <TextareaInput
            label="Target Narrative"
            name="targetNarrative"
            value={formData.targetNarrative}
            placeholder="Describe what achieving this target would look like…"
            onChange={(e) =>
              handleInputChange("targetNarrative", e.target.value)
            }
          />

          <DisaggregationComponent
            view="target"
            customTypes={KPI_DISAGG_TYPES}
            isStatusType={isStatusType}
            sharedCheckboxes={disaggCheckboxes}
            sharedRows={disaggRows}
            onCheckboxesChange={setDisaggCheckboxes}
            onRowsChange={setDisaggRows}
            onChange={handleDisaggregationChange}
            cumulativeValue={formData.cumulativeValue}
            cumulativeTarget={formData.cumulativeTarget}
          />
        </div>

        {/* ── Responsible persons */}
        <div className="border-t border-gray-100 pt-5">
          <TagInput
            label="Responsible Person(s)"
            value={formData.responsiblePersons}
            onChange={(persons) =>
              handleInputChange("responsiblePersons", persons)
            }
            placeholder="Add persons…"
          />
        </div>

        {/* ── Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <Button
            type="button"
            content="Cancel"
            isSecondary
            onClick={() => router.push("/strategic-objectives")}
            isDisabled={isSubmitting}
          />
          <Button
            type="submit"
            content={isSubmitting ? "Adding KPI..." : "Add KPI"}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}

export default function AddKPIPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading form…</div>}>
      <AddKPIForm />
    </Suspense>
  );
}

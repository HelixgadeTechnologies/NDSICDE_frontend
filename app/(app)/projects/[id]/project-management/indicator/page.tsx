"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import IndicatorSourceSelector, {
  IndicatorSourceData,
} from "@/ui/indicator-source-selector";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import DisaggregationComponent from "@/ui/disaggregation-component";
import DateInput from "@/ui/form/date-input";
import TextareaInput from "@/ui/form/textarea";
import RadioInput from "@/ui/form/radio";
import TagInput from "@/ui/form/tag-input";
import Button from "@/ui/form/button";
import { indicatorApi } from "@/lib/api/indicatorApi";
import {
  IndicatorFormData,
  IndicatorDisaggregationItem,
} from "@/types/indicator";
import { fetchResultTypes, ResultType } from "@/lib/api/result-types";
import { toast } from "react-toastify";
import axios from "axios";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import Heading from "@/ui/text-heading";

export default function AddIndicatorForm() {
  const searchParams = useSearchParams();
  const resultType = searchParams.get("resultType") ?? "impact";
  const resultId = searchParams.get("resultId") ?? "";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [resultTypes, setResultTypes] = useState<ResultType[]>([]);

  // Strategic objectives from global context — fetched once for the whole app
  // KPIs fetched locally from the all-kpis endpoint
  const [kpiOptions, setKpiOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoadingKpis, setIsLoadingKpis] = useState(false);

  const [formData, setFormData] = useState<IndicatorFormData>({
    indicatorId: "",
    indicatorSource: "",
    orgKpiId: "",
    thematicAreasOrPillar: "",
    statement: "",
    linkKpiToSdnOrgKpi: "",
    definition: "",
    specificArea: "",
    unitOfMeasure: "",
    itemInMeasure: "",
    baseLineDate: "",
    cumulativeValue: "",
    baselineNarrative: "",
    targetDate: "",
    cumulativeTarget: "",
    targetNarrative: "",
    targetType: "cumulative",
    responsiblePersons: [],
    result: resultId,
    resultTypeId: "",
    IndicatorDisaggregation: [],
  });

  // Fetch result types and auto-match against the resultType prop from the URL
  useEffect(() => {
    const loadResultTypes = async () => {
      setIsLoadingResults(true);
      try {
        const results = await fetchResultTypes();
        setResultTypes(results);

        // Match resultType prop (e.g. "impact", "outcome", "output") against resultName (case-insensitive)
        const matched = results.find(
          (r) => r.resultName.toLowerCase() === resultType.toLowerCase(),
        );

        if (matched) {
          setFormData((prev) => ({
            ...prev,
            // resultId from URL is the actual entity ID; resultTypeId comes from the matched result type
            result: resultId || prev.result,
            resultTypeId: matched.resultTypeId,
          }));
        } else if (results.length > 0) {
          // Fallback: use first result type if no match found
          setFormData((prev) => ({
            ...prev,
            result: resultId || prev.result,
            resultTypeId: results[0].resultTypeId,
          }));
        }
      } catch (error) {
        console.error("Failed to load result types:", error);
      } finally {
        setIsLoadingResults(false);
      }
    };

    loadResultTypes();
  }, [resultType, resultId]);

  // Fetch all org KPIs for the "Link to SDN Org KPIs" dropdown
  useEffect(() => {
    const loadKpis = async () => {
      setIsLoadingKpis(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpis`,
        );
        const kpis: { kpiId: string; statement: string }[] =
          res.data.data ?? [];
        setKpiOptions(
          kpis.map((k) => ({ label: k.statement, value: k.kpiId })),
        );
      } catch (err) {
        console.error("[AddIndicatorForm] Failed to load KPIs:", err);
      } finally {
        setIsLoadingKpis(false);
      }
    };
    loadKpis();
  }, []);

  // Handle indicator source change
  const handleIndicatorSourceChange = useCallback(
    (data: IndicatorSourceData) => {
      setFormData((prev) => ({
        ...prev,
        indicatorSource: data.indicatorSource,
        thematicAreasOrPillar: data.thematicAreasOrPillar || "",
        statement: data.statement || "",
      }));
    },
    [],
  );

  // Handle general form field changes
  const handleInputChange = (
    field: keyof IndicatorFormData,
    value: string | number | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle dropdown changes
  const handleDropdownChange =
    (field: keyof IndicatorFormData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  // Handle disaggregation change — receives typed array directly from component
  const handleDisaggregationChange = (
    items: Omit<
      IndicatorDisaggregationItem,
      "indicatorDisaggregationId" | "indicatorId"
    >[],
  ) => {
    const disaggregationItems: IndicatorDisaggregationItem[] = items.map(
      (item) => ({
        indicatorDisaggregationId: "",
        indicatorId: formData.indicatorId || "",
        type: item.type,
        category: item.category,
        value: item.value,
        target: item.target,
      }),
    );

    setFormData((prev) => ({
      ...prev,
      IndicatorDisaggregation: disaggregationItems,
    }));
  };

  // Prepare payload for API
  const preparePayload = () => {
    // Convert string values to numbers for cumulative fields
    const cumulativeValue = parseFloat(formData.cumulativeValue as string) || 0;
    const cumulativeTarget =
      parseFloat(formData.cumulativeTarget as string) || 0;

    // Format dates to ISO string
    const baseLineDate = formData.baseLineDate
      ? new Date(formData.baseLineDate).toISOString()
      : "";

    const targetDate = formData.targetDate
      ? new Date(formData.targetDate).toISOString()
      : "";

    const payload = {
      isCreate: true,
      data: {
        indicatorId: formData.indicatorId,
        indicatorSource: formData.indicatorSource,
        orgKpiId: formData.orgKpiId,
        thematicAreasOrPillar: formData.thematicAreasOrPillar,
        statement: formData.statement,
        linkKpiToSdnOrgKpi: formData.linkKpiToSdnOrgKpi,
        definition: formData.definition,
        specificArea: formData.specificArea,
        unitOfMeasure: formData.unitOfMeasure,
        itemInMeasure: formData.itemInMeasure,
        baseLineDate: baseLineDate,
        cumulativeValue: cumulativeValue,
        baselineNarrative: formData.baselineNarrative,
        targetDate: targetDate,
        cumulativeTarget: cumulativeTarget,
        targetNarrative: formData.targetNarrative,
        targetType: formData.targetType,
        responsiblePersons: formData.responsiblePersons.join(", "),
        // `result` is the actual entity ID (impactId / outcomeId / outputId) from the URL
        result: resultId || formData.result,
        resultTypeId: formData.resultTypeId,
        IndicatorDisaggregation: formData.IndicatorDisaggregation,
      },
    };

    return payload;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = preparePayload();
      console.log(payload);

      const response = await indicatorApi.createIndicator(payload);
      // Reset form or show success message

      // Reset form (but keep result types loaded)
      setFormData({
        indicatorId: "",
        indicatorSource: "",
        orgKpiId: "",
        thematicAreasOrPillar: "",
        statement: "",
        linkKpiToSdnOrgKpi: "",
        definition: "",
        specificArea: "",
        unitOfMeasure: "",
        itemInMeasure: "",
        baseLineDate: "",
        cumulativeValue: "",
        baselineNarrative: "",
        targetDate: "",
        cumulativeTarget: "",
        targetNarrative: "",
        targetType: "cumulative",
        responsiblePersons: [],
        result: resultTypes.length > 0 ? resultTypes[0].resultName : "",
        resultTypeId: resultTypes.length > 0 ? resultTypes[0].resultTypeId : "",
        IndicatorDisaggregation: [],
      });

      toast.success("Indicator added successfully!");
      router.back();
    } catch (error: any) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error?.message || "Failed to add indicator. Please try again.";
      console.error("[AddIndicatorForm] Error:", error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form but keep the first result type selected if available
    setFormData({
      indicatorId: "",
      indicatorSource: "",
      orgKpiId: "",
      thematicAreasOrPillar: "",
      statement: "",
      linkKpiToSdnOrgKpi: "",
      definition: "",
      specificArea: "",
      unitOfMeasure: "",
      itemInMeasure: "",
      baseLineDate: "",
      cumulativeValue: "",
      baselineNarrative: "",
      targetDate: "",
      cumulativeTarget: "",
      targetNarrative: "",
      targetType: "cumulative",
      responsiblePersons: [],
      result: resultTypes.length > 0 ? resultTypes[0].resultName : "",
      resultTypeId: resultTypes.length > 0 ? resultTypes[0].resultTypeId : "",
      IndicatorDisaggregation: [],
    });
  };

  // Maps a resultType string from the URL to a human-readable label.
  // e.g. "impact" → "Impact", "outcome" → "Outcome", "output" → "Output"
  function getResultLabel(resultType: string): string {
    const labels: Record<string, string> = {
      impact: "Impact",
      outcome: "Outcome",
      output: "Output",
    };
    return labels[resultType.toLowerCase()] ?? resultType;
  }
  const resultLabel = getResultLabel(resultType);

  return (
    <div className="">
      <Heading
        heading={`Add ${resultLabel} Indicator`}
        className="ml-5"
      />
      <form
        onSubmit={handleSubmit}
        className="space-y-5 mb-8 max-w-3xl p-6"
      >
        {/* ── Indicator source & classification */}
        <IndicatorSourceSelector
          onChange={handleIndicatorSourceChange}
          thematicAreaOptions={THEMATIC_AREAS_OPTIONS}
        />

        <DropDown
          label="SDN Org KPIs"
          value={formData.linkKpiToSdnOrgKpi}
          name="linkKpiToSdnOrgKpi"
          placeholder={isLoadingKpis ? "Loading KPIs..." : "Select a KPI"}
          onChange={handleDropdownChange("linkKpiToSdnOrgKpi")}
          options={kpiOptions}
          isBigger
        />

        <TextInput
          label="Indicator Definition"
          value={formData.definition}
          name="definition"
          placeholder="e.g. Number of people trained in water hygiene practices"
          onChange={(e) => handleInputChange("definition", e.target.value)}
          isBigger
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Specific Area"
            value={formData.specificArea}
            name="specificArea"
            placeholder="---"
            onChange={(e) => handleInputChange("specificArea", e.target.value)}
            isBigger
          />
          <DropDown
            label="Unit of Measurement"
            value={formData.unitOfMeasure}
            name="unitOfMeasure"
            placeholder="Select unit"
            onChange={handleDropdownChange("unitOfMeasure")}
            options={[
              { label: "Percentage", value: "Percentage" },
              { label: "Number", value: "Number" },
              { label: "Percentage of", value: "Percentage of" },
              { label: "Percentage change", value: "Percentage change" },
              { label: "Status", value: "Status" },
            ]}
            isBigger
          />
        </div>

        {/* ── Baseline */}
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Baseline
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1.5">Baseline Date</p>
              <DateInput
                value={formData.baseLineDate}
                onChange={(value) => handleInputChange("baseLineDate", value)}
              />
            </div>
            <TextInput
              label="Cumulative Value"
              placeholder="e.g. 50"
              value={formData.cumulativeValue}
              name="cumulativeValue"
              onChange={(e) =>
                handleInputChange("cumulativeValue", e.target.value)
              }
            />
          </div>

          <TextareaInput
            label="Baseline Narrative"
            placeholder="Describe the baseline situation…"
            value={formData.baselineNarrative}
            name="baselineNarrative"
            onChange={(e) =>
              handleInputChange("baselineNarrative", e.target.value)
            }
          />
        </div>

        {/* ── Target */}
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Target
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1.5">Target Date</p>
              <DateInput
                value={formData.targetDate}
                onChange={(value) => handleInputChange("targetDate", value)}
              />
            </div>
            <TextInput
              label="Cumulative Target"
              placeholder="e.g. 200"
              value={formData.cumulativeTarget}
              name="cumulativeTarget"
              onChange={(e) =>
                handleInputChange("cumulativeTarget", e.target.value)
              }
            />
          </div>

          <TextareaInput
            label="Target Narrative"
            placeholder="Describe what achieving this target would look like…"
            value={formData.targetNarrative}
            name="targetNarrative"
            onChange={(e) =>
              handleInputChange("targetNarrative", e.target.value)
            }
          />

          {/* <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Target Type</p>
            <div className="flex items-center gap-6">
              <RadioInput
                label="Cumulative"
                value="cumulative"
                name="targetType"
                is_checked={formData.targetType === "cumulative"}
                onChange={() => handleInputChange("targetType", "cumulative")}
              />
              <RadioInput
                label="Periodic"
                value="periodic"
                name="targetType"
                is_checked={formData.targetType === "periodic"}
                onChange={() => handleInputChange("targetType", "periodic")}
              />
            </div>
          </div> */}
        </div>

        {/* ── Disaggregation */}
        <div className="border-t border-gray-100 pt-5">
          <DisaggregationComponent
            cumulativeValue={formData.cumulativeValue}
            cumulativeTarget={formData.cumulativeTarget}
            onChange={handleDisaggregationChange}
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
          />
        </div>

        {/* ── Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <Button
            type="button"
            content="Cancel"
            isSecondary
            onClick={handleCancel}
            isDisabled={isSubmitting || isLoadingResults}
          />
          <Button
            type="submit"
            content={isSubmitting ? "Adding..." : "Add Indicator"}
            isDisabled={
              isSubmitting || isLoadingResults || !formData.resultTypeId
            }
          />
        </div>

        {isLoadingResults && (
          <p className="text-center text-gray-400 text-sm">
            Loading result types...
          </p>
        )}
      </form>
    </div>
  );
}

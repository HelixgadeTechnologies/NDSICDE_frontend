import { Icon } from "@iconify/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import IndicatorSourceSelector, {
  IndicatorSourceData,
} from "../../ui/indicator-source-selector";
import DropDown from "@/ui/form/select-dropdown";
import TextInput from "@/ui/form/text-input";
import DisaggregationComponent from "@/ui/disaggregation-component";
import DateInput from "@/ui/form/date-input";
import TextareaInput from "@/ui/form/textarea";
import RadioInput from "@/ui/form/radio";
import TagInput from "@/ui/form/tag-input";
import Button from "@/ui/form/button";
import { indicatorApi } from "@/lib/api/indicatorApi";
import { IndicatorFormData, IndicatorDisaggregationItem } from "@/types/indicator";
import { fetchResultTypes, ResultType } from "@/lib/api/result-types";
import { toast } from "react-toastify";
import axios from "axios";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";

export default function AddIndicatorForm({
  resultType = "",
  resultId = "",
}: {
  resultType?: string;
  resultId?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [resultTypes, setResultTypes] = useState<ResultType[]>([]);

  // Strategic objectives from global context — fetched once for the whole app
  // KPIs fetched locally from the all-kpis endpoint
  const [kpiOptions, setKpiOptions] = useState<{ label: string; value: string }[]>([]);
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
          (r) => r.resultName.toLowerCase() === resultType.toLowerCase()
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpis`
        );
        const kpis: { kpiId: string; statement: string }[] = res.data.data ?? [];
        setKpiOptions(
          kpis.map((k) => ({ label: k.statement, value: k.kpiId }))
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
  const handleIndicatorSourceChange = useCallback((data: IndicatorSourceData) => {
    setFormData((prev) => ({
      ...prev,
      indicatorSource: data.indicatorSource,
      thematicAreasOrPillar: data.thematicAreasOrPillar || "",
      statement: data.statement || "",
    }));
  }, []);

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


  // Handle disaggregation change — build IndicatorDisaggregation array from checked values
  const handleDisaggregationChange = (activeValuesJson: string) => {
    try {
      const parsed = JSON.parse(activeValuesJson);
      let disaggregationItems: IndicatorDisaggregationItem[] = [];

      if (Array.isArray(parsed)) {
        disaggregationItems = parsed.map((item: any) => ({
          indicatorDisaggregationId: "",
          indicatorId: formData.indicatorId || "",
          type: item.type.toLowerCase(),
          category: item.category || "",
          target: item.target || 0,
        }));
      } else {
        const activeValues: Record<string, string> = parsed;
        disaggregationItems = Object.entries(activeValues).map(
          ([type, category]) => ({
            indicatorDisaggregationId: "",
            indicatorId: formData.indicatorId || "",
            type: type.toLowerCase(),
            category: category || "",
            target: 0,
          })
        );
      }

      setFormData((prev) => ({
        ...prev,
        IndicatorDisaggregation: disaggregationItems,
      }));
    } catch {
      // If parsing fails (e.g. empty string), clear the array
      setFormData((prev) => ({ ...prev, IndicatorDisaggregation: [] }));
    }
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
      const message =
        axios.isAxiosError(error)
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 my-8 max-w-4xl mx-auto p-6">
      {/* indicator source */}
      <IndicatorSourceSelector
        onChange={handleIndicatorSourceChange}
        thematicAreaOptions={THEMATIC_AREAS_OPTIONS}
      />


      {/* link to indicator sdn / org KPIs */}
      <DropDown
        label="SDN Org KPIs (Select)"
        value={formData.linkKpiToSdnOrgKpi}
        name="linkKpiToSdnOrgKpi"
        placeholder={isLoadingKpis ? "Loading KPIs..." : "Select a KPI"}
        onChange={handleDropdownChange("linkKpiToSdnOrgKpi")}
        options={kpiOptions}
        isBigger
      />

      {/* indicator definition */}
      <TextInput
        label="Indicator Definition"
        value={formData.definition}
        name="definition"
        placeholder="---"
        onChange={(e) => handleInputChange("definition", e.target.value)}
        isBigger
      />

      {/* specific area */}
      <TextInput
        label="Specific Area"
        value={formData.specificArea}
        name="specificArea"
        placeholder="---"
        onChange={(e) => handleInputChange("specificArea", e.target.value)}
        isBigger
      />

      {/* unit of measurement */}
      <DropDown
        label="Unit of Measurement"
        value={formData.unitOfMeasure}
        name="unitOfMeasure"
        placeholder="---"
        onChange={handleDropdownChange("unitOfMeasure")}
        options={[
          { label: "Percentage", value: "Percentage" },
          { label: "Number", value: "Number" },
          { label: "Percentage of ", value: "Percentage of" },
          { label: "Percentage change", value: "Percentage change" },
          { label: "Status", value: "Status" },
        ]}
        isBigger
      />

      {/* items in measurement */}
      <DropDown
        label="Items in Measurement"
        value={formData.itemInMeasure}
        name="itemInMeasure"
        placeholder="---"
        onChange={handleDropdownChange("itemInMeasure")}
        options={[]}
        isBigger
      />

      {/* checkboxes */}
      <DisaggregationComponent onChange={handleDisaggregationChange} />

      {/* baseline */}
      <div className="space-y-1 rounded-lg">
        <p className="text-gray-900 text-sm font-medium mb-3">Baseline</p>

        {/* baseline date */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium w-1/3">Baseline Date</p>
          <div className="w-2/3">
            <DateInput
              value={formData.baseLineDate}
              onChange={(value) => handleInputChange("baseLineDate", value)}
            />
          </div>
        </div>

        {/* cumulative value */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium w-1/3">Cumulative Value</p>
          <div className="w-2/3">
            <TextInput
              placeholder="200"
              value={formData.cumulativeValue}
              name="cumulativeValue"
              onChange={(e) =>
                handleInputChange("cumulativeValue", e.target.value)
              }
            />
          </div>
        </div>

        {/* baseline narrative */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium w-1/3">Baseline Narrative</p>
          <div className="w-2/3">
            <TextareaInput
              placeholder="---"
              value={formData.baselineNarrative}
              name="baselineNarrative"
              onChange={(e) =>
                handleInputChange("baselineNarrative", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* target section */}
      <div className="space-y-1 rounded-lg">
        {/* <p className="text-gray-900 text-sm font-medium mb-3">Target</p> */}

        {/* target date */}
        {/* <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium w-1/3">Target Date</p>
          <div className="w-2/3">
            <DateInput
              value={formData.targetDate}
              onChange={(value) => handleInputChange("targetDate", value)}
            />
          </div>
        </div> */}

        {/* cumulative target */}
        {/* <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium w-1/3">Cumulative Target</p>
          <div className="w-2/3">
            <TextInput
              placeholder="200"
              value={formData.cumulativeTarget}
              name="cumulativeTarget"
              onChange={(e) =>
                handleInputChange("cumulativeTarget", e.target.value)
              }
            />
          </div>
        </div> */}

        {/* target narrative */}
        {/* <div className="flex items-center justify-between">
          <p className="text-sm font-medium w-1/3">Target Narrative</p>
          <div className="w-2/3">
            <TextareaInput
              placeholder="---"
              value={formData.targetNarrative}
              name="targetNarrative"
              onChange={(e) =>
                handleInputChange("targetNarrative", e.target.value)
              }
            />
          </div>
        </div> */}
      </div>

      {/* target type */}
      <div className="space-y-1">
        <p className="text-[#101928] text-sm font-medium">Target Type</p>
        <div className="flex items-center gap-2">
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
      </div>

      <TagInput
        label="Responsible Person(s)"
        value={formData.responsiblePersons}
        onChange={(persons) => handleInputChange("responsiblePersons", persons)}
      />

      {/* buttons */}
      <div className="flex items-center gap-8 pt-4">
        <Button
          type="button"
          content="Cancel"
          isSecondary
          onClick={handleCancel}
          isDisabled={isSubmitting || isLoadingResults}
        />
        <Button
          type="submit"
          content={isSubmitting ? "Adding..." : "Add"}
          isDisabled={
            isSubmitting || isLoadingResults || !formData.resultTypeId
          }
        />
      </div>

      {/* Loading state indicator */}
      {isLoadingResults && (
        <div className="text-center text-gray-500 text-sm">
          Loading result types...
        </div>
      )}
    </form>
  );
}

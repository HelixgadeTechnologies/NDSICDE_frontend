"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dates-format-utility";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";
import { getResultTypeById } from "@/lib/api/result-types";
import MeterPieChart from "@/ui/meter-pie-chart";
import { indicatorApi } from "@/lib/api/indicatorApi";
import GenericDeleteModal from "@/ui/generic-delete-modal";

// ─── Types

type IndicatorDisaggregation = {
  indicatorDisaggregationId: string;
  indicatorId: string;
  type: string;
  category: string;
  /** Disaggregated baseline value — defaults to 0 until backend supports it */
  value?: number;
  /** Disaggregated target value */
  target: number;
  /** Disaggregated actual/reported value — defaults to 0 until backend supports it */
  actual?: number;
};

type IndicatorData = {
  indicatorId: string;
  indicatorSource: string;
  orgKpiId: string;
  thematicAreasOrPillar: string;
  statement: string;
  linkKpiToSdnOrgKpi: string;
  definition: string;
  specificArea: string;
  unitOfMeasure: string;
  itemInMeasure: string;
  baseLineDate: string;
  cumulativeValue: number;
  baselineNarrative: string;
  targetDate: string;
  cumulativeTarget: number;
  targetNarrative: string;
  targetType: string;
  responsiblePersons: string;
  actual?: number;
  performance?: number;
  target?: number;
  resultTypeId?: string;
  IndicatorDisaggregation: IndicatorDisaggregation[];
};

// ─── Compact disaggregation chips

type DisaggChipsProps = {
  items: IndicatorDisaggregation[];
  valueKey: "value" | "target" | "actual";
  chipBg?: string;
  valueColor?: string;
};

function DisaggChips({
  items,
  valueKey,
  chipBg = "bg-white/60 border border-gray-200",
  valueColor = "text-gray-900",
}: DisaggChipsProps) {
  if (!items || items.length === 0) return null;

  // Group items by type (e.g. GENDER AND SOCIAL INCLUSION (SEX))
  const grouped = items.reduce((acc, item) => {
    const typeLabel = item.type.toUpperCase();
    if (!acc[typeLabel]) acc[typeLabel] = [];
    acc[typeLabel].push({ category: item.category, value: item[valueKey] ?? 0 });
    return acc;
  }, {} as Record<string, { category: string; value: number }[]>);

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {Object.entries(grouped).map(([type, list]) => (
        <div 
          key={`${type}-${valueKey}`}
          className={`px-3 py-1.5 rounded-md text-[11px] font-medium leading-relaxed ${chipBg}`}
        >
          <span className="opacity-60 font-semibold uppercase tracking-wider">{type}:</span>
          <span className={`ml-1.5 ${valueColor}`}>
            {list.map((l, i) => (
              <span key={l.category} className="capitalize">
                {l.category}{" "}
                <span className="font-bold">{l.value.toLocaleString()}</span>
                {i < list.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main component

export default function ViewIndicators({ resultId }: { resultId: string }) {
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState<string | null>(null);
  const [selectedIndicator, setSelectedIndicator] =
    useState<IndicatorData | null>(null);

  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const fetchIndicators = async () => {
    if (!resultId || !projectId) return;
    setIsLoading(true);
    try {
      // Fetch the result type first
      const resultType = await getResultTypeById(resultId);
      if (!resultType) {
         setIndicators([]);
         setIsLoading(false);
         return;
      }

      const name = resultType.resultName.toLowerCase();
      let segment = "";
      let idKey = "id";
      if (name.includes("output")) { segment = "outputs"; idKey = "outputId"; }
      else if (name.includes("outcome")) { segment = "outcomes"; idKey = "outcomeId"; }
      else if (name.includes("impact")) { segment = "impacts"; idKey = "impactId"; }
      
      if (!segment) {
         setIndicators([]);
         setIsLoading(false);
         return;
      }

      // Fetch results for the project
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/${segment}/project/${projectId}`
      );
      const rows: any[] = res.data?.data || [];

      // For each result row, fetch its indicators
      let allIndicators: IndicatorData[] = [];
      await Promise.all(
        rows.map(async (row) => {
          const specificResultId = row[idKey];
          try {
            const indRes = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/indicators/${specificResultId}`
            );
            if (indRes.data?.success && indRes.data?.data) {
              allIndicators = [...allIndicators, ...indRes.data.data];
            }
          } catch (err) {
             // ignore failures for individual results
          }
        })
      );
      
      setIndicators(allIndicators);
    } catch (error) {
      console.error("Error fetching indicators:", error);
      toast.error("An error occurred while fetching indicators.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, [resultId, projectId]);

  const handleDelete = async () => {
    if (!indicatorToDelete) return;
    setIsDeleting(true);
    console.log("Attempting to delete indicator:", indicatorToDelete);
    try {
      const res = await indicatorApi.deleteIndicator(indicatorToDelete);
      console.log("Delete response:", res);
      toast.success("Indicator deleted successfully.");
      setIndicatorToDelete(null);
      await fetchIndicators(); // Refresh the list
    } catch (error: any) {
      console.error("Delete error details:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to delete indicator.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!indicators || indicators.length === 0) {
    return (
      <div className="py-12 border border-gray-300 rounded-md flex flex-col items-center justify-center text-center w-fit mx-auto px-12 my-10">
        <Icon
          icon="fluent:document-search-24-regular"
          width={48}
          height={48}
          className="text-gray-300 mb-4"
        />
        <p className="text-gray-500 font-medium">No indicators found.</p>
        <p className="text-gray-400 text-sm mt-1">
          There are currently no indicators linked to this result.
        </p>
      </div>
    );
  }

  // ── Detail view 
  if (selectedIndicator) {
    const disagg = selectedIndicator.IndicatorDisaggregation ?? [];
    const hasDisagg = disagg.length > 0;

    const target = selectedIndicator.cumulativeTarget ?? selectedIndicator.target ?? null;
    const actual = selectedIndicator.actual ?? null;
    const computedPerformance =
      selectedIndicator.performance != null
        ? selectedIndicator.performance
        : target && actual != null
        ? Math.round((actual / target) * 100)
        : 0;

    return (
      <div className="mt-6 space-y-4">
        <button
          onClick={() => setSelectedIndicator(null)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
        >
          <Icon
            icon="fluent:arrow-left-24-regular"
            width={16}
            height={16}
            className="mr-2"
          />
          Back to Indicators
        </button>

        <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
          {/* ── Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-5 mb-5 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedIndicator.statement || "No Statement Provided"}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium text-gray-700">Source:</span>{" "}
                {selectedIndicator.indicatorSource || "N/A"}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-3 min-w-fit">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {selectedIndicator.thematicAreasOrPillar || "No Pillar"}
              </span>
              <div className="flex items-center gap-3 w-[400px]">
                <Button
                  content="View Actuals"
                  icon="fluent:eye-24-regular"
                  isSecondary={true}
                  onClick={() =>
                    router.push(
                      `/projects/${projectId}/project-management/indicator/${selectedIndicator.indicatorId}/view`,
                    )
                  }
                />
                <Button
                  content="Report Actual"
                  icon="fluent:document-add-24-regular"
                  onClick={() => {
                    const query = new URLSearchParams({
                      orgKpiId: selectedIndicator.orgKpiId || "",
                      resultTypeId: selectedIndicator.resultTypeId || "",
                      indicatorSource: selectedIndicator.indicatorSource || "",
                      thematicArea: selectedIndicator.thematicAreasOrPillar || "",
                      statement: selectedIndicator.statement || "",
                      responsiblePersons: selectedIndicator.responsiblePersons || "",
                      // Added missing fields below
                      baseLineDate: selectedIndicator.baseLineDate || "",
                      cumulativeValue: selectedIndicator.cumulativeValue?.toString() || "",
                      targetDate: selectedIndicator.targetDate || "",
                      cumulativeTarget: (selectedIndicator.cumulativeTarget ?? selectedIndicator.target)?.toString() || "",
                      definition: selectedIndicator.definition || "",
                      unitOfMeasure: selectedIndicator.unitOfMeasure || "",
                    }).toString();
                    router.push(
                      `/projects/${projectId}/project-management/indicator/${selectedIndicator.indicatorId}/report?${query}`,
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Meta + Baseline / Target / Actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: meta */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Definition
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  {selectedIndicator.definition || "N/A"}
                </p>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedIndicator.unitOfMeasure || "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Type
                  </p>
                  <p className="text-sm text-gray-800 mt-1 capitalize">
                    {selectedIndicator.targetType || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsible Persons
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  {selectedIndicator.responsiblePersons || "N/A"}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-center pb-2">
                <MeterPieChart performance={computedPerformance} size="md" />
              </div>
            </div>

            {/* Right: Baseline, Target, Actual cards */}
            <div className="space-y-3">
              {/* Baseline */}
              <div className="bg-gray-50 px-4 py-3 rounded-md border border-gray-100">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    Baseline
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedIndicator.baseLineDate
                      ? formatDate(selectedIndicator.baseLineDate)
                      : "No Date"}
                  </p>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-0.5">
                  {selectedIndicator.cumulativeValue ?? 0}
                </p>
                {selectedIndicator.baselineNarrative && (
                  <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">
                    &ldquo;{selectedIndicator.baselineNarrative}&rdquo;
                  </p>
                )}
                {hasDisagg && (
                  <DisaggChips
                    items={disagg}
                    valueKey="value"
                    chipBg="bg-gray-200/70 border border-gray-300/50"
                    valueColor="text-gray-800"
                  />
                )}
              </div>

              {/* Target */}
              <div className="bg-blue-50 px-4 py-3 rounded-md border border-blue-100">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                    Target
                  </p>
                  <p className="text-xs text-blue-400">
                    {selectedIndicator.targetDate
                      ? formatDate(selectedIndicator.targetDate)
                      : "No Date"}
                  </p>
                </div>
                <p className="text-2xl font-semibold text-blue-900 mt-0.5">
                  {selectedIndicator.cumulativeTarget ?? 0}
                </p>
                {selectedIndicator.targetNarrative && (
                  <p className="text-xs text-blue-500 mt-1 italic line-clamp-2">
                    &ldquo;{selectedIndicator.targetNarrative}&rdquo;
                  </p>
                )}
                {hasDisagg && (
                  <DisaggChips
                    items={disagg}
                    valueKey="target"
                    chipBg="bg-blue-100/80 border border-blue-200/60"
                    valueColor="text-blue-800"
                  />
                )}
              </div>

              {/* Actual */}
              <div className="bg-emerald-50 px-4 py-3 rounded-md border border-emerald-100 relative">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    Actual
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedIndicator.actual && selectedIndicator.actual !== 0
                      ? "text-emerald-500 bg-emerald-100 font-medium"
                      : "text-gray-500 bg-gray-100 font-medium"
                  }`}>
                    {selectedIndicator.actual && selectedIndicator.actual !== 0 ? "Reported" : "Not Reported"}
                  </span>
                </div>
                <p className={`text-2xl font-semibold mt-0.5 ${
                  selectedIndicator.actual && selectedIndicator.actual !== 0 
                    ? "text-emerald-900" 
                    : "text-gray-400 italic text-lg"
                }`}>
                  {selectedIndicator.actual && selectedIndicator.actual !== 0 
                    ? selectedIndicator.actual 
                    : "Not reported"}
                </p>
                {hasDisagg && (
                  <DisaggChips
                    items={disagg}
                    valueKey="actual"
                    chipBg="bg-emerald-100/80 border border-emerald-200/60"
                    valueColor="text-emerald-800"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List view 
  return (
    <div className="space-y-4 mt-6">
      {indicators.map((indicator, index) => {
        const target   = indicator.cumulativeTarget ?? indicator.target ?? null;
        const actual   = indicator.actual ?? null;

        const computedPerformance =
          indicator.performance != null
            ? indicator.performance
            : target && actual != null
            ? Math.round((actual / target) * 100)
            : 0;

        return (
        <div
          key={indicator.indicatorId || index}
          onClick={() => setSelectedIndicator(indicator)}
          className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-medium uppercase tracking-wider">
                  {indicator.thematicAreasOrPillar || "No Pillar"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                {indicator.statement || "No Statement Provided"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Source: {indicator.indicatorSource || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <MeterPieChart performance={computedPerformance} />
              
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndicator(indicator);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center"
                  title="View Details"
                >
                  <Icon icon="fluent:eye-24-regular" width={20} height={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndicatorToDelete(indicator.indicatorId);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                  title="Delete Indicator"
                >
                  <Icon icon="fluent:delete-24-regular" width={20} height={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-6 border-t border-gray-50 pt-3">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase">
                Baseline
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {indicator.cumulativeValue ?? 0}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase">
                Target
              </p>
              <p className="text-sm font-semibold text-blue-600">
                {indicator.cumulativeTarget ?? 0}
              </p>
            </div>
            {(indicator.IndicatorDisaggregation ?? []).length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase">
                  Disaggregations
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {indicator.IndicatorDisaggregation.length} categor
                  {indicator.IndicatorDisaggregation.length === 1 ? "y" : "ies"}
                </p>
              </div>
            )}
          </div>
        </div>
      )})}

      {indicatorToDelete && (
        <GenericDeleteModal
          isOpen={!!indicatorToDelete}
          onClose={() => setIndicatorToDelete(null)}
          onDelete={handleDelete}
          heading="Delete Indicator"
          subtitle="Are you sure you want to delete this indicator? This action cannot be undone."
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";
import MeterPieChart from "@/ui/meter-pie-chart";
import { OrgKpiDetail, OrgKpiResponse } from "@/types/org-kpi";
import { formatDate } from "@/utils/dates-format-utility";

type RawKPI = OrgKpiResponse["KPI_TABLE_DATA"][number];

type KpiDetailViewProps = {
  /** The dashboard row that was clicked — carries baseline/target/actual/performance fallbacks */
  selected: RawKPI;
  onBack: () => void;
};

/**
 * Mirrors the detail-view layout used by view-indicators on the project side.
 * Fetches the full KPI from /api/strategic-objectivesAndKpi/kpi/{id} for the
 * richer fields (definition, narratives, dates) that aren't on the dashboard row.
 */
export default function KpiDetailView({ selected, onBack }: KpiDetailViewProps) {
  const router = useRouter();
  const [details, setDetails] = useState<OrgKpiDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpi/${selected.kpiId}`,
        );
        if (cancelled) return;
        setDetails(res.data?.data ?? null);
      } catch (err) {
        console.error("Failed to fetch KPI detail:", err);
        if (!cancelled) setError("Failed to load KPI detail.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selected.kpiId]);

  // Performance + actual come from the dashboard row (the detail endpoint doesn't return them).
  const baseline = details?.cumulativeValue ?? selected.baseline ?? 0;
  const target = details?.cumulativeTarget ?? selected.target ?? 0;
  const actual = selected.actual ?? 0;
  const performance =
    selected.performance != null
      ? selected.performance
      : target
        ? Math.round((actual / target) * 100)
        : 0;

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">
        <Icon
          icon="fluent:arrow-left-24-regular"
          width={16}
          height={16}
          className="mr-2"
        />
        Back to KPIs
      </button>

      <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
        {/* ── Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-5 mb-5 gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {details?.statement ?? selected.statement ?? "No Statement Provided"}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-medium text-gray-700">Code:</span>{" "}
              {selected.code || "—"}
              <span className="mx-2 text-gray-300">·</span>
              <span className="font-medium text-gray-700">Responsible:</span>{" "}
              {details?.responsiblePersons || "—"}
            </p>
          </div>
          <div className="text-right flex flex-col items-end gap-3 min-w-fit">
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {selected.thematicArea || "No Pillar"}
              </span>
              {(details?.type || selected.resultLevel) && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {details?.type ?? selected.resultLevel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 min-w-70">
              <Button
                content="Report Actual"
                icon="fluent:document-add-24-regular"
                onClick={() =>
                  router.push(`/organizational-kpi/${selected.kpiId}/report`)
                }
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            {/* ── Meta + Baseline/Target/Actual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: meta */}
              <div className="space-y-4">
                <MetaRow label="Definition" value={details?.definition} />
                <MetaRow label="Unit of Measure" value={details?.unitOfMeasure} />
                <MetaRow label="Item in Measure" value={details?.itemInMeasure} />
                <MetaRow label="Specific Area" value={details?.specificArea} />
                <MetaRow label="Target Type" value={details?.targetType} />
              </div>

              {/* Right: Baseline / Target / Actual */}
              <div className="space-y-5">
                <ValueBlock
                  label="Baseline"
                  value={baseline}
                  date={details?.baseLineDate}
                  narrative={details?.baselineNarrative}
                  valueColor="text-gray-800"
                />
                <ValueBlock
                  label="Target"
                  value={target}
                  date={details?.targetDate}
                  narrative={details?.targetNarrative}
                  valueColor="text-blue-600"
                />
                <div className="border border-gray-100 rounded-lg p-4 bg-emerald-50/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                        Actual
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">
                        {actual.toLocaleString()}
                      </p>
                      <p className="text-xs text-emerald-700/70 mt-1">
                        Performance: {performance}%
                      </p>
                    </div>
                    <MeterPieChart performance={performance} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm text-gray-800 mt-0.5">{value || "—"}</p>
    </div>
  );
}

function ValueBlock({
  label,
  value,
  date,
  narrative,
  valueColor,
}: {
  label: string;
  value: number;
  date?: string | null;
  narrative?: string | null;
  valueColor: string;
}) {
  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className={`text-2xl font-bold ${valueColor}`}>
            {value.toLocaleString()}
          </p>
        </div>
        {date && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatDate(date, "date-only")}
          </span>
        )}
      </div>
      {narrative && (
        <p className="text-xs text-gray-500 italic">{narrative}</p>
      )}
    </div>
  );
}

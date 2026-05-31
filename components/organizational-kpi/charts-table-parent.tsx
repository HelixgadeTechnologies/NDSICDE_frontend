"use client";

import { useMemo, useState, useEffect } from "react";
import CardComponent from "@/ui/card-wrapper";
import TabComponent from "@/ui/tab-component";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import TableWithAccordion from "@/ui/table-with-accordion";
import MeterPieChart from "@/ui/meter-pie-chart";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { OrgKpiResponse, OrgKpiRow } from "@/types/org-kpi";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import {
  fetchResultTypes,
  ResultType,
  transformResultTypesToOptions,
} from "@/lib/api/result-types";
import { useOrgKPIFormState } from "@/store/super-admin-store/organizational-kpi-store";
import KpiDetailView from "./kpi-detail-view";

// ─── Types ────────────────────────────────────────────────────────────────────

/** The KPI shape the cards / table / detail view all consume. */
type RawKPI = OrgKpiRow;

/**
 * Charts / table parent row = one Strategic Objective.
 * `childKpis` holds the KPIs (indicators) belonging to it — mirrors the
 * Result → Indicators relationship in the project result dashboard.
 */
type SOGroup = {
  id: string;
  statement: string;
  thematicArea: string;
  totalProjects: number;
  childKpis: RawKPI[];
};

// ─── KPI list (mirrors view-indicators' card list in the project dashboard) ───

function KpiCards({
  kpis,
  onSelect,
}: {
  kpis: RawKPI[];
  onSelect: (kpi: RawKPI) => void;
}) {
  if (kpis.length === 0) {
    return (
      <div className="py-12 border border-gray-200 rounded-md flex flex-col items-center justify-center text-center w-fit mx-auto px-12 my-10">
        <Icon
          icon="fluent:document-search-24-regular"
          width={48}
          height={48}
          className="text-gray-300 mb-4"
        />
        <p className="text-gray-500 font-medium">No KPIs found.</p>
        <p className="text-gray-400 text-sm mt-1">
          There are currently no KPIs linked to this strategic objective.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {kpis.map((kpi) => {
        const performance =
          kpi.performance != null
            ? kpi.performance
            : kpi.target && kpi.actual != null
              ? Math.round((kpi.actual / kpi.target) * 100)
              : 0;

        return (
          <div
            key={kpi.kpiId}
            onClick={() => onSelect(kpi)}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-medium uppercase tracking-wider">
                    {kpi.thematicArea || "No Pillar"}
                  </span>
                  {kpi.resultLevel && (
                    <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium uppercase tracking-wider">
                      {kpi.resultLevel}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {kpi.statement || "No Statement"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Code: {kpi.code || "—"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <MeterPieChart performance={performance} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(kpi);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center"
                  title="View Details">
                  <Icon icon="fluent:eye-24-regular" width={20} height={20} />
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-6 border-t border-gray-50 pt-3">
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase">
                  Baseline
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {kpi.baseline ?? 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase">
                  Target
                </p>
                <p className="text-sm font-semibold text-blue-600">
                  {kpi.target ?? 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-400 uppercase">
                  Actual
                </p>
                <p className="text-sm font-semibold text-green-600">
                  {kpi.actual ?? 0}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ChartsAndTableParent({
  statData,
}: {
  statData?: OrgKpiResponse | null;
}) {
  const router = useRouter();
  // Reuse the existing store (it already has thematicArea / resultLevel / disaggregation).
  const { allThematicArea, resultLevel, disaggregation, setField } =
    useOrgKPIFormState();

  // Result types (drives the Result Level dropdown + filtering).
  const [resultTypes, setResultTypes] = useState<ResultType[]>([]);

  // Charts tab drill-down state: SO → KPI (indicator) → KPI details.
  const [selectedSO, setSelectedSO] = useState<SOGroup | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<RawKPI | null>(null);

  useEffect(() => {
    fetchResultTypes()
      .then(setResultTypes)
      .catch((err) => console.error("Failed to load result types:", err));
  }, []);

  // KPI_TABLE_DATA already arrives grouped by Strategic Objective, each carrying
  // its own KPIs. Normalise it into our SOGroup shape and enrich each KPI with
  // the parent's thematic area / SO statement (the detail view needs them).
  const soGroups = useMemo<SOGroup[]>(() => {
    const groups = statData?.KPI_TABLE_DATA ?? [];
    return groups.map((g) => ({
      id: g.strategicObjectiveId,
      statement: g.strategicObjective,
      thematicArea: g.thematicArea ?? "—",
      totalProjects: g.totalProjects ?? 0,
      childKpis: (g.kpis ?? []).map((k) => ({
        ...k,
        thematicArea: g.thematicArea,
        strategicObjective: g.strategicObjective,
      })),
    }));
  }, [statData]);

  const resultTypeOptions = useMemo(
    () => transformResultTypesToOptions(resultTypes),
    [resultTypes],
  );

  // The selected result level is a resultTypeId — map it back to its name so we
  // can match against each KPI's `resultLevel` (Impact / Outcome / Output).
  const selectedResultName = useMemo(
    () => resultTypes.find((t) => t.resultTypeId === resultLevel)?.resultName,
    [resultTypes, resultLevel],
  );

  // Apply the Thematic Area (SO-level) + Result Level (KPI-level) filters.
  const filteredGroups = useMemo<SOGroup[]>(() => {
    return soGroups
      .filter(
        (g) =>
          !allThematicArea ||
          g.thematicArea?.toLowerCase() === allThematicArea.toLowerCase(),
      )
      .map((g) => ({
        ...g,
        childKpis: selectedResultName
          ? g.childKpis.filter(
              (k) =>
                k.resultLevel?.toLowerCase() ===
                selectedResultName.toLowerCase(),
            )
          : g.childKpis,
      }));
  }, [soGroups, allThematicArea, selectedResultName]);

  // Drop the drill-down selection whenever the filtered dataset changes.
  useEffect(() => {
    setSelectedSO(null);
    setSelectedKpi(null);
  }, [allThematicArea, resultLevel]);

  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  /** Parent (Strategic Objective) row columns — mirrors the project result head. */
  const tableHead = [
    "Strategic Objective",
    "Thematic Area",
    "Contributing Projects",
    "",
    "",
    "",
  ];

  /** Child (KPI / indicator) row columns — rendered below the parent when expanded. */
  const childTableHead = [
    "KPI Statement",
    "Baseline",
    "Target",
    "Actual",
    "Performance",
    "Actions",
  ];

  return (
    <div className="space-y-5">
      <CardComponent fitWidth>
        {/* Filters — same set as the project result dashboard */}
        <div className="flex grow flex-col md:flex-row mb-5 gap-4 md:items-center mt-10">
          <DropDown
            label="Thematic Area"
            value={allThematicArea}
            placeholder="Thematic Area"
            name="allThematicArea"
            onChange={(value: string) => setField("allThematicArea", value)}
            options={THEMATIC_AREAS_OPTIONS}
          />

          <DropDown
            label="Result Level"
            value={resultLevel}
            placeholder="Result Level"
            name="resultLevel"
            onChange={(value: string) => setField("resultLevel", value)}
            options={resultTypeOptions}
          />

          <DateRangePicker label="Date Range" />

          <DropDown
            label="Disaggregation"
            value={disaggregation}
            name="disaggregation"
            onChange={(value: string) => setField("disaggregation", value)}
            options={[
              { label: "Gender", value: "gender" },
              { label: "State", value: "state" },
              { label: "LGA", value: "lga" },
              { label: "Age", value: "age" },
              { label: "Product", value: "product" },
              { label: "Department", value: "department" },
              { label: "Tenure", value: "tenure" },
            ]}
          />
        </div>

        {/* Charts / Table tabs */}
        <TabComponent
          width="80"
          data={tabs}
          persistKey="org-kpi-tabs"
          renderContent={(tabId) => {
            if (tabId === 1) {
              if (filteredGroups.length === 0) {
                return (
                  <div className="py-16 text-center text-sm text-gray-500">
                    No strategic objectives match the selected filters.
                  </div>
                );
              }

              // Drilled-in: a KPI (indicator) is open → show its full detail view.
              if (selectedKpi) {
                return (
                  <div className="h-115 overflow-auto pr-1">
                    <KpiDetailView
                      selected={selectedKpi}
                      onBack={() => setSelectedKpi(null)}
                    />
                  </div>
                );
              }

              // Drilled-in: an SO is open → show its KPIs (indicators).
              if (selectedSO) {
                // Pull the freshest snapshot so filter changes reflect while drilled in.
                const liveSO =
                  filteredGroups.find((s) => s.id === selectedSO.id) ??
                  selectedSO;
                return (
                  <div className="h-115 overflow-auto space-y-4 pr-1">
                    <button
                      type="button"
                      onClick={() => setSelectedSO(null)}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">
                      <Icon
                        icon="fluent:arrow-left-24-regular"
                        width={16}
                        height={16}
                      />
                      Back to Strategic Objectives
                    </button>
                    <div className="rounded-md border border-gray-200 bg-gray-50 px-5 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Strategic Objective
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {liveSO.statement}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Thematic Area
                          </p>
                          <p className="text-sm text-gray-700 mt-0.5">
                            {liveSO.thematicArea}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Contributing Projects
                          </p>
                          <p className="text-sm text-gray-700 mt-0.5">
                            {liveSO.totalProjects}
                          </p>
                        </div>
                      </div>
                    </div>
                    <KpiCards kpis={liveSO.childKpis} onSelect={setSelectedKpi} />
                  </div>
                );
              }

              // Top-level: list of strategic objectives.
              return (
                <div className="h-115 overflow-auto space-y-3 pr-1">
                  {filteredGroups.map((so) => (
                    <button
                      key={so.id}
                      type="button"
                      onClick={() => setSelectedSO(so)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <div className="grid grid-cols-3 gap-4 flex-1 items-center">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {so.statement}
                        </p>
                        <p className="text-xs text-gray-600">
                          {so.thematicArea}
                        </p>
                        <p className="text-xs text-gray-600">
                          {so.childKpis.length} KPI
                          {so.childKpis.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <Icon
                        icon="fluent:chevron-right-24-regular"
                        width={20}
                        height={20}
                        className="text-gray-400 shrink-0"
                      />
                    </button>
                  ))}
                </div>
              );
            }

            return (
              <div className="mt-4">
                <TableWithAccordion<SOGroup, RawKPI>
                  tableHead={tableHead}
                  childTableHead={childTableHead}
                  tableData={filteredGroups}
                  childrenKey="childKpis"
                  persistKey="org-kpi-accordion"
                  pdfTitle="Organizational KPI Dashboard"
                  emptyStateMessage="No KPIs found"
                  emptyStateSubMessage="No KPIs match the selected filters."
                  renderRow={(so) => (
                    <>
                      <td className="px-6 py-3 text-xs text-gray-900 font-semibold max-w-xs">
                        {so.statement}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-600">
                        {so.thematicArea || ""}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-600">
                        {so.totalProjects}
                      </td>
                      {/* KPI-level metrics live on the child rows */}
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3" />
                    </>
                  )}
                  renderChildRow={(kpi) => {
                    const baseline = kpi.baseline ?? null;
                    const target = kpi.target ?? null;
                    const actual = kpi.actual ?? null;

                    // Compute performance defensively from actual/target when the
                    // API doesn't supply it directly.
                    const numericTarget =
                      typeof target === "number" ? target : Number(target);
                    const numericActual =
                      typeof actual === "number" ? actual : Number(actual);
                    const performance =
                      kpi.performance != null && kpi.performance !== 0
                        ? kpi.performance
                        : !Number.isNaN(numericTarget) &&
                            numericTarget > 0 &&
                            !Number.isNaN(numericActual)
                          ? Math.round((numericActual / numericTarget) * 100)
                          : null;

                    return (
                      <>
                        <td className="px-6 py-3 pl-12 text-xs text-gray-700 max-w-xs">
                          {kpi.statement ?? ""}
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-700">
                          {baseline ?? 0}
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-700">
                          {target ?? 0}
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-700">
                          {actual ?? 0}
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-700">
                          {performance != null ? `${performance}%` : "—"}
                        </td>
                        <td
                          className="px-6 py-2 relative"
                          onClick={(e) => e.stopPropagation()}>
                          <Icon
                            icon="fluent:document-add-24-regular"
                            width={20}
                            height={20}
                            color="#909CAD"
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/organizational-kpi/${kpi.kpiId}/report`,
                              )
                            }
                          />
                        </td>
                      </>
                    );
                  }}
                />
              </div>
            );
          }}
        />
      </CardComponent>
    </div>
  );
}

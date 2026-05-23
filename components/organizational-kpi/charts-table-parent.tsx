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
import { OrgKpiResponse } from "@/types/org-kpi";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import {
  fetchResultTypes,
  transformResultTypesToOptions,
} from "@/lib/api/result-types";
import { useOrgKPIFormState } from "@/store/super-admin-store/organizational-kpi-store";

// ─── Types ────────────────────────────────────────────────────────────────────

type RawKPI = OrgKpiResponse["KPI_TABLE_DATA"][number];

type SOGroup = {
  id: string;
  statement: string;
  thematicArea: string;
  responsiblePerson: string;
  childKpis: RawKPI[];
};

// ─── Card view (mirrors view-indicators in the project dashboard) ─────────────

function KpiCards({ kpis }: { kpis: RawKPI[] }) {
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
          No KPIs match the selected filters.
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
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
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
              <MeterPieChart performance={performance} />
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
  // We just ignore the SO + indicator fields below.
  const { allThematicArea, resultLevel, disaggregation, setField } =
    useOrgKPIFormState();

  const [resultLevelOptions, setResultLevelOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    fetchResultTypes()
      .then((types) => setResultLevelOptions(transformResultTypesToOptions(types)))
      .catch((err) => console.error("Failed to load result types:", err));
  }, []);

  const allKpis = statData?.KPI_TABLE_DATA ?? [];

  // Filtered KPI list, used for both card view + table grouping.
  const filteredKpis = useMemo(() => {
    let data = allKpis;
    if (allThematicArea)
      data = data.filter((k) => k.thematicArea === allThematicArea);
    if (resultLevel)
      data = data.filter(
        (k) => k.resultLevel?.toLowerCase() === resultLevel.toLowerCase(),
      );
    return data;
  }, [allKpis, allThematicArea, resultLevel]);

  // Group filtered KPIs by Strategic Objective for the accordion table.
  const soGroups = useMemo<SOGroup[]>(() => {
    const map = new Map<string, SOGroup>();
    filteredKpis.forEach((kpi) => {
      const key = kpi.strategicObjective || "Unassigned";
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          statement: key,
          thematicArea: kpi.thematicArea ?? "—",
          responsiblePerson: "—",
          childKpis: [],
        });
      }
      map.get(key)!.childKpis.push(kpi);
    });
    return Array.from(map.values());
  }, [filteredKpis]);

  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  // Matches the project-result table head exactly.
  const tableHead = [
    "Strategic Objective",
    "Thematic Area",
    "Contributing Projects",
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
            options={resultLevelOptions}
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
              return (
                <div className="h-115 overflow-auto">
                  <KpiCards kpis={filteredKpis} />
                </div>
              );
            }

            return (
              <div className="mt-4">
                <TableWithAccordion<SOGroup, RawKPI>
                  tableHead={tableHead}
                  tableData={soGroups}
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
                        {so.responsiblePerson || ""}
                      </td>
                      {/* KPI-level metrics live on the child rows */}
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3" />
                      <td className="px-6 py-3" />
                    </>
                  )}
                  renderChildRow={(kpi) => {
                    const performance =
                      kpi.performance != null
                        ? kpi.performance
                        : kpi.target && kpi.actual != null
                          ? Math.round((kpi.actual / kpi.target) * 100)
                          : null;

                    return (
                      <>
                        <td className="px-6 py-3 pl-12 text-xs text-gray-700 max-w-xs">
                          {kpi.statement ?? ""}
                        </td>
                        <td className="px-6 py-3" />
                        <td className="px-6 py-3" />
                        <td className="px-6 py-3 text-xs text-gray-700">
                          {kpi.baseline ?? 0}
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-700">
                          {kpi.target ?? 0}
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-700">
                          {kpi.actual ?? 0}
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-700">
                          {performance != null ? `${performance}%` : ""}
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
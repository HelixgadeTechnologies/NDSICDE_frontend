"use client";

import { useMemo, useState } from "react";
import CardComponent from "@/ui/card-wrapper";
import TabComponent from "@/ui/tab-component";
import TableSection from "./table-section";
import ChartsComponent from "./charts-section";
import Heading from "@/ui/text-heading";
import LineChartComponent from "@/ui/line-chart";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import { ProjectResultResponse } from "@/types/project-result-dashboard";
import EmptyChartState from "@/ui/empty-chart-state";

export default function ProjectKpiChartsTableParent({
  data,
}: {
  data: ProjectResultResponse;
}) {
  const [filters, setFilters] = useState({
    allThematicArea: "",
    resultLevel: "",
    indicators: "",
    disaggregation: "",
  });

  const { allThematicArea, resultLevel, indicators, disaggregation } = filters;

  const setField = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  const kpiPerformanceData = useMemo(() => 
    data?.PROJECT_INDICATOR_PERFORMANCE?.indicators?.map((item) => ({
      code: item.code,
      value: item.performance,
    })) || [], [data]);

  const lines = [{ key: "value", label: "Performance", color: "#003B99" }];

  const allTableData = data?.KPI_TABLE_DATA || [];

  const thematicAreaOptions = useMemo(() => {
    const unique = Array.from(new Set(allTableData.map((d) => d.thematicArea).filter(Boolean)));
    return unique.map((val) => ({ label: val, value: val }));
  }, [allTableData]);

  const resultLevelOptions = useMemo(() => {
    let filtered = allTableData;
    if (allThematicArea) filtered = filtered.filter((d) => d.thematicArea === allThematicArea);
    const unique = Array.from(new Set(filtered.map((d) => d.resultLevel).filter(Boolean)));
    return unique.map((val) => ({ label: val, value: val }));
  }, [allTableData, allThematicArea]);

  const dynamicIndicatorOptions = useMemo(() => {
    let filtered = allTableData;
    if (allThematicArea) filtered = filtered.filter((d) => d.thematicArea === allThematicArea);
    if (resultLevel) filtered = filtered.filter((d) => d.resultLevel === resultLevel);
    const unique = Array.from(new Set(filtered.map((d) => d.statement || d.code).filter(Boolean)));
    return unique.map((val) => ({ label: val, value: val }));
  }, [allTableData, allThematicArea, resultLevel]);

  const filteredTableData = useMemo(() => {
    let result = allTableData;
    if (allThematicArea) result = result.filter((r) => r.thematicArea === allThematicArea);
    if (resultLevel) result = result.filter((r) => r.resultLevel === resultLevel);
    if (indicators) result = result.filter((r) => r.statement === indicators || r.code === indicators);
    return result;
  }, [allTableData, allThematicArea, resultLevel, indicators]);

  const bars = [
    { key: "baseline", label: "Baseline", color: "#003B99" },
    { key: "target", label: "Target", color: "#D2091E" },
    { key: "actual", label: "Actual", color: "#22C55E" },
  ];

  const chartData = useMemo(() => {
    return (
      data?.KPI_OVERVIEW_CHART?.monthly?.map((m) => ({
        name: m.period,
        baseline: data?.KPI_OVERVIEW_CHART?.baseline || 0,
        target: m.target,
        actual: m.actual,
      })) || []
    );
  }, [data]);

  return (
    <div className="space-y-5">
      <CardComponent fitWidth>
        <div className="flex grow flex-col md:flex-row mb-5 gap-4 md:items-center mt-10 overflow-auto no-scrollbar">
          <DropDown
            label="Thematic Area"
            value={allThematicArea}
            placeholder="Thematic Area"
            name="allThematicArea"
            onChange={(value: string) => setField("allThematicArea", value)}
            options={thematicAreaOptions}
          />

          <DropDown
            label="Result Level"
            value={resultLevel}
            placeholder="Result Level"
            name="resultLevel"
            onChange={(value: string) => setField("resultLevel", value)}
            options={resultLevelOptions}
          />

          <DropDown
            label="Indicators"
            value={indicators}
            placeholder="All Indicators"
            name="indicators"
            onChange={(value: string) => setField("indicators", value)}
            options={dynamicIndicatorOptions}
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

        <TabComponent
          width="80"
          data={tabs}
          renderContent={(tabId) => {
            if (tabId === 1) {
              return (
                <ChartsComponent
                  chartData={chartData}
                  bars={bars}
                  availableYears={[2024, 2025, 2026]}
                />
              );
            } else {
              return <TableSection data={filteredTableData} />;
            }
          }}
        />
      </CardComponent>

      <CardComponent>
        <div className="flex justify-between items-center mb-5">
          <Heading
            heading="Project Indicator Performance (%)"
            subtitle="Percentage of target achieved"
          />
          <div className="w-[356px]">
            <CardComponent>
              <div className="flex items-center gap-1.5">
                <span className="bg-[#003B99] h-2 w-2 rounded-full" />
                <p className="text-gray-500 text-xs">Performance</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[15px]">
                  Average Performance for Project:
                </span>
                <span className="font-semibold text-shadow-gray-900 text-2xl">
                  {data?.PROJECT_INDICATOR_PERFORMANCE?.averagePerformance ?? "0"}
                </span>
              </div>
            </CardComponent>
          </div>
        </div>

        <div className="h-72 flex flex-col justify-center">
          {kpiPerformanceData.length > 0 ? (
            <LineChartComponent
              data={kpiPerformanceData}
              lines={lines}
              legend={false}
              xKey="code"
            />
          ) : (
            <EmptyChartState
              height={288}
              title="No performance data"
              subtitle="Indicator performance analytics will appear here once data is collected."
            />
          )}
        </div>
      </CardComponent>
    </div>
  );
}

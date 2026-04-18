"use client";

import { useMemo, useState, useEffect } from "react";
import CardComponent from "@/ui/card-wrapper";
import TabComponent from "@/ui/tab-component";
import TableSection from "./table-section";
import ChartsComponent from "./charts-section";
import Heading from "@/ui/text-heading";
import LineChartComponent from "@/ui/line-chart";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import { useOrgKPIFormState } from "@/store/super-admin-store/organizational-kpi-store";
import { OrgKpiResponse } from "@/types/org-kpi";
import EmptyChartState from "@/ui/empty-chart-state";
import { THEMATIC_AREAS_OPTIONS } from "@/lib/config/admin-settings";
import { useStrategicObjectives } from "@/context/StrategicObjectivesContext";
import { transformResultTypesToOptions, fetchResultTypes } from "@/lib/api/result-types";

// Dynamic indicator options moved to component scope

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function generateChartData(indicator: string, year: number) {
  let baseMin = 80,
    baseMax = 120,
    targetMin = 110,
    targetMax = 160,
    actualMin = 90,
    actualMax = 150;

  switch (indicator) {
    case "project_completion":
      baseMin = 70;
      baseMax = 120;
      targetMin = 100;
      targetMax = 160;
      actualMin = 80;
      actualMax = 150;
      break;

    case "budget_utilization":
      baseMin = 60;
      baseMax = 90;
      targetMin = 90;
      targetMax = 110;
      actualMin = 70;
      actualMax = 100;
      break;

    case "stakeholder_satisfaction":
      baseMin = 50;
      baseMax = 100;
      targetMin = 80;
      targetMax = 130;
      actualMin = 60;
      actualMax = 120;
      break;

    case "training_participation":
      baseMin = 40;
      baseMax = 80;
      targetMin = 70;
      targetMax = 130;
      actualMin = 50;
      actualMax = 110;
      break;

    case "community_engagement":
      baseMin = 30;
      baseMax = 100;
      targetMin = 60;
      targetMax = 140;
      actualMin = 40;
      actualMax = 120;
      break;
  }

  // Generate data for each month
  return monthLabels.map((month) => ({
    name: month,
    baseline: Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin,
    target: Math.floor(Math.random() * (targetMax - targetMin + 1)) + targetMin,
    actual: Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin,
    year,
  }));
}

export default function ChartsAndTableParent({
  statData,
}: {
  statData?: OrgKpiResponse | null;
}) {
  // Tabs
  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  const { soOptions } = useStrategicObjectives();
  const [resultLevelOptions, setResultLevelOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const loadResultTypes = async () => {
      try {
        const types = await fetchResultTypes();
        setResultLevelOptions(transformResultTypesToOptions(types));
      } catch (error) {
        console.error("Failed to load result types:", error);
      }
    };
    loadResultTypes();
  }, []);

  // Lower line chart data
  const data = statData?.PROJECT_INDICATOR_PERFORMANCE?.kpis?.map((kpi) => ({
    code: kpi.code,
    value: kpi.performance,
  })) || [];

  const lines = [{ key: "value", label: "Performance", color: "#003B99" }];

  // Store state
  const {
    allThematicArea,
    allStrategicObjective,
    indicators,
    resultLevel,
    disaggregation,
    setField,
  } = useOrgKPIFormState();

  // Filter Options & Extracted Logic
  const allData = statData?.KPI_TABLE_DATA || [];


  const dynamicIndicatorOptions = useMemo(() => {
    let filtered = allData;
    if (allThematicArea) filtered = filtered.filter((d) => d.thematicArea === allThematicArea);
    if (allStrategicObjective) filtered = filtered.filter((d) => d.strategicObjective === allStrategicObjective);
    if (resultLevel) filtered = filtered.filter((d) => d.resultLevel === resultLevel);
    const unique = Array.from(new Set(filtered.map((d) => d.statement).filter(Boolean)));
    return unique.map((val) => ({ label: val, value: val }));
  }, [allData, allThematicArea, allStrategicObjective, resultLevel]);

  // Derived filtered data for the table
  const filteredTableData = useMemo(() => {
    let data = allData;
    if (allThematicArea) data = data.filter((r) => r.thematicArea === allThematicArea);
    if (allStrategicObjective) data = data.filter((r) => r.strategicObjective === allStrategicObjective);
    if (resultLevel) data = data.filter((r) => r.resultLevel === resultLevel);
    if (indicators) data = data.filter((r) => r.statement === indicators);
    return data;
  }, [allData, allThematicArea, allStrategicObjective, resultLevel, indicators]);

  // Available years
  const availableYears = [2024, 2025];
  const [selectedYear] = useState<number>(availableYears[0]);


  // Bars for bar chart
  const bars = [
    { key: "baseline", label: "Baseline", color: "#003B99" },
    { key: "target", label: "Target", color: "#D2091E" },
    { key: "actual", label: "Actual", color: "#22C55E" },
  ];

  // Generate chart data dynamically based on indicator and year
  const chartData = useMemo(() => {
    return (
      statData?.KPI_OVERVIEW_CHART?.monthly?.map((m) => ({
        name: m.period,
        baseline: statData.KPI_OVERVIEW_CHART.baseline || 0,
        target: m.target,
        actual: m.actual,
      })) || []
    );
  }, [statData]);

  return (
    <div className="space-y-5">
      {/* Filter Section */}
      <CardComponent fitWidth>
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
            label="Strategic Objective"
            value={allStrategicObjective}
            placeholder="Strategic Objective"
            name="allStrategicObjective"
            onChange={(value: string) => setField("allStrategicObjective", value)}
            options={soOptions}
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

        {/* Tabs for Charts/Table */}
        <TabComponent
          width="80"
          data={tabs}
          renderContent={(tabId) => {
            if (tabId === 1) {
              return (
                <ChartsComponent
                  chartData={chartData}
                  bars={bars}
                  availableYears={availableYears}
                />
              );
            } else {
              return <TableSection data={filteredTableData} />;
            }
          }}
        />
      </CardComponent>

      {/* Lower KPI Performance Section */}
      <CardComponent>
        <div className="flex justify-between items-center mb-5">
          <Heading
            heading="Project Indicator Performance (%)"
            subtitle="Percentage of target achieved"
          />
          <div className="w-[356px]">
            <CardComponent>
              <div className="flex items-center gap-1.5">
                <span className="bg-[#003B99] h-2 w-2 rounded-full"></span>
                <p className="text-gray-500 text-xs">Performance</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[15px]">
                  Average Performance for Project:
                </span>
                <span className="font-semibold text-shadow-gray-900 text-2xl">
                  {statData?.PROJECT_INDICATOR_PERFORMANCE?.averagePerformance ?? "0"}
                </span>
              </div>
            </CardComponent>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-72 flex flex-col justify-center">
          {data.length > 0 ? (
            <LineChartComponent
              data={data}
              lines={lines}
              legend={false}
              xKey="code"
            />
          ) : (
            <EmptyChartState height={288} title="No performance data" subtitle="Indicator performance analytics will appear here once data is collected." />
          )}
        </div>
      </CardComponent>
    </div>
  );
}

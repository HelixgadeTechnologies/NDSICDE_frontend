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
import { useOrgKPIFormState } from "@/store/admin-store/organizational-kpi-store";

const indicatorOptions = [
  { label: "Project Completion Rate", value: "project_completion" },
  { label: "Budget Utilization", value: "budget_utilization" },
  { label: "Stakeholder Satisfaction", value: "stakeholder_satisfaction" },
  { label: "Training Participation", value: "training_participation" },
  { label: "Community Engagement", value: "community_engagement" },
];

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function generateChartData(indicator: string, year: number) {
  let baseMin = 80, baseMax = 120, targetMin = 110, targetMax = 160, actualMin = 90, actualMax = 150;

  switch (indicator) {
    case "project_completion":
      baseMin = 70; baseMax = 120;
      targetMin = 100; targetMax = 160;
      actualMin = 80; actualMax = 150;
      break;

    case "budget_utilization":
      baseMin = 60; baseMax = 90;
      targetMin = 90; targetMax = 110;
      actualMin = 70; actualMax = 100;
      break;

    case "stakeholder_satisfaction":
      baseMin = 50; baseMax = 100;
      targetMin = 80; targetMax = 130;
      actualMin = 60; actualMax = 120;
      break;

    case "training_participation":
      baseMin = 40; baseMax = 80;
      targetMin = 70; targetMax = 130;
      actualMin = 50; actualMax = 110;
      break;

    case "community_engagement":
      baseMin = 30; baseMax = 100;
      targetMin = 60; targetMax = 140;
      actualMin = 40; actualMax = 120;
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

export default function ChartsAndTableParent() {
  // Tabs
  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  // Lower line chart data
  const data = [
    { code: "EDU 01", value: 70 },
    { code: "EDU 02", value: 100 },
    { code: "HEALTH 01", value: 35 },
    { code: "HEALTH 02", value: 75 },
    { code: "INFRA 01", value: 50 },
    { code: "INFRA 02", value: 90 },
  ];

  const lines = [
    { key: "value", label: "Performance", color: "#003B99" },
  ];

  // Store state
  const {
    allStrategicObjective,
    indicators,
    resultLevel,
    disaggregation,
    setField,
  } = useOrgKPIFormState();

  // Available years
  const availableYears = [2024, 2025];
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);
  console.log(setSelectedYear(0));

  // Bars for bar chart
  const bars = [
    { key: "baseline", label: "Baseline", color: "#003B99" },
    { key: "target", label: "Target", color: "#D2091E" },
    { key: "actual", label: "Actual", color: "#22C55E" },
  ];

  // Generate chart data dynamically based on indicator and year
  const chartData = useMemo(() => {
    const indicatorValue = indicators || "project_completion";
    return generateChartData(indicatorValue, selectedYear);
  }, [indicators, selectedYear]);

  return (
    <div className="space-y-5">
      {/* Filter Section */}
      <CardComponent fitWidth>
        <div className="flex flex-grow flex-col md:flex-row mb-5 gap-4 md:items-center mt-10">
          <DropDown
            label="Thematic Area"
            value={""}
            placeholder="Thematic Area"
            name="allThematicArea"
            onChange={() => {}}
            options={[
              { label: "Governance", value: "Governance" },
              { label: "Peace and Security", value: "Peace and Security" },
              { label: "Livelihood", value: "Livelihood" },
              {
                label: "Environment and Climate Change",
                value: "Environment and Climate Change",
              },
            ]}
          />

          <DropDown
            label="Strategic Objective"
            value={allStrategicObjective}
            placeholder="Strategic Objective"
            name="allStrategicObjective"
            onChange={(value: string) => setField("allStrategicObjective", value)}
            options={[]}
          />

          <DropDown
            label="Result Level"
            value={resultLevel}
            placeholder="Impact"
            name="resultLevel"
            onChange={(value: string) => setField("resultLevel", value)}
            options={[]}
          />

          <DropDown
            label="Indicators"
            value={indicators}
            placeholder="All Indicators"
            name="indicators"
            onChange={(value: string) => setField("indicators", value)}
            options={indicatorOptions}
          />

          <DateRangePicker label="Date Range" />

          <DropDown
            label="Disaggregation"
            value={disaggregation}
            placeholder="Sex"
            name="disaggregation"
            onChange={(value: string) => setField("disaggregation", value)}
            options={[]}
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
              return <TableSection />;
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
                  200
                </span>
              </div>
            </CardComponent>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-72">
          <LineChartComponent
            data={data}
            lines={lines}
            legend={false}
            xKey="code"
          />
        </div>
      </CardComponent>
    </div>
  );
}

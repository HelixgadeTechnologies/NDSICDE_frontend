"use client";

import CardComponent from "@/ui/card-wrapper";
import TabComponent from "@/ui/tab-component";
import TableSection from "./table-section";
import ChartsComponent from "./charts-section";
import Heading from "@/ui/text-heading";
import LineChartComponent from "@/ui/line-chart";
import { useOrgKPIFormState } from "@/store/admin-store/organizational-kpi-store";
import { useMemo } from "react";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";

// Mock indicators list - replace with your actual data
const indicatorOptions = [
  { label: "Project Completion Rate", value: "project_completion" },
  { label: "Budget Utilization", value: "budget_utilization" },
  { label: "Stakeholder Satisfaction", value: "stakeholder_satisfaction" },
  { label: "Training Participation", value: "training_participation" },
  { label: "Community Engagement", value: "community_engagement" },
];

// Function to generate random chart data based on indicator
const generateChartData = (indicator: string) => {
  const categories = ["Q1", "Q2", "Q3", "Q4"];
  
  return categories.map((quarter) => ({
    name: quarter,
    baseline: Math.floor(Math.random() * 100) + 50, // Random between 50-150
    target: Math.floor(Math.random() * 100) + 100, // Random between 100-200
    actual: Math.floor(Math.random() * 100) + 80, // Random between 80-180
  }));

  console.log("Generated chart data for indicator:", indicator);
};

export default function ChartsAndTableParent() {
  // for switch tab
  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  // data for lower line chart
  const data = [
    { code: "EDU 01", value: 70 },
    { code: "EDU 02", value: 100 },
    { code: "HEALTH 01", value: 35 },
    { code: "HEALTH 02", value: 75 },
    { code: "INFRA 01", value: 50 },
    { code: "INFRA 02", value: 90 },
  ];

  // lines for lower line chart
  const lines = [
    {
      key: "value",
      label: "Performance",
      color: "#003B99",
    },
  ];

  // for chart child component
    const {
      allStrategicObjective,
      indicators,
      resultLevel,
      disaggregation,
      setField,
    } = useOrgKPIFormState();
  
    // bars for bar chart
    const bars = [
      { key: "baseline", label: "Baseline", color: "#003B99" },
      { key: "target", label: "Target", color: "#D2091E" },
      { key: "actual", label: "Actual", color: "#22C55E" },
    ];
  
    // Generate chart data dynamically based on selected indicator
    const chartData = useMemo(() => {
      if (!indicators) {
        // Return default data if no indicator selected
        return [
          { name: "Q1", baseline: 100, target: 150, actual: 120 },
          { name: "Q2", baseline: 110, target: 160, actual: 140 },
          { name: "Q3", baseline: 120, target: 170, actual: 155 },
          { name: "Q4", baseline: 130, target: 180, actual: 165 },
        ];
      }
      
      // Generate random data when indicator changes
      return generateChartData(indicators);
    }, [indicators]);


  return (
    <div className="space-y-5">
      {/* tabs */}
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
            onChange={(value: string) =>
              setField("allStrategicObjective", value)
            }
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
        <TabComponent
          width="80"
          data={tabs}
          renderContent={(tabId) => {
            if (tabId === 1) {
              return <ChartsComponent chartData={chartData} bars={bars} />;
            } else {
              return <TableSection />;
            }
          }}
        />
      </CardComponent>

      {/* card and lower chart */}
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

        {/* line chart */}
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

"use client";

import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import LineChartComponent from "@/ui/line-chart";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { PieChart, ResponsiveContainer, Pie, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react";
import BarChartComponent from "@/ui/bar-chart";

function ITAChart() {
  const lines = [
    { key: "actual", label: "Actual", color: "#003B99" },
    { key: "planned", label: "Planned", color: "#EF4444" },
  ];

  const data = [
    { name: "Task 1", actual: 45, planned: 55 },
    { name: "Task 2", actual: 75, planned: 60 },
    { name: "Task 3", actual: 30, planned: 15 },
    { name: "Task 4", actual: 50, planned: 80 },
    { name: "Task 5", actual: 40, planned: 30 },
    { name: "Task 6", actual: 78, planned: 60 },
  ];

  return (
    <div className="h-[260px] mt-4 mr-4">
      <LineChartComponent data={data} lines={lines} xKey="name" legend />
    </div>
  );
}

function ITATable() {
  const head = [
    "Activity Description",
    "Total Activity Planned Days",
    "Total Activity Spent Days",
    "(Days Spent) %",
    "Earned Value (EV)",
    "Planned Value (EV)",
    "Status",
    "Cost Variance",
  ];

  const data = [
    {
      activityDescription: "Activity Description",
      totalActivityPlannedDays: 65,
      totalActivitySpentDays: 40,
      daysSpent: 32,
      earnedValue: 10,
      plannedValue: 78,
      status: "Due to Start",
      costVariance: 20,
    },
    {
      activityDescription: "Activity Description",
      totalActivityPlannedDays: 65,
      totalActivitySpentDays: 40,
      daysSpent: 32,
      earnedValue: 10,
      plannedValue: 78,
      status: "Due to Start",
      costVariance: 20,
    },
  ];

  return (
    <div className="mt-5">
      <Table
        tableHead={head}
        tableData={data}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.activityDescription}</td>
            <td className="px-6">{row.totalActivityPlannedDays}</td>
            <td className="px-6">{row.totalActivitySpentDays}</td>
            <td className="px-6">{row.daysSpent}</td>
            <td className="px-6">{row.earnedValue}</td>
            <td className="px-6">{row.plannedValue}</td>
            <td className="px-6">{row.status}</td>
            <td className="px-6">{row.costVariance}</td>
          </>
        )}
      />
    </div>
  );
}

const data = [
  { name: "Project 1", value: 80 },
  { name: "Project 2", value: 90 },
  { name: "Project 3", value: 80 },
  { name: "Project 4", value: 50 },
  { name: "Project 5", value: 80 },
  { name: "Project 6", value: 80 },
  { name: "Project 7", value: 90 },
  { name: "Project 8", value: 50 },
];

const colorsSpi = ["#0047AB", "#F44336", "#FBC02D"];
  const colorsCpi = ["#F44336", "#FBC02D", "#0047AB", "#22C55E",];

function CPI() {
  return (
    <div className="h-[300px] mt-5">
      <BarChartComponent
        data={data}
        isSingleBar={true}
        colors={colorsCpi}
        xKey="name"
        labels={["Under Budget",  "As Planned", "No Spending", "Over Budget"]}
        />
    </div>
  );
}

function SPI() {
  return (
    <div className="h-[300px] mt-5">
      <BarChartComponent
        data={data}
        isSingleBar={true}
        colors={colorsSpi}
        xKey="name"
        labels={["Behind Schedule", "Ahead of Schedule", "On Schedule"]}
        />
    </div>
  );
}

export default function ActivityOverview() {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    {tabName: "CPI", id: 1},
    {tabName: "SPI", id: 2},
  ];

  const budgetUilization = [
    { name: "Due to Start", value: 23 },
    { name: "In Progress(Early Start)", value: 14 },
    { name: "In Progress(Late Start)", value: 23 },
    { name: "Future Activity", value: 20 },
    { name: "Completed Early", value: 10 },
    { name: "Completed Late", value: 10 },
  ];

  const BUColors = ["#22C55E", "#EF4444", "#EAB308", "#003B99", "#98A2B3", "#000000"];

  const burnRate = [
    { normal: 60, name: "Target 1" },
    { normal: 70, name: "Target 2" },
    { normal: 50, name: "Target 3" },
    { normal: 85, name: "Target 4" },
    { normal: 55, name: "Target 5" },
    { normal: 70, name: "Target 6" },
  ];


  return (
    <>
      {/* activity overview */}
      <CardComponent>
        <Heading
          heading="Activity Overview"
          subtitle="Breakdown of activities by current activities"
        />
        <div className="flex items-center justify-between px-10">
          <div className="h-[400px] w-[50%]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={budgetUilization}>
                  {budgetUilization.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={BUColors[index % BUColors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 w-[50%]">
            {budgetUilization.map((p, i) => (
              <div key={i} className="w-full flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: BUColors[i % BUColors.length] }}
                  ></span>
                  <span className="text-sm text-gray-500">{p.name}</span>
                </div>
                <p className="font-medium text-gray-900 text-sm">{p.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </CardComponent>

      {/* implementation time analysis */}
      <div className="space-y-4">
        <TabComponent
          width="240px"
          data={[
            { tabName: "Charts", id: 1 },
            { tabName: "Table", id: 2 },
          ]}
          renderContent={(tabId) => {
            if (tabId === 1) {
              return (
                <CardComponent>
                  <Heading
                    heading="Implementation Time Analysis"
                    subtitle="Planned vs. actual timeline for project activities"
                  />
                  <ITAChart />
                </CardComponent>
              );
            } else {
              return (
                <CardComponent>
                  <Heading
                    heading="Implementation Time Analysis"
                    subtitle="Planned vs. actual timeline for project activities"
                  />
                  <ITATable />
                </CardComponent>
              );
            }
          }}
        />
      </div>

      {/* burn rate */}
      <CardComponent>
        {/* heading and filters */}
        <div className="flex items-end justify-between gap-4">
          <Heading heading="Burn Rate" subtitle="Percentage of target achieved" />
          <div className="flex gap-4 iteems-end">
            <DropDown
            label="Output"
            name="output"
            placeholder="All Output"
            value=""
            onChange={() => {}}
            options={[]}
            />
            <DropDown
            label="Activity"
            name="activity"
            placeholder="All Activity"
            value=""
            onChange={() => {}}
            options={[]}
            />
            <DateRangePicker label="Date Range"/>
          </div>
        </div>

          {/* line graph */}
        <div className="h-[260px] mt-5">
          <LineChartComponent data={burnRate} lines={[ { key: "normal", label: "Normal", color: "#D2091E" }, ]} xKey="name" />
        </div>
      </CardComponent>

      {/* cpi and spi */}
        <CardComponent>
      <div className="flex justify-between items-center">
        <Heading
          heading={activeTab === 1 ? 'Cost Performance Index (CPI)' : 'Schedule Performance Index (SPI)'}
          subtitle="Budget Performance by Project"
        />
          {/* Hardcoded Tabs */}
          <div className="w-[175px] h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg">
            {tabs.map((d) => {
              const isActive = activeTab === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveTab(d.id)}
                  className="relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab"
                      className="absolute inset-0 z-0 bg-white rounded-lg text-[#242424]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <div
                    className={`relative z-10 px-3 md:px-6 h-10 flex items-center justify-center font-bold text-xs md:text-sm cursor-pointer whitespace-nowrap ${
                      isActive ? "text-[#242424]" : "text-[#7A7A7A]"
                    }`}
                  >
                    {d.tabName}
                  </div>
                </div>
              );
            })}
          </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          { activeTab === 1 && <CPI/> }
          { activeTab === 2 && <SPI/> }
        </motion.div>
      </AnimatePresence>
    </CardComponent>
    </>
  );
}

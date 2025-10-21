"use client";

import CardComponent from "@/ui/card-wrapper";
import LineChartComponent from "@/ui/line-chart";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";

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

export default function ImplementationTimeAnalysisComponent() {
  return (
    <div className="space-y-4">
      <TabComponent
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
  );
}

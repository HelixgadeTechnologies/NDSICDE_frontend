"use client";

import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

// chart
function ActivityOverviewChart() {
  const budgetUilization = [
    { name: "Due to Start", value: 23 },
    { name: "In Progress(Early Start)", value: 14 },
    { name: "In Progress(Late Start)", value: 23 },
    { name: "Future Activity", value: 20 },
    { name: "Completed Early", value: 10 },
    { name: "Completed Late", value: 10 },
  ];

  const BUColors = [
    "#22C55E",
    "#EF4444",
    "#EAB308",
    "#003B99",
    "#98A2B3",
    "#000000",
  ];
  return (
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
                style={{
                  backgroundColor: BUColors[i % BUColors.length],
                }}></span>
              <span className="text-sm text-gray-500">{p.name}</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">{p.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// table
function ActivityOverviewTable() {
    const head = [
        "Activity Statement",
        "Target Frequency",
        "Actual Frequency",
        "Performance",
        "Status",
    ];

    const data = [
        {
            id: 1,
            activityStatement: "Statement 1", 
            targetFrequency: "Frequency 1", 
            actualFrequency: "Frequency 1",
            performance: "Perfect",
            status: "Due to Start",
        },
         {
            id: 2,
            activityStatement: "Statement 1", 
            targetFrequency: "Frequency 1", 
            actualFrequency: "Frequency 1",
            performance: "Perfect",
            status: "In Progress",
        },
    ];
    return (
        <Table
        tableHead={head}
        tableData={data}
        idKey="id"
        checkbox
        renderRow={(row) => (
            <>
                <td className="px-6">{row.activityStatement}</td>
                <td className="px-6">{row.targetFrequency}</td>
                <td className="px-6">{row.actualFrequency}</td>
                <td className="px-6">{row.performance}</td>
                <td className="px-6">{row.status}</td>
            </>
        )}
        />
    )
}

export default function ActivityOverviewComponent() {
  return (
    <TabComponent
      data={[
        { tabName: "Chart", id: 1 },
        { tabName: "Table", id: 2 },
      ]}
      renderContent={(rowId) => {
        if (rowId === 1) {
            return <ActivityOverviewChart/>
        } else {
            return <ActivityOverviewTable/>
        }
      }}
    />
  );
}

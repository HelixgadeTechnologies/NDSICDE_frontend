"use client";

import { ProjectResultResponse } from "@/types/project-result-dashboard";
import EmptyChartState from "@/ui/empty-chart-state";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

// chart
function ActivityOverviewChart({data}: {data: ProjectResultResponse}) {
  const chartData = data.ACTIVITY_OVERVIEW.map((item) => ({
    name: item.category,
    value: item.count,
    percentage: item.percentage
  }));

  const BUColors = [
    "#22C55E",
    "#EF4444",
    "#EAB308",
    "#003B99",
    "#98A2B3",
    "#000000",
  ];

  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (chartData.length === 0 || totalValue === 0) {
    return <EmptyChartState title="No activity data to display" subtitle="There are currently no recorded activities for this project." />;
  }

  return (
    <div className="flex items-center justify-between px-10">
      <div className="h-[300px] w-[50%]">
        <ResponsiveContainer>
          <PieChart>
            <Pie 
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            >
              {chartData.map((entry, index) => (
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
        {chartData.map((p, i) => (
          <div key={i} className="w-full flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: BUColors[i % BUColors.length],
                }}></span>
              <span className="text-sm text-gray-500">{p.name}</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">{p.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// table
function ActivityOverviewTable({data}: {data: ProjectResultResponse}) {
    const head = [
        "Activity Statement",
        "Target Frequency",
        "Actual Frequency",
        "Performance",
        "Status",
    ];

    return (
        <Table
        tableHead={head}
        tableData={data.ACTIVITY_TABLE}
        idKey="activityId"
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
         pagination={true}
        itemsPerPage={3}
        />
    )
}

export default function ActivityOverviewComponent({data}: {data: ProjectResultResponse}) {
  return (
    <TabComponent
      data={[
        { tabName: "Chart", id: 1 },
        { tabName: "Table", id: 2 },
      ]}
      renderContent={(rowId) => {
        if (rowId === 1) {
            return <ActivityOverviewChart data={data}/>
        } else {
            return <ActivityOverviewTable data={data}/>
        }
      }}
    />
  );
}

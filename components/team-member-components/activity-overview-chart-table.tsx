"use client";

import { ProjectResultResponse } from "@/types/project-result-dashboard";
import EmptyChartState from "@/ui/empty-chart-state";
import TabComponent from "@/ui/tab-component";
import TableWithAccordion from "@/ui/table-with-accordion";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type OutputRow = ProjectResultResponse["ACTIVITY_TABLE"][number];
type ActivityRow = OutputRow["activities"][number];

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
      <div className="h-75 w-[50%]">
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

// table — outputs are parent rows, their activities expand below
function ActivityOverviewTable({ data }: { data: ProjectResultResponse }) {
  const head = [
    "Output / Activity",
    "Target Frequency",
    "Actual Frequency",
    "Performance",
    "Status",
  ];

  return (
    <TableWithAccordion<OutputRow, ActivityRow>
      tableHead={head}
      tableData={data.ACTIVITY_TABLE}
      childrenKey="activities"
      persistKey="activity-overview-table"
      pdfTitle="Activity Overview"
      pagination
      itemsPerPage={2}
      emptyStateMessage="No activities yet"
      emptyStateSubMessage="There are no activities for this project yet."
      renderRow={(output) => (
        <>
          <td className="px-6 text-sm text-gray-800 font-medium max-w-xs">
            <div className="flex items-center gap-2">
              <span>{output.outputStatement || "—"}</span>
            </div>
          </td>
          {/* Empty cells — activity-level metrics live on the child rows */}
          <td className="px-6" />
          <td className="px-6" />
          <td className="px-6" />
          <td className="px-6" />
        </>
      )}
      renderChildRow={(activity) => (
        <>
          <td className="px-6 text-sm text-gray-700 max-w-xs">
            {activity.activityStatement || "—"}
          </td>
          <td className="px-6 text-sm text-gray-700">{activity.targetFrequency}</td>
          <td className="px-6 text-sm text-gray-700">{activity.actualFrequency}</td>
          <td className="px-6 text-sm text-gray-700">{activity.performance}</td>
          <td className="px-6 text-sm text-gray-700">{activity.status || "—"}</td>
        </>
      )}
    />
  );
}

export default function ActivityOverviewComponent({data}: {data: ProjectResultResponse}) {
  // console.log(data)
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

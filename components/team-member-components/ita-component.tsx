"use client";

import CardComponent from "@/ui/card-wrapper";
import LineChartComponent from "@/ui/line-chart";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";

function ITAChart({ chartData }: { chartData?: ProjectFinancialDashboardResponse["IMPLEMENTATION_TIME_ANALYSIS"]["chart"] }) {
  const lines = [
    { key: "actual", label: "Actual", color: "#003B99" },
    { key: "planned", label: "Planned", color: "#EF4444" },
  ];

  const data = chartData?.map((item) => ({
    name: item.outputId ? `${item.outputStatement}` : item.outputStatement || "Unknown",
    actual: item.totalActualDays || 0,
    planned: item.totalPlannedDays || 0,
  })) || [];


  return (
    <div className="h-[260px] mt-4 mr-4">
      <LineChartComponent data={data} lines={lines} xKey="name" legend />
    </div>
  );
}

function ITATable({ tableData }: { tableData?: ProjectFinancialDashboardResponse["IMPLEMENTATION_TIME_ANALYSIS"]["table"] }) {
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

  if (!tableData || tableData.length === 0) return <div className="text-center py-10 text-gray-500">No data available</div>;

  return (
    <div className="mt-5">
      <Table
        tableHead={head}
        tableData={tableData}
        checkbox
        idKey="activityId"
        renderRow={(row: any) => (
          <>
            <td className="px-6" title={row.activityDescription}>{row.activityDescription ?? "-"}</td>
            <td className="px-6">{row.totalPlannedDays ?? "-"}</td>
            <td className="px-6">{row.totalActivitySpentDays ?? "-"}</td>
            <td className="px-6">{row.percentageDaysSpent ?? 0}%</td>
            <td className="px-6">{row.earnedValue ?? "-"}</td>
            <td className="px-6">{row.plannedValue ?? "-"}</td>
            <td className="px-6">{row.status ?? "-"}</td>
            <td className="px-6">{row.costVariance ?? "-"}</td>
          </>
        )}
      />
    </div>
  );
}

export default function ImplementationTimeAnalysisComponent({
  statData,
}: {
  statData?: ProjectFinancialDashboardResponse | null;
}) {
  const itaData = statData?.IMPLEMENTATION_TIME_ANALYSIS;

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
                <ITAChart chartData={itaData?.chart} />
              </CardComponent>
            );
          } else {
            return (
              <CardComponent>
                <Heading
                  heading="Implementation Time Analysis"
                  subtitle="Planned vs. actual timeline for project activities"
                />
                <ITATable tableData={itaData?.table} />
              </CardComponent>
            );
          }
        }}
      />
    </div>
  );
}

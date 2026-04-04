"use client";

import LineChartComponent from "@/ui/line-chart";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";

function BurnRateChart({ burnData }: { burnData?: ProjectFinancialDashboardResponse["BURN_RATE"] }) {
  const burnRate = burnData?.map((item) => ({
    normal: item.burnRate || 0,
    name: item.outputStatement || item.outputId || "Unknown",
  })) || [];


  return (
    <div className="h-[260px] mt-5">
      <LineChartComponent
        data={burnRate}
        lines={[{ key: "normal", label: "Burn Rate", color: "#D2091E" }]}
        xKey="name"
      />
    </div>
  );
}

function BurnRateTable({ burnData }: { burnData?: ProjectFinancialDashboardResponse["BURN_RATE"] }) {
    const head = ["Output ID", "Output Statement", "Actual Cost", "Budget", "Burn Rate"];
    if (!burnData || burnData.length === 0) return <div className="text-center py-10 text-gray-500">No data available</div>;

    return (
        <div className="mt-5">
          <Table
          tableHead={head}
          tableData={burnData}
          checkbox
          idKey={"outputId"}
          renderRow={(row: any) => (
              <>
              <td className="px-6 truncate uppercase">{row.outputId ? `${row.outputId.substring(0, 4)}...` : "-"}</td>
              <td className="px-6">{row.outputStatement ?? "-"}</td>
              <td className="px-6">{row.sumActualCost ?? "-"}</td>
              <td className="px-6">{row.sumBudget ?? "-"}</td>
              <td className="px-6">{row.burnRate ?? 0}%</td>
              </>
          )}
          />
        </div>
    )
}

import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";

export default function BurnRateComponent({
  statData,
}: {
  statData?: ProjectFinancialDashboardResponse | null;
}) {
  return (
    <div className="mt-6">
        <TabComponent
          data={[
            { tabName: "Chart", id: 1 },
            { tabName: "Table", id: 2 },
          ]}
          renderContent={(rowId) => {
            if (rowId === 1) {
              return <BurnRateChart burnData={statData?.BURN_RATE} />;
            } else {
              return <BurnRateTable burnData={statData?.BURN_RATE} />;
            }
          }}
        />
    </div>
  );
}

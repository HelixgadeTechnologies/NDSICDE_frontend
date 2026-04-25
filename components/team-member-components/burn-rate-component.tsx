"use client";

import LineChartComponent from "@/ui/line-chart";
import TabComponent from "@/ui/tab-component";
import TableWithAccordion from "@/ui/table-with-accordion";

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

function BurnRateTable({ activities }: { activities?: ProjectFinancialDashboardResponse["ACTIVITY_FINANCIAL_DATA"] }) {
    const head = ["Description", "Budget","Actual Cost", "Burn Rate"];
    const childHead = ["Activity Statement", "Budget", "Actual Cost", "Burn Rate"];
    
    if (!activities || activities.length === 0) return <div className="text-center py-10 text-gray-500">No data available</div>;

    // Group activities by outputId
    const groupedData = activities.reduce((acc: any, activity) => {
      const outputId = activity.outputId || "unknown";
      if (!acc[outputId]) {
        acc[outputId] = {
          outputId: activity.outputId,
          outputStatement: activity.outputStatement,
          activities: [],
        };
      }
      acc[outputId].activities.push(activity);
      return acc;
    }, {});

    const burnData = Object.values(groupedData).map((output: any) => {
      const sumActualCost = output.activities.reduce((sum: number, act: any) => sum + (act.actualCost || 0), 0);
      const sumBudget = output.activities.reduce((sum: number, act: any) => sum + (act.budgetAtCompletion || 0), 0);
      const burnRate = sumBudget > 0 ? (sumActualCost / sumBudget) * 100 : 0;
      
      return {
        ...output,
        sumActualCost,
        sumBudget,
        burnRate: burnRate.toFixed(2),
      };
    });

    return (
        <div className="mt-5">
          <TableWithAccordion
            tableHead={head}
            tableData={burnData}
            childrenKey="activities"
            // childTableHead={childHead}
            renderRow={(row: any) => (
                <>
                <td className="px-6">{row.outputStatement ?? "-"}</td>
                <td className="px-6">₦{row.sumBudget.toLocaleString()}</td>
                <td className="px-6">₦{row.sumActualCost.toLocaleString()}</td>
                <td className="px-6">{row.burnRate}%</td>
                </>
            )}
            renderChildRow={(child: any) => (
              <>
                <td className="px-4">{child.activityStatement ?? "-"}</td>
                <td className="px-4">₦{(child.budgetAtCompletion || 0).toLocaleString()}</td>
                <td className="px-4">₦{(child.actualCost || 0).toLocaleString()}</td>
                <td className="px-4">{(child.burnRate || 0).toFixed(2)}%</td>
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
              return <BurnRateTable activities={statData?.ACTIVITY_FINANCIAL_DATA} />;
            }
          }}
        />
    </div>
  );
}

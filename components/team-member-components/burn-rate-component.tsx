"use client";

import BarChartComponent from "@/ui/bar-chart";
import TabComponent from "@/ui/tab-component";
import TableWithAccordion from "@/ui/table-with-accordion";
import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";

type OutputRow = ProjectFinancialDashboardResponse["BURN_RATE"][number];
type ActivityRow = OutputRow["activities"][number];
type BurnStatus = "Low" | "Mid" | "Normal" | "High";

// Keep x-axis labels short so every bar fits; full text stays on hover via tooltip.
const truncate = (text: string, max = 28) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

// Buckets: <50 Low, 50–69 Mid, 70–99 Normal, ≥100 High.
// The user-supplied ranges (50–60 / 70–100) had a 61–69 gap and overlapped at 100;
// these boundaries are the smallest tweak that covers every value.
function burnrateStatus(burnrate: number): BurnStatus {
  if (burnrate < 50) return "Low";
  if (burnrate < 70) return "Mid";
  if (burnrate < 100) return "Normal";
  return "High";
}

const STATUS_COLOR: Record<BurnStatus, string> = {
  Low: "text-gray-500",
  Mid: "text-amber-600",
  Normal: "text-green-600",
  High: "text-red-600",
};

const STATUS_DOT: Record<BurnStatus, string> = {
  Low: "bg-gray-400",
  Mid: "bg-amber-500",
  Normal: "bg-green-500",
  High: "bg-red-500",
};

const STATUS_PILL: Record<BurnStatus, string> = {
  Low: "bg-gray-100 text-gray-700",
  Mid: "bg-amber-100 text-amber-700",
  Normal: "bg-green-100 text-green-700",
  High: "bg-red-100 text-red-700",
};

function StatusLegend() {
  const statuses: BurnStatus[] = ["Low", "Mid", "Normal", "High"];
  return (
    <div className="flex flex-wrap items-center gap-3">
      {statuses.map((s) => (
        <div key={s} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} />
          <span className={`text-xs font-medium ${STATUS_COLOR[s]}`}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function BurnRateChart({ burnData }: { burnData: OutputRow[] }) {
  const isSingleOutput = burnData.length === 1;

  const chartData = isSingleOutput
    ? (burnData[0].activities ?? []).map((a) => {
        const full = a.activityStatement?.trim() || "Untitled activity";
        return { name: truncate(full), fullName: full, burnRate: a.burnRate ?? 0 };
      })
    : burnData.map((o) => {
        const full = o.outputStatement?.trim() || "Untitled output";
        return { name: truncate(full), fullName: full, burnRate: o.burnRate ?? 0 };
      });

  return (
    <div>
      <div className="flex justify-end mt-3">
        <StatusLegend />
      </div>
      <div className="h-75 mt-3">
        <BarChartComponent
          data={chartData}
          xKey="name"
          bars={[{ key: "burnRate", label: "Burn Rate (%)", color: "#D2091E" }]}
          legend={false}
        />
      </div>
    </div>
  );
}

function BurnRateTable({ burnData }: { burnData: OutputRow[] }) {
  const head = ["Description", "Budget", "Actual Cost", "Burn Rate", "Status"];

  return (
    <div className="mt-5">
      <TableWithAccordion<OutputRow, ActivityRow>
        tableHead={head}
        tableData={burnData}
        childrenKey="activities"
        persistKey="burn-rate-table"
        pdfTitle="Burn Rate"
        emptyStateMessage="No burn rate data"
        emptyStateSubMessage="No outputs or activities match the current filter."
        renderRow={(output) => {
          const status = burnrateStatus(output.burnRate ?? 0);
          return (
            <>
              <td className="px-6 text-sm text-gray-800 font-medium max-w-xs">
                {output.outputStatement ?? "—"}
              </td>
              <td className="px-6 text-sm text-gray-700">
                ₦{(output.totalBudget ?? 0).toLocaleString()}
              </td>
              <td className="px-6 text-sm text-gray-700">
                ₦{(output.totalSpent ?? 0).toLocaleString()}
              </td>
              <td className="px-6 text-sm text-gray-700">
                {(output.burnRate ?? 0).toFixed(2)}%
              </td>
              <td className="px-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_PILL[status]}`}>
                  {status}
                </span>
              </td>
            </>
          );
        }}
        renderChildRow={(activity) => {
          const status = burnrateStatus(activity.burnRate ?? 0);
          return (
            <>
              <td className="px-6 text-sm text-gray-700 max-w-xs">
                {activity.activityStatement?.trim() || "—"}
              </td>
              <td className="px-6 text-sm text-gray-700">
                ₦{(activity.totalBudget ?? 0).toLocaleString()}
              </td>
              <td className="px-6 text-sm text-gray-700">
                ₦{(activity.totalSpent ?? 0).toLocaleString()}
              </td>
              <td className="px-6 text-sm text-gray-700">
                {(activity.burnRate ?? 0).toFixed(2)}%
              </td>
              <td className="px-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_PILL[status]}`}>
                  {status}
                </span>
              </td>
            </>
          );
        }}
      />
    </div>
  );
}

export default function BurnRateComponent({
  burnData = [],
}: {
  burnData?: OutputRow[];
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
            return <BurnRateChart burnData={burnData} />;
          }
          return <BurnRateTable burnData={burnData} />;
        }}
      />
    </div>
  );
}

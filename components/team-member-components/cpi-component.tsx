"use client";

import BarChartComponent from "@/ui/bar-chart";
import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import TabComponent from "@/ui/tab-component";
import TableWithAccordion from "@/ui/table-with-accordion";
import Heading from "@/ui/text-heading";
import { useMemo, useState } from "react";
import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";

type OutputRow = ProjectFinancialDashboardResponse["ACTIVITY_FINANCIAL_DATA"][number];
type ActivityRow = OutputRow["activities"][number];

// Keep x-axis labels short so every bar fits; full text stays in the data as `fullName`.
const truncate = (text: string, max = 28) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

// Maps the API's cost-performance status strings to a pill / dot color set.
const CPI_PILL: Record<string, string> = {
  "UNDER BUDGET": "bg-blue-100 text-blue-700",
  "ON BUDGET": "bg-green-100 text-green-700",
  "OVER BUDGET": "bg-red-100 text-red-700",
  "NO SPENDING YET": "bg-gray-100 text-gray-700",
};

const CPI_DOT: Record<string, string> = {
  "UNDER BUDGET": "bg-blue-500",
  "ON BUDGET": "bg-green-500",
  "OVER BUDGET": "bg-red-500",
  "NO SPENDING YET": "bg-gray-400",
};

const CPI_TEXT: Record<string, string> = {
  "UNDER BUDGET": "text-blue-700",
  "ON BUDGET": "text-green-700",
  "OVER BUDGET": "text-red-700",
  "NO SPENDING YET": "text-gray-600",
};

const pillFor = (status?: string) =>
  CPI_PILL[status ?? ""] ?? "bg-gray-100 text-gray-700";

function CPIStatusLegend() {
  const statuses = ["Under Budget", "On Budget", "Over Budget", "No Spending Yet"];
  const keys = ["UNDER BUDGET", "ON BUDGET", "OVER BUDGET", "NO SPENDING YET"];
  return (
    <div className="flex flex-wrap items-center gap-3">
      {statuses.map((label, i) => (
        <div key={keys[i]} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${CPI_DOT[keys[i]]}`} />
          <span className={`text-xs font-medium ${CPI_TEXT[keys[i]]}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function CPIChart({ data }: { data: OutputRow[] }) {
  // Chart always shows one bar per activity (flattened) — filtering happens via the Output dropdown.
  const chartData = data.flatMap((output) =>
    (output.activities ?? []).map((a) => {
      const full = a.activityStatement?.trim() || "Untitled activity";
      return {
        name: truncate(full),
        fullName: full,
        cpi: a.costPerformanceIndex ?? 0,
      };
    }),
  );

  return (
    <div>
      <div className="flex justify-end mt-3">
        <CPIStatusLegend />
      </div>
      <div className="h-75 mt-3">
        <BarChartComponent
          data={chartData}
          xKey="name"
          bars={[{ key: "cpi", label: "CPI", color: "#0047AB" }]}
          legend={false}
        />
      </div>
    </div>
  );
}

function CPITable({ data }: { data: OutputRow[] }) {
  const head = ["Description", "Cost Variance", "CPI", "Status"];

  return (
    <div className="mt-5">
      <TableWithAccordion<OutputRow, ActivityRow>
        tableHead={head}
        tableData={data}
        childrenKey="activities"
        persistKey="cpi-table"
        pdfTitle="Cost Performance Index"
        emptyStateMessage="No CPI data"
        emptyStateSubMessage="No activities match the current filter."
        renderRow={(output) => (
          <>
            <td className="px-6 text-sm text-gray-800 font-medium">
              {output.outputStatement ?? "—"}
            </td>
            <td className="px-6" />
            <td className="px-6" />
            <td className="px-6" />
          </>
        )}
        renderChildRow={(activity) => {
          const status = activity.costPerformanceStatus ?? "—";
          return (
            <>
              <td className="px-6 text-sm text-gray-700 max-w-xs">
                {activity.activityStatement?.trim() || "—"}
              </td>
              <td className="px-6 text-sm text-gray-700">
                ₦{(activity.costVariance ?? 0).toLocaleString()}
              </td>
              <td className="px-6 text-sm text-gray-700">
                {(activity.costPerformanceIndex ?? 0).toFixed(2)}
              </td>
              <td className="px-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pillFor(status)}`}>
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

export default function CPIComponent({
  data = [],
  outputOptions = [],
}: {
  data?: OutputRow[];
  outputOptions?: { label: string; value: string }[];
}) {
  const [selectedOutputId, setSelectedOutputId] = useState<string>("");

  const filteredData = useMemo(() => {
    if (!selectedOutputId) return data;
    return data.filter((o) => o.outputId === selectedOutputId);
  }, [data, selectedOutputId]);

  return (
    <CardComponent>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <Heading
          heading="Cost Performance Index (CPI)"
          subtitle="Budget performance by output and activity"
        />
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="w-full sm:w-64">
            <DropDown
              label="Output"
              name="cpi-output"
              placeholder="All Outputs"
              value={selectedOutputId}
              onChange={(val: string) => setSelectedOutputId(val)}
              options={outputOptions}
            />
          </div>
          <DateRangePicker label="Date Range" />
        </div>
      </div>

      <div className="mt-5">
        <TabComponent
          data={[
            { tabName: "Chart", id: 1 },
            { tabName: "Table", id: 2 },
          ]}
          persistKey="cpi-tabs"
          renderContent={(rowId) => {
            if (rowId === 1) return <CPIChart data={filteredData} />;
            return <CPITable data={filteredData} />;
          }}
        />
      </div>
    </CardComponent>
  );
}

"use client";

import Table from "@/ui/table";
import { ProjectResultResponse } from "@/types/project-result-dashboard";

const head = [
  "Code",
  "Indicator",
  "Baseline",
  "Target",
  "Actual",
  "Performance",
  "Status",
];

export default function TableSection({
  data,
}: {
  data?: ProjectResultResponse["KPI_TABLE_DATA"];
}) {

  return (
    <section>
      <Table
        tableHead={head}
        tableData={data}
        renderRow={(row: any) => {
          return (
            <>
              <td className="px-6 text-xs md:text-sm">{row.code || "-"}</td>
              <td className="px-6 text-xs md:text-sm">{row.statement ?? "-"}</td>
              <td className="px-6 text-xs md:text-sm">{row.baseline ?? "-"}</td>
              <td className="px-6 text-xs md:text-sm">{row.target ?? "-"}</td>
              <td className="px-6 text-xs md:text-sm">{row.actual ?? "-"}</td>
              <td className="px-6 text-xs md:text-sm">{row.performance ?? 0}%</td>
              <td
                className={`${
                  row.status === "Met" ? "text-[#22C55E]" : "text-[#EAB308]"
                } px-6 text-xs md:text-sm`}>
                {row.status || "-"}
              </td>
            </>
          );
        }}
      />
    </section>
  );
}

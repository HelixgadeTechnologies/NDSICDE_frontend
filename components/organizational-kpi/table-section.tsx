"use client";

import Table from "@/ui/table";

const head = [
  "Code",
  "Indicator",
  "Baseline",
  "Target",
  "Actual",
  "Performance",
  "Status",
];

const data = [
  {
    code: "EDU-01",
    indicator: "Number of students enrolled",
    baseline: 500,
    target: 450,
    actual: 4500,
    performance: 90,
    status: "Partially Met",
  },
  {
    code: "EDU-02",
    indicator: "Percentage of students completing training",
    baseline: 85,
    target: 88,
    actual: 4500,
    performance: 103,
    status: "Met",
  },
  {
    code: "HEALTH-01",
    indicator: "Number of beneficiaries receiving health services",
    baseline: 5000,
    target: 3800,
    actual: 4500,
    performance: 76,
    status: "Partially Met",
  },
];

export default function TableSection() {

  return (
    <section>
      <Table
        tableHead={head}
        tableData={data}
        renderRow={(row) => {
          return (
            <>
              <td className="px-6 text-xs md:text-sm">{row.code}</td>
              <td className="px-6 text-xs md:text-sm">{row.indicator}</td>
              <td className="px-6 text-xs md:text-sm">{row.baseline}</td>
              <td className="px-6 text-xs md:text-sm">{row.target}</td>
              <td className="px-6 text-xs md:text-sm">{row.actual}</td>
              <td className="px-6 text-xs md:text-sm">{row.performance}%</td>
              <td
                className={`${
                  row.status === "Met" ? "text-[#22C55E]" : "text-[#EAB308]"
                } px-6 text-xs md:text-sm`}>
                {row.status}
              </td>
            </>
          );
        }}
      />
    </section>
  );
}

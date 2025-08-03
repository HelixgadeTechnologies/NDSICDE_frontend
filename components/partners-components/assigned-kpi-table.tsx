"use client";

import Table from "@/ui/table";
import CardComponent from "@/ui/card-wrapper";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";

export default function AssignedKPITable() {
  const head = [
    "KPI Name",
    "Type",
    "Baseline",
    "Target",
    "Date Created",
    "Status",
    "Actions",
  ];

  const data = [
    {
      id: 1,
      kpiName: " Percentage of household withheld.",
      type: "Outcome",
      baseline: 45,
      target: 75,
      dateCreated: "May 15, 2023 10:30",
      status: "Active",
    },
    {
      id: 2,
      kpiName: " Percentage of household withheld.",
      type: "Outcome",
      baseline: 45,
      target: 75,
      dateCreated: "May 15, 2023 10:30",
      status: "Inactive",
    },
  ];

  return (
    <CardComponent>
      <div className="absolute top-28 right-10 w-[250px]">
        <Button
          content="New KPI"
          icon="si:add-fill"
          href="/partners/kpi-reporting/new-kpi"
        />
      </div>
      <Table
        tableHead={head}
        tableData={data}
        checkbox
        idKey={"id"}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.kpiName}</td>
            <td className="px-6">{row.type}</td>
            <td className="px-6">{row.baseline}%</td>
            <td className="px-6">{row.target}%</td>
            <td className="px-6">{row.dateCreated}</td>
            <td
              className={`px-6 ${
                row.status === "Active" ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {row.status}
            </td>
            <td className="pl-10 relative">
              <Icon
                icon={"uiw:more"}
                width={22}
                height={22}
                className="cursor-pointer"
                color="#909CAD"
              />
            </td>
          </>
        )}
      />
    </CardComponent>
  );
}

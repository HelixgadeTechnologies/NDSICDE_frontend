"use client";

import Table from "@/ui/table";
import { Icon } from "@iconify/react";

export default function RetirementRequest() {
  const RRHead = [
    "Activity Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost(₦)",
    "Total Budget(₦)",
    "Actual Cost(₦)",
    "Status",
    "Actions",
  ];

  const RRData = [
    {
      id: 1,
      activityLineDesc: "Accomodation",
      quantity: 2,
      frequency: 3,
      unitCost: "30,000",
      totalBudget: "180,000",
      actualCost: "240,000",
      status: "Pending",
    },
    {
      id: 2,
      activityLineDesc: "Accomodation",
      quantity: 2,
      frequency: 3,
      unitCost: "30,000",
      totalBudget: "180,000",
      actualCost: "240,000",
      status: "Approved",
    },
    {
      id: 3,
      activityLineDesc: "Accomodation",
      quantity: 2,
      frequency: 3,
      unitCost: "30,000",
      totalBudget: "180,000",
      actualCost: "240,000",
      status: "Rejected",
    },
  ];

  return (
    <Table
      tableHead={RRHead}
      tableData={RRData}
      idKey={"id"}
      checkbox
      renderRow={(row) => (
        <>
          <td className="px-6">{row.activityLineDesc}</td>
          <td className="px-6">{row.quantity}</td>
          <td className="px-6">{row.frequency}</td>
          <td className="px-6">{row.unitCost}</td>
          <td className="px-6">{row.totalBudget}</td>
          <td className="px-6">{row.actualCost}</td>
          <td
            className={`px-6 ${
              row.status === "Approved"
                ? "text-green-500"
                : row.status === "Pending"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {row.status}
          </td>
          <td className="px-6">
            <Icon
              icon={"hugeicons:view"}
              height={20}
              width={20}
              className="cursor-pointer"
            />
          </td>
        </>
      )}
    />
  );
}

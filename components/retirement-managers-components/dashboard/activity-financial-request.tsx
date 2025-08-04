"use client";

import Table from "@/ui/table";
import { Icon } from "@iconify/react";

export default function ActivityFinancialRequest() {
    const AFRHead = [
      "Activity Description",
      "Total Budget(₦)",
      "Responsible Person(s)",
      "Start Date",
      "End Date",
      "Status",
      "Actions",
    ];
    
    const AFRData = [
      {
        id: 1,
        activityDesc: "Meeting with stakeholders in Akwa Ibom",
        totalBudget: "500,000",
        responsiblePerson: "Ifeoma",
        startDate: "12/03/2024",
        endDate: "12/03/2024",
        status: "Pending",
      },
      {
        id: 2,
        activityDesc: "Meeting with stakeholders in Akwa Ibom",
        totalBudget: "500,000",
        responsiblePerson: "Ifeoma",
        startDate: "12/03/2024",
        endDate: "12/03/2024",
        status: "Approved",
      },
      {
        id: 3,
        activityDesc: "Meeting with stakeholders in Akwa Ibom",
        totalBudget: "500,000",
        responsiblePerson: "Ifeoma",
        startDate: "12/03/2024",
        endDate: "12/03/2024",
        status: "Rejected",
      },
    ];

    return (
        <Table
      tableHead={AFRHead}
      tableData={AFRData}
      idKey={"id"}
      checkbox
      renderRow={(row) => (
        <>
          <td className="px-6">{row.activityDesc}</td>
          <td className="px-6">{row.totalBudget}</td>
          <td className="px-6">{row.responsiblePerson}</td>
          <td className="px-6">{row.startDate}</td>
          <td className="px-6">{row.endDate}</td>
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
    )
}
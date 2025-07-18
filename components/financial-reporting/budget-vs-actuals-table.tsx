"use client";

import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import { typeChecker } from "@/utils/ui";

export default function BudgetVSActuals() {
  const head = [
    "Project Name",
    "Approved Budget",
    "Actual Expenses",
    "Variance Amount",
    "Variance (%)",
    "Actions",
  ];

  const data = [
    {
      id: 1,
      projectName: "Digital Transformation",
      approvedBudget: "350,000",
      actualExpenses: "320,000",
      varianceAmount: "30,000",
      variance: "8.57",
      status: "Under Budget",
    },
    {
      id: 2,
      projectName: "Digital Transformation",
      approvedBudget: "350,000",
      actualExpenses: "320,000",
      varianceAmount: "30,000",
      variance: "8.57",
      status: "Over Budget",
    },
    {
      id: 3,
      projectName: "Digital Transformation",
      approvedBudget: "350,000",
      actualExpenses: "320,000",
      varianceAmount: "30,000",
      variance: "8.57",
      status: "On Track",
    },
  ];
  return (
    <CardComponent>
      <Heading heading="Budget vs. Actuals" />
      <div className="mt-5">
        <Table
            tableHead={head}
            tableData={data}
            checkbox
            idKey="id"
            renderRow={(row) => {
            return (
                <>
                <td className="px-6">{row.projectName}</td>
                <td className="px-6">${row.approvedBudget}</td>
                <td className="px-6">${row.actualExpenses}</td>
                <td className="px-6">${row.varianceAmount}</td>
                <td className="px-6">{row.variance}%</td>
                <td className={typeChecker(row)}>{row.status}</td>
                </>
            );
            }}
        />
      </div>
    </CardComponent>
  );
}

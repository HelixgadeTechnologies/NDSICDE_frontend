"use client";

import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import { typeChecker } from "@/utils/ui-utility";

interface BudgetVSActualsProps {
  data: {
    projectId: string;
    projectName: string;
    approvedExpenses: number;
    actualExpenses: number;
    varianceAmount: number;
    variancePercentage: number;
    status: string;
  }[];
}

export default function BudgetVSActuals({ data }: BudgetVSActualsProps) {
  const head = [
    "Project Name",
    "Approved Budget",
    "Actual Expenses",
    "Variance Amount",
    "Variance (%)",
    "Status",
  ];

  return (
    <CardComponent>
      <Heading heading="Budget vs. Actuals" />
      <div className="mt-5">
        <Table
          tableHead={head}
          tableData={data || []}
          checkbox
          idKey="projectId"
          renderRow={(row) => {
            return (
              <>
                <td className="px-6">{row.projectName}</td>
                <td className="px-6">₦{row.approvedExpenses.toLocaleString()}</td>
                <td className="px-6">₦{row.actualExpenses.toLocaleString()}</td>
                <td className="px-6">₦{row.varianceAmount.toLocaleString()}</td>
                <td className="px-6">{row.variancePercentage}%</td>
                <td className={typeChecker(row)}>{row.status}</td>
              </>
            );
          }}
        />
      </div>
    </CardComponent>
  );
}


"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import {
  expenseCategoriesBreakdown,
  budgetVSActualSpending,
  ECBColors,
} from "@/lib/config/charts";
import PieChartComponent from "../../ui/pie-chart";
import BarChartComponent from "../../ui/bar-chart";
import Table from "@/ui/table";
import { typeChecker } from "@/utils/ui";

export default function FinancialPerformance() {

  const bars = [
    { key: "budget", label: "Budget", color: "#003B99" },
    { key: "actual", label: "Actual", color: "#D2091E" },
  ];

  const head = [
    "Project",
    "Budget",
    "Actual",
    "Variance",
    "Deviation",
    "Status",
  ];

  const data = [
    {
      project: "Project Alpha",
      budget: 125.0,
      actual: 118.75,
      variance: 6.25,
      deviation: "5.0",
      status: "Under Budget",
    },
    {
      project: "Project Alpha",
      budget: 125.0,
      actual: 118.75,
      variance: 6.25,
      deviation: "5.0",
      status: "Over Budget",
    },
    {
      project: "Project Alpha",
      budget: 125.0,
      actual: 118.75,
      variance: 6.25,
      deviation: "5.0",
      status: "On Track",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* budget vs actual spending */}
        <div className="w-full md:w-[65%]">
          <CardComponent>
            <div className="flex justify-between items-start">
              <Heading heading="Budget vs. Actual Spending" />
            </div>
            <div className="h-[530px]">
              <BarChartComponent
                data={budgetVSActualSpending}
                bars={bars}
                xKey="name"
              />
            </div>
          </CardComponent>
        </div>

        {/* project status distribution */}
        <div className="w-full md:w-[35%]">
          <CardComponent>
            <div className="flex justify-between items-start">
              <Heading
                heading="Expense Categories Breakdown"
                subtitle="Distribution by category"
              />
            </div>
            <PieChartComponent
              data={expenseCategoriesBreakdown}
              colors={ECBColors}
            />
          </CardComponent>
        </div>
      </div>

      <CardComponent>
        <Heading
          heading="Financial Variance Analysis"
          subtitle="Showing % deviation from budget"
        />

        <div className="mt-4">
          <Table
            tableHead={head}
            tableData={data}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.project}</td>
                <td className="px-6">${row.budget}</td>
                <td className="px-6">${row.actual}</td>
                <td className={typeChecker(row)}>${row.variance}</td>
                <td className={typeChecker(row)}>
                  {row.status === "Over Budget" || "On Track" ? "+" : "-"}{" "}
                  {row.deviation}%
                </td>
                <td className={typeChecker(row)}>{row.status}</td>
              </>
            )}
          />
        </div>
      </CardComponent>
    </section>
  );
}

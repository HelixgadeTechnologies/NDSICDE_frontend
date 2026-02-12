"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import PieChartComponent from "../../../ui/pie-chart";
import { ECBColors, expenseCategoriesBreakdown } from "@/lib/config/charts";
import LineChartComponent from "@/ui/line-chart";

export default function BudgetVSExpenditureTrends() {
  const lines = [
    { key: "budget", label: "Budget", color: "#003B99" },
    { key: "expenditure", label: "Expenditure", color: "#EF4444" },
  ];

  const data = [
    { name: "Jan", budget: 0, expenditure: 0 },
    { name: "Feb", budget: 0, expenditure: 0 },
    { name: "Mar", budget: 0, expenditure: 0 },
    { name: "Apr", budget: 0, expenditure: 0 },
    { name: "May", budget: 0, expenditure: 0 },
    { name: "Jun", budget: 0, expenditure: 0 },
    { name: "Jul", budget: 0, expenditure: 0 },
    { name: "Aug", budget: 0, expenditure: 0 },
    { name: "Sep", budget: 0, expenditure: 0 },
    { name: "Oct", budget: 0, expenditure: 0 },
    { name: "Nov", budget: 0, expenditure: 0 },
    { name: "Dec", budget: 0, expenditure: 0 },
  ];

  return (
    <section className="flex gap-6">
      <div className="w-[65%]">
        <CardComponent>
          <Heading
            heading="Budget vs. Expenditure Trends"
            subtitle="Monthly comparison of budget allocation and actual expenses"
          />
          <div className="h-127.5">
            <LineChartComponent data={data} lines={lines} xKey="name" legend />
          </div>
        </CardComponent>
      </div>
      <div className="w-[35%]">
        <CardComponent>
          <Heading
            heading="Expense Breakdown"
            subtitle="Distribution by category"
          />
          <PieChartComponent
            data={expenseCategoriesBreakdown}
            colors={ECBColors}
          />
        </CardComponent>
      </div>
    </section>
  );
}

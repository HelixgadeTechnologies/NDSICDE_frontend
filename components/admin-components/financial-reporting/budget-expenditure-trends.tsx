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
    { name: "Jan", budget: 6000, expenditure: 4500 },
    { name: "Feb", budget: 5000, expenditure: 10000 },
    { name: "Mar", budget: 5000, expenditure: 1500 },
    { name: "Apr", budget: 6000, expenditure: 5000 },
    { name: "May", budget: 3000, expenditure: 7000 },
    { name: "Jun", budget: 10000, expenditure: 7000 },
    { name: "Jul", budget: 9000, expenditure: 6000 },
    { name: "Aug", budget: 10000, expenditure: 2000 },
    { name: "Sep", budget: 4000, expenditure: 8000 },
    { name: "Oct", budget: 5000, expenditure: 3000 },
    { name: "Nov", budget: 2000, expenditure: 4000 },
    { name: "Dec", budget: 6000, expenditure: 1000 },
  ];

  return (
    <section className="flex gap-6">
      <div className="w-[65%]">
        <CardComponent>
          <Heading
            heading="Budget vs. Expenditure Trends"
            subtitle="Monthly comparison of budget allocation and actual expenses"
          />
          <div className="h-[510px]">
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

"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import PieChartComponent from "../../../ui/pie-chart";
import { ECBColors } from "@/lib/config/charts";
import LineChartComponent from "@/ui/line-chart";

interface BudgetVSExpenditureTrendsProps {

  budgetTrends: { name: string; budget: number; expenditure: number; [key: string]: unknown }[];
  expenseBreakdown: { name: string; value: number; [key: string]: unknown }[];
}


export default function BudgetVSExpenditureTrends({
  budgetTrends,
  expenseBreakdown,
}: BudgetVSExpenditureTrendsProps) {

  const lines = [
    { key: "budget", label: "Budget", color: "#003B99" },
    { key: "expenditure", label: "Expenditure", color: "#EF4444" },
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
            <LineChartComponent data={budgetTrends || []} lines={lines} xKey="name" legend />
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
            data={expenseBreakdown || []}
            colors={ECBColors}
          />
        </CardComponent>
      </div>
    </section>
  );
}


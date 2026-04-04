"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import LineChartComponent from "@/ui/line-chart";
import PieChartComponent from "@/ui/pie-chart";
import { ECBColors } from "@/lib/config/charts";
import { useEffect, useState } from "react";
import axios from "axios";

type BudgetTrends = {
  month: string;
  year: number;
  budget: number;
  expenditure: number;
}

type ExpenseBreakdown = {
  category: string;
  amount: number;
  percentage: number;
}


export default function BudgetVSExpenditureTrends() {
  const [budgetTrends, setBudgetTrends] = useState<BudgetTrends[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown[]>([]);

  useEffect(() => {
    const fetchBudgetTrends = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/financial-dashboard/budget-trends`);
        setBudgetTrends(response.data.data);
      } catch (error) {
        console.error("Error fetching budget trends:", error);
      }
    };

    const fetchExpenseBreakdown = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/financial-dashboard/expense-breakdown`);
        setExpenseBreakdown(response.data.data);
      } catch (error) {
        console.error("Error fetching expense breakdown:", error);
      }
    };

    fetchBudgetTrends();
    fetchExpenseBreakdown();
  }, [])

  return (
    <section className="flex gap-6">
      <div className="w-[65%]">
        <CardComponent>
          <Heading
            heading="Budget vs. Expenditure Trends"
            subtitle="Monthly comparison of budget allocation and actual expenses"
          />
          <div className="h-127.5">
            <LineChartComponent
              data={budgetTrends}
              lines={[
                { key: "budget", label: "Budget", color: "#003B99" },
                { key: "expenditure", label: "Expenditure", color: "#EF4444" }
              ]}
              xKey="month"
              legend
            />
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
            data={expenseBreakdown.map(item => ({ name: item.category, value: item.percentage }))} 
            colors={ECBColors} 
          />
        </CardComponent>
      </div>
    </section>
  );
}


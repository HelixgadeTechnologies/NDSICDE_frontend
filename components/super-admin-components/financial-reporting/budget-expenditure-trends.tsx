"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
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
            {budgetTrends && budgetTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={budgetTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", fontSize: "0.875rem", textTransform: "capitalize" }} 
                    labelStyle={{ fontWeight: "bold", color: "#374151" }} 
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle" 
                    iconSize={10} 
                    formatter={(value) => <span className="text-sm text-gray-700 capitalize">{value}</span>}
                  />
                  <Line type="linear" dataKey="budget" name="Budget" stroke="#003B99" strokeWidth={2} dot={{ fill: "#003B99", r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="linear" dataKey="expenditure" name="Expenditure" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50 border border-gray-100 border-dashed rounded-lg">
                <p>No budget trends data available yet.</p>
              </div>
            )}
          </div>
        </CardComponent>
      </div>
      <div className="w-[35%]">
        <CardComponent>
          <Heading
            heading="Expense Breakdown"
            subtitle="Distribution by category"
          />
          {expenseBreakdown && expenseBreakdown.length > 0 ? (
            <>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseBreakdown} dataKey="percentage" nameKey="category">
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ECBColors[index % ECBColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "0.875rem", borderRadius: "6px", textTransform: "capitalize" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {expenseBreakdown.map((p, i) => (
                  <div key={i} className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ECBColors[i % ECBColors.length] }}></span>
                      <span className="text-sm text-gray-500">{p.category}</span>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{p.percentage}%</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] mt-4 text-gray-500 bg-gray-50 border border-gray-100 border-dashed rounded-lg">
              <p>No expense breakdown data available yet.</p>
            </div>
          )}
        </CardComponent>
      </div>
    </section>
  );
}


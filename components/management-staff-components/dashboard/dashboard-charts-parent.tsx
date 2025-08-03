"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import LineChartComponent from "@/ui/line-chart";
import { PieChart, ResponsiveContainer, Pie, Cell } from "recharts";

export default function DashboardCharts() {
  const lines = [
    { key: "budget", label: "Budget", color: "#003B99" },
    { key: "expenditure", label: "Expenditure", color: "#EF4444" },
  ];

  const lineData = [
    { name: "Jan", budget: 60, expenditure: 70 },
    { name: "Feb", budget: 90, expenditure: 48 },
    { name: "Mar", budget: 40, expenditure: 60 },
    { name: "Apr", budget: 50, expenditure: 80 },
    { name: "May", budget: 55, expenditure: 55 },
    { name: "Jun", budget: 80, expenditure: 60 },
  ];

  const budgetUilization = [
    { name: "Spent", value: 33 },
    { name: "Remaining", value: 63 },
  ];

  const BU = ["#D2091E", "#003B99"];

  const projectStatus = [
    { name: "Active", value: 43 },
    { name: "On Hold", value: 40 },
    { name: "Completed", value: 17 },
  ];

  const PS = ["#22C55E", "#D2091E", "#003B99"];

  return (
    <section className="flex gap-4 items-start">
      <div className="w-3/5">
        <CardComponent>
          <Heading heading="KPI Performance" />
          <div className="h-[450px]">
            <LineChartComponent
              lines={lines}
              data={lineData}
              legend
              xKey="name"
            />
          </div>
        </CardComponent>
      </div>
      <div className="w-2/5 space-y-4">
        <CardComponent>
          <Heading
            heading="Budget Utilization"
            subtitle="Spent vs Remaining"
            className="text-center"
          />
          <div className="flex items-center justify-between">
            <div className="h-[140px] w-[50%]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={budgetUilization}>
                    {budgetUilization.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={BU[index % BU.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-[50%]">
              {budgetUilization.map((p, i) => (
                <div
                  key={i}
                  className="w-full flex justify-between items-center"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: BU[i % BU.length] }}
                    ></span>
                    <span className="text-sm text-gray-500">{p.name}</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">
                    {p.value}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardComponent>
        <CardComponent>
          <Heading
            heading="Project Status"
            subtitle="Distribution by status"
            className="text-center"
          />
          <div className="flex items-center justify-between">
            <div className="h-[140px] w-[50%]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={projectStatus}>
                    {projectStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={PS[index % PS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-[50%]">
              {projectStatus.map((p, i) => (
                <div
                  key={i}
                  className="w-full flex justify-between items-center"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: PS[i % PS.length] }}
                    ></span>
                    <span className="text-sm text-gray-500">{p.name}</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">
                    {p.value}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardComponent>
      </div>
    </section>
  );
}

"use client";

import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import LineChartComponent from "@/ui/line-chart";
import Heading from "@/ui/text-heading";
import { PieChart, ResponsiveContainer, Pie, Cell } from "recharts";
import { useState } from "react";
import ImplementationTimeAnalysisComponent from "./ita-component";
import CPIComponent from "./cpi-component";
import SPIComponnet from "./spi-component";


export default function ActivityOverview() {

  const budgetUilization = [
    { name: "Due to Start", value: 23 },
    { name: "In Progress(Early Start)", value: 14 },
    { name: "In Progress(Late Start)", value: 23 },
    { name: "Future Activity", value: 20 },
    { name: "Completed Early", value: 10 },
    { name: "Completed Late", value: 10 },
  ];

  const BUColors = ["#22C55E", "#EF4444", "#EAB308", "#003B99", "#98A2B3", "#000000"];

  const burnRate = [
    { normal: 60, name: "Target 1" },
    { normal: 70, name: "Target 2" },
    { normal: 50, name: "Target 3" },
    { normal: 85, name: "Target 4" },
    { normal: 55, name: "Target 5" },
    { normal: 70, name: "Target 6" },
  ];


  return (
    <>
      {/* activity overview */}
      <CardComponent>
        <Heading
          heading="Activity Overview"
          subtitle="Breakdown of activities by current activities"
        />
        <div className="flex items-center justify-between px-10">
          <div className="h-[400px] w-[50%]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={budgetUilization}>
                  {budgetUilization.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={BUColors[index % BUColors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 w-[50%]">
            {budgetUilization.map((p, i) => (
              <div key={i} className="w-full flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: BUColors[i % BUColors.length] }}
                  ></span>
                  <span className="text-sm text-gray-500">{p.name}</span>
                </div>
                <p className="font-medium text-gray-900 text-sm">{p.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </CardComponent>

      {/* implementation time analysis */}
     <ImplementationTimeAnalysisComponent/>

      {/* burn rate */}
      <CardComponent>
        {/* heading and filters */}
        <div className="flex items-end justify-between gap-4">
          <Heading heading="Burn Rate" subtitle="Percentage of target achieved" />
          <div className="flex gap-4 iteems-end">
            <DropDown
            label="Output"
            name="output"
            placeholder="All Output"
            value=""
            onChange={() => {}}
            options={[]}
            />
            <DropDown
            label="Activity"
            name="activity"
            placeholder="All Activity"
            value=""
            onChange={() => {}}
            options={[]}
            />
            <DateRangePicker label="Date Range"/>
          </div>
        </div>

          {/* line graph */}
        <div className="h-[260px] mt-5">
          <LineChartComponent data={burnRate} lines={[ { key: "normal", label: "Normal", color: "#D2091E" }, ]} xKey="name" />
        </div>
      </CardComponent>

        <CPIComponent/>

        <SPIComponnet/>
    </>
  );
}

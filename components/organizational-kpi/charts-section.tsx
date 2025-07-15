"use client";

import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import { useOrgKPIFormState } from "@/store/organizational-kpi-store";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"; 

export default function ChartsComponent() {
    const { 
        allStrategicObjective, 
        indicators, 
        resultLevel, 
        disaggregation, 
        setField,
    } = useOrgKPIFormState();

    const data = [
        {
            name: "EDU 01",
            baseline: 68,
            target: 95,
            actual: 50,
        },
        {
            name: "EDU 02",
            baseline: 45,
            target: 70,
            actual: 17,
        },
        {
            name: "HEALTH 01",
            baseline: 44,
            target: 70,
            actual: 27,
        },
        {
            name: "HEALTH 02",
            baseline: 44,
            target: 70,
            actual: 25,
        },
        {
            name: "INFRA 01",
            baseline: 60,
            target: 20,
            actual: 30,
        },
        {
            name: "INFRA 02",
            baseline: 35,
            target: 25,
            actual: 28,
        },
    ];

  return (
    <section>
      {/* when api comes, add this on shared parent component if needed */}
      <div className="flex flex-col md:flex-row mb-5 gap-4 md:items-center w-full mt-10">
        <DropDown
          label="Strategic Objective"
          value={allStrategicObjective}
          placeholder="Strategic Objective"
          name="allStrategicObjective"
          onChange={(value: string) => setField("allStrategicObjective", value)}
          options={[]}
        />
        <DropDown
          label="Result Level"
          value={resultLevel}
          placeholder="Impact"
          name="resultLevel"
          onChange={(value: string) => setField("resultLevel", value)}
          options={[]}
        />
        <DropDown
          label="Indicators"
          value={indicators}
          placeholder="All Indicators"
          name="indicators"
          onChange={(value: string) => setField("indicators", value)}
          options={[]}
        />
        <DateRangePicker label="Date Range" />
        <DropDown
          label="Disaggregation"
          value={disaggregation}
          placeholder="Sex"
          name="disaggregation"
          onChange={(value: string) => setField("disaggregation", value)}
          options={[]}
        />
      </div>

        <CardComponent>
            <Heading heading="Key Performance Indicator Overview" />
            <div className="h-[417px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barCategoryGap={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{ fontSize: "0.875rem", borderRadius: "6px", textTransform: "capitalize" }}
                        labelStyle={{ fontWeight: 600 }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        iconSize={10}
                        formatter={(value) => (
                        <span className="text-sm text-gray-700 capitalize">{value}</span>
                        )}
                    />
                    <Bar dataKey="baseline" fill="#003B99" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#D2091E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </CardComponent>
    </section>
  );
}

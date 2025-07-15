"use client";

import CardComponent from "@/ui/card";
import TabComponent from "@/components/tab-component";
import TableSection from "./table-section";
import ChartsComponent from "./charts-section";
import Heading from "@/ui/text-heading";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ChartsAndTableParent() {
  const tabs = [
    { tabName: "Charts", id: 1 },
    { tabName: "Table", id: 2 },
  ];

  const data = [
    { code: "EDU 01", value: 70 },
    { code: "EDU 02", value: 100 },
    { code: "HEALTH 01", value: 35 },
    { code: "HEALTH 02", value: 75 },
    { code: "INFRA 01", value: 50 },
    { code: "INFRA 02", value: 90 },
  ];
  return (
    <div className="space-y-5">
        {/* tabs */}
      <CardComponent>
        <TabComponent
          width="80"
          data={tabs}
          renderContent={(tabId) => {
            if (tabId === 1) {
              return <ChartsComponent />;
            } else {
              return <TableSection />;
            }
          }}
        />
      </CardComponent>

      {/* card and lower chart */}
      <CardComponent>
        <div className="flex justify-between items-center mb-5">
          <Heading
            heading="Project Indicator Performance (%)"
            subtitle="Percentage of target achieved"
          />
          <div className="w-[356px]">
            <CardComponent>
              <div className="flex items-center gap-1.5">
                <span className="bg-[#003B99] h-2 w-2 rounded-full"></span>
                <p className="text-gray-500 text-xs">Performance</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[15px]">
                  Average Performance for Project:
                </span>
                <span className="font-semibold text-shadow-gray-900 text-2xl">
                  200
                </span>
              </div>
            </CardComponent>
          </div>
        </div>

        {/* line chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="code"
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
                contentStyle={{ borderRadius: "8px", fontSize: "0.875rem", textTransform: "capitalize" }}
                labelStyle={{ fontWeight: "bold", color: "#374151" }}
              />
              <Line
                dataKey="value"
                stroke="#003B99"
                strokeWidth={2}
                dot={{ fill: "#003B99", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardComponent>
    </div>
  );
}

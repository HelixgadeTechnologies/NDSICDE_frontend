"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

type Item = {
  label: string;
  value: number;
};

type BarChartSingleColoredProps = {
  data: Item[];
};

const COLORS = ["#22C55E", "#3B82F6", "#EF4444", "#FACC15"]; // green, blue, red, yellow

export default function BarChartSingleColored({
  data,
}: BarChartSingleColoredProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis
          dataKey="label"
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
          contentStyle={{
            fontSize: "0.875rem",
            borderRadius: "6px",
            textTransform: "capitalize",
          }}
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
        <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Value">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type MeterPieChartProps = {
  performance: number;
  size?: "sm" | "md" | "lg";
};

export default function MeterPieChart({ performance, size = "sm" }: MeterPieChartProps) {
  const perf = performance ?? 0;
  const data = [
    { name: "Performance", value: perf },
    { name: "Remaining", value: Math.max(0, 100 - perf) }
  ];
  
  const sizeClasses = {
    sm: { wrapper: "h-28 w-40", chartWrapper: "h-20 w-32", innerRadius: 25, outerRadius: 35, text: "text-[15px]", label: "text-[10px]" },
    md: { wrapper: "h-36 w-48", chartWrapper: "h-28 w-40", innerRadius: 40, outerRadius: 55, text: "text-2xl", label: "text-xs" },
    lg: { wrapper: "h-48 w-64", chartWrapper: "h-40 w-56", innerRadius: 60, outerRadius: 80, text: "text-4xl", label: "text-sm" }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.wrapper} relative flex flex-col items-center`}>
      <div className={`${currentSize.chartWrapper} relative`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={currentSize.innerRadius}
              outerRadius={currentSize.outerRadius}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#22C55E" />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className={`font-bold text-gray-700 ${currentSize.text}`}>{perf}%</span>
        </div>
      </div>
      <p className={`font-medium text-gray-400 uppercase tracking-wider mt-1 ${currentSize.label}`}>Performance</p>
    </div>
  );
}

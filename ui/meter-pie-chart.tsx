"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type MeterPieChartProps = {
  performance: number;
};

export default function MeterPieChart({ performance }: MeterPieChartProps) {
  const perf = performance ?? 0;
  const data = [
    { name: "Performance", value: perf },
    { name: "Remaining", value: Math.max(0, 100 - perf) }
  ];
  
  return (
    <div className="h-28 w-40 relative flex flex-col items-center">
      <div className="h-20 w-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={25}
              outerRadius={35}
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
          <span className="text-[15px] font-bold text-gray-700">{perf}%</span>
        </div>
      </div>
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">Performance</p>
    </div>
  );
}

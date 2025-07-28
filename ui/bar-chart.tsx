"use client";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell,
} from "recharts";

type BarChartProps = {
  data: Record<string, unknown>[];
  // for grouped bars, each bar should have a key, label, and color
  bars?: {
    key: string;
    label?: string;
    color: string;
  }[];
  xKey: string;
  legend?: boolean;
  // for single bar charts
  isSingleBar?: boolean;
  colors?: string[];
  labels?: string[];
};

export default function BarChartComponent({
  data,
  bars,
  xKey,
  legend = true,
  isSingleBar = false,
  colors,
  labels,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barCategoryGap={20}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#E5E7EB"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
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
        {/* legend for grouped bars */}
        {legend && bars && (
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-sm text-gray-700 capitalize">{value}</span>
            )}
          />
        )}
        {/* legend on single bars */}
      {legend && isSingleBar && colors && (
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={10}
            content={() => (
              <ul
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  gap: "1rem",
                  margin: 0,
                  padding: "0.5rem 1rem 0 0",
                  marginBottom: 5,
                }}
              >
                {colors.map((color, index) => (
                  <li
                    key={color + index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      listStyle: "none",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: color,
                        marginRight: 6,
                      }}
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {labels?.[index] || `Label ${index + 1}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          />
        )}

        {isSingleBar && colors ? (
          <Bar dataKey="value" name="" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        ) : (
          bars &&
          bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              fill={bar.color}
              name={bar.label || bar.key}
              radius={[4, 4, 0, 0]}
            />
          ))
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

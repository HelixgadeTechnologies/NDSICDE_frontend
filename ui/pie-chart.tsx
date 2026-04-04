import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import EmptyChartState from "./empty-chart-state";

type P = {
  name: string;
  value: number;
}

type PieChartProps = {
  data: Array<P>;
  colors?: Array<string>;
  isLoading?: boolean;
};

export default function PieChartComponent({
  data,
  colors = [],
  isLoading = false,
}: PieChartProps) {
  if (isLoading) {
    return <EmptyChartState height={350} title="Loading visualization..." subtitle="We're preparing your activity breakdown." />;
  }

  if (!data || data.length === 0) {
    return <EmptyChartState height={350} title="No category data" subtitle="There is no categorical data to display for this period." />;
  }

  return (
    <>
      <div className="h-[350px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {/* <Tooltip contentStyle={{ fontSize: "0.875rem", borderRadius: "6px", textTransform: "capitalize"}}/> */}
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-4">
        {data.map((p, i) => (
          <div key={i} className="w-full flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              ></span>
              <span className="text-sm text-gray-500">{p.name}</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">{p.value}%</p>
          </div>
        ))}
      </div>
    </>
  );
}

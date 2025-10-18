import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  // Tooltip,
} from "recharts";

type P = {
  name: string;
  value: number;
}

type PieChartProps = {
  data: Array<P>;
  colors?: Array<string>;
};

export default function PieChartComponent({
  data,
  colors = [],
}: PieChartProps) {
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

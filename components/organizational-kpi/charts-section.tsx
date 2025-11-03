"use client";

import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import BarChartComponent from "../../ui/bar-chart";

export default function ChartsComponent({
  chartData,
  bars,
}: {
  chartData: { name: string; baseline: number; target: number; actual: number }[];
  bars: { key: string; label: string; color: string }[];
}) {
  return (
    <section>
      {/* when api comes, add this on shared parent component if needed */}

      <CardComponent>
        <Heading heading="Key Performance Indicator Overview" />
        <div className="h-[417px]">
          <BarChartComponent data={chartData} xKey="name" bars={bars} />
        </div>
      </CardComponent>
    </section>
  );
}
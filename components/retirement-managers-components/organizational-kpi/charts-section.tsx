"use client";

import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import BarChartComponent from "@/ui/bar-chart";
import { kPIOverview } from "@/lib/config/charts";

export default function RetirementManagersChartsComponent() {

  const bars = [
    { key: "baseline", label: "Baseline", color: "#003B99" },
    { key: "target", label: "Target", color: "#D2091E" },
    { key: "actual", label: "Actual", color: "#22C55E" },
  ];

  return (
    <section>
      {/* when api comes, add this on shared parent component if needed */}
      <div className="flex flex-grow flex-col md:flex-row mb-5 gap-4 md:items-center mt-10">
        <DropDown
          label="Strategic Objective"
          value={""}
          placeholder="Strategic Objective"
          name="allStrategicObjective"
          onChange={() => {}}
          options={[]}
        />
        <DropDown
          label="Result Level"
          value={""}
          placeholder="Impact"
          name="resultLevel"
          onChange={() => {}}
          options={[]}
        />
        <DropDown
          label="Indicators"
          value={""}
          placeholder="All Indicators"
          name="indicators"
          onChange={() => {}}
          options={[]}
        />
        <DateRangePicker label="Date Range" />
        <DropDown
          label="Disaggregation"
          value={""}
          placeholder="Sex"
          name="disaggregation"
          onChange={() => {}}
          options={[]}
        />
      </div>

      <CardComponent>
        <Heading heading="Key Performance Indicator Overview" />
        <div className="h-[417px]">
          <BarChartComponent data={kPIOverview} xKey="name" bars={bars} />
        </div>
      </CardComponent>
    </section>
  );
}

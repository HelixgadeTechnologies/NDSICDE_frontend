"use client";

import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import { useOrgKPIFormState } from "@/store/organizational-kpi-store";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import BarChartComponent from "../../../ui/bar-chart";
import { kPIOverview } from "@/lib/config/charts";

export default function ChartsComponent() {
  const {
    allStrategicObjective,
    indicators,
    resultLevel,
    disaggregation,
    setField,
  } = useOrgKPIFormState();

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
          <BarChartComponent data={kPIOverview} xKey="name" bars={bars} />
        </div>
      </CardComponent>
    </section>
  );
}

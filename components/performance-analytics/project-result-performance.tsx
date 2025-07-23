"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import DropDown from "@/ui/form/select-dropdown";
import {
  KPIActualTarget,
  projectDistributionStatus,
  PDSColors,
  KPIProgressTracking,
} from "@/lib/config/charts";
import PieChartComponent from "../../ui/pie-chart";
import BarChartGrouped from "../../ui/bar-chart-grouped";
import Percentage from "@/ui/percentage-component";
import { usePerformanceAnalyticsReportsState } from "@/store/performance-analytics";

export default function ProjectResultPerformance() {
  const { KPIName, result, projects, PSDFilter, setField } =
    usePerformanceAnalyticsReportsState();

  const bars = [
    { key: "target", label: "Target", color: "#003B99" },
    { key: "actual", label: "Actual", color: "#D2091E" },
  ];

  const PSDOptions = [
    { value: "1", label: "Department" },
    { value: "2", label: "Manager" },
    { value: "3", label: "Priority" },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* KPI vs actual targets */}
        <div className="w-full md:w-[70%]">
          <CardComponent>
            <div className="flex justify-between items-start">
              <Heading heading="KPI Actuals vs. Targets" />
              <div className="gap-2 flex items-center w-[440px]">
                <DropDown
                  name="KPIName"
                  label="KPI"
                  placeholder="KPI name"
                  value={KPIName}
                  onChange={(value: string) => setField("KPIName", value)}
                  options={[]}
                />
                <DropDown
                  name="result"
                  label="Result"
                  placeholder="Impact"
                  value={result}
                  onChange={(value: string) => setField("result", value)}
                  options={[]}
                />
                <DropDown
                  name="projects"
                  label="Projects"
                  placeholder="Project Alpha"
                  value={projects}
                  onChange={(value: string) => setField("projects", value)}
                  options={[]}
                />
              </div>
            </div>
            <div className="h-[460px]">
              <BarChartGrouped data={KPIActualTarget} bars={bars} xKey="name" />
            </div>
          </CardComponent>
        </div>

        {/* project status distribution */}
        <div className="w-full md:w-[35%] relative">
          <CardComponent>
            <div className="flex justify-between items-start">
              <Heading
                heading="Project Status Distribution"
                subtitle="Distribution by category"
              />
              <DropDown
                name="PSDFilter"
                label="Filter"
                // placeholder="Department"
                value={PSDFilter}
                onChange={(value: string) => setField("PSDFilter", value)}
                options={PSDOptions}
              />
            </div>
            <PieChartComponent
              data={projectDistributionStatus}
              colors={PDSColors}
            />
          </CardComponent>
        </div>
      </div>

      {/* progress tracking */}
      <CardComponent>
        <Heading
          heading="Progress Tracking"
          subtitle="Activity, Output, Outcome, Impact"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {KPIProgressTracking.map((k, i) => (
            <CardComponent key={i}>
              <h4 className="text-[#242424] text-base leading-5 font-semibold mb-2">
                {k.title}
              </h4>
              <Percentage data={k.percentages} />
            </CardComponent>
          ))}
        </div>
      </CardComponent>
    </section>
  );
}

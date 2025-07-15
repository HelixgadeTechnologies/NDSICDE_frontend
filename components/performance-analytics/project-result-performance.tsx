"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
// import DropDown from "@/ui/form/select-dropdown";
import { KPIActualTarget, projectDistributionStatus, PDSColors, KPIProgressTracking } from "@/lib/config/charts";
import PieChartComponent from "../pie-chart";
import BarChartComponent from "../bar-chart";
import Percentage from "@/ui/percentage-component";


export default function ProjectResultPerformance() {

  const bars = [
    { key: "target", label: "Target", color: "#003B99" },
    { key: "actual", label: "Actual", color: "#D2091E" },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* KPI vs actual targets */}
        <div className="w-full md:w-[65%]">
          <CardComponent>
            <div className="flex justify-between items-start">
              <Heading heading="KPI Actuals vs. Targets" />
            </div>
            <div className="h-[460px]">
              <BarChartComponent data={KPIActualTarget} bars={bars} xKey="name" />
            </div>
          </CardComponent>
        </div>

        {/* project status distribution */}
        <div className="w-full md:w-[35%]">
          <CardComponent>
            <div className="flex justify-between items-start">
              <Heading
                heading="Project Status Distribution"
                subtitle="Distribution by category"
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
        <Heading heading="Progress Tracking" subtitle="Activity, Output, Outcome, Impact"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {KPIProgressTracking.map((k,i) => (
            <CardComponent key={i}>
              <h4 className="text-[#242424] text-base leading-5 font-semibold mb-2">{k.title}</h4>
              <Percentage data={k.percentages} />
            </CardComponent>
          ))}
        </div>
      </CardComponent>
    </section>
  );
}

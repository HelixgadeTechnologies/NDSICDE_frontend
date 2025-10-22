"use client";

import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import LineChartComponent from "@/ui/line-chart";
import Heading from "@/ui/text-heading";
import { PieChart, ResponsiveContainer, Pie, Cell } from "recharts";
import ImplementationTimeAnalysisComponent from "./ita-component";
import CPIComponent from "./cpi-component";
import SPIComponnet from "./spi-component";
import TabComponent from "@/ui/tab-component";
import ActivityOverviewComponent from "./activity-overview-chart-table";


export default function ActivityOverview() {

  const burnRate = [
    { normal: 60, name: "Target 1" },
    { normal: 70, name: "Target 2" },
    { normal: 50, name: "Target 3" },
    { normal: 85, name: "Target 4" },
    { normal: 55, name: "Target 5" },
    { normal: 70, name: "Target 6" },
  ];


  return (
    <>
      {/* activity overview */}
      <CardComponent>
          <Heading
            heading="Activity Overview"
            subtitle="Breakdown of activities by current activities"
            className="mb-4"
          />
        <ActivityOverviewComponent/>
      </CardComponent>

      {/* implementation time analysis */}
     <ImplementationTimeAnalysisComponent/>

      {/* burn rate */}
      <CardComponent>
        {/* heading and filters */}
        <div className="flex items-end justify-between gap-4">
          <Heading heading="Burn Rate" subtitle="Percentage of target achieved" />
          <div className="flex gap-4 iteems-end">
            <DropDown
            label="Output"
            name="output"
            placeholder="All Output"
            value=""
            onChange={() => {}}
            options={[]}
            />
            <DropDown
            label="Activity"
            name="activity"
            placeholder="All Activity"
            value=""
            onChange={() => {}}
            options={[]}
            />
            <DateRangePicker label="Date Range"/>
          </div>
        </div>

          {/* line graph */}
        <div className="h-[260px] mt-5">
          <LineChartComponent data={burnRate} lines={[ { key: "normal", label: "Normal", color: "#D2091E" }, ]} xKey="name" />
        </div>
      </CardComponent>

        <CPIComponent/>

        <SPIComponnet/>
    </>
  );
}

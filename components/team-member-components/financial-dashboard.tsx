"use client";

import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import LineChartComponent from "@/ui/line-chart";
import Heading from "@/ui/text-heading";
import ImplementationTimeAnalysisComponent from "./ita-component";
import CPIComponent from "./cpi-component";
import SPIComponnet from "./spi-component";
import ActivityOverviewComponent from "./activity-overview-chart-table";
import BurnRateComponent from "./burn-rate-component";

export default function ActivityOverview() {
  return (
    <>
      {/* activity overview */}
      <CardComponent>
        <Heading
          heading="Activity Overview"
          subtitle="Breakdown of activities by current activities"
          className="mb-4"
        />
        <ActivityOverviewComponent />
      </CardComponent>

      {/* implementation time analysis */}
      <ImplementationTimeAnalysisComponent />

      {/* burn rate */}
      <CardComponent>
        {/* heading and filters */}
        <div className="flex items-end justify-between gap-4">
          <Heading
            heading="Burn Rate"
            subtitle="Percentage of target achieved"
          />
          <div className="flex gap-4 items-end">
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
            <DateRangePicker label="Date Range" />
          </div>
        </div>
        {/* burn rate*/}
       <BurnRateComponent/>

      </CardComponent>
      {/* cpi and spi component */}
      <CPIComponent />
      <SPIComponnet />
    </>
  );
}

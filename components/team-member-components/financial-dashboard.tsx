"use client";

import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import Heading from "@/ui/text-heading";
import ImplementationTimeAnalysisComponent from "./ita-component";
import CPIComponent from "./cpi-component";
import SPIComponnet from "./spi-component";
import BurnRateComponent from "./burn-rate-component";
import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";

export default function ActivityOverview({
  statData,
}: {
  statData?: ProjectFinancialDashboardResponse | null;
}) {
  return (
    <>

      {/* implementation time analysis */}
      <ImplementationTimeAnalysisComponent statData={statData} />

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
       <BurnRateComponent statData={statData} />

      </CardComponent>
      {/* cpi and spi component */}
      <CPIComponent statData={statData} />
      <SPIComponnet statData={statData} />
    </>
  );
}

"use client";

import BarChartComponent from "@/ui/bar-chart";
import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { useState } from "react";

const colorsSpi = ["#0047AB", "#F44336", "#FBC02D"];

function SPIChart({ spiData }: { spiData?: ProjectFinancialDashboardResponse["ACTIVITY_FINANCIAL_DATA"] }) {
  const data = spiData?.map((item) => ({
    name: item.activityStatement || item.outputStatement || "Unknown",
    value: item.schedulePerformanceIndex || 0,
  })) || [];


  return (
    <div className="h-[300px] mt-5">
      <BarChartComponent
        data={data}
        isSingleBar={true}
        colors={colorsSpi}
        xKey="name"
        labels={["SPI Values"]}
      />
    </div>
  );
}

function SPITable({ spiData }: { spiData?: ProjectFinancialDashboardResponse["ACTIVITY_FINANCIAL_DATA"] }) {
  const head = [
    "Description",
    "Schedule Variance",
    "SPI",
    "Status",
  ];

  if (!spiData || spiData.length === 0) return <div className="text-center py-10 text-gray-500">No data available</div>;

  return (
    <div className="mt-5">
      <Table
        tableHead={head}
        tableData={spiData}
        renderRow={(row: any) => (
          <>
            <td className="px-6">{row.activityStatement || row.outputStatement || "-"}</td>
            <td className="px-6">{row.scheduleVariance ?? "-"}</td>
            <td className="px-6">{row.schedulePerformanceIndex ?? "-"}</td>
            <td className="px-6">{row.schedulePerformanceStatus || "-"}</td>
          </>
        )}
      />
    </div>
  );
}

import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";

export default function SPIComponnet({
  statData,
}: {
  statData?: ProjectFinancialDashboardResponse | null;
}) {
  const [levels, setLevels] = useState("");
  return (
    <CardComponent>
      <div className="flex justify-between items-center">
        <Heading
          heading="Schedule Performance Index (SPI)"
          subtitle="Budget Performance by Project"
        />
        <div className="w-[220px]">
            <DropDown
            value={levels}
            label="Level"
            name="level"
            options={[
                { value: "Output", label: "Output" },
                { value: "Activity", label: "Activity" },
            ]}
            onChange={setLevels}
            />
        </div>
      </div>
      {/* spi chart and table component */}
      <div className="mt-5">
        <TabComponent
          data={[
            { tabName: "Chart", id: 1 },
            { tabName: "Table", id: 2 },
          ]}
          renderContent={(rowId) => {
            if (rowId === 1) {
              return <SPIChart spiData={statData?.ACTIVITY_FINANCIAL_DATA} />;
            } else {
              return <SPITable spiData={statData?.ACTIVITY_FINANCIAL_DATA} />;
            }
          }}
        />
      </div>
    </CardComponent>
  );
}

"use client";

import BarChartComponent from "@/ui/bar-chart";
import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { useState } from "react";

const colorsCpi = ["#F44336", "#FBC02D", "#0047AB", "#22C55E"];

function CPIChart({ cpiData }: { cpiData?: ProjectFinancialDashboardResponse["ACTIVITY_FINANCIAL_DATA"] }) {
  const data = cpiData?.map((item) => ({
    name: item.activityStatement || item.outputStatement || "Unknown",
    value: item.costPerformanceIndex || 0,
  })) || [];


  return (
    <div className="h-[300px] mt-5">
      <BarChartComponent
        data={data}
        isSingleBar={true}
        colors={colorsCpi}
        xKey="name"
        labels={["CPI Values"]}
      />
    </div>
  );
}

function CPITable({ cpiData }: { cpiData?: ProjectFinancialDashboardResponse["ACTIVITY_FINANCIAL_DATA"] }) {
  const head = [
    "Description",
    "Cost Variance",
    "CPI",
    "Status",
  ];

  return (
    <div className="mt-5">
      <Table
        tableHead={head}
        tableData={cpiData}
        renderRow={(row: any) => (
          <>
            <td className="px-6">{row.activityStatement || row.outputStatement || "-"}</td>
            <td className="px-6">{row.costVariance ?? "-"}</td>
            <td className="px-6">{row.costPerformanceIndex ?? "-"}</td>
            <td className="px-6">{row.costPerformanceStatus || "-"}</td>
          </>
        )}
      />
    </div>
  );
}

import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";

export default function CPIComponent({
  statData,
}: {
  statData?: ProjectFinancialDashboardResponse | null;
}) {
  const [levels, setLevels] = useState("");
  return (
    <CardComponent>
      <div className="flex justify-between items-center">
        <Heading
          heading="Cost Performance Index (CPI)"
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
      {/* cpi chart and table component */}
      <div className="mt-5">
        <TabComponent
          data={[
            { tabName: "Chart", id: 1 },
            { tabName: "Table", id: 2 },
          ]}
          renderContent={(rowId) => {
            if (rowId === 1) {
              return <CPIChart cpiData={statData?.ACTIVITY_FINANCIAL_DATA} />;
            } else {
              return <CPITable cpiData={statData?.ACTIVITY_FINANCIAL_DATA} />;
            }
          }}
        />
      </div>
    </CardComponent>
  );
}

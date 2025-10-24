"use client";

import BarChartComponent from "@/ui/bar-chart";
import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { useState } from "react";

const colorsSpi = ["#0047AB", "#F44336", "#FBC02D"];

function SPIChart() {
  const data = [
    { name: "Project 1", value: 80 },
    { name: "Project 2", value: 90 },
    { name: "Project 3", value: 80 },
    { name: "Project 4", value: 50 },
    { name: "Project 5", value: 80 },
    { name: "Project 6", value: 80 },
    { name: "Project 7", value: 90 },
    { name: "Project 8", value: 50 },
  ];
  return (
    <div className="h-[300px] mt-5">
      <BarChartComponent
        data={data}
        isSingleBar={true}
        colors={colorsSpi}
        xKey="name"
        labels={["Behind Schedule", "Ahead of Schedule", "On Schedule"]}
      />
    </div>
  );
}

function SPITable() {
  const head = [
    "Description",
    "Behind Schedule",
    "Ahead of Schedule",
    "On Schedule",
    "Status",
  ];

  const data = [
    {
      description: "---",
      behindSchedule: 30,
      aheadOfSchedule: 12,
      onSchedule: 0,
      status: "Due to Start",
    },
    {
      description: "---",
      behindSchedule: 30,
      aheadOfSchedule: 12,
      onSchedule: 0,
      status: "Due to Start",
    },
  ];

  return (
    <div className="mt-5">
      <Table
        tableHead={head}
        tableData={data}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.description}</td>
            <td className="px-6">{row.behindSchedule}</td>
            <td className="px-6">{row.aheadOfSchedule}</td>
            <td className="px-6">{row.onSchedule}</td>
            <td className="px-6">{row.status}</td>
          </>
        )}
      />
    </div>
  );
}

export default function SPIComponnet() {
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
              return <SPIChart />;
            } else {
              return <SPITable />;
            }
          }}
        />
      </div>
    </CardComponent>
  );
}

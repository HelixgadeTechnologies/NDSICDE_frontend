"use client";

import BarChartComponent from "@/ui/bar-chart";
import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { useState } from "react";

const colorsCpi = ["#F44336", "#FBC02D", "#0047AB", "#22C55E"];

function CPIChart() {
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
        colors={colorsCpi}
        xKey="name"
        labels={["Under Budget", "As Planned", "No Spending", "Over Budget"]}
      />
    </div>
  );
}

function CPITable() {
  const head = [
    "Under Budget",
    "As Planned",
    "No Spending",
    "Over Budget",
    "Status",
  ];

  const data = [
    {
      underBudget: 45,
      asPlanned: 30,
      noSpending: 12,
      overBudget: 0,
      status: "Due to Start",
    },
    {
      underBudget: 45,
      asPlanned: 30,
      noSpending: 12,
      overBudget: 0,
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
            <td className="px-6">{row.underBudget}</td>
            <td className="px-6">{row.asPlanned}</td>
            <td className="px-6">{row.noSpending}</td>
            <td className="px-6">{row.overBudget}</td>
            <td className="px-6">{row.status}</td>
          </>
        )}
      />
    </div>
  );
}

export default function CPIComponent() {
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
              { value: "Project", label: "Project" },
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
              return <CPIChart />;
            } else {
              return <CPITable />;
            }
          }}
        />
      </div>
    </CardComponent>
  );
}

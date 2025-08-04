"use client";

import Table from "@/ui/table";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";


const head = [
  "Code",
  "Indicator",
  "Baseline",
  "Target",
  "Performance",
  "Status",
];

const data = [
  {
    code: "EDU-01",
    indicator: "Number of students enrolled",
    baseline: 500,
    target: 450,
    performance: 90,
    status: "Partially Met",
  },
  {
    code: "EDU-02",
    indicator: "Percentage of students completing training",
    baseline: 85,
    target: 88,
    performance: 103,
    status: "Met",
  },
  {
    code: "HEALTH-01",
    indicator: "Number of beneficiaries receiving health services",
    baseline: 5000,
    target: 3800,
    performance: 76,
    status: "Partially Met",
  },
];

const optionsData = [
  { value: "1", label: "Option One" },
  { value: "2", label: "Option Two" },
  { value: "3", label: "Option Three" },
];

export default function RetirementManagerTableComponent() {

  return (
    <section>
      {/* when api comes, add this on shared parent component if needed */}
      <div className="flex flex-col md:flex-row mb-5 gap-4 md:items-center w-full mt-10">
        <DropDown
          label="Strategic Objective"
          value={""}
          placeholder="Strategic Objective"
          name="allStrategicObjective"
          onChange={() => {}}
          options={optionsData}
        />
        <DropDown
          label="Result Level"
          value={""}
          placeholder="Impact"
          name="resultLevel"
          onChange={() => {}}
          options={[]}
        />
        <DropDown
          label="Indicators"
          value={""}
          placeholder="All Indicators"
          name="indicators"
          onChange={() => {}}
          options={[]}
        />
        <DateRangePicker label="Date Range" />
        <DropDown
          label="Disaggregation"
          value={""}
          placeholder="Sex"
          name="disaggregation"
          onChange={() => {}}
          options={[]}
        />
      </div>
      <Table
        tableHead={head}
        tableData={data}
        renderRow={(row) => {
          return (
            <>
              <td className="px-6 text-xs md:text-sm">{row.code}</td>
              <td className="px-6 text-xs md:text-sm">{row.indicator}</td>
              <td className="px-6 text-xs md:text-sm">{row.baseline}</td>
              <td className="px-6 text-xs md:text-sm">{row.target}</td>
              <td className="px-6 text-xs md:text-sm">{row.performance}%</td>
              <td
                className={`${
                  row.status === "Met" ? "text-[#22C55E]" : "text-[#EAB308]"
                } px-6 text-xs md:text-sm`}
              >
                {row.status}
              </td>
            </>
          );
        }}
      />
    </section>
  );
}

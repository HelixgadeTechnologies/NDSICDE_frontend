"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import PieChartComponent from "@/ui/pie-chart";
import LineChartComponent from "@/ui/line-chart";
import Table from "@/ui/table";
import { progressTrackingColors, progressTracking } from "@/lib/config/charts";

export default function PartnersDashboardComponent() {
  const head = ["KPI", "Submission Date", "Status", "Actions"];
  const data = [
    {
      kpi: "Digital Transformation",
      submissionDate: "May 15, 2023 10:30",
      status: "Approved",
    },
    {
      kpi: "Digital Transformation",
      submissionDate: "May 15, 2023 10:30",
      status: "Pending",
    },
    {
      kpi: "Digital Transformation",
      submissionDate: "May 15, 2023 10:30",
      status: "Rejected",
    },
  ];

//   search
  const [query, setQuery] = useState("");
  const filteredData = data.filter((item) =>
    `${item.kpi} ${item.submissionDate} ${item.status}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

//   line chart data
const lines = [
    { key: "target", label: "Target", color: "#003B99" },
    { key: "actual", label: "Actual", color: "#EF4444" },
  ];

  const chartData = [
    { name: "Jan", target: 20, actual: 40 },
    { name: "Feb", target: 70, actual: 60 },
    { name: "Mar", target: 38, actual: 45 },
    { name: "Apr", target: 75, actual: 60 },
    { name: "May", target: 50, actual: 70 },
    { name: "Jun", target: 90, actual: 60 },
    { name: "Jul", target: 60, actual: 70 },
    { name: "Aug", target: 90, actual: 40 },
    { name: "Sep", target: 58, actual: 80 },
    { name: "Oct", target: 40, actual: 50 },
    { name: "Nov", target: 50, actual: 50 },
    { name: "Dec", target: 70, actual: 20 },
  ];

  return (
    <section className="space-y-8">
        <div className="flex gap-4 items-end">
            <SearchInput
            value=""
            name=""
            onChange={() => {}}
            placeholder="Search Projects"
            />
            <DropDown
            label="Projects"
            placeholder="All Projects"
            value=""
            name=""
            onChange={() => {}}
            options={[]}
            />
            <DateRangePicker label="Date Range"/>
        </div>
        <div className="flex gap-6 items-start">
            <div className="w-[70%]">
                <CardComponent>
                    <Heading heading="KPI Performance Overview" subtitle="Targets vs. Actuals over the last 6 months" />
                    <div className="h-[440px]">
                        <LineChartComponent data={chartData} lines={lines} xKey="name" legend />
                      </div>
                </CardComponent>
            </div>
            <div className="w-[30%]">
                <CardComponent>
                    <Heading heading="Progress Tracking" subtitle="KPI Types Distribution" className="text-center" />
                        <PieChartComponent
                        data={progressTracking}
                        colors={progressTrackingColors}
                        />
                </CardComponent>
            </div>
        </div>

      <CardComponent>
        <div className="flex justify-between items-center mb-4">
          <Heading heading="Recent Submissions and Status" />
          <div className="gap-[17px] flex items-end">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              name="search"
              placeholder="Search Project"
            />
            <DropDown
            value=""
            name="status"
            label="Status"
            placeholder="All Status"
            options={[]}
            onChange={() => {}}
            />
          </div>
        </div>
        {filteredData.length > 0 ? (
          <Table
            tableHead={head}
            tableData={filteredData}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.kpi}</td>
                <td className="px-6">{row.submissionDate}</td>
                <td
                    className={`px-6 ${
                      row.status === "Approved"
                        ? "text-green-500"
                        : row.status === "Pending" ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {row.status}
                  </td>
                <td className="pl-10 relative">
                    <Icon
                      icon={"uiw:more"}
                      width={22}
                      height={22}
                      className="cursor-pointer"
                      color="#909CAD"
                    />
                </td>
              </>
            )}
          />
        ) : (
          <div className="text-center text-gray-500 py-10 text-sm rounded-lg">
            No results found matching{" "}
            <span className="font-medium">{`"${query}"`}</span>.
          </div>
        )}
      </CardComponent>
    </section>
  );
}

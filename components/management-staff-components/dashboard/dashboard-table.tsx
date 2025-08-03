"use client";

import CardComponent from "@/ui/card-wrapper";
import Table from "@/ui/table";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import { Icon } from "@iconify/react";
import { managementTypeChecker } from "@/utils/ui-utility";
import DateRangePicker from "@/ui/form/date-range";

export default function ManagementStaffDashboardTable() {
  const head = [
    "Project Code",
    "Project Name",
    "Strategic Objective",
    "Status",
    "Start Date",
    "End Date",
    "Team",
    "Actions",
  ];

  const data = [
    {
      projectCode: "PRJ001",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Active",
      startDate: "Jan 15, 2023",
      endDate: "Jun 30, 2024",
      team: "Health Team",
    },
    {
      projectCode: "PRJ001",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Completed",
      startDate: "Jan 15, 2023",
      endDate: "Jun 30, 2024",
      team: "Health Team",
    },
    {
      projectCode: "PRJ001",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "On Hold",
      startDate: "Jan 15, 2023",
      endDate: "Jun 30, 2024",
      team: "Health Team",
    },
  ];

  return (
    <CardComponent>
      <div className="mb-6 flex gap-4 items-end">
        <div className="w-2/5">
          <SearchInput
            name=""
            value=""
            onChange={() => {}}
            placeholder="Search Projects"
          />
        </div>
        <div className="w-3/5 flex gap-4 items-end">
          <DropDown
            label="Status"
            placeholder="All Status"
            name="status"
            value=""
            onChange={() => {}}
            options={[]}
          />
          <DropDown
            label="Categories"
            placeholder="All Categories"
            name="categories"
            value=""
            onChange={() => {}}
            options={[]}
          />
          <DateRangePicker label="Date Range"/>
        </div>
      </div>
      <Table
        tableHead={head}
        tableData={data}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.projectCode}</td>
            <td className="px-6">{row.projectName}</td>
            <td className="px-6">{row.strategicObjective}</td>
            <td className={managementTypeChecker(row)}>{row.status}</td>
            <td className="px-6">{row.startDate}</td>
            <td className="px-6">{row.endDate}</td>
            <td className="px-6">{row.team}</td>
            <td className="px-6">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  // onClick={() =>
                  //   setActiveRowId((prev) =>
                  //     prev === row.id ? null : row.id
                  //   )
                  // }
                />
              </div>
            </td>
          </>
        )}
      />
    </CardComponent>
  );
}

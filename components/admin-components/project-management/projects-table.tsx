"use client";

import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function ProjectsTable() {
  const [query, setQuery] = useState("");

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
      id: 1,
      projectCode: "PRJ001",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Active",
      startDate: "Jan 15, 2023",
      endDate: "Jan 30, 2024",
      team: "Health Team",
    },
    {
      id: 2,
      projectCode: "PRJ001",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Completed",
      startDate: "Jan 15, 2023",
      endDate: "Jan 30, 2024",
      team: "Health Team",
    },
    {
      id: 3,
      projectCode: "PRJ001",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "On Hold",
      startDate: "Jan 15, 2023",
      endDate: "Jan 30, 2024",
      team: "Health Team",
    },
  ];

  return (
    <CardComponent>
      <div className="flex justify-between items-end gap-4 mb-4">
        <div className="w-2/5">
          <SearchInput
            value={query}
            name="search"
            placeholder="Search Projects"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-3/5 flex items-end gap-4">
          <DropDown
            name="status"
            value=""
            placeholder="All Status"
            onChange={() => {}}
            options={[]}
            label="Status"
          />
          <DropDown
            name="strategicObjective"
            value=""
            placeholder="All Objective"
            onChange={() => {}}
            options={[]}
            label="Strategic Objectives"
          />
          <DropDown
            name="teams"
            value=""
            placeholder="All Teams"
            onChange={() => {}}
            options={[]}
            label="Teams"
          />
        </div>
      </div>
      <Table
        tableHead={head}
        tableData={data}
        idKey={"id"}
        checkbox
        renderRow={(row) => (
          <>
            <td className="px-4">{row.projectName}</td>
            <td className="px-4">{row.projectCode}</td>
            <td className="px-4">{row.strategicObjective}</td>
            <td className="px-4">{row.status}</td>
            <td className="px-4">{row.startDate}</td>
            <td className="px-4">{row.endDate}</td>
            <td className="px-4">{row.team}</td>
            <td className="px-4">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                //   onClick={() =>
                //     setActiveRowId((prev) => (prev === row.id ? null : row.id))
                //   }
                />
              </div>
            </td>
          </>
        )}
      />
    </CardComponent>
  );
}

// app/dashboard/management-staff/page.tsx (or wherever this component is)
"use client";

import CardComponent from "@/ui/card-wrapper";
import Table from "@/ui/table";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import { Icon } from "@iconify/react";
import { managementTypeChecker } from "@/utils/ui-utility";
import DateRangePicker from "@/ui/form/date-range";
import { formatDate } from "@/utils/dates-format-utility";
import { useProjects } from "@/context/ProjectsContext";

export default function ManagementStaffDashboardTable() {
  const { projects, isLoading, projectOptions } = useProjects();

  const head = [
    "Project Name",
    "Strategic Objective",
    "Status",
    "Start Date",
    "End Date",
    "Team Members",
    // "Actions",
  ];

  return (
    <CardComponent>
      <div className="mb-6 flex gap-4 items-end">
        <div className="w-3/5">
          <SearchInput
            name="search"
            value=""
            onChange={() => {}}
            placeholder="Search Projects"
          />
        </div>
        <div className="w-2/5 flex gap-4 items-end">
          <DropDown
            label="Status"
            placeholder="All Status"
            name="status"
            value=""
            onChange={() => {}}
            options={[]}
          />
          <DropDown
            label="Projects"
            placeholder="Select Project"
            name="project"
            value=""
            onChange={() => {}}
            options={projectOptions}
          />
          <DateRangePicker label="Date Range" />
        </div>
      </div>
      {isLoading ? (
        <div className="dots my-20 mx-auto">
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <Table
          tableHead={head}
          tableData={projects}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.projectName}</td>
              <td className="px-6">{row.strategicObjective.statement}</td>
              <td className={managementTypeChecker(row)}>{row.status}</td>
              <td className="px-6">{formatDate(row.startDate, "date-only")}</td>
              <td className="px-6">{formatDate(row.endDate, "date-only")}</td>
              <td className="px-6">
                {row.teamMember.length === 0
                  ? "No team members"
                  : row.teamMember.map((member) => member.fullName).join(", ")}
              </td>
              {/* <td className="px-6">
                <div className="flex justify-center items-center">
                  <Icon
                    icon={"uiw:more"}
                    width={22}
                    height={22}
                    className="cursor-pointer"
                    color="#909CAD"
                  />
                </div>
              </td> */}
            </>
          )}
        />
      )}
    </CardComponent>
  );
}
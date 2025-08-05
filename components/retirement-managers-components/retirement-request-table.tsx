"use client";

import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";

export default function RequestAndRetirementTable() {
  const head = [
    "Activity Description",
    "Total Budget(₦)",
    "Responsible Person(s)",
    "Start Date",
    "End Date",
    "Status",
    "Actions",
  ];

  const data = [
    {
      id: 1,
      activityDesc: "Meeting with stakeholders in Akwa Ibom",
      totalBudget: "500,000",
      responsiblePerson: "Ifeoma",
      startDate: "12/03/2024",
      endDate: "12/03/2024",
      status: "Pending",
    },
    {
      id: 2,
      activityDesc: "Meeting with stakeholders in Akwa Ibom",
      totalBudget: "500,000",
      responsiblePerson: "Ifeoma",
      startDate: "12/03/2024",
      endDate: "12/03/2024",
      status: "Approved",
    },
    {
      id: 3,
      activityDesc: "Meeting with stakeholders in Akwa Ibom",
      totalBudget: "500,000",
      responsiblePerson: "Ifeoma",
      startDate: "12/03/2024",
      endDate: "12/03/2024",
      status: "Rejected",
    },
  ];

  return (
    <div className="mt-10">
      <div className="absolute top-20 right-10">
        <DateRangePicker />
      </div>
      <CardComponent>
        <div className="flex justify-end mb-5">
          <div className="w-[535px] flex items-end gap-4">
            <SearchInput
              value=""
              name=""
              placeholder="Search Project"
              onChange={() => {}}
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
        <Table
          tableHead={head}
          tableData={data}
          idKey={"id"}
          checkbox
          renderRow={(row) => (
            <>
              <td className="px-6">{row.activityDesc}</td>
              <td className="px-6">{row.totalBudget}</td>
              <td className="px-6">{row.responsiblePerson}</td>
              <td className="px-6">{row.startDate}</td>
              <td className="px-6">{row.endDate}</td>
              <td
                className={`px-6 ${
                  row.status === "Approved"
                    ? "text-green-500"
                    : row.status === "Pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {row.status}
              </td>
              <td className="px-6">
                <Icon
                  icon={"hugeicons:view"}
                  height={20}
                  width={20}
                  className="cursor-pointer"
                />
              </td>
            </>
          )}
        />
      </CardComponent>
    </div>
  );
}

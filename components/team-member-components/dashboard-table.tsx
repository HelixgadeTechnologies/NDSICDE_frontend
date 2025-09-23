"use client";

import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DashboardTable() {
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
      projectCode: "PRJ002",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Completed",
      startDate: "Jan 15, 2023",
      endDate: "Jun 30, 2024",
      team: "Health Team",
    },
    {
      projectCode: "PRJ003",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "On Hold",
      startDate: "Jan 15, 2023",
      endDate: "Jun 30, 2024",
      team: "Health Team",
    },
  ];

  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  return (
    <CardComponent>
      <div className="flex gap-4 items-end mb-5">
        <SearchInput
          name="search"
          value=""
          onChange={() => {}}
          placeholder="Search Projects"
        />
        <div className="flex gap-4">
          <DropDown
            label="Status"
            name="status"
            value=""
            placeholder="All Status"
            onChange={() => {}}
            options={[]}
          />
          <DropDown
            label="Objective"
            name="objective"
            value=""
            placeholder="All Objective"
            onChange={() => {}}
            options={[]}
          />
          <DropDown
            label="Teams"
            name="teams"
            value=""
            placeholder="All Teams"
            onChange={() => {}}
            options={[]}
          />
        </div>
      </div>

      <Table
        tableHead={head}
        tableData={data}
        checkbox
        idKey={"projectCode"}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.projectCode}</td>
            <td className="px-6">{row.projectName}</td>
            <td className="px-6">{row.strategicObjective}</td>
            <td
              className={`px-6 ${
                row.status == "Active"
                  ? "text-green-500"
                  : row.status === "Completed"
                  ? "text-blue-500"
                  : "text-yellow-500"
              }`}
            >
              {row.status}
            </td>
            <td className="px-6">{row.startDate}</td>
            <td className="px-6">{row.endDate}</td>
            <td className="px-6">{row.team}</td>
            <td className="px-6 relative">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) =>
                      prev === row.projectCode ? null : row.projectCode
                    )
                  }
                />
              </div>

              {activeRowId === row.projectCode && (
                <AnimatePresence>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 right-0 bg-white z-30 rounded-[6px] border border-[#E5E5E5] shadow-md w-[200px]"
                  >
                    <ul className="text-sm">
                      <li className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center">
                        <Icon
                          icon={"ph:pencil-simple-line"}
                          height={20}
                          width={20}
                        />
                        Edit
                      </li>
                      <li className="cursor-pointer hover:text-[var(--primary-light)] flex gap-2 p-3 items-center">
                        <Icon
                          icon={"pixelarticons:trash"}
                          height={20}
                          width={20}
                        />
                        Delete
                      </li>
                    </ul>
                  </motion.div>
                </AnimatePresence>
              )}
            </td>
          </>
        )}
      />
    </CardComponent>
  );
}

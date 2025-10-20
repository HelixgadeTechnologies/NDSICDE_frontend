"use client";

import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { year_options } from "@/lib/config/general-config";
import Link from "next/link";
import { useRoleStore } from "@/store/role-store";

export default function ProjectsTable() {
  const [query, setQuery] = useState("");
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const { user } = useRoleStore();

  const head = [
    "Project Name",
    "Project Code",
    "SO Alignment",
    "Status",
    "Start Date",
    "End Date",
    "Thematic Areas",
    "Actions",
  ];

  const projects = [
    {
      id: "1",
      projectCode: "PRJ001",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Active",
      startDate: "Jan 15, 2023",
      endDate: "Jan 30, 2024",
      team: "Health Teams",
    },
    {
      id: "2",
      projectCode: "PRJ002",
      projectName: "Community Health Initiative",
      strategicObjective: "Improve Healthcare Access",
      status: "Completed",
      startDate: "Jan 15, 2023",
      endDate: "Jan 30, 2024",
      team: "Health Team",
    },
    {
      id: "3",
      projectCode: "PRJ003",
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
            name="year"
            value=""
            onChange={() => {}}
            options={year_options}
            label="Year"
          />
        </div>
      </div>
      <Table
        tableHead={head}
        tableData={projects}
        idKey={"id"}
        checkbox
        renderRow={(row) => (
          <>
            <td className="px-4">
              <Link href={`/projects/${row.id}`} className="hover:underline">{row.projectName}</Link>
            </td>
            <td className="px-4">{row.projectCode}</td>
            <td className="px-4">{row.strategicObjective}</td>
            <td className="px-4">{row.status}</td>
            <td className="px-4">{row.startDate}</td>
            <td className="px-4">{row.endDate}</td>
            <td className="px-4">{row.team}</td>
            <td className="px-4 relative">
              <div className="flex justify-center items-center"> 
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) => (prev === row.id ? null : row.id))
                  }
                />
              </div>
              {activeRowId === row.id && (
                <AnimatePresence>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 right-0 bg-white z-30 rounded-[6px] border border-[#E5E5E5] shadow-md w-[200px]"
                  >
                    <ul className="text-sm">
                      <li className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                        <Icon
                          icon={"ph:pencil-simple-line"}
                          height={20}
                          width={20}
                        />
                        Edit
                      </li>
                      {user?.role === "super-admin" && <li className="cursor-pointer hover:text-[var(--primary-light)] border-y border-gray-300 flex gap-2 p-3 items-center">
                        <Icon
                          icon={"pixelarticons:trash"}
                          height={20}
                          width={20}
                        />
                        Remove
                      </li>}
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

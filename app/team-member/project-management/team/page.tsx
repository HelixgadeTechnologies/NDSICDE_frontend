"use client";

import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function ProjectTeam() {
  const [activeRowId, setActiveRowId] = useState<number | null>(1);
  const head = [
    "Full Name",
    "Email Address",
    "Role",
    "Status",
    "Last Active",
    "Actions",
  ];
  const data = [
    {
      userId: 1,
      name: "John Doe",
      email: "john.doe@mail.com",
      role: "Super Admin",
      status: "Active",
      lastActive: "May 15, 2023 10:30",
    },
    {
      userId: 2,
      name: "John Doe",
      email: "john.doe@mail.com",
      role: "Team Member",
      status: "Active",
      lastActive: "May 15, 2023 10:30",
    },
    {
      userId: 3,
      name: "John Doe",
      email: "john.doe@mail.com",
      role: "Admin",
      status: "Active",
      lastActive: "May 15, 2023 10:30",
    },
  ];
  return (
    <CardComponent>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div className="w-3/5">
          <SearchInput
            name="search"
            value=""
            placeholder="Search Projects"
            onChange={() => {}}
          />
        </div>
        <div className="w-2/5 flex items-end gap-4">
          <DropDown
            value=""
            name="role"
            placeholder="All Role"
            onChange={() => {}}
            options={[]}
          />
          <DropDown
            value=""
            name="status"
            placeholder="All Status"
            onChange={() => {}}
            options={[]}
          />
        </div>
      </div>

      <Table
        tableHead={head}
        tableData={data}
        checkbox
        idKey={"email"}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.name}</td>
            <td className="px-6">{row.email}</td>
            <td className="px-6">{row.role}</td>
            <td className="px-6">{row.status}</td>
            <td className="px-6">{row.lastActive}</td>
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
                      prev === row.userId ? null : row.userId
                    )
                  }
                />
              </div>

              {activeRowId === row.userId && (
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
                        <Icon icon={"hugeicons:view"} height={20} width={20} />
                        View Profile
                      </li>
                      <li className="cursor-pointer hover:text-blue-600 flex gap-2 border-y border-gray-300 p-3 items-center">
                        <Icon icon={"cil:pencil"} height={20} width={20} />
                        Edit
                      </li>
                      <li className="cursor-pointer hover:text-[var(--primary-light)] flex gap-2 p-3 items-center">
                        <Icon
                          icon={"pixelarticons:trash"}
                          height={20}
                          width={20}
                        />
                        Remove
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

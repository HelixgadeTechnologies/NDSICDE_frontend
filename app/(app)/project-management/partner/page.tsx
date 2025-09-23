"use client";

import { useState } from "react";
import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";

export default function ProjectPartner() {
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const head = [
    "Partner Organization Name",
    "Email Address",
    "Role",
    "Last Active",
    "Actions",
  ];
  const data = [
    {
      userId: 1,
      name: "Seplat",
      email: "john.doe@mail.com",
      role: "Super Admin",
      lastActive: "May 15, 2023 10:30",
    },
    {
      userId: 2,
      name: "Seplat",
      email: "john.doe@mail.com",
      role: "Team Member",
      lastActive: "May 15, 2023 10:30",
    },
    {
      userId: 3,
      name: "Seplat",
      email: "john.doe@mail.com",
      role: "Admin",
      lastActive: "May 15, 2023 10:30",
    },
  ];

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button
          content="Add Project Partners"
          icon="si:add-fill"
          href="/project-management/partner/add"
        />
      </div>
      <CardComponent>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div className="w-4/5">
            <SearchInput
              name="search"
              value=""
              placeholder="Search Projects"
              onChange={() => {}}
            />
          </div>
          <div className="w-1/5 flex items-end gap-4">
            <DropDown
              value=""
              name="role"
              placeholder="All Role"
              onChange={() => {}}
              options={[]}
            />
          </div>
        </div>

        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"userId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.name}</td>
              <td className="px-6">{row.email}</td>
              <td className="px-6">{row.role}</td>
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
    </div>
  );
}

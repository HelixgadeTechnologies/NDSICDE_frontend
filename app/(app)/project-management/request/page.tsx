"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

export default function ProjectRequest() {
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const head = [
    "Activity Description",
    "Total Budget (₦)",
    "Activity Location",
    "Responsible Person(s)",
    "Start Date",
    "End Date",
    "Actions",
  ];

  const data = [
    {
      userId: 1,
      activityDescription: "Meeting with stakeholders in Akwa Ibom",
      totalBudget: "500,000",
      activityLocation: "Bayelsa",
      responsiblePersons: "Ifeoma",
      startDate: "12/03/2024",
      endDate: "12/03/2024",
    },
    {
      userId: 2,
      activityDescription: "Meeting with stakeholders in Akwa Ibom",
      totalBudget: "500,000",
      activityLocation: "Bayelsa",
      responsiblePersons: "Ifeoma",
      startDate: "12/03/2024",
      endDate: "12/03/2024",
    },
  ];
  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button content="Add Activity Request" icon="cil:plus" />
      </div>

      <CardComponent>
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"userId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.activityDescription}</td>
              <td className="px-6">{row.totalBudget}</td>
              <td className="px-6">{row.activityLocation}</td>
              <td className="px-6">{row.responsiblePersons}</td>
              <td className="px-6">{row.startDate}</td>
              <td className="px-6">{row.endDate}</td>
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
                          <Icon icon={"cil:pencil"} height={20} width={20} />
                          Edit
                        </li>
                        <li className="cursor-pointer hover:text-[var(--primary-light)] border-y border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"pixelarticons:trash"} height={20} width={20} />
                          Remove
                        </li>
                        <li className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center">
                          <Icon icon={"si:add-fill"} height={20} width={20} />
                          Retire
                        </li>
                        <li className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                          <Icon icon={"hugeicons:view"} height={20} width={20} />
                          View Activity
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

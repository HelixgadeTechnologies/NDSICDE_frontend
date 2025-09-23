"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

export default function ProjectActivity() {
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const head = [
    "Activity Statement",
    "Linked to Output",
    "Budget (₦)",
    "Start Date",
    "End Date",
    "Responsible Person(s)",
    "Actions",
  ];

  const data = [
    {
      userId: 1,
      activityStatement: "Seplat",
      output: "Output 1.1",
      budget: "300,000",
      startDate: "May 15, 2025 10:30",
      endDate: "May 20, 2025 11:00",
      responsiblePersons: "Ifeoma Ojadi",
    },
    {
      userId: 2,
      activityStatement: "Seplat",
      output: "Output 1.2",
      budget: "300,000",
      startDate: "May 15, 2025 10:30",
      endDate: "May 20, 2025 11:00",
      responsiblePersons: "Isioma Otokini",
    },
  ];
  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button content="Add Activity" icon="si:add-fill" />
      </div>

      <CardComponent>
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"userId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.activityStatement}</td>
              <td className="px-6">{row.output}</td>
              <td className="px-6">{row.budget}</td>
              <td className="px-6">{row.startDate}</td>
              <td className="px-6">{row.endDate}</td>
              <td className="px-6">{row.responsiblePersons}</td>
              <td className="px-6 relative">
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
                          <Icon
                            icon={"ph:pencil-simple-line"}
                            height={20}
                            width={20}
                          />
                          Edit
                        </li>
                        <li className="cursor-pointer hover:text-[var(--primary-light)] border-y border-gray-300 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"pixelarticons:trash"}
                            height={20}
                            width={20}
                          />
                          Remove
                        </li>
                        <li className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                          <Icon icon={"si:add-fill"} height={20} width={20} />
                          Report Actual Value
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

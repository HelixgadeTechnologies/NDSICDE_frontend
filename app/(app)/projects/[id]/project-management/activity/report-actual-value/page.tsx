"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function ReportActualValue() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const head = [
    "Activity Statement",
    "Liinked to Output",
    "Total Budget",
    "Responsible Person(s)",
    "Start Date",
    "End Date",
    "Actions",
  ];

  const data = [
    {
      userId: "1",
      activityStatement: "Activity Statement",
      linkedToOutput: "Output 1",
      budget: "200, 000",
      responsiblePerson: "Ifeoma",
      startDate: "12/03/2025",
      endDate: "12/03/2025",
    },
    {
      userId: "2",
      activityStatement: "Activity Statement",
      linkedToOutput: "Output 1",
      budget: "200, 000",
      responsiblePerson: "Ifeoma",
      startDate: "12/03/2025",
      endDate: "12/03/2025",
    },
  ];
  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button content="Add Indicator Reporting Formats" icon="si:add-fill" />
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
              <td className="px-6">{row.linkedToOutput}</td>
              <td className="px-6">{row.budget}</td>
              <td className="px-6">{row.responsiblePerson}</td>
              <td className="px-6">{row.startDate}</td>
              <td className="px-6">{row.endDate}</td>
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

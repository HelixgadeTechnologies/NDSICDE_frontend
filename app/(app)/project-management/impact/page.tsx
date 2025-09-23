"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

export default function ProjectImpact() {
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const head = [
    "Project Impact Statement",
    "Thematic Areas",
    "Responsible Person(s)",
    "Actions",
  ];
  const data = [
    {
      userId: 1,
      impactStatement: "Seplat",
      thematicAreas: "Thematic Areas",
      responsiblePerson: "Person 1",
    },
    {
      userId: 2,
      impactStatement: "Seplat",
      thematicAreas: "Thematic Areas",
      responsiblePerson: "Person 2",
    },
  ];
  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button content="Add Project Partners" icon="si:add-fill" />
      </div>

      <CardComponent>
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"userId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.impactStatement}</td>
              <td className="px-6">{row.thematicAreas}</td>
              <td className="px-6">{row.responsiblePerson}</td>
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
                          <Icon icon={"ph:pencil-simple-line"} height={20} width={20} />
                          Edit
                        </li>
                        <li className="cursor-pointer hover:text-[var(--primary-light)] border-y border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"pixelarticons:trash"} height={20} width={20} />
                          Remove
                        </li>
                        <li className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"si:add-fill"} height={20} width={20} />
                          Add Indicator
                        </li>
                        <li className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"hugeicons:view"} height={20} width={20} />
                          View Indicator
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

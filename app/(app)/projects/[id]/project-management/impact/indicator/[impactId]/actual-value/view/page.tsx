"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

export default function ViewActualValue() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const head = [
    "Indicator Source",
    "Thematic Areas",
    "Indicator Statement",
    "Responsible Person(s)",
    "Result Narrative",
    "Actions",
  ];
  const data = [
    {
      id: "1",
      indicator_source: "Source One",
      thematic_areas: "Development Outcome",
      indicator_statement: "Statement",
      responsible_person: "Person 1",
      result_narrative: "Narrative 1",
    },
    {
      id: "2",
      indicator_source: "Source One",
      thematic_areas: "Development Outcome",
      indicator_statement: "Statement",
      responsible_person: "Person 1",
      result_narrative: "Narrative 1",
    },
  ];
  return (
    <section className="relative mt-12">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Add Indicator Reporting Formats"
          icon="si:add-fill"
          href="/projects/1/project-management/impact/indicator/actual-value/report"
        />
      </div>

      <CardComponent>
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"id"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.indicator_source}</td>
              <td className="px-6">{row.thematic_areas}</td>
              <td className="px-6">{row.indicator_statement}</td>
              <td className="px-6">{row.responsible_person}</td>
              <td className="px-6">{row.result_narrative}</td>
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
                        prev === row.id ? null : row.id
                      )
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
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50">
                      <ul className="text-sm">
                        <li className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"ph:pencil-simple-line"}
                            height={20}
                            width={20}
                          />
                          Edit
                        </li>
                        <li className="cursor-pointer hover:text-(--primary-light) border-t border-gray-300 flex gap-2 p-3 items-center">
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
    </section>
  );
}

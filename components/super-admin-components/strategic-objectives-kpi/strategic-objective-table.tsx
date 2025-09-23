"use client";

import Table from "@/ui/table";
import { useStrategicObjectivesAndKPIsModal } from "@/utils/strategic-objective-kpi-utility";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AddKPIModal from "./add-kpi-form";

export default function SOTable() {
  const head = ["Objective Name", "Linked KPIs", "Status", "Actions"];

  const data = [
    {
      id: 1,
      objectiveName: "Improve food security in target communities",
      linkedKPIs: 4,
      status: "Active",
    },
    {
      id: 2,
      objectiveName: "Improve food security in target communities",
      linkedKPIs: 6,
      status: "Active",
    },
    {
      id: 3,
      objectiveName: "Improve food security in target communities",
      linkedKPIs: 3,
      status: "Active",
    },
  ];

  const [activeRowId, setActiveRowId] = useState<number | null>(null);

  const { addKPI, setAddKPI, handleAddKPI } =
    useStrategicObjectivesAndKPIsModal();

  return (
    <section>
      <Table
        checkbox
        idKey={"id"}
        tableHead={head}
        tableData={data}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.objectiveName}</td>
            <td className="px-6">{row.linkedKPIs}</td>
            <td className="px-6">{row.status}</td>
            <td className="px-6 relative">
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
                    className="absolute top-full mt-2 right-0 bg-white z-30 rounded-[6px] border border-[#E5E5E5] shadow-md w-[210px]"
                  >
                    <ul className="text-sm">
                      <li
                        onClick={() => handleAddKPI(setActiveRowId)}
                        className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center"
                      >
                        <Icon
                          icon={"fluent:arrow-growth-24-regular"}
                          height={20}
                          width={20}
                        />
                        Add Organizational KPI
                      </li>
                      <li className="cursor-pointer hover:text-blue-600 flex gap-2 border-y border-gray-300 p-3 items-center">
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

      {addKPI && (
        <AddKPIModal isOpen={addKPI} onClose={() => setAddKPI(false)} />
      )}
    </section>
  );
}

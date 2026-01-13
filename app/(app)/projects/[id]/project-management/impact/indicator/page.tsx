"use client";

import CardComponent from "@/ui/card-wrapper";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function ImpactIndicator() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const head = [
    "Indicator Statement",
    "Baseline Value",
    "Target Value",
    "Actual Value",
    "Disaggregation",
    "Responsible Person(s)",
    "Actions",
  ];

  const data = [
    {
      user_id: "1",
      indicator_statement:
        "Number of stakeholders  trained on leadership skill",
      baseline_value: 0,
      target_value: 200,
      actual_value: "-",
      disaggregation: "Sex",
      responsible_persons: "Ifeoma",
    },
    {
      user_id: "2",
      indicator_statement:
        "Number of stakeholders  trained on leadership skill",
      baseline_value: 0,
      target_value: 145,
      actual_value: "-",
      disaggregation: "Sex",
      responsible_persons: "Patrick",
    },
  ];
  return (
    <CardComponent>
      <Table
        tableHead={head}
        tableData={data}
        checkbox
        idKey={"user_id"}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.indicator_statement}</td>
            <td className="px-6">{row.baseline_value}</td>
            <td className="px-6">{row.target_value}</td>
            <td className="px-6">{row.actual_value}</td>
            <td className="px-6">{row.disaggregation}</td>
            <td className="px-6">{row.responsible_persons}</td>
            <td className="px-6 relative">
              <Icon
                icon={"uiw:more"}
                width={22}
                height={22}
                className="cursor-pointer"
                color="#909CAD"
                onClick={() =>
                  setActiveRowId((prev) =>
                    prev === row.user_id ? null : row.user_id
                  )
                }
              />
              {activeRowId === row.user_id && (
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
                      <li className="cursor-pointer hover:text-(--primary-light) border-y border-gray-300 flex gap-2 p-3 items-center">
                        <Icon
                          icon={"pixelarticons:trash"}
                          height={20}
                          width={20}
                        />
                        Remove
                      </li>
                      <Link
                        href={
                          "/projects/1/project-management/impact/indicator/actual-value/report"
                        }
                        className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                        <Icon icon={"si:add-fill"} height={20} width={20} />
                        Report Actual Value
                      </Link>
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

"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";
import AddProjectRequestRetirement from "@/components/project-management-components/add-project-request-retirement";
import BackButton from "@/ui/back-button";

export default function ProjectRequestRetirementPage() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [openAddRetirement, setOpenAddRetirement] = useState(false);

  const head = [
    "Activity Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total Budget (₦)",
    "Actual Cost (₦)",
    "Variance",
    "Actions",
  ];

  const data = [
    {
      userId: "1",
      description: "Accomodation",
      quantity: 2,
      frequency: 3,
      unit_cost: 300,
      total_budget: 180,
      actual_cost: 240,
      variance: 600,
    },
    {
      userId: "2",
      description: "Accomodation",
      quantity: 2,
      frequency: 3,
      unit_cost: 300,
      total_budget: 180,
      actual_cost: 240,
      variance: 600,
    },
  ];
  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button
          content="Add Retirement"
          icon="si:add-fill"
          onClick={() => setOpenAddRetirement(true)}
        />
      </div>

      <CardComponent>
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"userId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.description}</td>
              <td className="px-6">{row.quantity}</td>
              <td className="px-6">{row.frequency}</td>
              <td className="px-6">{row.unit_cost}</td>
              <td className="px-6">{row.total_budget}</td>
              <td className="px-6">{row.actual_cost}</td>
              <td className="px-6">{row.variance}</td>
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
        <div className="flex justify-between items-center pt-6 px-10 text-base font-medium">
          <p>Total  Activity Cost (N): 100,00</p>
          <p>Amount to reimburse to NDSICDE (N): 200,000</p>
          <p>Amount to reimburse to Staff (N): 200,000</p>
        </div>
      </CardComponent>

      <AddProjectRequestRetirement
        isOpen={openAddRetirement}
        onClose={() => setOpenAddRetirement(false)}
      />
    </div>
  );
}

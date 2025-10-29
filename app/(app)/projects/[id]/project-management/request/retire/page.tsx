"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";
import AddProjectRequestRetirement from "@/components/project-management-components/add-project-request-retirement";
import DashboardStat from "@/ui/dashboard-stat-card";
import SimpleFileInput from "@/ui/form/simple-file-input";
import TextInput from "@/ui/form/text-input";

export default function ProjectRequestRetirementPage() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [openAddRetirement, setOpenAddRetirement] = useState(false);
  const [fileInputs, setFileInputs] = useState<string[]>(["file-1"]);

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

  const dashboardData = [
    {
      title: "Total Requests",
      value: 0,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Total Approved",
      value: 0,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Total Rejected",
      value: 0,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Total Pending",
      value: 0,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Total Retired",
      value: 0,
      icon: "fluent:target-24-filled",
    },
  ];

  const handleAddFileInput = () => {
    const newId = `file-${Date.now()}`;
    setFileInputs([...fileInputs, newId]);
  };

  const handleRemoveFileInput = (id: string) => {
    if (fileInputs.length > 1) {
      setFileInputs(fileInputs.filter((inputId) => inputId !== id));
    }
  };

  return (
    <div className="mt-12 space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DashboardStat data={dashboardData} icon="basil:plus-solid" />
      </div>
      <div className="w-[200px]">
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
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-[6px] border border-[#E5E5E5] shadow-md w-[200px]">
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
          <p>Total Activity Cost (N): 100,00</p>
          <p>Amount to reimburse to NDSICDE (N): 200,000</p>
          <p>Amount to reimburse to Staff (N): 200,000</p>
        </div>
      </CardComponent>

      <div className="space-y-4">
        {fileInputs.map((id) => (
          <div key={id} className="flex items-center gap-4">
            <div className="flex items-center flex-1 gap-5">
              <SimpleFileInput id={id} />
              <TextInput
              placeholder="Enter File Name"
              value=""
              onChange={() => {}}
              name="fileName"
              />
            </div>
            {fileInputs.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveFileInput(id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label="Remove file input">
                <Icon icon="pixelarticons:trash" width={20} height={20} />
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddFileInput}
          className="flex items-center gap-2 text-gray-400 text-sm hover:text-gray-500 font-medium transition-color cursor-pointers">
          <Icon icon="si:add-fill" width={18} height={18} />
          Add file
        </button>
      </div>

      <div className="w-[400px] gap-6 mt-6 flex">
        <Button content="Submit" isSecondary />
        <Button content="Print" onClick={() => window.print()} />
      </div>

      <AddProjectRequestRetirement
        isOpen={openAddRetirement}
        onClose={() => setOpenAddRetirement(false)}
      />
    </div>
  );
}
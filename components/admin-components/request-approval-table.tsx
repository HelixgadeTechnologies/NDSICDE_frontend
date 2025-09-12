"use client";

import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import SearchInput from "@/ui/form/search";
import Table from "@/ui/table";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import FinancialRequestModal from "./financial-request-modal";

export default function RequestApprovalsTable() {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const [openView, setOpenView] = useState(false);
  const handleModalOpen = () => {
    setOpenView(true);
  }

  const tabs = [
    { tabName: "Activity Financial Request", id: 1 },
    { tabName: "Retirement Request", id: 2 },
  ];


  function ActivityFinancialRequestTable() {
    const activityFinancialRequestHead = [
      "Activity Description",
      "Total Budget (₦)",
      "Responsible Person(s)",
      "Start Date",
      "End Date",
      "Status",
      "Actions",
    ];

    const activityFinancialRequestData = [
      {
        id: 1,
        description: "Meeting with stakeholders in Akwa Ibom",
        totalBudget: "500, 000",
        responsiblePersons: "Ifeoma Johnson",
        startDate: "12/03/2024",
        endDate: "12/03/2024",
        status: "Pending",
      },
      {
        id: 2,
        description: "Meeting with stakeholders in Akwa Ibom",
        totalBudget: "500, 000",
        responsiblePersons: "Ifeoma Johnson",
        startDate: "12/03/2024",
        endDate: "12/03/2024",
        status: "Approved",
      },
    ];

    return (
      <Table
        tableHead={activityFinancialRequestHead}
        tableData={activityFinancialRequestData}
        checkbox
        idKey={"id"}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.description}</td>
            <td className="px-6">{row.totalBudget}</td>
            <td className="px-6">{row.responsiblePersons}</td>
            <td className="px-6">{row.startDate}</td>
            <td className="px-6">{row.endDate}</td>
            <td className={`px-6 ${row.status === "Pending" ? 'text-yellow-500' : row.status === "Approved" ? 'text-green-500' : 'text-red-500'}`}>{row.status}</td>
            <td className="px-6">
              <Icon
                icon={"fluent-mdl2:view"}
                width={16}
                height={16}
                onClick={() => handleModalOpen()}
              />
            </td>
          </>
        )}
      />
    );
  }

  function RetirementRequestTable() {
    const retirementRequestHead = [
      "Activity Line Description",
      "Quantity",
      "Frequency",
      "Unit Cost (₦)",
      "Total Budget (₦)",
      "Actual Cost (₦)",
      "Status",
      "Actions",
    ];

    const retirementRequestData = [
      {
        id: 1,
        description: "Accomodation",
        quantity: 2,
        frequency: 3,
        unitCost: "30, 000",
        totalBudget: "180,000",
        actualCost: "240,000",
        status: "Pending",
      },
      {
        id: 2,
        description: "Accomodation",
        quantity: 2,
        frequency: 3,
        unitCost: "30, 000",
        totalBudget: "180,000",
        actualCost: "240,000",
        status: "Rejected",
      },
    ];

    return (
      <Table
        tableHead={retirementRequestHead}
        tableData={retirementRequestData}
        checkbox
        idKey={"id"}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.description}</td>
            <td className="px-6">{row.quantity}</td>
            <td className="px-6">{row.frequency}</td>
            <td className="px-6">{row.unitCost}</td>
            <td className="px-6">{row.totalBudget}</td>
            <td className="px-6">{row.actualCost}</td>
            <td className={`px-6 ${row.status === "Pending" ? 'text-yellow-500' : row.status === "Approved" ? 'text-green-500' : 'text-red-500'}`}>{row.status}</td>
            <td className="px-6">
              <Icon
                icon={"fluent-mdl2:view"}
                width={16}
                height={16}
              />
            </td>
          </>
        )}
      />
    );
  }

  return (
    <>
      <CardComponent>
        <div className="flex justify-between items-center gap-8">
          {/* Hardcoded Tabs */}
          <div className="w-fit h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg">
            {tabs.map((d) => {
              const isActive = activeTab === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => handleTabChange(d.id)}
                  className="relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab"
                      className="absolute inset-0 z-0 bg-white rounded-lg text-[#242424]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <div
                    className={`relative z-10 px-3 md:px-6 h-10 flex items-center justify-center font-bold text-xs md:text-sm cursor-pointer whitespace-nowrap ${
                      isActive ? "text-[#242424]" : "text-[#7A7A7A]"
                    }`}
                  >
                    {d.tabName}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-fit flex items-end gap-4">
            <SearchInput
              value=""
              name="search"
              onChange={() => {}}
              placeholder="Search Request"
            />
            <DropDown
              value=""
              name="status"
              placeholder="All Status"
              label="Status"
              onChange={() => {}}
              options={[]}
            />
          </div>
        </div>

        {/* tables */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-4"
          >
            {activeTab === 1 && <ActivityFinancialRequestTable />}
            {activeTab === 2 && <RetirementRequestTable />}
          </motion.div>
        </AnimatePresence>
      </CardComponent>

    <FinancialRequestModal 
    isOpen={openView}
    onClose={() => setOpenView(false)}
    />
    </>
  );
}

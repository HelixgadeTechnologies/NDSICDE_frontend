"use client";

import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import SearchInput from "@/ui/form/search";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import DateRangePicker from "@/ui/form/date-range";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { activity_financial_request, activity_financial_retirement } from "@/lib/config/request-approvals-dashboard";
import DashboardStat from "@/ui/dashboard-stat-card";

export default function RequestApprovalsTable() {
  const tabs = [
    { tabName: "Activity Financial Request", id: 1 },
    { tabName: "Activity Financial Retirement", id: 2 },
  ];

  function ActivityFinancialRequestTable() {
    const activityFinancialRequestHead = [
      "Activity Description",
      "Total Budget (₦)",
      "Responsible Person(s)",
      "Projects",
      "Start Date",
      "End Date",
      "Status",
    ];

    const activityFinancialRequestData = [
      {
        id: 1,
        description: "Meeting with stakeholders in Akwa Ibom",
        totalBudget: "500, 000",
        responsiblePersons: "Ifeoma Johnson",
        project: "Project 1",
        startDate: "12/03/2024",
        endDate: "12/03/2024",
        status: "Pending",
      },
      {
        id: 2,
        description: "Meeting with stakeholders in Akwa Ibom",
        totalBudget: "500, 000",
        responsiblePersons: "Ifeoma Johnson",
        project: "Project 1",
        startDate: "12/03/2024",
        endDate: "12/03/2024",
        status: "Approved",
      },
    ];

    return (
      <div className="space-y-5">
        <div className="w-full flex items-end justify-end gap-4">
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
          <DropDown
            value=""
            name="project"
            placeholder="All Projects"
            label="Project"
            onChange={() => {}}
            options={[]}
          />
          <DateRangePicker label="Date" />
        </div>
        <Table
          tableHead={activityFinancialRequestHead}
          tableData={activityFinancialRequestData}
          checkbox
          idKey={"id"}
          renderRow={(row) => (
            <>
              <td className="px-6 cursor-pointer hover:underline">
                <Link href={`/request-approvals/requests/${row.id}`}>
                  {row.description}
                </Link>
              </td>
              <td className="px-6">{row.totalBudget}</td>
              <td className="px-6">{row.responsiblePersons}</td>
              <td className="px-6">{row.project}</td>
              <td className="px-6">{row.startDate}</td>
              <td className="px-6">{row.endDate}</td>
              <td
                className={`px-6 ${
                  row.status === "Pending"
                    ? "text-yellow-500"
                    : row.status === "Approved"
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                {row.status}
              </td>
            </>
          )}
        />
      </div>
    );
  }

  function ActivityFinancialRetirement() {
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
      <div className="space-y-5">
        <div className="w-full flex items-end justify-end gap-4">
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
          <DropDown
            value=""
            name="project"
            placeholder="All Projects"
            label="Project"
            onChange={() => {}}
            options={[]}
          />
          <SearchInput
            value=""
            name="journalId"
            placeholder="All Journal IDs"
            onChange={() => {}}
          />
          <DateRangePicker label="Date" />
        </div>
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
              <td
                className={`px-6 ${
                  row.status === "Pending"
                    ? "text-yellow-500"
                    : row.status === "Approved"
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                {row.status}
              </td>
              <td className="px-6">
                <Link href={`/request-approvals/retirement/${row.id}`}>
                  <Icon icon={"fluent-mdl2:view"} width={16} height={16} />
                </Link>
              </td>
            </>
          )}
        />
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState(1);

  return (
     <section>
          <div className={`grid grid-cols-1 gap-4 my-5 ${activeTab === 1 ? ' md:grid-cols-4' : ' md:grid-cols-5'}`}>
            <DashboardStat data={activeTab === 1 ? activity_financial_request : activity_financial_retirement} />
          </div>
          <CardComponent>
            {/* hardcoded tabs */}
            <div
              className={`w-full relative h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg mb-4`}>
              {tabs.map((d) => {
                const isActive = activeTab === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setActiveTab(d.id)}
                    className="relative z-10">
                    {isActive && (
                      <motion.div
                        layoutId="tab"
                        className="absolute inset-0 z-0 bg-white rounded-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div
                      className={`relative z-10 px-3 md:px-6 h-10 flex items-center justify-center font-bold text-xs md:text-sm cursor-pointer whitespace-nowrap ${
                        isActive ? "text-[#242424]" : "text-[#7A7A7A]"
                      }`}>
                      {d.tabName}
                    </div>
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}>
                {activeTab === 1 && <ActivityFinancialRequestTable />}
                {activeTab === 2 && <ActivityFinancialRetirement />}
              </motion.div>
            </AnimatePresence>
          </CardComponent>
        </section>
  );
}

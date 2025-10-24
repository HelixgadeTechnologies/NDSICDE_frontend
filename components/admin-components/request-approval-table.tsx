"use client";

import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import SearchInput from "@/ui/form/search";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import DateRangePicker from "@/ui/form/date-range";
import TabComponent from "@/ui/tab-component";
import Link from "next/link";

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
      "Actions",
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
              <td className="px-6">
                {/* <Icon
                  icon={"fluent-mdl2:view"}
                  width={16}
                  height={16}
                  onClick={() => handleModalOpen()}
                /> */}
                <Link href={`/request-approvals/requests/${row.id}`}>
                  <Icon icon={"fluent-mdl2:view"} width={16} height={16} />
                </Link>
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
                <Icon icon={"fluent-mdl2:view"} width={16} height={16} />
              </td>
            </>
          )}
        />
      </div>
    );
  }

  return (
    <>
      <CardComponent>
        <TabComponent
          data={tabs}
          renderContent={(rowId) => {
            if (rowId === 1) {
              return <ActivityFinancialRequestTable />;
            } else {
              return <ActivityFinancialRetirement />;
            }
          }}
        />
      </CardComponent>
    </>
  );
}

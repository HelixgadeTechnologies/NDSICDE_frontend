"use client";

import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import BarChartComponent from "@/ui/bar-chart";
import Button from "@/ui/form/button";
import { Icon } from "@iconify/react";

export default function DetailedExpenseBreakdown() {
  const tabs = [
    { tabName: "Transactions", id: 1 },
    { tabName: "Categories", id: 2 },
  ];

  const bars = [{ key: "value", label: "Category", color: "#D2091E" }];

  const barData = [
    { name: "Personnel", value: 35000 },
    { name: "Equipment", value: 15000 },
    { name: "Logistics", value: 50000 },
    { name: "Software", value: 25000 },
    { name: "Marketing", value: 35000 },
  ];

  const head = [
    "Transaction ID",
    "Project",
    "Date",
    "Category",
    "Amount",
    "Description",
    "Receipt",
  ];

  const tableData = [
    {
      id: 1,
      transactionID: "TRX-001",
      project: "Digital Transformation",
      date: "May 15, 2023 10:30",
      category: "Equipment",
      amount: "12,500",
      description: "Server hardware purchase",
    },
    {
      id: 2,
      transactionID: "TRX-001",
      project: "Digital Transformation",
      date: "May 15, 2023 10:30",
      category: "Equipment",
      amount: "12,500",
      description: "Server hardware purchase",
    },
  ];
  return (
    <>
      <CardComponent>
        <Heading heading="Detailed Expense Breakdown" />
        <div className="my-5">
          <TabComponent
            data={tabs}
            renderContent={(tabId) => {
              if (tabId === 1) {
                return (
                  <Table
                    tableHead={head}
                    tableData={tableData}
                    checkbox
                    idKey="id"
                    onSelectionChange={(selected) => {
                      console.log("Selected rows:", selected);
                    }}
                    renderRow={(row) => (
                      <>
                        <td className="px-6">{row.transactionID}</td>
                        <td className="px-6">{row.project}</td>
                        <td className="px-6">{row.date}</td>
                        <td className="px-6">{row.category}</td>
                        <td className="px-6">${row.amount}</td>
                        <td className="px-6">{row.description}</td>
                        <td className="px-6 cursor-pointer">
                          <Icon
                            icon="fluent:document-28-regular"
                            height={25}
                            width={25}
                          />
                        </td>
                      </>
                    )}
                  />
                );
              } else {
                return (
                  <div className="h-[330px]">
                    <BarChartComponent
                      data={barData}
                      xKey="name"
                      bars={bars}
                      legend={false}
                    />
                  </div>
                );
              }
            }}
          />
        </div>
      </CardComponent>
      <div className="w-[280px]">
        <Button content="Export" icon="uil:export" />
      </div>
    </>
  );
}

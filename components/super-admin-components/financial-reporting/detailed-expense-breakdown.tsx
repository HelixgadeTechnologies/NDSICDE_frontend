"use client";

import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import TabComponent from "@/ui/tab-component";
import Table from "@/ui/table";
import BarChartComponent from "@/ui/bar-chart";
import Button from "@/ui/form/button";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";

type TransactionType = {
    transactionId: string,
    projectId: string,
    projectName: string,
    date: string,
    category: string,
    amount: number,
    description: string,
    receipt: string,
    type: string
}
type CategoryType = {
  category: string,
  amount: number,
  percentage: number
}

export default function DetailedExpenseBreakdown() {
  const tabs = [
    { tabName: "Transactions", id: 1 },
    { tabName: "Categories", id: 2 },
  ];

  const bars = [{ key: "value", label: "Category", color: "#D2091E" }];
  const head = [
    "Transaction ID",
    "Project",
    "Date",
    "Category",
    "Amount",
    "Description",
    "Receipt",
  ];
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/financial-dashboard/detailed-expenses`)
        setTransactions(res.data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    // const fetchCategories = async () => {
    //   try {
    //     const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/financial-dashboard/expense-breakdown`)
    //     setCategories(res.data.data);
    //   } catch (error) {
    //     console.error("Error fetching categories:", error);
    //   }
    // };
    fetchTransactions();
    // fetchCategories();
  }, []);

  return (
    <>
      <CardComponent>
        <Heading heading="Detailed Expense Breakdown" />
        <div className="my-5">
          <TabComponent
            data={tabs}
            renderContent={(tabId) => {
              if (tabId === 1) {
                return loading ? (
                     <div className="dots my-20 mx-auto">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                  ) : <Table
                    tableHead={head}
                    tableData={transactions}
                    checkbox
                    idKey="transactionId"
                    onSelectionChange={(selected) => {

                    }}
                    renderRow={(row) => (
                      <>
                        <td className="px-6 max-w-[100px] truncate uppercase">{row.transactionId}</td>
                        <td className="px-6 max-w-[200px] truncate">{row.projectName}</td>
                        <td className="px-6">{formatDate(row.date, "date-only")}</td>
                        <td className="px-6">{row.category}</td>
                        <td className="px-6">₦{row.amount.toLocaleString()}</td>
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
                  />;
              } else {
                return (
                  <div className="h-[330px]">
                    <BarChartComponent
                      data={categories}
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


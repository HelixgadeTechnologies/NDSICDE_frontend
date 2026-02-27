"use client";

import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import SearchInput from "@/ui/form/search";
import Table from "@/ui/table";
import DateRangePicker from "@/ui/form/date-range";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  activity_financial_request,
  activity_financial_retirement,
} from "@/lib/config/request-approvals-dashboard";
import DashboardStat from "@/ui/dashboard-stat-card";
import { Icon } from "@iconify/react";
import { formatDate } from "@/utils/dates-format-utility";

export default function RequestApprovalsTable({ showStats }: { showStats?: boolean }) {
  const tabs = [
    { tabName: "Activity Financial Request", id: 1 },
    { tabName: "Activity Financial Retirement", id: 2 },
  ];

  function ActivityFinancialRequestTable() {
    const activityFinancialRequestHead = [
      "Activity Description",
      "Total Budget (₦)",
      "Responsible Person(s)",
      "Project",
      "Start Date",
      "End Date",
      "Status",
    ];

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [project, setProject] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/list`,
            {
              params: {
                type: "request",
                search: search || undefined,
                status: status === "All" ? undefined : (status || undefined),
                projectId: project || undefined,
              },
            }
          );
          // Assuming response has a 'data' array
          setData(res.data.data || []);
          console.log(res.data.data)
        } catch (error) {
          console.error("Failed to fetch requests", error);
        } finally {
          setLoading(false);
        }
      };

      const debounceId = setTimeout(() => {
        fetchData();
      }, 500);

      return () => clearTimeout(debounceId);
    }, [search, status, project]);

    return (
      <div className="space-y-5">
        <div className="w-full flex items-end justify-end gap-4">
          <SearchInput
            value={search}
            name="search"
            onChange={(e: any) => setSearch(e.target.value)}
            placeholder="Search Request"
          />
          <DropDown
            value={status}
            name="status"
            placeholder="All Status"
            label="Status"
            onChange={(e: any) => setStatus(e.target.value)}
            options={[
              { label: "All", value: "All" },
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
            ]}
          />
          <DropDown
            value={project}
            name="project"
            placeholder="All Projects"
            label="Project"
            onChange={(e: any) => setProject(e.target.value)}
            options={[]} // Add project options if available
          />
          <DateRangePicker label="Date" />
        </div>
        <Table
          tableHead={activityFinancialRequestHead}
          tableData={data}
          checkbox
          idKey={"id"}
          renderRow={(row) => (
            <>
              <td className="px-6 cursor-pointer hover:underline">
                <Link href={`/request-approvals/requests/${row.id}`}>
                  {row.activityLineDescription || "N/A"}
                </Link>
              </td>
              <td className="px-6">{row.total || "0"}</td>
              <td className="px-6">{row.staff || "N/A"}</td>
              <td className="px-6">{row.project || "N/A"}</td>
              <td className="px-6">{formatDate(row.activityStartDate, "date-only") || "N/A"}</td>
              <td className="px-6">{formatDate(row.activityEndDate, "date-only") || "N/A"}</td>
              <td
                className={`px-6 ${
                  row.status === "Pending"
                    ? "text-yellow-500"
                    : row.status === "Approved"
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                {row.status || "N/A"}
              </td>
            </>
          )}
        />
      </div>
    );
  }

  function ActivityFinancialRetirement() {
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

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [project, setProject] = useState("");

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/list`,
            {
              params: {
                type: "retirement",
                search: search || undefined,
                status: status === "All" ? undefined : (status || undefined),
                projectId: project || undefined,
              },
            }
          );
          // Assuming response has a 'data' array
          setData(res.data?.data || []);
        } catch (error) {
          console.error("Failed to fetch retirements", error);
        } finally {
          setLoading(false);
        }
      };

      const debounceId = setTimeout(() => {
        fetchData();
      }, 500);

      return () => clearTimeout(debounceId);
    }, [search, status, project]);

    return (
      <div className="space-y-5">
        <div className="w-full flex items-end justify-end gap-4">
          <SearchInput
            value={search}
            name="search"
            onChange={(e: any) => setSearch(e.target.value)}
            placeholder="Search Request"
          />
          <DropDown
            value={status}
            name="status"
            placeholder="All Status"
            label="Status"
            onChange={(e: any) => setStatus(e.target.value)}
            options={[
              { label: "All", value: "All" },
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
            ]}
          />
          <DropDown
            value={project}
            name="project"
            placeholder="All Projects"
            label="Project"
            onChange={(e: any) => setProject(e.target.value)}
            options={[]} // Add project options if available
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
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"id"}
          renderRow={(row) => (
            <>
              <td className="px-6">
                <Link href={`/request-approvals/retirement/${row.id}`} className="hover:underline">
                  {row.lineItemDesc || row.description || "N/A"}
                </Link>
              </td>
              <td className="px-6">{row.quantity || "0"}</td> 
              <td className="px-6">{row.frequency || "0"}</td>
              <td className="px-6">{row.unit_cost || row.unitCost || "0"}</td>
              <td className="px-6">{row.total_budget || row.totalBudget || "0"}</td>
              <td className="px-6">{row.actual_cost || row.actualCost || "0"}</td>
              <td className="px-6">{row.variance || "0"}</td>
              <td className="px-6 relative">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"              
                   />
              </td>
            </>
          )}
        />
        <div className="flex justify-between items-center pt-6 px-10 text-base font-medium">
          <p>Total Activity Cost (N): 100,00</p>
          <p>Amount to reimburse to NDSICDE (N): 200,000</p>
          <p>Amount to reimburse to Staff (N): 200,000</p>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState(1);

  return (
    <section>
     {showStats && <div
        className={`grid grid-cols-1 gap-4 my-5 ${
          activeTab === 1 ? " md:grid-cols-4" : " md:grid-cols-5"
        }`}>
        <DashboardStat
          data={
            activeTab === 1
              ? activity_financial_request
              : activity_financial_retirement
          }
        />
      </div>}
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

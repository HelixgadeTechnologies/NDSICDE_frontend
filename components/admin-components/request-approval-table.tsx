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
import { convertDateToISO8601, formatDate } from "@/utils/dates-format-utility";
import { ActivityRequestType, RetirementRequestType } from "@/types/retirement-request";
import { useProjects } from "@/context/ProjectsContext";


function ActivityFinancialRequestTable({ type }: { type?: string }) {
  const activityFinancialRequestHead = [
    "Activity Description",
    "Total Budget (₦)",
    "Responsible Person(s)",
    "Project",
    "Start Date",
    "End Date",
    "Status",
  ];

  const [data, setData] = useState<ActivityRequestType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const { projectOptions } = useProjects();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const formattedStartDate = convertDateToISO8601(dates.startDate);
        const formattedEndDate = convertDateToISO8601(dates.endDate);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/request-retirement-dashboard/list?type=${type}&search=${search}&status=${status}&projectId=${project}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        );
        setData(res.data.data);
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
  }, [search, status, project, dates, type]);

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
          options={projectOptions} 
        />
        <DateRangePicker 
          label="Date" 
          onChange={(dateRange) => setDates({ startDate: dateRange.startDate || "", endDate: dateRange.endDate || "" })} 
        />
      </div>
      {loading ? (
        <div className="dots my-20 mx-auto">
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : <Table
        tableHead={activityFinancialRequestHead}
        tableData={data}
        checkbox
        idKey={"requestId"}
        renderRow={(row) => (
          <>
            <td className="px-6 cursor-pointer hover:underline">
              <Link href={`/request-approvals/requests/${row.requestId}`}>
                {row.activityLineDescription || "N/A"}
              </Link>
            </td>
            <td className="px-6">{row.total || "0"}</td>
            <td className="px-6">{row.staff || "N/A"}</td>
            <td className="px-6">{row.project?.projectName || "N/A"}</td>
            <td className="px-6">
              {formatDate(row.activityStartDate, "date-only") || "N/A"}
            </td>
            <td className="px-6">
              {formatDate(row.activityEndDate, "date-only") || "N/A"}
            </td>
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
      />}
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
  ];

  const [data, setData] = useState<RetirementRequestType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [journalId, setJournalId] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const { projectOptions } = useProjects();

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
              status: status === "All" ? undefined : status || undefined,
              projectId: project || undefined,
              journalId: journalId || undefined,
              startDate: dates.startDate ? convertDateToISO8601(dates.startDate) : undefined,
              endDate: dates.endDate ? convertDateToISO8601(dates.endDate) : undefined,
            },
          },
        );
        setData(res.data?.data || []);
        console.log(res.data.data);
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
  }, [search, status, project, journalId, dates]);

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
          options={projectOptions} 
        />
        <SearchInput
          value={journalId}
          name="journalId"
          placeholder="All Journal IDs"
          onChange={(e: any) => setJournalId(e.target.value)}
        />
        <DateRangePicker 
          label="Date"
          onChange={(dateRange) => setDates({ startDate: dateRange.startDate || "", endDate: dateRange.endDate || "" })} 
        />
      </div>
     {loading ? (
      <div className="dots my-20 mx-auto">
        <div></div>
        <div></div>
        <div></div>
      </div>
     ) : <Table
        tableHead={head}
        tableData={data}
        checkbox
        idKey={"retirementId"}
        renderRow={(row) => (
          <>
            <td className="px-6">
              <Link
                href={`/request-approvals/retirement/${row.retirementId}`}
                className="hover:underline">
                {row.activityLineDescription || "N/A"}
              </Link>
            </td>
            <td className="px-6">{row.quantity || "0"}</td>
            <td className="px-6">{row.frequency || "0"}</td>
            <td className="px-6">{row.unitCost || "0"}</td>
            <td className="px-6">
              {row.totalBudget || "0"}
            </td>
            <td className="px-6">{row.actualCost || "0"}</td>
          </>
        )}
      />}
      <div className="flex justify-between items-center pt-6 px-10 text-base font-medium">
        <p>Total Activity Cost (₦): {data.reduce((acc, curr) => acc + (curr.actualCost || 0), 0).toLocaleString()}</p>
        <p>Amount to reimburse to NDSICDE (₦): 0</p>
        <p>Amount to reimburse to Staff (₦): 0</p>
      </div>
    </div>
  );
}

export default function RequestApprovalsTable({
  showStats,
}: {
  showStats?: boolean;
}) {
  const tabs = [
    { tabName: "Activity Financial Request", id: 1 },
    { tabName: "Activity Financial Retirement", id: 2 },
  ];

  const [activeTab, setActiveTab] = useState(1);

  return (
    <section>
      {showStats && (
        <div
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
        </div>
      )}
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
            {activeTab === 1 && <ActivityFinancialRequestTable type={activeTab === 1 ? 'request' : ''} />}
            {activeTab === 2 && <ActivityFinancialRetirement />}
          </motion.div>
        </AnimatePresence>
      </CardComponent>
    </section>
  );
}

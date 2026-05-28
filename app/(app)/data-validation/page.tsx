"use client";

import DashboardStat from "@/ui/dashboard-stat-card";
import DataValidationTable from "@/components/super-admin-components/data-validation/data-validation-table";
import { useEffect, useState } from "react";
import axios from "axios";
import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import { useUIStore } from "@/store/ui-store";
import { format } from "date-fns";

type Stats = {
  totalSubmissions: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  pendingFinancialRequests: number;
  approvedRetirements: number;
  percentageFromLastMonth: number;
  approvalRate: number;
  rejectionRate: number;
}

import { AnimatePresence, motion } from "framer-motion";

export default function DataValidation() {
  const tabs = [
    { tabName: "Activity Financial Request", id: 1 },
    { tabName: "Activity Financial Retirement", id: 2 },
  ];
  const [activeTab, setActiveTab] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { resetDateRange } = useUIStore();

  const statusOptions = activeTab === 1 ? [
    { value: "", label: "All Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "In Review", label: "In Review" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ] : [
    { value: "", label: "All Statuses" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    totalSubmissions: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    pendingFinancialRequests: 0,
    approvedRetirements: 0,
    percentageFromLastMonth: 0,
    approvalRate: 0,
    rejectionRate: 0
  });

  const [selectedDates, setSelectedDates] = useState<{
    startDate: string;
    endDate: string;
  }>(() => {
    // Initialize with current month dates
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      startDate: format(firstDayOfMonth, "M/d/yyyy"),
      endDate: format(lastDayOfMonth, "M/d/yyyy"),
    };
  });

  // Fetch stats when component mounts with default dates
  useEffect(() => {
    fetchStats(selectedDates.startDate, selectedDates.endDate);
  }, []);

  // Fetch stats whenever dates change
  useEffect(() => {
    fetchStats(selectedDates.startDate, selectedDates.endDate);
  }, [selectedDates.startDate, selectedDates.endDate, activeTab]);

  // Reset status filter when switching tabs (options differ per tab)
  useEffect(() => {
    setStatusFilter("");
  }, [activeTab]);

  // Function to fetch statistics from the API
  const fetchStats = async (startDate: string, endDate: string) => {
    setIsLoadingStats(true);
    try {
      // Convert M/d/yyyy format to ISO string format that API expects
      const parseDate = (dateStr: string): Date => {
        const [month, day, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
      };

      const startDateObj = parseDate(startDate);
      const endDateObj = parseDate(endDate);
      
      // Set start time to 00:00:00
      startDateObj.setHours(0, 0, 0, 0);
      // Set end time to 23:59:59.999
      endDateObj.setHours(23, 59, 59, 999);

      // Encode ISO strings for URL
      const encodedStartDate = encodeURIComponent(startDateObj.toISOString());
      const encodedEndDate = encodeURIComponent(endDateObj.toISOString());

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/data-validation/stats?startDate=${encodedStartDate}&endDate=${encodedEndDate}&type=${activeTab === 1 ? 'request' : 'retirement'}`
      );
      setStats(res.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Handle date range selection from the DateRangePicker
  const handleDateRangeChange = (range: { startDate: string; endDate: string }) => {
    setSelectedDates(range);
  };

  console.log(stats);
  
  const dashboardData = [
    {
      title: "Total Submitted Request",
      value: isLoadingStats ? "..." : stats.totalSubmissions,
      percentage: stats.percentageFromLastMonth,
      percentInfo: "from last month",
      icon: "proicons:graph",
    },
    // {
    //   title: "Pending Review",
    //   value: isLoadingStats ? "..." : stats.pendingReview,
    //   percentage: stats.pendingReview && stats.totalSubmissions
    //     ? (stats.pendingReview / stats.totalSubmissions) * 100
    //     : 0,
    //   percentInfo: " of total submissions",
    //   icon: "material-symbols:planner-review-rounded",
    // },
    {
      title: "Approved Requests",
      value: isLoadingStats ? "..." : stats.approved,
      percentage: stats.approvalRate,
      percentInfo: "approval rate",
      icon: "duo-icons:approved",
    },
    {
      title: "Rejected Requests",
      value: isLoadingStats ? "..." : stats.rejected,
      percentage: stats.rejectionRate,
      percentInfo: "rejection rate",
      icon: "marketeq:rejected-file-2",
    },
    {
      title: "Pending Financial Requests",
      value: isLoadingStats ? "..." : stats.pendingFinancialRequests,
      percentInfo: "Awaiting approval",
    },
    {
      title: "Approved Retirements",
      value: isLoadingStats ? "..." : stats.approvedRetirements,
      percentInfo: "Completed this period",
    },
  ];

  return (
    <section className="space-y-5 relative">
      <div className="absolute -top-16 right-5">
        <DateRangePicker onChange={handleDateRangeChange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>

      <CardComponent>
        {/* Tab switcher replicated from admin */}
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

        {/* Status filter (date filter lives in the top-right DateRangePicker) */}
        <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
          <div className="w-full sm:w-48">
            <DropDown
              name="statusFilter"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={statusOptions}
              placeholder="All Statuses"
            />
          </div>

          {statusFilter && (
            <button
              onClick={() => {
                setStatusFilter("");
                resetDateRange();
              }}
              className="h-10 px-4 w-full sm:w-auto text-sm font-semibold text-gray-555 hover:text-red-550 hover:bg-red-50 border border-gray-200 hover:border-red-100 rounded-md transition-all flex items-center justify-center gap-1.5">
              Clear
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}>
            <DataValidationTable
              startDate={selectedDates.startDate}
              endDate={selectedDates.endDate}
              activeTab={activeTab}
              statusFilter={statusFilter}
            />
          </motion.div>
        </AnimatePresence>
      </CardComponent>
    </section>
  );
}
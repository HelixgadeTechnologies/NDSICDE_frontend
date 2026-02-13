"use client";

import DashboardStat from "@/ui/dashboard-stat-card";
import BudgetVSExpenditureTrends from "@/components/super-admin-components/financial-reporting/budget-expenditure-trends";
import FinancialPerformance from "@/components/super-admin-components/financial-reporting/cpi-spi-parent";
import BudgetVSActuals from "@/components/super-admin-components/financial-reporting/budget-vs-actuals-table";
import DetailedExpenseBreakdown from "@/components/super-admin-components/financial-reporting/detailed-expense-breakdown";
import { FinancialReportApiResponse } from "@/types/admin-types";
import { useState, useEffect } from "react";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import { useProjects } from "@/context/ProjectsContext";
import axios from "axios";
import { useUIStore } from "@/store/ui-store";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function FinancialReporting() {
  const [summaryData, setSummaryData] = useState<FinancialReportApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const { projectOptions } = useProjects();
  const { dateRange } = useUIStore();

  useEffect(() => {
    const fetchSummaryData = async () => {
      setLoading(true);
      try {
        const start = format(dateRange.startDate, "yyyy-MM-dd");
        const end = format(dateRange.endDate, "yyyy-MM-dd");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/financial-dashboard?startDate=${start}&endDate=${end}&projectId=${selectedProject}`
        );
        setSummaryData(response.data.data);
        console.log(response.data.data)
        toast.success(response.data.message)
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummaryData();
  }, [dateRange.startDate, dateRange.endDate, selectedProject]);

  const dashboardData = [
    {
      title: "Total Budget Allocated",
      value: `₦${summaryData?.summary?.totalBudgetAllocated?.toLocaleString() || 0}`,
      percentInfo: "for selected period",
    },
    {
      title: "Total Expenses Incurred",
      value: `₦${summaryData?.summary?.totalExpensesIncurred?.toLocaleString() || 0}`,
      percentage: summaryData?.summary?.percentageFromLastPeriod || 0,
      percentInfo: "of total budget",
    },
    {
      title: "Budget Variance",
      value: `${summaryData?.summary?.budgetVariancePercentage || 0}%`,
      percentInfo: summaryData?.summary?.budgetVariancePercentage && summaryData.summary.budgetVariancePercentage > 0 ? "Over budget" : "Under budget",
    },
  ];

  return (
    <section className="space-y-5 relative pt-10">
      <div className="w-107.5 flex items-center gap-4 absolute -top-10 right-0">
        <DateRangePicker label="Date Range" />
        <DropDown
          label="Projects"
          name="projects"
          options={projectOptions}
          placeholder="All Projects"
          value={selectedProject}
          onChange={(value: string) => setSelectedProject(value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>
      {loading ? (
        <div className="dots my-20 mx-auto">
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <>
          <BudgetVSExpenditureTrends
            budgetTrends={summaryData?.budgetTrends || []}
            expenseBreakdown={summaryData?.expenseBreakdown || []}
          />
          <FinancialPerformance performanceData={summaryData?.projectPerformance || []} />
          <BudgetVSActuals data={summaryData?.budgetVsActuals || []} />
          <DetailedExpenseBreakdown
            detailedExpenses={summaryData?.detailedExpenses || []}
            expenseCategories={summaryData?.expenseBreakdown || []}
          />
        </>
      )}
    </section>

  );
}

import DashboardStat from "@/ui/dashboard-stat-card";
import BudgetVSExpenditureTrends from "@/components/admin-components/financial-reporting/budget-expenditure-trends";
import FinancialPerformance from "@/components/admin-components/financial-reporting/cpi-spi-parent";
import BudgetVSActuals from "@/components/admin-components/financial-reporting/budget-vs-actuals-table";
import DetailedExpenseBreakdown from "@/components/admin-components/financial-reporting/detailed-expense-breakdown";

export const metadata = {
  title: "Financial Reporting - NDSICDE",
  description: "View reports of budget allocation regarding KPI",
};

export default function FinancialReporting() {
  const dashboardData = [
    {
      title: "Total Budget Allocated",
      value: "$1,250,000",
      percentInfo: "for current fiscal year",
    },
    {
      title: "Total Expenses Incurred",
      value: "$875,000",
      percentage: 70,
      percentInfo: "of total budget",
    },
    // {
    //   title: "Pending Financial Requests",
    //   value: 13,
    //   percentInfo: "Awaiting approval",
    // },
    // {
    //   title: "Approved Retirements",
    //   value: 45,
    //   percentInfo: "Completed this period",
    // },
    {
      title: "Budget Variance",
      value: "-7.5%",
      percentInfo: "Over budget",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>
      <BudgetVSExpenditureTrends />
      <FinancialPerformance />
      <BudgetVSActuals />
      <DetailedExpenseBreakdown />
    </section>
  );
}

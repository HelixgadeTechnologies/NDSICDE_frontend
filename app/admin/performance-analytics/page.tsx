import DashboardStat from "@/ui/dashboard-stat-card";
import RestOfPage from "@/components/admin-components/performance-analytics/tab-switching-parent";

export const metadata = {
  title: "Performance Analytics & Reports - NDSICDE",
  description:
    "View real time analytics of performances from pervious projects",
};

export default function PerformanceAnalytics() {
  const dashboardData = [
    {
      title: "Total Active Projects",
      value: 24,
      percentage: 12,
      percentInfo: "from last month",
    },
    {
      title: "Completed KPIs",
      value: "78%",
      percentage: 5,
      percentInfo: "from last quarter",
    },
    {
      title: "Pending Financial Requests",
      value: 12,
      percentage: 3,
      percentInfo: "from yesterday",
    },
    {
      title: "Budget vs. Expenditure",
      value: "92%",
      percentage: 8,
      percentInfo: "utilization",
    },
    {
      title: "Project Health Score",
      value: 86,
      percentage: 3,
      percentInfo: "points",
    },
  ];
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 my-5">
        <DashboardStat data={dashboardData} icon="basil:arrow-up-outline" />
      </div>
      <RestOfPage />
    </section>
  );
}

import RetirementManagersChartAnalytics from "@/components/retirement-managers-components/dashboard/chart-analytics";
import RetirementManagersDashboardTable from "@/components/retirement-managers-components/dashboard/table-parent";
import DashboardStat from "@/ui/dashboard-stat-card";
import RequestApprovalsTable from "../admin-components/request-approval-table";

export const metadata = {
  title: "Dashboard - NDSICDE",
  description: "Request & Retirement Dashboard",
};

export default function RetirementManagersDashboard() {
  const dashboardData = [
    {
      title: "Pending Request",
      value: 24,
      percentage: 5,
      percentInfo: "since last week",
      icon: "et:piechart",
    },
    {
      title: "Awaiting Approval",
      value: 12,
      percentage: -2,
      percentInfo: "since last week",
      icon: "weui:time-outlined",
    },
    {
      title: "Retirement Request",
      value: 5,
      percentage: 8,
      percentInfo: "since last week",
      icon: "duo-icons:approved",
    },
  ];
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>
      <RetirementManagersChartAnalytics />
      {/* might be prone to change sha */}
      {/* <RetirementManagersDashboardTable /> */}
      <RequestApprovalsTable showStats={false} />
    </section>
  );
}

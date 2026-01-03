import ActivityOverview from "@/components/team-member-components/financial-dashboard";
import DashboardStat from "@/ui/dashboard-stat-card";

export const metadata = {
  title: "Financial Dashboard - NDSCIDE",
  description: "View your financial dashboard",
};

export default function FinancialDashboard() {
  const dashboardData = [
    {
      title: "Total Budget",
      value: 0,
      percentage: 0,
      percentInfo: "from last month",
      icon: "proicons:graph",
    },
    {
      title: "On Budget",
      value: 0,
      percentage: 0,
      percentInfo: "of total projects",
      icon: "material-symbols:planner-review-rounded",
    },
    {
      title: "Burn Rate",
      value: 0,
      percentage: 0,
      percentInfo: "of total projects",
      icon: "material-symbols:planner-review-rounded",
    },
    {
      title: "On Schedule",
      value: 0,
      percentage: 0,
      percentInfo: "of total Projects",
      icon: "duo-icons:approved",
    },
  ];
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardStat data={dashboardData} icon="basil:plus-solid" />
      </div>
      <ActivityOverview/>
    </section>
  );
}

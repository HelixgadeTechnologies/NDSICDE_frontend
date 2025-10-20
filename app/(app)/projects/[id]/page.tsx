import ChartsAndTableParent from "@/components/organizational-kpi/charts-table-parent";
import DashboardStat from "@/ui/dashboard-stat-card";

export const metadata = {
  title: "Result Dashboard - NDSCIDE",
  description: "View your result dashboard",
};

export default function ResultDashboard() {
  const dashboardData = [
    {
      title: "Total Submissions",
      value: 0,
      percentage: 0,
      percentInfo: "from last month",
      icon: "proicons:graph",
    },
    {
      title: "Pending Review",
      value: 0,
      percentage: 0,
      percentInfo: "of total submissions",
      icon: "material-symbols:planner-review-rounded",
    },
    {
      title: "Approved",
      value: 0,
      percentage: 0,
      percentInfo: "approval rate",
      icon: "duo-icons:approved",
    },
    {
      title: "Rejected",
      value: 0,
      percentage: 0,
      percentInfo: "rejection rate",
      icon: "marketeq:rejected-file-2",
    },
  ];
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardStat data={dashboardData} />
      </div>
      <ChartsAndTableParent />
    </section>
  );
}

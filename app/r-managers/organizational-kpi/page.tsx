import DashboardStat from "@/ui/dashboard-stat-card";
import RetirementManagerChartsAndTableParent from "@/components/retirement-managers-components/organizational-kpi/charts-table-parent";

export const metadata = {
  title: "Organizational KPI - NDSICDE",
  description: "Organizational KPIs",
};

export default function RetirementManagersOrganizationalKPI() {
  const dashboardData = [
    {
      title: "Total Submissions",
      value: 24,
      percentage: 20.1,
      percentInfo: "from last month",
      icon: "proicons:graph",
    },
    {
      title: "Pending Review",
      value: 5,
      percentage: 33,
      percentInfo: "of total submissions",
      icon: "material-symbols:planner-review-rounded",
    },
    {
      title: "Approved",
      value: 5,
      percentage: 33,
      percentInfo: "approval rate",
      icon: "duo-icons:approved",
    },
    {
      title: "Rejected",
      value: 2,
      percentage: 23,
      percentInfo: "rejection rate",
      icon: "marketeq:rejected-file-2",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <DashboardStat data={dashboardData} icon="basil:plus-solid" />
      </div>
      <RetirementManagerChartsAndTableParent />
    </section>
  );
}

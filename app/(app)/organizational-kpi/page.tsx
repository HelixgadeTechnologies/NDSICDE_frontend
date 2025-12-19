import ChartsAndTableParent from "@/components/organizational-kpi/charts-table-parent";
import DashboardStat from "@/ui/dashboard-stat-card";

export const metadata = {
  title: "Organizational KPI - NDSICDE",
  desrcription: "View your organization's  KPI dashboard",
};

export default function OrganizationalKPI() {
  const dashboardData = [
    {
      title: "Governance",
      lists: [
        { title: "Total SOs", count: "0" },
        { title: "Total KPIs", count: "0" },
        { title: "Overall KPI Performance", count: "0%" },
      ],
      icon: "mdi:security",
    },
    {
      title: "Peace & Security",
      lists: [
        { title: "Total SOs", count: "0" },
        { title: "Total KPIs", count: "0" },
        { title: "Overall KPI Performance", count: "0%" },
      ],
      icon: "mdi:security",
    },
    {
      title: "Livelihood",
      lists: [
        { title: "Total SOs", count: "0" },
        { title: "Total KPIs", count: "0" },
        { title: "Overall KPI Performance", count: "0%" },
      ],
      icon: "mdi:briefcase",
    },
    {
      title: "Environment & Climate Change",
      lists: [
        { title: "Total SOs", count: "0" },
        { title: "Total KPIs", count: "0" },
        { title: "Overall KPI Performance", count: "0%" },
      ],
      icon: "mdi:leaf",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <DashboardStat data={dashboardData} bigger />
      </div>
      <ChartsAndTableParent />
    </section>
  );
}

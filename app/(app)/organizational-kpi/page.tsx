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
      value: "12 SOs | 45 KPIs",
      percentage: 78,
      percentInfo: "Overall KPI Performance",
      icon: "mdi:security",
    },
    {
      title: "Peace & Security",
      value: "10 SOs | 30 KPIs",
      percentage: 85,
      percentInfo: "Overall KPI Performance",
      icon: "mdi:security",
    },
    {
      title: "Livelihood",
      value: "8 SOs | 25 KPIs",
      percentage: 72,
      percentInfo: "Overall KPI Performance",
      icon: "mdi:briefcase",
    },
    {
      title: "Environment & Climate Change",
      value: "14 SOs | 40 KPIs",
      percentage: 90,
      percentInfo: "Overall KPI Performance",
      icon: "mdi:leaf",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>
      <ChartsAndTableParent />
    </section>
  );
}

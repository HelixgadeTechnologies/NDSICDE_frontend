import DashboardCharts from "@/components/management-staff-components/dashboard/dashboard-charts-parent";
import ManagementStaffDashboardTable from "@/components/management-staff-components/dashboard/dashboard-table";

import DashboardStat from "@/ui/dashboard-stat-card";

export const metadata = {
  title: "Dashboard - NDSICDE",
  description: "View your management and staff dashboard",
};

export default function ManagementAndStaffDashboard() {
  const dashboardData = [
    {
      title: "Total Projects",
      value: 24,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Active KPIs",
      value: 5,
      percentInfo: "Being tracked across all projects",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Completed Projects",
      value: 5,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "On Hold Projects",
      value: 2,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
  ];

  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>
      <DashboardCharts />
      <ManagementStaffDashboardTable />
    </section>
  );
}

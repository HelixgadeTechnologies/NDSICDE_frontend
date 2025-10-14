import DashboardStat from "@/ui/dashboard-stat-card";
import ProjectsTable from "../super-admin-components/project-management/projects-table";

export const metadata = {
  title: "Dashboard - NDSICDE",
  description: "View your dashboard in detail",
};

export default function TeamMemberDashboard() {
  const dashboardData = [
    {
      title: "Total Projects",
      value: 24,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Team Assigned Projects",
      value: 24,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Active Projects",
      value: 5,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Completed Projects",
      value: 5,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "On Hold Projects",
      value: 5,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
  ];
  return (
    <section className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DashboardStat data={dashboardData} icon="basil:plus-solid" />
      </div>
      <ProjectsTable/>
    </section>
  );
}

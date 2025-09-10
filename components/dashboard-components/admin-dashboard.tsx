import DashboardStat from "@/ui/dashboard-stat-card";
import RecentActivityTab from "@/components/admin-components/dashboard/recent-activity-summary";
import PendingActivityCards from "@/components/admin-components/dashboard/pending-activity-cards";
// import OrganizationalProjectPerformance from "@/components/admin-components/dashboard/organizational-project-performance";
import ProjectsTable from "@/components/admin-components/project-management/projects-table";

export const metadata = {
  title: "Dashboard - NDSICDE",
  description: "View your dashboard in detail",
};

export default function AdminDashboardPage() {
  const dashboardData = [
    {
      title: "Total Projects",
      value: 24,
      percentage: 2,
      percentInfo: "since last month",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Team Members",
      value: 142,
      percentage: 12,
      percentInfo: "since last month",
      icon: "majesticons:users-line",
    },
    {
      title: "Active Organizational KPIs",
      value: 87,
      percentage: 5,
      percentInfo: "since last month",
      icon: "fluent:target-24-filled",
    },
    {
      title: "Financial Requests",
      value: 18,
      percentage: 7,
      percentInfo: "pending approval",
      icon: "basil:card-outline",
    },
    {
      title: "Upcoming Deadlines",
      value: 9,
      percentage: 3,
      percentInfo: "this week",
      icon: "majesticons:calendar-line",
    },
    {
      title: "Pending Reviews",
      value: 5,
      percentage: 4,
      percentInfo: "awaiting action",
      icon: "material-symbols:pending-actions-rounded",
    },
  ];

  return (
    <section className="space-y-7">
      <div className="flex justify-center items-start gap-4">
        <div className="w-3/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardStat data={dashboardData} icon="basil:plus-solid" />
          </div>
        </div>
        <div className="w-2/5">
          <RecentActivityTab />
        </div>
      </div>
      <ProjectsTable/>
      <PendingActivityCards/>
    </section>
  );
}

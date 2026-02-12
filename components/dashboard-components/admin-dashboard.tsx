"use client";

import DashboardStat from "@/ui/dashboard-stat-card";
import RecentActivityTab from "@/components/super-admin-components/dashboard/recent-activity-summary";
import PendingActivityCards from "@/components/super-admin-components/dashboard/pending-activity-cards";
import ProjectsTable from "@/components/super-admin-components/project-management/projects-table";
import { useEffect, useState } from "react";
import axios from "axios";

type Summary = {
  count: number;
  trend: string;
}

type DashboardData = {
  totalProjects: Summary;
  teamMembers: Summary;
  activeKpis: Summary;
  financialRequests: Summary;
  upcomingDeadlines: Summary;
  pendingReviews: Summary;
}

export default function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<DashboardData>({
    totalProjects: { count: 0, trend: "0" },
    teamMembers: { count: 0, trend: "0" },
    activeKpis: { count: 0, trend: "0" },
    financialRequests: { count: 0, trend: "0" },
    upcomingDeadlines: { count: 0, trend: "0" },
    pendingReviews: { count: 0, trend: "0" },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard-overview/stats`,
        );
        setSummaryData(response.data.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [])

  const dashboardData = [
    {
      title: "Total Projects",
      value: summaryData.totalProjects.count,
      percentInfo: summaryData.totalProjects.trend,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Team Members",
      value: summaryData.teamMembers.count,
      percentInfo: summaryData.teamMembers.trend,
      icon: "majesticons:users-line",
    },
    {
      title: "Active Organizational KPIs",
      value: summaryData.activeKpis.count,
      percentInfo: summaryData.activeKpis.trend,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Financial Requests",
      value: summaryData.financialRequests.count,
      percentInfo: summaryData.financialRequests.trend,
      icon: "basil:card-outline",
    },
    {
      title: "Upcoming Deadlines",
      value: summaryData.upcomingDeadlines.count,
      percentInfo: summaryData.upcomingDeadlines.trend,
      icon: "majesticons:calendar-line",
    },
    {
      title: "Pending Reviews",
      value: summaryData.pendingReviews.count,
      percentInfo: summaryData.pendingReviews.trend,
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
      <ProjectsTable />
      <PendingActivityCards />
    </section>
  );
}

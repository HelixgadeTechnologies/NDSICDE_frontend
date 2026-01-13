import DashboardStat from "@/ui/dashboard-stat-card";
import ProjectsTable from "../super-admin-components/project-management/projects-table";
import { useEffect, useState } from "react";
import axios from "axios";

export const metadata = {
  title: "Dashboard - NDSICDE",
  description: "View your dashboard in detail",
};

type Stats = {
  activeProjects: number,
  completedProjects: number, 
  onHoldProjects: number,
  totalProjects: number,
  teamAssignedProjects?: number, // Optional if not returned by API
}

export default function TeamMemberDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  
  useEffect(() => {
    const fetchCount = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/project-stats`);
        setStats(res.data.data); // Assuming API returns the stats object
      } catch (error) {
        console.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, []);

  // Create dashboard data using API stats
  const dashboardData = [
    {
      title: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Team Assigned Projects",
      value: stats?.teamAssignedProjects || 0, // Adjust based on your API response
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Active Projects",
      value: stats?.activeProjects || 0,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Completed Projects",
      value: stats?.completedProjects || 0,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "On Hold Projects",
      value: stats?.onHoldProjects || 0,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
  ];

  // Optional: Loading state
  if (loading) {
    return (
      <section className="space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
        <ProjectsTable />
      </section>
    );
  }

  return (
    <section className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DashboardStat data={dashboardData} icon="basil:plus-solid" />
      </div>
      <ProjectsTable />
    </section>
  );
}
import DashboardStat from "@/ui/dashboard-stat-card";
import ProjectsTable from "../super-admin-components/project-management/projects-table";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRoleStore } from "@/store/role-store";
import { useProjects } from "@/context/ProjectsContext";

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
  const { user } = useRoleStore();
  const { projects, isLoading: projectsLoading } = useProjects();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  // Staff / team members only see the project(s) they're assigned to, so their
  // stat cards are derived client-side from the assigned projects (there's no
  // user-scoped stats endpoint). Other roles keep the global stats endpoint.
  const restrictToAssigned =
    user?.role === "staff" || user?.role === "team-member";

  const assignedStats = useMemo<Stats | null>(() => {
    if (!restrictToAssigned) return null;
    const assignedIds = (user?.assignedProjectId ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    const mine = projects.filter((p) => assignedIds.includes(p.projectId));
    return {
      totalProjects: mine.length,
      teamAssignedProjects: mine.length,
      activeProjects: mine.filter((p) => p.status === "Active").length,
      completedProjects: mine.filter((p) => p.status === "Completed").length,
      onHoldProjects: mine.filter((p) => p.status === "On Hold").length,
    };
  }, [restrictToAssigned, projects, user?.assignedProjectId]);

  useEffect(() => {
    // Skip the global stats endpoint for restricted users (computed locally).
    if (restrictToAssigned) return;
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
  }, [restrictToAssigned]);

  const effectiveStats = restrictToAssigned ? assignedStats : stats;
  const isLoading = restrictToAssigned ? projectsLoading : loading;

  // Create dashboard data using API stats
  const dashboardData = [
    {
      title: "Total Projects",
      value: effectiveStats?.totalProjects || 0,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Team Assigned Projects",
      value: effectiveStats?.teamAssignedProjects || 0, // Adjust based on your API response
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Active Projects",
      value: effectiveStats?.activeProjects || 0,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Completed Projects",
      value: effectiveStats?.completedProjects || 0,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "On Hold Projects",
      value: effectiveStats?.onHoldProjects || 0,
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
  ];

  // Optional: Loading state
  if (isLoading) {
    return (
      <section className="space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="h-[126px] w-full rounded-lg bg-white border border-gray-200 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
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
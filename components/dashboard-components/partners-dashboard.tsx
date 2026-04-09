"use client";

import PartnersDashboardComponent from "@/components/partners-components/dashboard-component";
import { useProjects } from "@/context/ProjectsContext";
import { useProjectStore } from "@/store/admin-store/project-creation";
import { useRoleStore } from "@/store/role-store";
import DashboardStat from "@/ui/dashboard-stat-card";
import DateRangePicker from "@/ui/form/date-range";
import DropDown from "@/ui/form/select-dropdown";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type DashboardStats = {
  totalAssignedKpis: number;
  acrossProjects: number;
  pendingUpdates: number;
  achievedTargets: number;
  successRate: number;
};

export default function PartnersDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const { user } = useRoleStore();
  const { projectOptions } = useProjects();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/stats?userId=${user?.id}&projectId=${projectId}`,
        );
        setStats(response.data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, projectId]);

  // if (!stats) return toast.error("Error fetching stats.")

  const dashboardData = [
    {
      title: "Total Assigned KPIs",
      value: loading ? "..." : stats?.totalAssignedKpis,
      percentInfo: `Across ${stats?.acrossProjects} projects`,
      icon: "et:piechart",
    },
    {
      title: "Pending Updates",
      value: loading ? "..." : stats?.pendingUpdates,
      percentInfo: "Due within 7 days",
      icon: "weui:time-outlined",
    },
    {
      title: "Achieved Targets",
      value: loading ? "..." : stats?.achievedTargets,
      percentage: loading ? 0 : stats?.successRate,
      percentInfo: "success rate",
      icon: "duo-icons:approved",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-end w-full justify-end">
        <div className="flex gap-4 w-130">
          <DropDown
            label="Projects"
            placeholder="All Projects"
            value={projectId}
            name="projectId"
            onChange={(val) => setProjectId(val)}
            options={[{ label: "All Projects", value: "" }, ...projectOptions]}
          />
          <DateRangePicker
            label="Date Range"
            onChange={(range) => {
              if (range.startDate && range.endDate) {
                setDateRange({
                  startDate: new Date(range.startDate).toISOString(),
                  endDate: new Date(range.endDate).toISOString(),
                });
              }
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardStat data={dashboardData} />
      </div>
      <PartnersDashboardComponent
        projectId={projectId}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
      />
    </section>
  );
}

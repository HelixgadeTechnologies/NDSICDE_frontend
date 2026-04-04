"use client"

import ActivityOverview from "@/components/team-member-components/financial-dashboard";
import DashboardStat from "@/ui/dashboard-stat-card";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";

export default function FinancialDashboard() {
  const params = useParams<{ id: string }>();
  const [statData, setStatData] = useState<ProjectFinancialDashboardResponse | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!params?.id) return;
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/project_activity_dashboard/${params.id}`
        );
        setStatData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch financial dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [params?.id]);

  const dashboardData = [
    {
      title: "Total Budget",
      value: statData?.PROJECT_BUDGET_PERFORMANCE_SUMMARY?.totalActivities ?? 0,
      percentage: 0,
      percentInfo: "from last month",
      icon: "proicons:graph",
    },
    {
      title: "On Budget",
      value: statData?.PROJECT_BUDGET_PERFORMANCE_SUMMARY?.onBudgetActivities ?? 0,
      percentage: statData?.PROJECT_BUDGET_PERFORMANCE_SUMMARY?.onBudgetPercentage ?? 0,
      percentInfo: "of total projects",
      icon: "material-symbols:planner-review-rounded",
    },
    {
      title: "Burn Rate",
      value: statData?.BURN_RATE?.[0]?.burnRate ?? 0,
      percentage: 0,
      percentInfo: "overall burn rate",
      icon: "material-symbols:planner-review-rounded",
    },
    {
      title: "On Schedule",
      value: statData?.PROJECT_BUDGET_PERFORMANCE_SUMMARY?.onScheduleActivities ?? 0,
      percentage: statData?.PROJECT_BUDGET_PERFORMANCE_SUMMARY?.onSchedulePercentage ?? 0,
      percentInfo: "of total Projects",
      icon: "duo-icons:approved",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardStat data={dashboardData} icon="basil:plus-solid" />
      </div>
      <ActivityOverview statData={statData} />
    </section>
  );
}

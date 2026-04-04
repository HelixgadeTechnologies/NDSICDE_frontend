"use client";

import ProjectKpiChartsTableParent from "@/components/project-result-dashboard/charts-table-parent";
import ActivityOverviewComponent from "@/components/team-member-components/activity-overview-chart-table";
import CardComponent from "@/ui/card-wrapper";
import DashboardStat from "@/ui/dashboard-stat-card";
import Heading from "@/ui/text-heading";
import { useState, useEffect } from "react";
import { ProjectResultResponse } from "@/types/project-result-dashboard";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ResultDashboard() {
  const [resultDashboardData, setResultDashboardData] = useState<ProjectResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const projectId = params.id;

  useEffect(() => {
    const fetchResultDashboardData = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const [fullRes, kpiRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/result_dashboard_full/${projectId}`),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/result_dashboard_kpi/${projectId}`)
        ]);

        const combinedData: ProjectResultResponse = {
          ...fullRes.data.data,
          KPI_OVERVIEW_CHART: kpiRes.data.data.KPI_OVERVIEW_CHART,
          KPI_TABLE_DATA: kpiRes.data.data.KPI_TABLE_DATA,
          PROJECT_INDICATOR_PERFORMANCE: kpiRes.data.data.PROJECT_INDICATOR_PERFORMANCE,
        };

        setResultDashboardData(combinedData);
      } catch (error) {
        console.error("Error fetching result dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultDashboardData();
  }, [projectId]);

  if (loading) {
    return (
      <section className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-39.5 w-full animate-pulse bg-zinc-300 rounded-lg"></div>
          <div className="h-39.5 w-full animate-pulse bg-zinc-300 rounded-lg"></div>
          <div className="h-39.5 w-full animate-pulse bg-zinc-300 rounded-lg"></div>
        </div>
      </section>
    );
  }

  if (!resultDashboardData) {
    return (
      <div className="text-center py-10 text-gray-500">No data available</div>
    );
  }

  const dashboardData = [
    {
      title: "Result & Activities",
      icon: "material-symbols:target",
      lists: [
        {title: "Total Impacts", count: resultDashboardData.RESULT_SUMMARY.resultAndActivities.totalImpacts},
        {title: "Total Outcomes", count: resultDashboardData.RESULT_SUMMARY.resultAndActivities.totalOutcomes},
        {title: "Total Outputs", count: resultDashboardData.RESULT_SUMMARY.resultAndActivities.totalOutputs},
        {title: "Total Activity", count: resultDashboardData.RESULT_SUMMARY.resultAndActivities.totalActivities},
      ],
    },
    {
      title: "KPIs due for reporting",
      icon: "material-symbols:target",
      lists: [
        {title: "Impacts", count: resultDashboardData.RESULT_SUMMARY.kpisDueForReporting.impacts},
        {title: "Outcomes", count: resultDashboardData.RESULT_SUMMARY.kpisDueForReporting.outcomes},
        {title: "Outputs", count: resultDashboardData.RESULT_SUMMARY.kpisDueForReporting.outputs},
      ],
    },
    {
      title: "Overall Performance",
      icon: "material-symbols:target",
      lists: [
        {title: "Impacts", count: resultDashboardData.RESULT_SUMMARY.overallPerformance.impacts},
        {title: "Outcomes", count: resultDashboardData.RESULT_SUMMARY.overallPerformance.outcomes},
        {title: "Outputs", count: resultDashboardData.RESULT_SUMMARY.overallPerformance.outputs},
        {title: "Total Activity", count: resultDashboardData.RESULT_SUMMARY.overallPerformance.totalActivity},
      ],
    },
  ];
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardStat data={dashboardData} bigger />
      </div>
      {/* activity overview */}
      <CardComponent>
        <Heading
          heading="Activity Overview"
          subtitle="Breakdown of activities by current activities"
          className="mb-4"
        />
        <ActivityOverviewComponent data={resultDashboardData} />
      </CardComponent>
      <ProjectKpiChartsTableParent data={resultDashboardData} />
    </section>
  );
}

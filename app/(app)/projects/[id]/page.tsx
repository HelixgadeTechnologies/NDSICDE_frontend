"use client";

import ProjectKpiChartsTableParent from "@/components/project-result-dashboard/charts-table-parent";
import DashboardStat from "@/ui/dashboard-stat-card";
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[158px] w-full rounded-lg bg-white border border-gray-200 p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
              <div className="space-y-3 mt-4 flex-1 overflow-hidden">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-full rounded-lg border border-gray-200 bg-white p-6 flex flex-col gap-6">
           <div className="flex flex-col md:flex-row gap-4 mb-2 mt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-lg w-full"></div>
              ))}
           </div>
           <div className="flex gap-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-24"></div>
              <div className="h-8 bg-gray-100 animate-pulse rounded w-24"></div>
           </div>
           <div className="h-[300px] bg-gray-50 animate-pulse rounded-lg w-full border border-gray-100"></div>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white p-6 flex flex-col gap-6">
           <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
             <div>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-100 animate-pulse rounded w-48"></div>
             </div>
             <div className="h-24 w-full md:w-72 bg-gray-100 animate-pulse rounded-lg"></div>
           </div>
           <div className="h-[250px] bg-gray-50 animate-pulse rounded-lg w-full border border-gray-100 mt-4"></div>
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
        {title: "Impacts", count: `${resultDashboardData.RESULT_SUMMARY.overallPerformance.impacts}%`},
        {title: "Outcomes", count: `${resultDashboardData.RESULT_SUMMARY.overallPerformance.outcomes}%`},
        {title: "Outputs", count: `${resultDashboardData.RESULT_SUMMARY.overallPerformance.outputs}%`},
        {title: "Total Activity", count: `${resultDashboardData.RESULT_SUMMARY.overallPerformance.totalActivity}%`},
      ],
    },
  ];
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardStat data={dashboardData} bigger />
      </div>
      <ProjectKpiChartsTableParent data={resultDashboardData} projectId={projectId as string} />
    </section>
  );
}

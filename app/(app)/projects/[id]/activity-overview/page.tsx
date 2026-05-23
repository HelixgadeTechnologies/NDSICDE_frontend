"use client";

import ActivityOverviewComponent from "@/components/team-member-components/activity-overview-chart-table";
import ImplementationTimeAnalysisComponent from "@/components/team-member-components/ita-component";
import CardComponent from "@/ui/card-wrapper";
import DashboardStat from "@/ui/dashboard-stat-card";
import Heading from "@/ui/text-heading";
import { useState, useEffect, useMemo } from "react";
import { ProjectResultResponse } from "@/types/project-result-dashboard";
import { ProjectFinancialDashboardResponse } from "@/types/project-financial-dashboard";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ProjectActivityOverview() {
  const [resultDashboardData, setResultDashboardData] = useState<ProjectResultResponse | null>(null);
  const [financialData, setFinancialData] = useState<ProjectFinancialDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const projectId = params.id;

  // Look up the "Due to Start" and "In Progress" buckets from ACTIVITY_OVERVIEW
  // (lenient match — handles minor wording differences from the API)
  const activityStats = useMemo(() => {
    const buckets = resultDashboardData?.ACTIVITY_OVERVIEW ?? [];
    const findCategory = (needle: string) =>
      buckets.find((b) =>
        b.category?.toLowerCase().replace(/\s+/g, "").includes(needle),
      );

    const dueToStart = findCategory("duetostart") ?? findCategory("yettostart");
    const inProgress = findCategory("inprogress");

    return [
      {
        title: "Due to Start",
        icon: "fluent:calendar-clock-24-regular",
        value: dueToStart?.count ?? 0,
        percentage: dueToStart?.percentage,
        percentInfo: "of total activities",
      },
      {
        title: "In Progress",
        icon: "fluent:clock-arrow-circle-24-regular",
        value: inProgress?.count ?? 0,
        percentage: inProgress?.percentage,
        percentInfo: "of total activities",
      },
    ];
  }, [resultDashboardData]);

  useEffect(() => {
    const fetchResultDashboardData = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const [fullRes, kpiRes, financialRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/result_dashboard_full/${projectId}`),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/result_dashboard_kpi/${projectId}`),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/project_activity_dashboard/${projectId}`),
        ]);

        const combinedData: ProjectResultResponse = {
          ...fullRes.data.data,
          KPI_OVERVIEW_CHART: kpiRes.data.data.KPI_OVERVIEW_CHART,
          KPI_TABLE_DATA: kpiRes.data.data.KPI_TABLE_DATA,
          PROJECT_INDICATOR_PERFORMANCE: kpiRes.data.data.PROJECT_INDICATOR_PERFORMANCE,
        };

        setResultDashboardData(combinedData);
        setFinancialData(financialRes.data?.data ?? null);
      } catch (error) {
        console.error("Error fetching activity overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultDashboardData();
  }, [projectId]);

  if (loading) {
    return (
      <section className="space-y-5">
        <div className="w-full rounded-lg border border-gray-200 bg-white p-6 flex flex-col">
          <div className="mb-8">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-100 animate-pulse rounded w-72"></div>
          </div>
          
          <div className="flex gap-4 mb-6">
             <div className="h-8 bg-gray-200 animate-pulse rounded w-24"></div>
             <div className="h-8 bg-gray-100 animate-pulse rounded w-24"></div>
          </div>
          
          <div className="h-75 flex flex-col md:flex-row gap-8 items-center">
            <div className="h-full w-full md:w-1/2 flex items-center justify-center">
               <div className="h-64 w-64 rounded-full border-16 border-gray-50 animate-pulse"></div>
            </div>
            <div className="h-full w-full md:w-1/2 flex flex-col justify-center space-y-6">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex justify-between items-center w-full md:w-3/4">
                    <div className="flex items-center gap-3 w-2/3">
                      <div className="h-3 w-3 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-full"></div>
                    </div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-12"></div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!resultDashboardData) {
    return (
      <div className="text-center py-10 text-gray-500">No data available</div>
    );
  }

  return (
    <section className="space-y-5">
      <CardComponent>
        <Heading
          heading="Activity Overview"
          subtitle="Breakdown of activities by current activities"
          className="mb-4"
        />
        <ActivityOverviewComponent data={resultDashboardData} />
      </CardComponent>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardStat data={activityStats} />
      </div>

      <ImplementationTimeAnalysisComponent statData={financialData} />
    </section>
  );
}
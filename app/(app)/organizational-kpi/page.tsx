"use client";

import ChartsAndTableParent from "@/components/organizational-kpi/charts-table-parent";
import DashboardStat from "@/ui/dashboard-stat-card";
import { OrgKpiResponse } from "@/types/org-kpi";
import { useEffect, useState } from "react";
import axios from "axios";
import { THEMATIC_AREAS } from "@/lib/config/admin-settings";

export default function OrganizationalKPI() {
  const [statData, setStatData] = useState<OrgKpiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrgKpi = async () => {
     try {
      setLoading(true); 
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/org_kpi_dashboard`);
      setStatData(res.data.data);
     } catch (error) {
      console.log(error);
     } finally {
      setLoading(false);
       }
    }
    fetchOrgKpi();
  }, [])

  const dashboardData = THEMATIC_AREAS.map((areaTitle) => {
    const areaName = areaTitle.toLowerCase();
    let icon = "mdi:chart-box-outline";
    if (areaName.includes("security") || areaName.includes("peace")) icon = "mdi:security";
    else if (areaName.includes("livelihood")) icon = "mdi:briefcase";
    else if (areaName.includes("environment") || areaName.includes("climate")) icon = "mdi:leaf";
    else if (areaName.includes("governance")) icon = "mdi:gavel";
    else if (areaName.includes("economic")) icon = "mdi:chart-line";
    else if (areaName.includes("organizational")) icon = "mdi:office-building";
    else if (areaName.includes("cross")) icon = "mdi:link-variant";

    const apiArea = statData?.THEMATIC_AREA_SUMMARY?.find(
      (a) => a.thematicArea.toLowerCase() === areaName
    );

    return {
      title: areaTitle,
      lists: [
        { title: "Total SOs", count: String(apiArea?.totalSOs ?? 0) },
        { title: "Total KPIs", count: String(apiArea?.totalKPIs ?? 0) },
        { title: "Overall KPI Performance", count: `${apiArea?.overallKPIPerformance ?? 0}%` },
      ],
      icon,
    };
  });

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {loading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          </>
        ) : (
          <DashboardStat data={dashboardData} bigger />
        )}
      </div>
      <ChartsAndTableParent statData={statData} />
    </section>
  );
}

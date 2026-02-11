"use client";

import DashboardStat from "@/ui/dashboard-stat-card";
import TabComponent from "@/ui/tab-component";
import ProjectResultPerformance from "@/components/super-admin-components/performance-analytics/project-result-performance";
import FinancialPerformance from "@/components/super-admin-components/financial-reporting/cpi-spi-parent";
import CustomReports from "@/components/super-admin-components/performance-analytics/custom-reports";
import { useEffect, useState } from "react";
import axios from "axios";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import { fetchProjects, type ProjectType } from "@/lib/api/projects";
import { fetchResultTypes, transformResultTypesToOptions, type ResultType } from "@/lib/api/result-types";
import { APIResponse, SummaryAPIResponse } from "@/types/performance-dashboard-types";
import toast from "react-hot-toast";

export default function PerformanceAnalytics() {
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<SummaryAPIResponse | null>(null);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [resultTypes, setResultTypes] = useState<ResultType[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedResultType, setSelectedResultType] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    endDate: new Date().toISOString(),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, resultTypesData] = await Promise.all([
          fetchProjects(),
          fetchResultTypes(),
        ]);
        setProjects(projectsData);
        setResultTypes(resultTypesData);
        toast.success("Filters loaded successfully");
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load filters");
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/performance-dashboard?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
        
        if (selectedProjectId) {
          url += `&projectId=${selectedProjectId}`;
          
          const selectedProject = projects.find(p => p.projectId === selectedProjectId);
          if (selectedProject?.thematicAreasOrPillar) {
            url += `&thematicArea=${encodeURIComponent(selectedProject.thematicAreasOrPillar)}`;
          }
        }
        
        if (selectedResultType) {
          url += `&resultType=${encodeURIComponent(selectedResultType)}`;
        }
        
        const response = await axios.get<APIResponse>(url);

        if (response.data.success) {
          setApiData(response.data.data);
          toast.success(response.data.message || "Performance data loaded successfully");
        } else {
          toast.error("Failed to fetch performance data");
        }
      } catch (error) {
        console.error("Error fetching performance analytics:", error);
        toast.error("An error occurred while fetching data");
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [dateRange, selectedProjectId, selectedResultType, projects]);

  const handleDateRangeChange = (range: { startDate: string; endDate: string }) => {
    setDateRange(range);
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value);
  };

  const handleResultTypeChange = (value: string) => {
    setSelectedResultType(value);
  };

  const projectOptions = projects.map((project) => ({
    value: project.projectId,
    label: project.projectName,
  }));

  const resultTypeOptions = [
    { value: "", label: "All Result Types" },
    ...transformResultTypesToOptions(resultTypes),
  ];

  const dashboardData = [
    {
      title: "Total Active Projects",
      value: apiData ? apiData.summary.totalActiveProjects : "0",
      percentage: apiData ? apiData.summary.percentageFromLastPeriod : 0,
      percentInfo: "from last month",
    },
    {
      title: "Completed KPIs",
      value: apiData ? `${apiData.summary.completedKPIsPercentage}%` : "0%",
      percentage: 0,
      percentInfo: "from last quarter",
    },
    {
      title: "Pending Financial Requests",
      value: apiData ? apiData.summary.pendingRequests : 0,
      percentage: 0,
      percentInfo: "from yesterday",
    },
    {
      title: "Budget vs. Expenditure",
      value: apiData ? `${apiData.summary.budgetUtilization}%` : "0%",
      percentage: 0,
      percentInfo: "utilization",
    },
    {
      title: "Project Health Score",
      value: apiData ? apiData.summary.projectHealthScore : 0,
      percentage: 0,
      percentInfo: "points",
    },
  ];

  const tabs = [
    { tabName: "Project Result Performance", id: 1 },
    { tabName: "Financial Performance", id: 2 },
    { tabName: "Custom Reports", id: 3 },
  ];

  return (
    <section className="relative">
      <div className="w-107.5 flex items-center gap-4 mt-10">
        <DropDown
          label="Projects"
          name="projects"
          options={projectOptions}
          // placeholder="All Projects"
          value={selectedProjectId}
          onChange={handleProjectChange}
        />
        <DropDown
          label="Result Type"
          name="resultType"
          options={resultTypeOptions}
          // placeholder="Select Result Type"
          value={selectedResultType}
          onChange={handleResultTypeChange}
        />
        <DateRangePicker label="Date Range" onChange={handleDateRangeChange} />
      </div>
      {loading ? (
        <div className="dots my-20 mx-auto">
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : !apiData ? (
        <div className="text-center my-20">
          <p className="text-gray-500">No data available. Please adjust your filters and try again.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 my-5">
            <DashboardStat data={dashboardData} icon="basil:arrow-up-outline" />
          </div>
          <div className="space-y-5">
            <TabComponent
              data={tabs}
              renderContent={(tabId) => {
                if (tabId === 1) {
                  return <ProjectResultPerformance apiData={apiData} />;
                } else if (tabId === 2) {
                  return <FinancialPerformance />;
                } else {
                  return <CustomReports />;
                }
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}
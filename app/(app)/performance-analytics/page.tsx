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

  // Fetch projects and result types on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, resultTypesData] = await Promise.all([
          fetchProjects(),
          fetchResultTypes(),
        ]);
        setProjects(projectsData);
        setResultTypes(resultTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        
        // Build URL with query parameters
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/performance-dashboard?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
        
        // Add projectId if selected
        if (selectedProjectId) {
          url += `&projectId=${selectedProjectId}`;
          
          // Add thematicArea from the selected project
          const selectedProject = projects.find(p => p.projectId === selectedProjectId);
          if (selectedProject?.thematicAreasOrPillar) {
            url += `&thematicArea=${encodeURIComponent(selectedProject.thematicAreasOrPillar)}`;
          }
        }
        
        // Add resultType if selected
        if (selectedResultType) {
          url += `&resultType=${encodeURIComponent(selectedResultType)}`;
        }
        
        const response = await axios.get<APIResponse>(url);

        const data = response.data.data; // This is your SummaryAPIResponse
        setApiData(data);
      } catch (error) {
        console.error("Error fetching performance analytics:", error);
        // Keep default/previous data if API fails
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

  // Prepare dropdown options for projects
  const projectOptions = projects.map((project) => ({
    value: project.projectId,
    label: project.projectName,
  }));

  // Transform result types to dropdown options
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
    <section className="relative ">
      <div className="w-107.5 flex items-center gap-4">
        <DateRangePicker label="Date Range" onChange={handleDateRangeChange} />
        <DropDown
          label="Projects"
          name="projects"
          options={projectOptions}
          placeholder="All Projects"
          value={selectedProjectId}
          onChange={handleProjectChange}
        />
        <DropDown
          label="Result Type"
          name="resultType"
          options={resultTypeOptions}
          placeholder="Select Result Type"
          value={selectedResultType}
          onChange={handleResultTypeChange}
        />
      </div>
      {loading ? (
        <div className="dots my-20 mx-auto">
          <div></div>
          <div></div>
          <div></div>
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
                  return (
                    <ProjectResultPerformance
                    // apiData={apiData}
                    />
                  );
                } else if (tabId === 2) {
                  return (
                    <FinancialPerformance
                    // apiData={apiData}
                    />
                  );
                } else {
                  return (
                    <CustomReports
                    // apiData={apiData}
                    />
                  );
                }
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}
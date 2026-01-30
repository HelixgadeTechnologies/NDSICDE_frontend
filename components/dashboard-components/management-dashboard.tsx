"use client";

import DashboardStat from "@/ui/dashboard-stat-card";
import ProjectsTable from "../super-admin-components/project-management/projects-table";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import LineChartComponent from "@/ui/line-chart";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import DropDown from "@/ui/form/select-dropdown";
import { year_options } from "@/lib/config/general-config";
import ManagementStaffProjectsTable from "../management-staff-components/projects-table";

type SummaryType = {
  totalProjects: number;
  onHoldProjects: number;
  activeProjects: number;
  activeKpis: number;
  completedProjects: number;
};

// Define the type for KPI performance data
type KpiDataPoint = {
  target: number;
  actual: number;
};

type KpiPerformanceType = {
  [month: string]: KpiDataPoint;
};

// Define type for budget utilization based on API response
type BudgetUtilizationItem = {
  label: string;
  amount: number;
  percentage: number;
};

// Define type for project status based on API response
type ProjectStatusItem = {
  label: string;
  count: number;
  percentage: number;
};

export default function ManagementAndStaffDashboard() {
  const [summaryData, setSummaryData] = useState<SummaryType>({
    totalProjects: 0,
    onHoldProjects: 0,
    activeProjects: 0,
    activeKpis: 0,
    completedProjects: 0,
  });

  const [kpiPerformance, setKpiPerformance] = useState<KpiPerformanceType>({});
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isLoadingKpi, setIsLoadingKpi] = useState<boolean>(false);

  // State for budget utilization
  const [budgetUtilization, setBudgetUtilization] = useState<
    BudgetUtilizationItem[]
  >([]);
  const [isLoadingBudget, setIsLoadingBudget] = useState<boolean>(false);

  // State for project status
  const [projectStatus, setProjectStatus] = useState<ProjectStatusItem[]>([]);
  const [isLoadingProjectStatus, setIsLoadingProjectStatus] = useState<boolean>(false);

  // Dynamic color mapping for project status
  const getProjectStatusColor = (label: string, index: number): string => {
    const colorMap: { [key: string]: string } = {
      Active: "#22C55E",
      "On Hold": "#D2091E",
      Completed: "#003B99",
      Cancelled: "#F59E0B",
      Pending: "#8B5CF6",
      Paused: "#EF4444",
    };
    
    // Return predefined color if exists, otherwise use fallback colors
    if (colorMap[label]) {
      return colorMap[label];
    }
    
    // Fallback colors for any additional status types
    const fallbackColors = ["#6366F1", "#EC4899", "#10B981", "#F97316", "#06B6D4"];
    return fallbackColors[index % fallbackColors.length];
  };

  useEffect(() => {
    // Fetching dashboard summary
    const fetchSummaryData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/summary`,
        );
        setSummaryData(res.data.data);
      } catch (error) {
        console.error(`Error fetching summary:`, error);
      }
    };

    // Fetching budget utilization
    const fetchBudgetUtilization = async () => {
      setIsLoadingBudget(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/budget-utilization`,
        );
        if (res.data.success && res.data.data) {
          setBudgetUtilization(res.data.data);
        }
      } catch (error) {
        console.error(`Error fetching budget utilization:`, error);
      } finally {
        setIsLoadingBudget(false);
      }
    };

    // Fetching project status
    const fetchProjectStatus = async () => {
      setIsLoadingProjectStatus(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/project-status-distribution`,
        );
        if (res.data.success && res.data.data) {
          setProjectStatus(res.data.data);
        }
      } catch (error) {
        console.error(`Error fetching project status:`, error);
      } finally {
        setIsLoadingProjectStatus(false);
      }
    };

    fetchSummaryData();
    fetchBudgetUtilization();
    fetchProjectStatus();
  }, []);

  useEffect(() => {
    const getKpiPerformance = async (year: number) => {
      setIsLoadingKpi(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/kpi-performance?year=${year}`,
        );
        if (res.data.success) {
          setKpiPerformance(res.data.data);
        }
      } catch (error) {
        console.error(`Error fetching KPI performance:`, error);
      } finally {
        setIsLoadingKpi(false);
      }
    };

    getKpiPerformance(selectedYear);
  }, [selectedYear]);

  // Transform KPI performance data for the chart
  const kpiChartData = Object.entries(kpiPerformance).map(([month, data]) => ({
    name: month,
    target: data.target || 0,
    actual: data.actual || 0,
  }));

  // Transform budget utilization data for pie chart
  const budgetChartData = budgetUtilization.map((item) => ({
    name: item.label,
    value: item.percentage,
  }));

  // Transform project status data for pie chart
  const projectStatusChartData = projectStatus.map((item) => ({
    name: item.label,
    value: item.percentage,
  }));

  const dashboardData = [
    {
      title: "Total Projects",
      value: summaryData.totalProjects,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Active KPIs",
      value: summaryData.activeKpis,
      percentInfo: "Being tracked across all projects",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Completed Projects",
      value: summaryData.completedProjects,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "On Hold Projects",
      value: summaryData.onHoldProjects,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
  ];

  // Update chart lines configuration for KPI data
  const kpiLines = [
    { key: "target", label: "Target", color: "#003B99" },
    { key: "actual", label: "Actual", color: "#EF4444" },
  ];

  const BU = ["#D2091E", "#003B99"];

  // Handler for year change
  const handleYearChange = (value: string | number) => {
    console.log("Year changed to:", value);
    const year = typeof value === "string" ? parseInt(value, 10) : value;
    if (!isNaN(year)) {
      setSelectedYear(year);
    }
  };

  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>

      {/* charts */}
      <section className="flex gap-4 items-start">
        <div className="w-3/5">
          <CardComponent>
            <div className="flex justify-between items-center mb-4">
              <Heading heading="KPI Performance" />
              <div className="w-24 mr-4">
                <DropDown
                  name="selectedYear"
                  value={selectedYear.toString()}
                  onChange={handleYearChange}
                  options={year_options}
                  label=""
                  placeholder="Select Year"
                />
              </div>
            </div>
            <div className="h-112.5">
              {isLoadingKpi ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Loading KPI data...
                </div>
              ) : kpiChartData.length > 0 ? (
                <LineChartComponent
                  lines={kpiLines}
                  data={kpiChartData}
                  legend
                  xKey="name"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No KPI data available for {selectedYear}
                </div>
              )}
            </div>
          </CardComponent>
        </div>
        <div className="w-2/5 space-y-4">
          <CardComponent>
            <Heading
              heading="Budget Utilization"
              subtitle="Spent vs Remaining"
              className="text-center"
            />
            {isLoadingBudget ? (
              <div className="flex items-center justify-center h-35 text-gray-500">
                Loading budget data...
              </div>
            ) : budgetChartData.length > 0 ? (
              <div className="flex items-center justify-between">
                <div className="h-35 w-[50%]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={budgetChartData}>
                        {budgetChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.name}`}
                            fill={BU[index % BU.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 w-[50%]">
                  {budgetUtilization.map((item, i) => (
                    <div key={i} className="w-full space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: BU[i % BU.length],
                            }}></span>
                          <span className="text-sm text-gray-500">
                            {item.label}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 text-sm">
                          {item.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-35 text-gray-500">
                No budget data available
              </div>
            )}
          </CardComponent>
          <CardComponent>
            <Heading
              heading="Project Status"
              subtitle="Distribution by status"
              className="text-center"
            />
            {isLoadingProjectStatus ? (
              <div className="flex items-center justify-center h-35 text-gray-500">
                Loading project status...
              </div>
            ) : projectStatusChartData.length > 0 ? (
              <div className="flex items-center justify-between">
                <div className="h-35 w-[50%]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={projectStatusChartData}>
                        {projectStatusChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.name}`}
                            fill={getProjectStatusColor(entry.name, index)}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 w-[50%]">
                  {projectStatus.map((item, i) => (
                    <div
                      key={i}
                      className="w-full flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: getProjectStatusColor(item.label, i),
                          }}></span>
                        <span className="text-sm text-gray-500">{item.label}</span>
                      </div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.percentage}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-35 text-gray-500">
                No project status data available
              </div>
            )}
          </CardComponent>
        </div>
      </section>

      {/* <ProjectsTable /> */}
      <ManagementStaffProjectsTable />
    </section>
  );
}
"use client";

import DashboardStat from "@/ui/dashboard-stat-card";
import ProjectsTable from "../super-admin-components/project-management/projects-table";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import LineChartComponent from "@/ui/line-chart";
import { PieChart, ResponsiveContainer, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProjectApiResponse } from "@/types/admin-types";

// Helper function to calculate percentages
const calculatePercentage = (count: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
};

export default function ManagementAndStaffDashboard() {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/projects`
        );
        setProjects(res.data.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Calculate project counts with proper status filtering
  const totalProjects = projects.length;
  
  // Fixed: Your original filter had a logical error. It should be:
  const onHoldProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "on hold" || 
                  project.status?.toLowerCase() === "hold"
  ).length;
  
  const completedProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "completed"
  ).length;
  
  const activeProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "active" ||
                 project.status?.toLowerCase() === "in progress" ||
                 project.status?.toLowerCase() === "ongoing"
  ).length;
  
  // You can also calculate "other" statuses
  const otherProjects = totalProjects - (activeProjects + onHoldProjects + completedProjects);

  // Calculate percentages for the pie chart
  const projectStatus = isLoading 
    ? [] 
    : [
        { 
          name: "Active", 
          value: calculatePercentage(activeProjects, totalProjects),
          count: activeProjects
        },
        { 
          name: "On Hold", 
          value: calculatePercentage(onHoldProjects, totalProjects),
          count: onHoldProjects
        },
        { 
          name: "Completed", 
          value: calculatePercentage(completedProjects, totalProjects),
          count: completedProjects
        },
        // Only show "Other" if there are projects with other statuses
        ...(otherProjects > 0 ? [{
          name: "Other",
          value: calculatePercentage(otherProjects, totalProjects),
          count: otherProjects
        }] : [])
      ];

  // Colors for the pie chart
  const PS = ["#22C55E", "#D2091E", "#003B99", "#6B7280"]; // Added gray for "Other"

  // Alternative: If you want to show only top 3 statuses
  const topProjectStatus = isLoading
    ? []
    : [
        { 
          name: "Active", 
          value: calculatePercentage(activeProjects, totalProjects),
          count: activeProjects,
          description: "Projects currently in progress"
        },
        { 
          name: "On Hold", 
          value: calculatePercentage(onHoldProjects, totalProjects),
          count: onHoldProjects,
          description: "Projects temporarily paused"
        },
        { 
          name: "Completed", 
          value: calculatePercentage(completedProjects, totalProjects),
          count: completedProjects,
          description: "Successfully finished projects"
        }
      ];

  const dashboardData = [
    {
      title: "Total Projects",
      value: isLoading ? "..." : projects.length,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Active KPIs",
      value: 0,
      percentInfo: "Being tracked across all projects",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "Completed Projects",
      value: isLoading ? "..." : completedProjects,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
    {
      title: "On Hold Projects",
      value: isLoading ? "..." : onHoldProjects,
      percentInfo: "Across all departments and categories",
      icon: "fluent:clipboard-bullet-list-ltr-16-regular",
    },
  ];

  const lines = [
    { key: "budget", label: "Budget", color: "#003B99" },
    { key: "expenditure", label: "Expenditure", color: "#EF4444" },
  ];

  const lineData = [
    { name: "Jan", budget: 0, expenditure: 0 },
    { name: "Feb", budget: 0, expenditure: 0 },
    { name: "Mar", budget: 0, expenditure: 0 },
    { name: "Apr", budget: 0, expenditure: 0 },
    { name: "May", budget: 0, expenditure: 0 },
    { name: "Jun", budget: 0, expenditure: 0 },
  ];

  const budgetUtilization = [
    { name: "Spent", value: 1 },
    { name: "Remaining", value: 1 },
  ];

  const BU = ["#D2091E", "#003B99"];

  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>
      <section className="flex gap-4 items-start">
        <div className="w-3/5">
          <CardComponent>
            <Heading heading="KPI Performance" />
            <div className="h-112.5">
              <LineChartComponent
                lines={lines}
                data={lineData}
                legend
                xKey="name"
              />
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
            <div className="flex items-center justify-between">
              <div className="h-35 w-[50%]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={budgetUtilization}>
                      {budgetUtilization.map((entry, index) => (
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
                {budgetUtilization.map((p, i) => (
                  <div
                    key={i}
                    className="w-full flex justify-between items-center"
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: BU[i % BU.length] }}
                      ></span>
                      <span className="text-sm text-gray-500">{p.name}</span>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">
                      {p.value}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardComponent>
          
          {/* Updated Project Status Card with Real Data */}
          <CardComponent>
            <Heading
              heading="Project Status"
              subtitle={`Distribution across ${totalProjects} projects`}
              className="text-center"
            />
            {isLoading ? (
              <div className="h-35 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : projects.length === 0 ? (
              <div className="h-35 flex items-center justify-center text-gray-500">
                No project data available.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="h-35 w-[50%]">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie 
                          data={topProjectStatus} 
                          dataKey="value"
                          nameKey="name"
                        >
                          {topProjectStatus.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={PS[index % PS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 w-[50%]">
                    {topProjectStatus.map((p, i) => (
                      <div
                        key={i}
                        className="w-full flex justify-between items-center"
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: PS[i % PS.length] }}
                          ></span>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">{p.name}</span>
                            {/* <span className="text-xs text-gray-400">
                              {p.count} projects
                            </span> */}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 text-sm">
                            {p.value}%
                          </p>
                          {/* <p className="text-xs text-gray-400">
                            of total
                          </p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Optional: Status breakdown summary */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    {activeProjects} active • {completedProjects} completed • {onHoldProjects} on hold
                  </p>
                </div>
              </>
            )}
          </CardComponent>
        </div>
      </section>
      <ProjectsTable />
    </section>
  );
}
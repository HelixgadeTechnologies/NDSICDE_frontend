"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import DropDown from "@/ui/form/select-dropdown";
import {
  KPIActualTarget,
  projectDistributionStatus,
  PDSColors,
  KPIProgressTracking,
} from "@/lib/config/charts";
import PieChartComponent from "../../../ui/pie-chart";
import BarChartComponent from "../../../ui/bar-chart";
import Percentage from "@/ui/percentage-component";
import { usePerformanceAnalyticsReportsState } from "@/store/super-admin-store/performance-analytics-store";
import { SummaryAPIResponse } from "@/types/performance-dashboard-types";

export default function ProjectResultPerformance({ apiData }: { apiData: SummaryAPIResponse }) {
  const { KPIName, result, projects, PSDFilter, setField } =
    usePerformanceAnalyticsReportsState();

  const bars = [
    { key: "target", label: "Target", color: "#003B99" },
    { key: "actual", label: "Actual", color: "#D2091E" },
  ];

  const PSDOptions = [
    { value: "1", label: "Department" },
    { value: "2", label: "Manager" },
    { value: "3", label: "Priority" },
  ];

  // Transform API data for KPI Actuals vs Targets chart
  const kpiChartData = Array.isArray(apiData.kpiActualsVsTargets) && apiData.kpiActualsVsTargets.length > 0
    ? apiData.kpiActualsVsTargets.map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          return {
            name: item.period,
            target: item.target,
            actual: item.actual,
          };
        }
        return null;
      }).filter((item): item is { name: string | number; target: number; actual: number } => item !== null)
    : KPIActualTarget;

  // Transform API data for Project Status Distribution
  const statusDistributionData = apiData.statusDistribution && apiData.statusDistribution.length > 0
    ? apiData.statusDistribution.map((item) => ({
        name: item.status,
        value: item.percentage,
        percentage: item.percentage,
      }))
    : projectDistributionStatus;

  // Transform API data for Progress Tracking
  const progressTrackingData = apiData.progressTracking
    ? [
        {
          title: "Activity",
          percentages: [
            {
              name: apiData.progressTracking.activity.status,
              percent: apiData.progressTracking.activity.percentage,
            },
          ],
        },
        {
          title: "Output",
          percentages: [
            {
              name: apiData.progressTracking.output.status,
              percent: apiData.progressTracking.output.percentage,
            },
          ],
        },
        {
          title: "Outcomes",
          percentages: [
            {
              name: apiData.progressTracking.outcomes.status,
              percent: apiData.progressTracking.outcomes.percentage,
            },
          ],
        },
        {
          title: "Impact",
          percentages: [
            {
              name: apiData.progressTracking.impact.status,
              percent: apiData.progressTracking.impact.percentage,
            },
          ],
        },
      ]
    : KPIProgressTracking;

  // Extract project names for dropdown
  const projectOptions = apiData.projectDetails && apiData.projectDetails.length > 0
    ? apiData.projectDetails.map((project) => ({
        value: project.projectId,
        label: project.projectName,
      }))
    : [];


  return (
    <section className="space-y-5">
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* KPI vs actual targets */}
        <div className="w-full md:w-[70%]">
          <CardComponent>
            <div className="flex justify-between items-start">
              <Heading heading="KPI Actuals vs. Targets" />
              <div className="gap-2 flex items-center w-40">
                <DropDown
                  name="KPIName"
                  label="KPI"
                  placeholder="KPI name"
                  value={KPIName}
                  onChange={(value: string) => setField("KPIName", value)}
                  // options={kpiOptions.length > 0 ? kpiOptions : [{ value: "N/A", label: "N/A" }]}
                  options={[]}
                />
                {/* <DropDown
                  name="result"
                  label="Result"
                  placeholder="Impact"
                  value={result}
                  onChange={(value: string) => setField("result", value)}
                  options={resultOptions}
                /> */}
                {/* <DropDown
                  name="projects"
                  label="Projects"
                  placeholder="Project Alpha"
                  value={projects}
                  onChange={(value: string) => setField("projects", value)}
                  options={projectOptions.length > 0 ? projectOptions : [{ value: "N/A", label: "N/A" }]}
                /> */}
              </div>
            </div>
            <div className="h-115">
              <BarChartComponent
                data={kpiChartData}
                bars={bars}
                xKey="name"
              />
            </div>
          </CardComponent>
        </div>

        {/* project status distribution */}
        <div className="w-full md:w-[35%] relative">
          <CardComponent>
            <div className="flex justify-between items-start">
              <Heading
                heading="Project Status Distribution"
                subtitle="Distribution by category"
              />
              <DropDown
                name="PSDFilter"
                label="Filter"
                value={PSDFilter}
                onChange={(value: string) => setField("PSDFilter", value)}
                options={PSDOptions}
              />
            </div>
            <PieChartComponent
              data={statusDistributionData}
              colors={PDSColors}
            />
          </CardComponent>
        </div>
      </div>

      {/* progress tracking */}
      <CardComponent>
        <Heading
          heading="Progress Tracking"
          subtitle="Activity, Output, Outcome, Impact"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {progressTrackingData.map((k, i) => (
            <CardComponent key={i}>
              <h4 className="text-[#242424] text-base leading-5 font-semibold mb-2">
                {k.title}
              </h4>
              <Percentage data={k.percentages} />
            </CardComponent>
          ))}
        </div>
      </CardComponent>
    </section>
  );
}
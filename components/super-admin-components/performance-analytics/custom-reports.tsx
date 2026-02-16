"use client";

import Heading from "@/ui/text-heading";
import Table from "@/ui/table";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import CardComponent from "@/ui/card-wrapper";

import PDF from "@/ui/pdf-download-btn";
import { usePerformanceAnalyticsReportsState } from "@/store/super-admin-store/performance-analytics-store";
import { useProjects } from "@/context/ProjectsContext";
import TagInput from "@/ui/form/tag-input";
import TextInput from "@/ui/form/text-input";
import { useRoleStore } from "@/store/role-store";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "@/lib/api/credentials";
import { formatDate, convertDateToISO8601 } from "@/utils/dates-format-utility";
import DateInput from "@/ui/form/date-input";

type ReportsTable = {
  reportId: string;
  reportName: string;
  reportType: string;
  projectId: string;
  startDate: string;
  endDate: string;
  selectedMetrics: string;
  generatedBy: string;
  fileUrl: string;
  fileSize: number;
  status: string;
  totalActivities: number;
  totalRequests: number;
  totalRetirements: number;
  budgetUtilization: number;
  createAt: string;
  updateAt: string;
  project: {
    projectName: string;
  }
}

export default function CustomReports() {
  const {
    reportType,
    reportName,
    reportConfigurationProjects,
    metricsAndKPIs,
    startDate,
    endDate,
    setField,
    resetForm,
  } = usePerformanceAnalyticsReportsState();

  const { projectOptions } = useProjects();
  const { user } = useRoleStore();
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportsTable[]>([]);
  const [isFetchingReports, setIsFetchingReports] = useState(false);
  const [filterProjectId, setFilterProjectId] = useState("");
  const [filterReportType, setFilterReportType] = useState("");

  const handleGenerateReport = async () => {
    if (!reportName || !reportType || !reportConfigurationProjects) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        reportType,
        reportName,
        projectId: reportConfigurationProjects,
        startDate: convertDateToISO8601(startDate).split("T")[0],
        endDate: convertDateToISO8601(endDate).split("T")[0],
        selectedMetrics: metricsAndKPIs,
        generatedBy: user?.id,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/generate`, 
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      toast.success("Report generated successfully");
      resetForm();
      handleFetchReports();
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchReports = async () => {
    setIsFetchingReports(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/all?projectId=${filterProjectId}&reportType=${filterReportType}`
      );
      setReportData(response.data.data);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast.error(error.response?.data?.message || "Failed to fetch reports");
    } finally {
      setIsFetchingReports(false);
    }
  };

  useEffect(() => {
    handleFetchReports();
  }, [filterProjectId, filterReportType]);

  const head = ["Report Name", "Type", "Date Created", "Actions"];

  return (
    <section className="flex flex-col md:flex-row gap-4">
      {/* generate report form */}
      <div className="w-full md:w-[30%]">
        <CardComponent 
        // height="380px" 
        // className="overflow-y-scroll custom-scrollbar"
        >
          <Heading
            heading="Report Configuration"
            subtitle="Customize your report parameters"
            spacing="3"
          />
          <div className="space-y-4 mt-5 mb-8">
            <TextInput
              label="Report Name"
              name="reportName"
              value={reportName}
              placeholder="Enter report name"
              onChange={(e) => setField("reportName", e.target.value)}
            />
            <DropDown
              name="reportType"
              value={reportType}
              label="Report Type"
              onChange={(value: string) => setField("reportType", value)}
              options={[
                { label: "Activity Summary", value: "Activity Summary" },
                { label: "Financial Overview", value: "Financial Overview" },
                { label: "Request Analysis", value: "Request Analysis" },
                { label: "Retirement Analysis", value: "Retirement Analysis" },
              ]}
            />
            <DateInput
              label="Start Date"
              value={startDate}
              onChange={(value) => setField("startDate", value)}
            />
            <DateInput
              label="End Date"
              value={endDate}
              onChange={(value) => setField("endDate", value)}
            />
            <DropDown
              name="reportConfigurationProjects"
              value={reportConfigurationProjects}
              label="Projects"
              placeholder="All Projects"
              onChange={(value: string) =>
                setField("reportConfigurationProjects", value)
              }
              options={projectOptions}
            />
            <TagInput
              label="Metrics & KPIs"
              onChange={(value: string[]) => setField("metricsAndKPIs", value)}
              value={metricsAndKPIs}
              options={[
                "Budget Utilization",
                "Completion Rate",
                "Approval Rate",
                "Timeline Adherence", 
                "Cost Variance",
                "Activity Progress", 
                "Request Turnaround Time",
                "Retirement Completion Rate",
              ]}
            />
          </div>
          <Button
            content={loading ? "Generating..." : "Generate Report"}
            onClick={handleGenerateReport}
            isDisabled={loading}
          />
        </CardComponent>
      </div>

      {/* reports table */}
      <div className="w-full md:w-[70%]">
        <div className="flex justify-end items-center gap-4 mb-4 w-100">
          <DropDown
            name="filterProjectId"
            value={filterProjectId}
            onChange={(value: string) => setFilterProjectId(value)}
            options={[{ label: "All Projects", value: "" }, ...projectOptions]}
          />
          <DropDown
            name="filterReportType"
            value={filterReportType}
            onChange={(value: string) => setFilterReportType(value)}
            options={[
              { label: "All Types", value: "" },
              { label: "Activity Summary", value: "Activity Summary" },
              { label: "Financial Overview", value: "Financial Overview" },
              { label: "Request Analysis", value: "Request Analysis" },
              { label: "Retirement Analysis", value: "Retirement Analysis" },
            ]}
          />
        </div>
        <CardComponent height="auto">
         {isFetchingReports ? (
           <div className="dots my-20 mx-auto">
            <div></div>
            <div></div>
            <div></div>
          </div>
         ) : <Table
            tableHead={head}
            tableData={reportData}
            renderRow={(row) => {
              return (
                <>
                  <td className="px-6">{row.reportName}</td>
                  <td className="px-6">{row.reportType}</td>
                  <td className="px-6">{formatDate(row.startDate, "short")}</td>
                  <td>
                    <div className="flex gap-1">
                      <PDF title="PDF" />
                      <PDF title="Excel" />
                    </div>
                  </td>
                </>
              );
            }}
            pagination={true}
            itemsPerPage={3}
            showPaginationControls={true}
          />}
        </CardComponent>
      </div>
    </section>
  );
}

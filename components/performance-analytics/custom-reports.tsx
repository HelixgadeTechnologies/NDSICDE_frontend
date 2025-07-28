"use client";

import Heading from "@/ui/text-heading";
import Table from "@/ui/table";
import DropDown from "@/ui/form/select-dropdown";
import Button from "@/ui/form/button";
import CardComponent from "@/ui/card-wrapper";
import DateRangePicker from "@/ui/form/date-range";
import PDF from "@/ui/pdf-download-btn";
import { usePerformanceAnalyticsReportsState } from "@/store/performance-analytics-store";

export default function CustomReports() {
  const { reportType, reportConfigurationProjects, metricsAndKPIs, setField } =
    usePerformanceAnalyticsReportsState();

  const head = ["Report Name", "Type", "Date Created", "Actions"];

  const data = [
    {
      reportName: "Q1 Financial Summary",
      type: "Financial",
      dateCreated: "Mar 31, 2025",
    },
    {
      reportName: "Q1 Financial Summary",
      type: "Financial",
      dateCreated: "Mar 31, 2025",
    },
    {
      reportName: "Q1 Financial Summary",
      type: "Financial",
      dateCreated: "Mar 31, 2025",
    },
    {
      reportName: "Q1 Financial Summary",
      type: "Financial",
      dateCreated: "Mar 31, 2025",
    },
    {
      reportName: "Q1 Financial Summary",
      type: "Financial",
      dateCreated: "Mar 31, 2025",
    },
  ];

  return (
    <section className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-[30%]">
        <CardComponent height="540px">
          <Heading
            heading="Report Configuration"
            subtitle="Customize your report parameters"
            spacing="3"
          />
          <div className="space-y-4 mt-5 mb-8">
            <DropDown
              name="reportType"
              value={reportType}
              label="Report Type"
              placeholder="Summary Report"
              onChange={(value: string) => setField("reportType", value)}
              options={[]}
            />
            <DateRangePicker label="Date Range" />
            <DropDown
              name="reportConfigurationProjects"
              value={reportConfigurationProjects}
              label="Projects"
              placeholder="All Projects"
              onChange={(value: string) =>
                setField("reportConfigurationProjects", value)
              }
              options={[]}
            />
            <DropDown
              name="metricsAndKPIs"
              value={metricsAndKPIs}
              label="Metrics & KPIs"
              placeholder="All Metrics"
              onChange={(value: string) => setField("metricsAndKPIs", value)}
              options={[]}
            />
          </div>
          <Button content="Generate Report" />
        </CardComponent>
      </div>
      <div className="w-full md:w-[70%]">
        <CardComponent height="540px">
          <Table
            tableHead={head}
            tableData={data}
            renderRow={(row) => {
              return (
                <>
                  <td className="px-6">{row.reportName}</td>
                  <td className="px-6">{row.type}</td>
                  <td className="px-6">{row.dateCreated}</td>
                  <td>
                    <div className="flex gap-1">
                      <PDF title="PDF" />
                      <PDF title="Excel" />
                    </div>
                  </td>
                </>
              );
            }}
          />
        </CardComponent>
      </div>
    </section>
  );
}

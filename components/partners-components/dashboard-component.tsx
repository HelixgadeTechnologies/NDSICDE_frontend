"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import PieChartComponent from "@/ui/pie-chart";
import LineChartComponent from "@/ui/line-chart";
import Table from "@/ui/table";
import { progressTrackingColors, progressTracking } from "@/lib/config/charts";
import { formatDate } from "@/utils/dates-format-utility";

type ChartData = {
  month: string;
  target: number;
  actual: number;
}

type PieChartData = {
  type: string;
  count: number;
  percentage: number;
}

type PartnersDashboardComponentProps = {
  projectId?: string;
  startDate?: string;
  endDate?: string;
};

export default function PartnersDashboardComponent({
  projectId,
  startDate,
  endDate,
}: PartnersDashboardComponentProps) {
  // table data headers
  const head = ["KPI", "Submission Date", "Status", "Actions"];
  // line chart data
  const lines = [
    { key: "target", label: "Target", color: "#003B99" },
    { key: "actual", label: "Actual", color: "#EF4444" },
  ];
  // get table data requests
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // states for datas
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartDataLoading, setChartDataLoading] = useState(false);
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
  const [pieChartDataLoading, setPieChartDataLoading] = useState(false);

  useEffect(() => {
    setChartDataLoading(true);
    setPieChartDataLoading(true);

    const fetchChartData = async () => {
      try {
        const params = new URLSearchParams();
        if (projectId) params.append("projectId", projectId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/performance-chart?${params.toString()}`);
        setChartData(res.data.data);
      } catch (error) {
        console.error('error getting line data: ', error)
      } finally {
        setChartDataLoading(false);
      }
    };

    const fetchPieChartData = async () => {
      try {
        const params = new URLSearchParams();
        if (projectId) params.append("projectId", projectId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/type-distribution?${params.toString()}`);
        setPieChartData(res.data.data);
      } catch (error) {
        console.error('error getting pie data: ', error)
      } finally {
        setPieChartDataLoading(false);
      }
    };

    fetchChartData();
    fetchPieChartData();
  }, [projectId, startDate, endDate]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setSubmissionsLoading(true);
      try {
        const params = new URLSearchParams();
        if (projectId) params.append("projectId", projectId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (query) params.append("search", query);
        if (statusFilter && statusFilter !== "All") params.append("status", statusFilter);

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/submissions?${params.toString()}`);
        setSubmissions(res.data.data || []);
      } catch (error) {
        console.error("error getting submissions: ", error);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchSubmissions();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [projectId, startDate, endDate, query, statusFilter]);
  return (
    <section className="space-y-8">
        <div className="flex gap-6 items-start">
            <div className="w-[70%]">
                <CardComponent>
                    <Heading heading="KPI Performance Overview" subtitle="Targets vs. Actuals over the last 6 months" />
                    <div className="h-110">
                      {chartDataLoading ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          Loading KPI data...
                        </div>
                      ) : chartData.length > 0 ? (
                        <LineChartComponent data={chartData} lines={lines} xKey="month" legend />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No KPI data available
                        </div>
                      )}
                    </div>
                </CardComponent>
            </div>
            <div className="w-[30%]">
                <CardComponent>
                    <Heading heading="Progress Tracking" subtitle="KPI Types Distribution" className="text-center" />
                    <div className="h-110">
                      {pieChartDataLoading ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                           Loading Pie data...
                        </div>
                      ) : pieChartData?.length > 0 ? (
                        <PieChartComponent
                          data={pieChartData.map(item => ({ name: item.type, value: item.percentage }))}
                          colors={progressTrackingColors}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                           No Pie data available
                        </div>
                      )}
                    </div>
                </CardComponent>
            </div>
        </div>

      <CardComponent>
        <div className="flex justify-between items-center mb-4">
          <Heading heading="Recent Submissions and Status" />
          <div className="gap-4.25 flex items-end">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              name="search"
              placeholder="Search Project"
            />
            <DropDown
              value={statusFilter}
              name="status"
              label="Status"
              placeholder="All Status"
              options={[
                { label: "All", value: "All" },
                { label: "Approved", value: "Approved" },
                { label: "Pending", value: "Pending" },
                { label: "Rejected", value: "Rejected" },
              ]}
              onChange={(val) => setStatusFilter(val)}
            />
          </div>
        </div>
        {submissionsLoading ? (
          <div className="dots my-20 mx-auto">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <Table
            tableHead={head}
            tableData={submissions}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.kpiName || "N/A"}</td>
                <td className="px-6">{formatDate(row.createdAt)}</td>
                <td
                    className={`px-6 capitalize ${
                      (row.status || "").toLowerCase() === "approved"
                        ? "text-green-500"
                        : (row.status || "").toLowerCase() === "pending" ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {row.status || "N/A"}
                  </td>
                <td className="pl-10 relative">
                    <Icon
                      icon={"uiw:more"}
                      width={22}
                      height={22}
                      className="cursor-pointer"
                      color="#909CAD"
                    />
                </td>
              </>
            )}
          />
        )}
      </CardComponent>
    </section>
  );
}

"use client";

import Table from "@/ui/table";
import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import { Icon } from "@iconify/react";
import ActionMenu from "@/ui/action-menu";
import { useState, useEffect } from "react";
import { useReportsCommentsModal } from "@/utils/reports-and-comments-utility";
import { reportsHead } from "@/types/reports-and-comments";
import AddComment from "./add-comments";
import ViewAnalytics from "./view-analytics";
import axios from "axios";
import {
  fetchResultTypes,
  transformResultTypesToOptions,
} from "@/lib/api/result-types";
import { formatDate } from "@/utils/dates-format-utility";
import { toSentenceCase } from "@/utils/ui-utility";

// Types for dropdown options
type DropdownOption = {
  label: string;
  value: string;
};

// Type for report data based on actual API response
type ReportData = {
  id: number;
  reportId: string;
  reportTitle: string;
  project: string;
  dateGenerated: string;
  status: string;
  kpiStatus: string;
  resultType: string;
  resultTypeId: string;
  indicatorSource: string;
  responsiblePersons: string;
  actualDate: string;
  cumulativeActual: string;
  actualNarrative: string;
  attachmentUrl: string;
  createAt: string;
  updateAt: string;
  resultTypeDetails: {
    resultName: string;
    resultTypeId: string;
  };
};

export default function ReportsTable() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [reportsData, setReportsData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [resultTypeFilter, setResultTypeFilter] = useState<string>("");

  // Dropdown options state
  const [resultTypeOptions, setResultTypeOptions] = useState<DropdownOption[]>([
    { label: "All Result Types", value: "" },
  ]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const limit = 10;

  const {
    handleAddComments,
    handleViewAnalytics,
    addComments,
    viewAnalytics,
    selectedReport,
    setAddComments,
    setViewAnalytics,
  } = useReportsCommentsModal();

  // Fetch result types on component mount
  useEffect(() => {
    const loadResultTypes = async () => {
      try {
        const resultTypes = await fetchResultTypes();
        const options = transformResultTypesToOptions(resultTypes);
        setResultTypeOptions([
          { label: "All Result Types", value: "" },
          ...options,
        ]);
      } catch (error) {
        console.error("Error loading result types:", error);
      }
    };

    loadResultTypes();
  }, []); // Run once on component mount

  // Fetch reports whenever filters change
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // Build the URL with filters
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/indicator-reports`;

        // Add filters only if they have values
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
        if (statusFilter) url += `status=${statusFilter}&`;
        if (resultTypeFilter) url += `resultType=${resultTypeFilter}&`;

        // Always add page and limit
        url += `page=${currentPage}&limit=${limit}`;

        const response = await axios.get(url);

        // Check if response has the data array
        if (response.data.success && response.data.data) {
          setReportsData(response.data.data);

          // If there's pagination info, use it
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages || 0);
          } else {
            // If no pagination, calculate based on data length
            setTotalPages(Math.ceil(response.data.data.length / limit));
          }
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReportsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [searchTerm, statusFilter, resultTypeFilter, currentPage]);
  console.log(reportsData)

  // Status options
  const statusOptions = [
    { label: "ALL STATUS", value: "" },
    { label: "Approved", value: "APPROVED" },
    { label: "Pending", value: "PENDING" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Active", value: "ACTIVE" },
  ];

  // Handle search with reset to page 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <section>
      <CardComponent>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 mb-6">
          <div className="w-full lg:w-1/2">
            <SearchInput
              placeholder="Search reports by title or projects.."
              value={searchTerm}
              onChange={handleSearchChange}
              name="search"
            />
          </div>

          {/* Filter dropdowns - simplified to just Status and Result Type */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row lg:justify-end items-stretch sm:items-end gap-4">
            <DropDown
              name="status"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={statusOptions}
              label="Status"
              placeholder="All Status"
            />
            <DropDown
              name="resultType"
              value={resultTypeFilter}
              onChange={(value) => {
                setResultTypeFilter(value);
                setCurrentPage(1);
              }}
              options={resultTypeOptions}
              label="Result Type"
              placeholder="All Result Types"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="dots mx-auto my-20">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <>
            {/* Table */}
            <Table
              tableHead={reportsHead}
              tableData={reportsData}
              renderRow={(row) => (
                <>
                  <td className="px-6">{row.reportTitle}</td>
                  <td className="px-6">{row.project}</td>
                  <td className="px-6">{formatDate(row.dateGenerated)}</td>
                  <td
                    className={`px-6 ${
                      row.status === "APPROVE"
                        ? "text-green-500"
                        : row.status === "PENDING"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}>
                    {toSentenceCase(row.status ?? "")}
                  </td>
                  <td
                    className={`px-6 ${
                      row.kpiStatus === "Met"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                    {row.kpiStatus}
                  </td>
                  <td className="px-6 relative">
                    <div className="flex justify-center items-center">
                      <Icon
                        icon={"uiw:more"}
                        width={22}
                        height={22}
                        className="cursor-pointer"
                        color="#909CAD"
                        onClick={() =>
                          setActiveRowId((prev) =>
                            prev === row.reportId ? null : row.reportId,
                          )
                        }
                      />
                    </div>

                    <ActionMenu
                      isOpen={activeRowId === row.reportId}
                      onClose={() => setActiveRowId(null)}
                      items={[
                        {
                          type: "button",
                          label: "Add Comments",
                          icon: "si:add-fill",
                          onClick: () =>
                            handleAddComments(row, () => setActiveRowId(null)),
                        },
                        {
                          type: "button",
                          label: "View Analytics",
                          icon: "heroicons:eye",
                          onClick: () =>
                            handleViewAnalytics(row, () => setActiveRowId(null)),
                          className: "border-y border-gray-300",
                        },
                      ]}
                    />
                  </td>
                </>
              )}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </CardComponent>

      {addComments && selectedReport && (
        <AddComment
          isOpen={addComments}
          onClose={() => setAddComments(false)}
          selectedReportId={selectedReport.reportId}
        />
      )}

      {viewAnalytics && selectedReport && (
        <ViewAnalytics
          isOpen={viewAnalytics}
          onClose={() => setViewAnalytics(false)}
          indicatorReportId={selectedReport.reportId}
        />
      )}
    </section>
  );
}
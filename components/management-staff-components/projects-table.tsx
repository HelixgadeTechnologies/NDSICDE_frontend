"use client";

import CardComponent from "@/ui/card-wrapper";
import Table from "@/ui/table";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import { Icon } from "@iconify/react";
import { managementTypeChecker } from "@/utils/ui-utility";
import DateRangePicker from "@/ui/form/date-range";
import { useState, useEffect } from "react";
import axios from "axios";

// Type for project data
type ProjectData = {
  projectId: string;
  projectCode: string;
  projectName: string;
  strategicObjective: string;
  status: string;
  startDate: string;
  endDate: string;
  team: string;
  category?: string;
};

// Type for dropdown options
type DropdownOption = {
  label: string;
  value: string;
};

// Type for DateRangePicker return value
type DateRange = {
  startDate: string;
  endDate: string;
};

export default function ManagementStaffProjectsTable() {
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: ""
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const limit = 10;

  const head = [
    "Project Code",
    "Project Name",
    "Strategic Objective",
    "Status",
    "Start Date",
    "End Date",
    "Team",
    "Actions",
  ];

  // Fetch projects whenever filters change
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // Build the URL with filters
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/managementAndStaff/projects?`;

        // Add filters only if they have values
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
        if (statusFilter) url += `status=${statusFilter}&`;
        if (categoryFilter) url += `category=${categoryFilter}&`;
        if (dateRange.startDate) url += `startDate=${dateRange.startDate}&`;
        if (dateRange.endDate) url += `endDate=${dateRange.endDate}&`;

        // Always add page and limit
        url += `page=${currentPage}&limit=${limit}`;

        console.log("Fetching projects from:", url);

        const response = await axios.get(url);

        console.log("Projects Response:", response.data);

        // Check if response has the data array
        if (response.data.success && response.data.data) {
          // Ensure we always set an array, even if data is null/undefined
          const data = response.data.data || [];
          setProjectsData(Array.isArray(data) ? data : [data]);

          // If there's pagination info, use it
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages || 0);
          } else {
            // If no pagination, calculate based on data length
            const dataLength = Array.isArray(data) ? data.length : 1;
            setTotalPages(Math.ceil(dataLength / limit));
          }
        } else {
          // If no data in response, set empty array
          setProjectsData([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjectsData([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [searchTerm, statusFilter, categoryFilter, dateRange.startDate, dateRange.endDate, currentPage]);

  // Status options
  const statusOptions: DropdownOption[] = [
    { label: "All Status", value: "" },
    { label: "Active", value: "Active" },
    { label: "Completed", value: "Completed" },
    { label: "On Hold", value: "On Hold" },
    { label: "Pending", value: "Pending" },
  ];

  // Category options (you might need to fetch these from an API too)
  const categoryOptions: DropdownOption[] = [
    { label: "All Categories", value: "" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Education", value: "Education" },
    { label: "Infrastructure", value: "Infrastructure" },
  ];

  // Handle search with reset to page 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle date range change
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  // Handle dropdown change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  // Add defensive check to ensure projectsData is always an array
  const safeProjectsData = Array.isArray(projectsData) ? projectsData : [];

  return (
    <CardComponent>
      <div className="mb-6 flex gap-4 items-end">
        <div className="w-2/5">
          <SearchInput
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search Projects"
          />
        </div>
        <div className="w-3/5 flex gap-4 items-end">
          <DropDown
            label="Status"
            placeholder="All Status"
            name="status"
            value={statusFilter}
            onChange={handleStatusChange}
            options={statusOptions}
          />
          <DropDown
            label="Categories"
            placeholder="All Categories"
            name="categories"
            value={categoryFilter}
            onChange={handleCategoryChange}
            options={categoryOptions}
          />
          <DateRangePicker 
            label="Date Range"
            onChange={handleDateRangeChange}
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
          <Table
            tableHead={head}
            tableData={safeProjectsData}
            renderRow={(row) => (
              <tr key={row.projectId}>
                <td className="px-6">{row.projectCode}</td>
                <td className="px-6">{row.projectName}</td>
                <td className="px-6">{row.strategicObjective}</td>
                <td className={managementTypeChecker({ status: row.status })}>{row.status}</td>
                <td className="px-6">{row.startDate}</td>
                <td className="px-6">{row.endDate}</td>
                <td className="px-6">{row.team}</td>
                <td className="px-6">
                  <div className="flex justify-center items-center">
                    <Icon
                      icon={"uiw:more"}
                      width={22}
                      height={22}
                      className="cursor-pointer"
                      color="#909CAD"
                      // onClick={() => handleRowAction(row)}
                    />
                  </div>
                </td>
              </tr>
            )}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
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
                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </CardComponent>
  );
}
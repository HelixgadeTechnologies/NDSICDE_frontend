"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectRequestType } from "@/types/project-management-types";
import { useEntityModal } from "@/utils/project-management-utility";
import DeleteModal from "@/ui/generic-delete-modal";
import Link from "next/link";
import EditActivityRequest from "@/components/project-management-components/edit-activity-request";
import EditProjectRequestRetirement from "@/components/project-management-components/edit-project-request-retirement";
import DashboardStat from "@/ui/dashboard-stat-card";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dates-format-utility";
import { RetirementRequestType } from "@/types/retirement-request";
import LoadingSpinner from "@/ui/loading-spinner";
import { toSentenceCase } from "@/utils/ui-utility";
import DropDown from "@/ui/form/select-dropdown";
import DateRangePicker from "@/ui/form/date-range";
import { useUIStore } from "@/store/ui-store";

const getRequestApprovalStatus = (step: number | undefined): string => {
  if (step === undefined || step === null) return "Awaiting SPO approval";
  switch (step) {
    case 0:
      return "Awaiting SPO approval";
    case 1:
      return "Awaiting Security Officer Approval";
    case 2:
      return "Awaiting Finance Officer Approval";
    case 3:
      return "Awaiting Finance Manager Approval";
    case 4:
      return "Awaiting Country Director Approval";
    case 5:
      return "Approved";
    default:
      return "Awaiting SPO approval";
  }
};

const getRetirementApprovalStatus = (step: number | undefined): string => {
  if (step === undefined || step === null) return "Awaiting Finance Officer Approval";
  switch (step) {
    case 0:
      return "Awaiting Finance Officer Approval";
    case 1:
      return "Awaiting Finance Manager Approval";
    case 2:
      return "Awaiting Country Director Approval";
    case 3:
      return "Approved";
    default:
      return "Awaiting Finance Officer Approval";
  }
};

export default function ProjectRequest() {
  const tabs = [
    { tabName: "Activity Financial Request", id: 1 },
    { tabName: "Activity Financial Retirement", id: 2 },
  ];
  const [activeTab, setActiveTab] = useState(1);
  const [data, setData] = useState<ProjectRequestType[]>([]);
  const [retirementData, setRetirementData] = useState<RetirementRequestType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRetirements, setIsLoadingRetirements] = useState(false);

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState<{ startDate: string; endDate: string } | null>(null);
  const { resetDateRange } = useUIStore();

  const isDateInRange = (dateStr: string | undefined): boolean => {
    if (!dateStr || !dateRangeFilter) return true;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return false;
      
      const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      
      const start = new Date(dateRangeFilter.startDate);
      const startMs = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      
      const end = new Date(dateRangeFilter.endDate);
      const endMs = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
      
      return compareDate >= startMs && compareDate <= endMs;
    } catch (e) {
      return false;
    }
  };

  const statusOptions = activeTab === 1 ? [
    { value: "", label: "All Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "In Review", label: "In Review" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ] : [
    { value: "", label: "All Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "In Review", label: "In Review" },
    { value: "Approved", label: "Approved and Closed" },
    { value: "Rejected", label: "Rejected" },
  ];

  const filteredRequests = data.filter((row) => {
    if (statusFilter) {
      const s = row.status?.toLowerCase() || "";
      const f = statusFilter.toLowerCase();
      if (s !== f && !(f === "approved" && s === "active")) return false;
    }
    if (dateRangeFilter) {
      if (!isDateInRange(row.activityStartDate)) return false;
    }
    return true;
  });

  const filteredRetirements = retirementData.filter((row) => {
    if (statusFilter) {
      const s = row.retirementStatus?.toLowerCase() || "pending";
      const f = statusFilter.toLowerCase();
      if (s !== f) return false;
    }
    if (dateRangeFilter) {
      const rowDate = row.activityStartDate || row.createAt;
      if (!isDateInRange(rowDate)) return false;
    }
    return true;
  });

  // const [viewRequestOpen, setViewRequestOpen] = useState(false);
  // const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  const [editRetirement, setEditRetirement] = useState(false);
  const [removeRetirement, setRemoveRetirement] = useState(false);
  const [selectedRetirement, setSelectedRetirement] = useState<RetirementRequestType | null>(null);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const projectId = (params?.id as string) || "";
  const router = useRouter();

  const head = [
    "Activity",
    "Total Requested Budget (₦)",
    "Approval Status",
    "Staff",
    "Status",
    // "Retirement Status",
    "Start Date",
    "End Date",
    "Actions",
  ];

  const retirementHead = [
    "Activity",
    "Total Requested Budget (₦)",
    "Actual Retired Cost (₦)",
    "Variance (₦)",
    "Approval Status",
    "Status",
    "Actions",
  ];

  const requestStats = [
    {
      title: "Total Requests",
      value: data?.length || 0,
      icon: "mdi:chart-box-outline",
    },
    {
      title: "Approved Requests",
      value: data?.filter((r) => r.status === "Approved").length || 0,
      icon: "mdi:check-circle-outline",
    },
    {
      title: "Pending Requests",
      value: data?.filter((r) => r.status === "Pending").length || 0,
      icon: "mdi:clock-outline",
    },
    {
      title: "Rejected Requests",
      value: data?.filter((r) => r.status === "Rejected").length || 0,
      icon: "mdi:close-circle-outline",
    },
  ];

  const retirementStats = [
    {
      title: "Total Approved Request",
      value: 0,
      icon: "mdi:check-circle-outline",
    },
    {
      title: "Total Retired",
      value:
        retirementData?.filter((r) => r.retirementStatus === "Approved")
          .length || 0,
      icon: "mdi:check-circle-outline",
    },
    {
      title: "Total Rejected",
      value:
        retirementData?.filter((r) => r.retirementStatus === "Rejected")
          .length || 0,
      icon: "mdi:close-circle-outline",
    },
    {
      title: "Total Under Review",
      value:
        retirementData?.filter((r) => r.retirementStatus === "Pending")
          .length || 0,
      icon: "mdi:clock-outline",
    },
    {
      title: "Total Retirements",
      value: retirementData?.length || 0,
      icon: "mdi:chart-box-outline",
    },
    {
      title: "Unretired",
      value: 0,
      icon: "mdi:chart-box-outline",
    },
  ];

  const dashboardData = activeTab === 1 ? requestStats : retirementStats;

  // state for modals - edit and remove
  const {
    editEntity: editRequest,
    setEditEntity: setEditRequest,
    handleEditEntity: handleEditRequest,
    removeEntity: removeRequest,
    setRemoveEntity: setRemoveRequest,
    handleRemoveEntity: handleRemoveRequest,
    selectedEntity: selectedRequest,
  } = useEntityModal<ProjectRequestType>();

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/getRequestByProjectId/${projectId}`,
      );
      setData(res.data?.data || []);
      console.log(res.data.data);
    } catch (error) {
      toast.error("Error retrieving requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRetirements = async () => {
    setIsLoadingRetirements(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/retirement/retirements`,
        {
          params: {
            projectId: projectId,
          },
        },
      );
      setRetirementData(res.data?.data || []);
    } catch (error) {
      console.error("Error Fetching retirements", error);
    } finally {
      setIsLoadingRetirements(false);
    }
  };

  // automatically fetch requests
  useEffect(() => {
    fetchRequests();
    fetchRetirements();
  }, []);

  // delete request
  const deleteRequest = async (requestId: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/request/${requestId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchRequests();
    } catch (error) {
      console.error(`Error deleting request: ${error}`);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  // delete retirement
  const deleteRetirement = async (retirementId: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/retirement/${retirementId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Retirement request deleted successfully.");
      fetchRetirements();
    } catch (error) {
      console.error(`Error deleting retirement: ${error}`);
      toast.error("An error occurred while deleting retirement.");
    } finally {
      setIsDeleting(false);
      setRemoveRetirement(false);
      setSelectedRetirement(null);
    }
  };



  return (
    <div className="relative mt-12 space-y-7">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Add Activity Request"
          icon="si:add-fill"
          href={`/projects/${projectId}/project-management/request/add`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardStat data={dashboardData} icon="basil:plus-solid" />
      </div>

      <CardComponent fitWidth={true}>
        {/* Tab switcher replicated from admin */}
        <div
          className={`w-full relative h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg mb-4`}>
          {tabs.map((d) => {
            const isActive = activeTab === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setActiveTab(d.id)}
                className="relative z-10">
                {isActive && (
                  <motion.div
                    layoutId="tab"
                    className="absolute inset-0 z-0 bg-white rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div
                  className={`relative z-10 px-3 md:px-6 h-10 flex items-center justify-center font-bold text-xs md:text-sm cursor-pointer whitespace-nowrap ${
                    isActive ? "text-[#242424]" : "text-[#7A7A7A]"
                  }`}>
                  {d.tabName}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status and Date Filters */}
        <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
          <div className="w-full sm:w-48">
            <DropDown
              name="statusFilter"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={statusOptions}
              placeholder="All Statuses"
            />
          </div>
          
          <div className="w-full sm:w-auto min-w-45 relative">
            <DateRangePicker
              onChange={(range) => setDateRangeFilter(range)}
            />
          </div>

          {(statusFilter || dateRangeFilter) && (
            <button
              onClick={() => {
                setStatusFilter("");
                setDateRangeFilter(null);
                resetDateRange();
              }}
              className="h-10 px-4 w-full sm:w-auto text-sm font-semibold text-gray-555 hover:text-red-550 hover:bg-red-50 border border-gray-200 hover:border-red-100 rounded-md transition-all flex items-center justify-center gap-1.5">
              Clear
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}>
            {activeTab === 1 &&
              (isLoading ? (
                <LoadingSpinner />
              ) : (
                <Table
                  tableHead={head}
                  tableData={filteredRequests}
                  checkbox
                  idKey={"requestId"}
                  onClick={(row) =>
                    router.push(
                      `/projects/${projectId}/project-management/request/view?requestId=${row.requestId}`,
                    )
                  }
                  renderRow={(row) => (
                    <>
                      <td className="px-6 w-37.5">
                        {toSentenceCase(row.activityTitle ?? "")}
                      </td>
                      <td className="px-6">
                        ₦
                        {(row.lineItems || [])
                          .reduce(
                            (sum, item) => sum + (item.totalBudget || 0),
                            0,
                          )
                          .toLocaleString()}
                      </td>
                      <td className="px-6">
                        {getRequestApprovalStatus(row.approvalStep)}
                      </td>
                      <td className="px-6">
                        {toSentenceCase(row.staff ?? "")}
                      </td>
                      <td
                        className={`px-6 font-semibold ${
                          row.status === "Approved" || row.status === "Active"
                            ? "text-green-600"
                            : row.status === "Pending"
                              ? "text-yellow-600"
                              : row.status === "In Review"
                                ? "text-blue-600"
                                : row.status === "Rejected"
                                  ? "text-red-600"
                                  : "text-gray-600"
                        }`}>
                        {row.status || "Pending"}
                      </td>
                      <td className="px-6">
                        {formatDate(row.activityStartDate, "date-only")}
                      </td>
                      <td className="px-6">
                        {formatDate(row.activityEndDate, "date-only")}
                      </td>
                      <td className="px-6 relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center items-center">
                          <Icon
                            icon={"uiw:more"}
                            width={22}
                            height={22}
                            className="cursor-pointer"
                            color="#909CAD"
                            onClick={() =>
                              setActiveRowId((prev) =>
                                prev === row.requestId ? null : row.requestId,
                              )
                            }
                          />
                        </div>

                        {activeRowId === row.requestId && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -10, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50">
                              <ul className="text-sm">
                                <li
                                  onClick={() =>
                                    handleEditRequest(row, setActiveRowId)
                                  }
                                  className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                                  <Icon
                                    icon={"ph:pencil-simple-line"}
                                    height={20}
                                    width={20}
                                  />
                                  Edit
                                </li>
                                <li
                                  onClick={() =>
                                    handleRemoveRequest(row, setActiveRowId)
                                  }
                                  className="cursor-pointer hover:text-(--primary-light) border-y border-gray-300 flex gap-2 p-3 items-center">
                                  <Icon
                                    icon={"pixelarticons:trash"}
                                    height={20}
                                    width={20}
                                  />
                                  Remove
                                </li>
                                <Link
                                  href={`/projects/${projectId}/project-management/request/retire?requestId=${row.requestId}`}
                                  className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center">
                                  <Icon
                                    icon={"si:add-fill"}
                                    height={20}
                                    width={20}
                                  />
                                  Retire
                                </Link>
                                <Link
                                  href={`/projects/${projectId}/project-management/request/view?requestId=${row.requestId}`}
                                  className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                                  <Icon
                                    icon={"hugeicons:view"}
                                    height={20}
                                    width={20}
                                  />
                                  View Activity
                                </Link>
                              </ul>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </td>
                    </>
                  )}
                />
              ))}

            {activeTab === 2 &&
              (isLoadingRetirements ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-5 mt-4">
                  <Table
                    tableHead={retirementHead}
                    tableData={filteredRetirements}
                    checkbox
                    idKey={"retirementId"}
                    onClick={(row) =>
                      router.push(
                        `/projects/${projectId}/project-management/request/retire?requestId=${row.requestId}`,
                      )
                    }
                    renderRow={(row: RetirementRequestType) => (
                      <>
                        <td className="px-6">
                          {toSentenceCase(row.requestActivityTitle || row.activityLineDescription || "")}
                        </td>
                        <td className="px-6">
                          ₦{(row.totalBudget || 0).toLocaleString()}
                        </td>
                        <td className="px-6">
                          ₦{(row.actualCost || 0).toLocaleString()}
                        </td>
                        <td className="px-6 font-medium">
                          {(() => {
                            const diff = (row.totalBudget || 0) - (row.actualCost || 0);
                            if (diff < 0) {
                              return (
                                <span className="text-red-500">
                                  -₦{Math.abs(diff).toLocaleString()}
                                </span>
                              );
                            } else if (diff > 0) {
                              return (
                                <span className="text-green-500">
                                  ₦{diff.toLocaleString()}
                                </span>
                              );
                            } else {
                              return (
                                <span className="text-gray-500">
                                  ₦0
                                </span>
                              );
                            }
                          })()}
                        </td>
                        <td className="px-6">
                          {getRetirementApprovalStatus(row.approvalStep)}
                        </td>
                        <td
                          className={`px-6 font-semibold ${
                            row.retirementStatus === "Approved"
                              ? "text-green-600"
                              : row.retirementStatus === "Pending"
                                ? "text-yellow-600"
                                : row.retirementStatus === "In Review"
                                  ? "text-blue-600"
                                  : row.retirementStatus === "Rejected"
                                    ? "text-red-600"
                                    : "text-gray-600"
                          }`}>
                          {row.retirementStatus === "Approved" ? "Approved and Closed" : (row.retirementStatus || "Pending")}
                        </td>
                        <td className="px-6 relative" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-center items-center">
                            <Icon
                              icon={"uiw:more"}
                              width={22}
                              height={22}
                              className="cursor-pointer"
                              color="#909CAD"
                              onClick={() =>
                                setActiveRowId((prev) =>
                                  prev === row.retirementId ? null : row.retirementId,
                                )
                              }
                            />
                          </div>

                          {activeRowId === row.retirementId && (
                            <AnimatePresence>
                              <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50">
                                <ul className="text-sm">
                                  <li
                                    onClick={() => {
                                      setSelectedRetirement(row);
                                      setEditRetirement(true);
                                      setActiveRowId(null);
                                    }}
                                    className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                                    <Icon
                                      icon={"ph:pencil-simple-line"}
                                      height={20}
                                      width={20}
                                    />
                                    Edit
                                  </li>
                                  <li
                                    onClick={() => {
                                      setSelectedRetirement(row);
                                      setRemoveRetirement(true);
                                      setActiveRowId(null);
                                    }}
                                    className="cursor-pointer hover:text-(--primary-light) border-y border-gray-300 flex gap-2 p-3 items-center">
                                    <Icon
                                      icon={"pixelarticons:trash"}
                                      height={20}
                                      width={20}
                                    />
                                    Remove
                                  </li>
                                  <Link
                                    href={`/projects/${projectId}/project-management/request/retire?requestId=${row.requestId}&viewOnly=true`}
                                    className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                                    <Icon
                                      icon={"hugeicons:view"}
                                      height={20}
                                      width={20}
                                    />
                                    View Retirement
                                  </Link>
                                </ul>
                              </motion.div>
                            </AnimatePresence>
                          )}
                        </td>
                      </>
                    )}
                  />
                </div>
              ))}
          </motion.div>
        </AnimatePresence>
      </CardComponent>

      {selectedRequest && (
        <EditActivityRequest
          isOpen={editRequest}
          onClose={() => {
            setEditRequest(false);
            fetchRequests(); // Refresh table data after editing
          }}
          initialData={selectedRequest}
          projectId={projectId}
        />
      )}

      {selectedRequest && (
        <DeleteModal
          isOpen={removeRequest}
          onClose={() => setRemoveRequest(false)}
          heading="Do you want to remove this Project Request?"
          onDelete={() => deleteRequest(selectedRequest.requestId)}
          isDeleting={isDeleting}
        />
      )}



      {editRetirement && selectedRetirement && (
        <EditProjectRequestRetirement
          isOpen={editRetirement}
          onClose={() => {
            setEditRetirement(false);
            setSelectedRetirement(null);
            fetchRetirements();
          }}
          selectedRequest={data.find((r) => r.requestId === selectedRetirement.requestId)}
          retirementData={selectedRetirement}
        />
      )}

      {selectedRetirement && (
        <DeleteModal
          isOpen={removeRetirement}
          onClose={() => {
            setRemoveRetirement(false);
            setSelectedRetirement(null);
          }}
          heading="Do you want to remove this Retirement Request?"
          onDelete={() => deleteRetirement(selectedRetirement.retirementId)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

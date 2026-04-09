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
import ViewActivityRequestModal from "@/components/project-management-components/view-activity-request-modal";
import DashboardStat from "@/ui/dashboard-stat-card";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dates-format-utility";
import { RetirementRequestType } from "@/types/retirement-request";

export default function ProjectRequest() {
  const tabs = [
    { tabName: "Activity Financial Request", id: 1 },
    { tabName: "Activity Financial Retirement", id: 2 },
  ];
  const [activeTab, setActiveTab] = useState(1);

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [retirementData, setRetirementData] = useState<RetirementRequestType[]>([]);
  const [isLoadingRetirements, setIsLoadingRetirements] = useState(false);
  const [data, setData] = useState<ProjectRequestType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewRequestOpen, setViewRequestOpen] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const projectId = (params?.id as string) || "";

  const head = [
    "Activity Description",
    "Total (₦)",
    "Activity Location",
    "Staff",
    "Status",
    // "Retirement Status",
    "Start Date",
    "End Date",
    "Actions",
  ];

  const retirementHead = [
    "Activity Line Description",
    "Quantity",
    "Frequency",
    "Unit Cost (₦)",
    "Total Budget (₦)",
    "Actual Cost (₦)",
  ];

  const requestStats = [
    {
      title: "Total Requests",
      value: data.length,
      icon: "mdi:chart-box-outline",
    },
    {
      title: "Approved Requests",
      value: data.filter((r) => r.status === "Approved").length,
      icon: "mdi:check-circle-outline",
    },
    {
      title: "Pending Requests",
      value: data.filter((r) => r.status === "Pending").length,
      icon: "mdi:clock-outline",
    },
    {
      title: "Rejected Requests",
      value: data.filter((r) => r.status === "Rejected").length,
      icon: "mdi:close-circle-outline",
    },
  ];

  const retirementStats = [
    {
      title: "Total Retired",
      value: retirementData.filter((r) => r.retirementStatus === "Approved").length,
      icon: "mdi:check-circle-outline",
    },
    {
      title: "Total Rejected",
      value: retirementData.filter((r) => r.retirementStatus === "Rejected").length,
      icon: "mdi:close-circle-outline",
    },
    {
      title: "Total Under Review",
      value: retirementData.filter((r) => r.retirementStatus === "Pending").length,
      icon: "mdi:clock-outline",
    },
    {
      title: "Total Retirements",
      value: retirementData.length,
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/requests`,
      );
      setData(res.data.data);
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error Fetching requests");
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
        }
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
      toast.success("Project request deleted successfully!");
      setRemoveRequest(false);
      fetchRequests();
    } catch (error) {
      console.error(`Error deleting request: ${error}`);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsDeleting(false);
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
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}>

        {activeTab === 1 && (
          isLoading ? (
            <div className="dots my-20 mx-auto">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
          <Table
            tableHead={head}
            tableData={data}
            checkbox
            idKey={"requestId"}
            renderRow={(row) => (
              <>
                <td className="px-6 w-37.5 capitalize">
                  {row.activityPurposeDescription}
                </td>
                {/* budget total previously */}
                <td className="px-6">{row.total}</td>
                <td className="px-6 capitalize">{row.activityLocation}</td>
                <td className="px-6 capitalize">{row.staff}</td>
                <td
                  className={`px-6 ${
                    row.status === "Active" ? "text-green-500" :
                    row.status === "Pending" ? 'text-yellow-500' 
                    : "text-red-500"
                  }`}>
                  {row.status}
                </td>
                <td className="px-6">
                  {formatDate(row.activityStartDate, "date-only")}
                </td>
                <td className="px-6">
                  {formatDate(row.activityEndDate, "date-only")}
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
                            <Icon icon={"si:add-fill"} height={20} width={20} />
                            Retire
                          </Link>
                          <li onClick={() => { setViewRequestOpen(true); setSelectedViewId(row.requestId); setActiveRowId(null); }} className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                            <Icon
                              icon={"hugeicons:view"}
                              height={20}
                              width={20}
                            />
                            View Activity
                          </li>
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </td>
              </>
            )}
          />
        ))}

        {activeTab === 2 && (
          isLoadingRetirements ? (
            <div className="dots my-20 mx-auto">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <div className="space-y-5 mt-4">
              <Table
                tableHead={retirementHead}
                tableData={retirementData}
                checkbox
                idKey={"retirementId"}
                renderRow={(row) => (
                  <>
                    <td className="px-6">{row.activityLineDescription || "N/A"}</td>
                    <td className="px-6">{row.quantity || "0"}</td>
                    <td className="px-6">{row.frequency || "0"}</td>
                    <td className="px-6">{row.unitCost || "0"}</td>
                    <td className="px-6">{row.totalBudget || "0"}</td>
                    <td className="px-6">{row.actualCost || "0"}</td>
                  </>
                )}
              />
              <div className="flex justify-between items-center pt-6 px-10 text-base font-medium">
                <p>Total Activity Cost (₦): {retirementData.reduce((acc, curr) => acc + (curr.actualCost || 0), 0).toLocaleString()}</p>
                <p>Amount to reimburse to NDSICDE (₦): 0</p>
                <p>Amount to reimburse to Staff (₦): 0</p>
              </div>
            </div>
          )
        )}
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

      <ViewActivityRequestModal 
         isOpen={viewRequestOpen} 
         onClose={() => { setViewRequestOpen(false); setSelectedViewId(null); }} 
         requestId={selectedViewId} 
      />
    </div>
  );
}

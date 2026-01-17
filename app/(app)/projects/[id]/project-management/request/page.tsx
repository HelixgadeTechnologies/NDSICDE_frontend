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
import DashboardStat from "@/ui/dashboard-stat-card";
import axios from "axios";
import { getToken } from "@/lib/api/credentials";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dates-format-utility";

export default function ProjectRequest() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectRequestType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const dashboardData = [
    {
      title: "Total Requests",
      value: 0,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Total Approved",
      value: 0,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Total Rejected",
      value: 0,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Total Pending",
      value: 0,
      icon: "fluent:target-24-filled",
    },
    {
      title: "Total Retired",
      value: 0,
      icon: "fluent:target-24-filled",
    },
  ];

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/request/requests`
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

  // automatically fetch requests
  useEffect(() => {
    fetchRequests();
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
        }
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DashboardStat data={dashboardData} icon="basil:plus-solid" />
      </div>

      <CardComponent fitWidth={true}>
        {isLoading ? (
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
                <td className="px-6 w-37.5">
                  {row.activityPurposeDescription}
                </td>
                {/* budget total previously */}
                <td className="px-6">{row.total}</td>
                <td className="px-6">{row.activityLocation}</td>
                <td className="px-6">{row.staff}</td>
                <td
                  className={`px-6 ${
                    row.status === "Active" ? "text-green-500" : "text-red-500"
                  }`}>
                  {row.status}
                </td>
                {/* <td className="px-6">{row.projectId}</td> */}
                <td className="px-6">
                  {formatDate(row.activityStartDate, "short")}
                </td>
                <td className="px-6">
                  {formatDate(row.activityEndDate, "short")}
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
                          prev === row.requestId ? null : row.requestId
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
                            href={`/projects/${projectId}/project-management/request/retire`}
                            className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center">
                            <Icon icon={"si:add-fill"} height={20} width={20} />
                            Retire
                          </Link>
                          <li className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
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
        )}
      </CardComponent>

      {selectedRequest && (
        <EditActivityRequest
          isOpen={editRequest}
          onClose={() => setEditRequest(false)}
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
    </div>
  );
}

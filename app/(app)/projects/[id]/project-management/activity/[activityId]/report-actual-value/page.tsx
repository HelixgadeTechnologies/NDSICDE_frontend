"use client";

import { getToken } from "@/lib/api/credentials";
import { ProjectActivityReportTypes } from "@/types/project-management-types";
import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import DeleteModal from "@/ui/generic-delete-modal";
import Table from "@/ui/table";
import Heading from "@/ui/text-heading";
import { formatDate } from "@/utils/dates-format-utility";
import { Icon } from "@iconify/react";
import axios from "axios";
import ActionMenu from "@/ui/action-menu";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ReportActualValue() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectActivityReportTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const params = useParams();
  const projectId = (params.id as string) || "";
  const activityId = (params.activityId as string) || "";

  const head = [
    "Activity Statement",
    "Actual Narrative",
    "Completion (%)",
    // "Actual Cost",
    "Actual Start Date",
    "Actual End Date",
    "Actions",
  ];

  // fetch data
  const fetchActivityReports = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity-reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const allReports = response.data.data || [];
      const filteredReports = activityId
        ? allReports.filter(
            (report: ProjectActivityReportTypes) =>
              report.activityId === activityId,
          )
        : allReports;

      setData(filteredReports);
    } catch (error) {
      console.log(`Error fetching activity reports: ${error}`);
      toast.error("Error retrieving activity report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch automatically
  useEffect(() => {
    fetchActivityReports();
  }, [activityId, token]);
  console.log(data);

  // Handle delete click - opens confirmation modal
  const handleDeleteClick = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setConfirmDeleteModal(true);
    setActiveRowId(null);
  };

  // delete activity report
  const deleteActivity = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity-report/${itemToDelete.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setItemToDelete(null);
      fetchActivityReports();
    } catch (error) {
      console.error(`Error deleting activity report: ${error}`);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModalClose = () => {
    setConfirmDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="relative mt-12">
      <Heading heading={`Actual Value Report`} className="mb-5" />

      <CardComponent>
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
            idKey={"activityReportId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.activityStatement}</td>
                <td className="px-6">{row.actualNarrative}</td>
                <td className="px-6">{row.percentageCompletion}%</td>
                {/* <td className="px-6">₦ {row.actualCost}</td> */}
                <td className="px-6">
                  {formatDate(row.actualStartDate, "date-only")}
                </td>
                <td className="px-6">{formatDate(row.actualEndDate, "date-only")}</td>
                <td className="px-6 relative">
                  <Icon
                    icon={"uiw:more"}
                    width={22}
                    height={22}
                    className="cursor-pointer"
                    color="#909CAD"
                    onClick={() =>
                      setActiveRowId((prev) =>
                        prev === row.activityReportId
                          ? null
                          : row.activityReportId,
                      )
                    }
                  />

                  <ActionMenu
                    isOpen={activeRowId === row.activityReportId}
                    onClose={() => setActiveRowId(null)}
                    items={[
                      {
                        type: "button",
                        label: "Edit",
                        icon: "ph:pencil-simple-line",
                        onClick: () => {},
                      },
                      {
                        type: "button",
                        label: "Remove",
                        icon: "pixelarticons:trash",
                        onClick: () =>
                          handleDeleteClick(
                            row.activityReportId,
                            row.activityStatement || "this activity",
                          ),
                        className:
                          "hover:text-(--primary-light) border-y border-gray-300",
                      },
                    ]}
                  />
                </td>
              </>
            )}
          />
        )}
      </CardComponent>

      {itemToDelete && (
        <DeleteModal
          isOpen={confirmDeleteModal}
          onClose={handleDeleteModalClose}
          isDeleting={isDeleting}
          heading="Are you sure you want to delete this report?"
          subtitle={`You are about to delete "${itemToDelete.name}". This action is permanent and CANNOT be reversed.`}
          onDelete={deleteActivity}
        />
      )}
    </div>
  );
}

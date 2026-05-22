"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import TableWithAccordion from "@/ui/table-with-accordion";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { ProjectActivityTypes } from "@/types/project-management-types";
import { useEntityModal } from "@/utils/project-management-utility";
import DeleteModal from "@/ui/generic-delete-modal";
import EditProjectActivity from "@/components/project-management-components/edit-project-activity";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "next/navigation";
import { formatDate } from "@/utils/dates-format-utility";
import LoadingSpinner from "@/ui/loading-spinner";
import ActionMenu from "@/ui/action-menu";
import { sortByCreatedAt } from "@/utils/ui-utility";

type ActivityWithLinkedOutput = ProjectActivityTypes & {
  linkedOutputs: { outputStatement: string }[];
};

export default function ProjectActivity() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectActivityTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const projectId = (params?.id as string) || "";

  const head = [
    "Activity Statement",
    "Sub Activity",
    "Activity Frequency",
    "Budget (₦)",
    "Start - End Date",
    "Responsible Person(s)",
    "Actions",
  ];

  // Wrap each activity's outputStatement in an array so TableWithAccordion can render it as a child row
  const tableData: ActivityWithLinkedOutput[] = useMemo(
    () =>
      data.map((a) => ({
        ...a,
        linkedOutputs: a.outputStatement ? [{ outputStatement: a.outputStatement }] : [],
      })),
    [data],
  );

  // states for modals
  const {
    editEntity: editActivity,
    setEditEntity: setEditActivity,
    handleEditEntity: handleEditActivity,
    removeEntity: removeActivity,
    setRemoveEntity: setRemoveActivity,
    handleRemoveEntity: handleRemoveActivity,
    selectedEntity: selectedActivity,
  } = useEntityModal<ProjectActivityTypes>();

  // fetch activities
  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activities/project/${projectId}`,
      );
      setData(sortByCreatedAt(response.data.data || []));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // automatically fetch activities
  useEffect(() => {
    fetchActivities();
  }, []);

  // delete activity
  const deleteActivity = async (activityId: string) => {
    setIsDeleting(true);
    try {
      // Check if there are any reports attached to this activity
      const reportsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity-reports`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const reports = reportsResponse.data.data || [];
      const hasReport = reports.some((report: any) => report.activityId === activityId);
      
      if (hasReport) {
        toast.error("You cannot delete this activity without deleting its corresponding report first.");
        setIsDeleting(false);
        setRemoveActivity(false);
        return;
      }

      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity/${activityId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchActivities();
    } catch (error) {
      console.error(`Error deleting activity: ${error}`);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Add Activity"
          icon="si:add-fill"
          href={`/projects/${projectId}/project-management/activity/add`}
        />
      </div>

      <CardComponent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <TableWithAccordion<ActivityWithLinkedOutput, { outputStatement: string }>
            tableHead={head}
            tableData={tableData}
            childrenKey="linkedOutputs"
            persistKey={`activity-accordion-${projectId}`}
            renderRow={(row, _i, isOpen) => (
              <>
                <td className="px-6">{row.activityStatement}</td>
                <td className="px-6">{row.subActivity?.toLowerCase() === "one off" ? "One Off" : "Multiple"}</td>
                <td className="px-6">{row.activityFrequency}</td>
                <td className="px-6">{row.activityTotalBudget}</td>
                <td className="px-6">
                  {formatDate(row.startDate, "date-only")} - {formatDate(row.endDate, "date-only")}
                </td>
                <td className="px-6">{row.responsiblePerson}</td>
                <td className="px-6 relative" onClick={(e) => e.stopPropagation()}>
                  <Icon
                    icon={"uiw:more"}
                    width={22}
                    height={22}
                    className="cursor-pointer"
                    color="#909CAD"
                    onClick={() =>
                      setActiveRowId((prev) =>
                        prev === row.activityId ? null : row.activityId,
                      )
                    }
                  />
                  <ActionMenu
                    isOpen={activeRowId === row.activityId}
                    items={[
                      {
                        type: "button",
                        label: "Edit",
                        icon: "ph:pencil-simple-line",
                        onClick: () => handleEditActivity(row, setActiveRowId),
                      },
                      {
                        type: "button",
                        label: "Remove",
                        icon: "pixelarticons:trash",
                        onClick: () => handleRemoveActivity(row, setActiveRowId),
                        className: "hover:text-(--primary-light) border-y border-gray-300",
                      },
                      {
                        type: "link",
                        label: "Report Actual Value",
                        icon: "si:add-fill",
                        href: `/projects/${projectId}/project-management/activity/${row.activityId}/report-actual-value/add`,
                      },
                      {
                        type: "link",
                        label: "View Actual Value",
                        icon: "hugeicons:view",
                        href: `/projects/${projectId}/project-management/activity/${row.activityId}/report-actual-value`,
                      },
                    ]}
                  />
                </td>
              </>
            )}
            renderChildRow={(child) => (
              <td colSpan={head.length} className="px-6 py-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Linked Output
                  </p>
                  <p className="text-sm text-gray-900">
                    {child.outputStatement || "No output linked to this activity."}
                  </p>
                </div>
              </td>
            )}
            emptyStateMessage="No activities yet"
            emptyStateSubMessage="There are no activities for this project yet. Click 'Add Activity' to create one."
          />
        )}
      </CardComponent>

      {selectedActivity && (
        <EditProjectActivity
          isOpen={editActivity}
          onClose={() => setEditActivity(false)}
          mode="edit"
          initialData={selectedActivity}
          onSuccess={fetchActivities}
        />
      )}
      {selectedActivity && (
        <DeleteModal
          isOpen={removeActivity}
          onClose={() => setRemoveActivity(false)}
          heading="Do you want to remove this Project Activity?"
          onDelete={() => deleteActivity(selectedActivity.activityId)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

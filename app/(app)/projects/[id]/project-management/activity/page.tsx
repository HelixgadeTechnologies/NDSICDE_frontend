"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectActivityTypes } from "@/types/project-management-types";
import { useEntityModal } from "@/utils/project-management-utility";
import Link from "next/link";
import DeleteModal from "@/ui/generic-delete-modal";
import EditProjectActivity from "@/components/project-management-components/edit-project-activity";
import { getToken } from "@/lib/api/credentials";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "next/navigation";
import { formatDate } from "@/utils/dates-format-utility";

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
    "Budget (₦)",
    "Start Date",
    "End Date",
    "Responsible Person(s)",
    "Actions",
  ];

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activities`
      );
      toast.success(response.data.message);
      setData(response.data.data);
    } catch (error) {
      console.log(`Error fetching activities: ${error}`);
      toast.error("Error retrieving activities. Please try again.");
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
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity/${activityId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Project activity deleted successfully!");
      setRemoveActivity(false);
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
          <div className="dots ny-20 mx-auto">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <Table
            tableHead={head}
            tableData={data}
            checkbox
            idKey={"activityId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.activityStatement}</td>
                <td className="px-6">{row.subActivity}</td>
                <td className="px-6">{row.activityTotalBudget}</td>
                <td className="px-6">{formatDate(row.startDate, "short")}</td>
                <td className="px-6">{formatDate(row.endDate, "short")}</td>
                <td className="px-6">{row.responsiblePerson}</td>
                <td className="px-6 relative">
                  <Icon
                    icon={"uiw:more"}
                    width={22}
                    height={22}
                    className="cursor-pointer"
                    color="#909CAD"
                    onClick={() =>
                      setActiveRowId((prev) =>
                        prev === row.activityId ? null : row.activityId
                      )
                    }
                  />

                  {activeRowId === row.activityId && (
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
                              handleEditActivity(row, setActiveRowId)
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
                              handleRemoveActivity(row, setActiveRowId)
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
                            href={`/projects/${projectId}/project-management/activity/report-actual-value`}
                            className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                            <Icon icon={"si:add-fill"} height={20} width={20} />
                            Report Actual Value
                          </Link>
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

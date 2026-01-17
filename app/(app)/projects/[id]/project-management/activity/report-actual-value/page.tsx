"use client";

import { getToken } from "@/lib/api/credentials";
import { ProjectActivityReportTypes } from "@/types/project-management-types";
import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { formatDate } from "@/utils/dates-format-utility";
import { Icon } from "@iconify/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ReportActualValue() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectActivityReportTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const projectId = (params.id as string) || "";

  const head = [
    "Activity Statement",
    "Completion Rate",
    "Total Budget",
    "Responsible Person(s)",
    "Start Date",
    "End Date",
    "Actions",
  ];

  // fetch data
  const fetchActivityReports = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity-reports`);
        toast.success(response.data.message);
        setData(response.data.data);
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
  }, []);

  // delete activity report
  const deleteActivity = async (activityReportId: string) => {
    setIsDeleting(true);
   try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activity-report/${activityReportId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Project activity deleted successfully!");
      // setRemoveActivity(false);
      fetchActivityReports();
    } catch (error) {
      console.error(`Error deleting activity report: ${error}`);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-18.75">
        <Button content="Add Indicator Reporting Formats" icon="si:add-fill" />
      </div>

      <CardComponent>
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"activityReportId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.activityStatement}</td>
              <td className="px-6">{row.percentageCompletion}%</td>
              <td className="px-6">{row.activityTotalBudget}</td>
              <td className="px-6">{row.responsiblePerson}</td>
              <td className="px-6">{formatDate(row.startDate, "short")}</td>
              <td className="px-6">{formatDate(row.endDate, "short")}</td>
              <td className="px-6 relative">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) =>
                      prev === row.activityReportId ? null : row.activityReportId
                    )
                  }
                />

                {activeRowId === row.activityReportId && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50">
                      <ul className="text-sm">
                        <li className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"ph:pencil-simple-line"}
                            height={20}
                            width={20}
                          />
                          Edit
                        </li>
                        <li className="cursor-pointer hover:text-(--primary-light) border-y border-gray-300 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"pixelarticons:trash"}
                            height={20}
                            width={20}
                          />
                          Remove
                        </li>
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                )}
              </td>
            </>
          )}
        />
      </CardComponent>
    </div>
  );
}

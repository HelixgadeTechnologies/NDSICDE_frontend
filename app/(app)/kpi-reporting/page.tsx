"use client";

import Table from "@/ui/table";
import CardComponent from "@/ui/card-wrapper";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";
import DeleteModal from "@/ui/generic-delete-modal";
import EditKPIModal from "./components/edit-kpi-modal";
import ViewKPIModal from "./components/view-kpi-modal";

type KPIReportType = {
  actualValue: number;
  baseline: number;
  createdAt: string;
  kpiName: string;
  kpiReportId: string;
  kpiType: string;
  project: {
    projectId: string;
    projectName: string;
  };
  status: string;
  strategicObjective: {
    statement: string;
    strategicObjectiveId: string;
  };
  target: number;
};

export default function AssignedKPITable() {
  const [data, setData] = useState<KPIReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [kpiToDelete, setKpiToDelete] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [kpiToEdit, setKpiToEdit] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [kpiToView, setKpiToView] = useState<string | null>(null);

  const head = [
    "KPI Name",
    "Type",
    "Baseline",
    "Target",
    "Date Created",
    "Status",
    "Actions",
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/assigned`,
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!kpiToDelete) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/kpi-report/report/${kpiToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        },
      );
      setData((prev) =>
        prev.filter((item) => item.kpiReportId !== kpiToDelete)
      );
      setActiveRowId(null);
      setDeleteModal(false);
      setKpiToDelete(null);
    } catch (error) {
      console.error("Error deleting KPI report:", error);
      toast.error("Failed to delete KPI report");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <CardComponent className="mt-16">
        <div className="absolute top-28 right-10 w-62.5">
          <Button
            content="New KPI"
            icon="si:add-fill"
            href="/kpi-reporting/new-kpi"
          />
        </div>
        {loading ? (
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
            idKey={"kpiReportId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.kpiName}</td>
                <td className="px-6">{row.kpiType}</td>
                <td className="px-6">{row.baseline}</td>
                <td className="px-6">{row.target}</td>
                <td className="px-6">
                  {formatDate(row.createdAt, "date-only")}
                </td>
                <td
                  className={`px-6 ${
                    row.status === "Active"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}>
                  {row.status}
                </td>
                <td className="pl-10 relative">
                  <Icon
                    icon={"uiw:more"}
                    width={22}
                    height={22}
                    className="cursor-pointer"
                    color="#909CAD"
                    onClick={() =>
                      setActiveRowId((prev) =>
                        prev === row.kpiReportId ? null : row.kpiReportId,
                      )
                    }
                  />

                  {activeRowId === row.kpiReportId && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-40">
                        <ul className="text-sm">
                          <li
                            onClick={() => {
                              setKpiToView(row.kpiReportId);
                              setViewModal(true);
                              setActiveRowId(null);
                            }}
                            className="hover:text-blue-600 border-b border-gray-100 p-3 flex gap-2 items-center cursor-pointer w-full">
                            <Icon
                              icon={"hugeicons:view"}
                              height={20}
                              width={20}
                            />
                            View
                          </li>
                          <li
                            onClick={() => {
                              setKpiToEdit(row.kpiReportId);
                              setEditModal(true);
                              setActiveRowId(null);
                            }}
                            className="hover:text-blue-600 border-b border-gray-100 p-3 flex gap-2 items-center cursor-pointer w-full">
                            <Icon
                              icon={"ph:pencil-simple-line"}
                              height={20}
                              width={20}
                            />
                            Edit
                          </li>
                          <li
                            onClick={() => {
                              setKpiToDelete(row.kpiReportId);
                              setDeleteModal(true);
                              setActiveRowId(null);
                            }}
                            className={`cursor-pointer hover:text-red-500 flex gap-2 p-3 items-center ${isDeleting ? "opacity-50" : ""}`}>
                            <Icon
                              icon={"pixelarticons:trash"}
                              height={20}
                              width={20}
                            />
                            Delete
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

      <DeleteModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setKpiToDelete(null);
        }}
        onDelete={handleDelete}
        heading="Delete KPI Report"
        subtitle="Are you sure you want to delete this KPI report?"
        isDeleting={isDeleting}
      />

      {editModal && kpiToEdit && (
        <EditKPIModal
          isOpen={editModal}
          onClose={() => {
            setEditModal(false);
            setKpiToEdit(null);
          }}
          kpiId={kpiToEdit}
          onEdit={() => {
            fetchData();
          }}
        />
      )}

      {viewModal && kpiToView && (
        <ViewKPIModal
          isOpen={viewModal}
          onClose={() => {
            setViewModal(false);
            setKpiToView(null);
          }}
          kpiId={kpiToView}
        />
      )}
    </>
  );
}

"use client";

import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-hot-toast";
import DeleteModal from "@/ui/generic-delete-modal";
import EditKPIModal from "./edit-kpi-form";

type KPI = {
  baseLine: string;
  createAt: string;
  definition: string;
  disaggregation: string;
  itemInMeasure: string;
  kpiId: string;
  specificAreas: string;
  statement: string;
  strategicObjectiveId: string;
  target: string;
  type: string;
  unitOfMeasure: string;
  updateAt: string;
};

export default function KPITable() {
  const head = [
    "KPI Name",
    "Type",
    "Baseline",
    "Target",
    "Assigned",
    "Disaggregation",
    "Actions",
  ];

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [kpiToDelete, setKpiToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [kpiToEdit, setKpiToEdit] = useState<KPI | null>(null);

  // Fetch KPIs function
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/kpis`
      );
      setData(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load KPIs");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Get strategic objectives kpi
  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (kpi: KPI) => {
    setKpiToEdit(kpi);
    setShowEditModal(true);
    setActiveRowId(null);
  };

  const handleDeleteClick = (kpiId: string) => {
    setKpiToDelete(kpiId);
    setConfirmDelete(true);
    setActiveRowId(null);
  };

  const handleDelete = async () => {
    if (!kpiToDelete) return;
    
    const token = getToken();
    try {
      setDeleting(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/strategic-objectivesAndKpi/deleteKpi`,
        {
          data: { kpiId: kpiToDelete },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Deleted successfully!");
      
      // Refresh the table data
      await fetchData();
    } catch (error) {
      console.error(`Error ${error}`);
      toast.error("An error occurred. Please try again");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
      setKpiToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setKpiToDelete(null);
  };

  if (loading) {
    return (
      <section className="flex justify-center items-center h-40">
        <div className="dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchData()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No KPIs objectives found.</p>
      </div>
    );
  }

  return (
    <>
      <Table
        checkbox
        idKey={"kpiId"}
        tableHead={head}
        tableData={data}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.statement}</td>
            <td className="px-6">{row.type}</td>
            <td className="px-6">{row.baseLine}</td>
            <td className="px-6">{row.target}</td>
            <td className="px-6">No</td>
            <td className="px-6 capitalize">{row.disaggregation}</td>
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
                      prev === row.kpiId ? null : row.kpiId
                    )
                  }
                />
              </div>
              {activeRowId === row.kpiId && (
                <AnimatePresence>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-52.5">
                    <ul className="text-sm">
                      <li 
                        onClick={() => handleEditClick(row)}
                        className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center">
                        <Icon
                          icon={"ph:pencil-simple-line"}
                          height={20}
                          width={20}
                        />
                        Edit
                      </li>
                      <li
                        onClick={() => handleDeleteClick(row.kpiId)}
                        className="cursor-pointer hover:text-red-600 flex gap-2 p-3 items-center">
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

      {/* Edit Modal */}
      <EditKPIModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setKpiToEdit(null);
        }}
        kpiData={kpiToEdit}
        onSuccess={fetchData}
      />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <DeleteModal
          isOpen={confirmDelete}
          onClose={handleCancelDelete}
          heading="Confirm"
          subtitle="Are you sure you want to delete this KPI? This action is irreversible!"
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
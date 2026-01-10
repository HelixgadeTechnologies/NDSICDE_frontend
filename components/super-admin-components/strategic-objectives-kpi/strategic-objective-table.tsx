"use client";

import Table from "@/ui/table";
import { useStrategicObjectivesAndKPIsModal } from "@/utils/strategic-objective-kpi-utility";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AddKPIModal from "./add-kpi-form";
import axios from "axios";
import { getStrategicObjectives } from "@/lib/api/admin-api-calls";
import DeleteModal from "@/ui/generic-delete-modal";
import LinkedKPIsModal from "./linked-kpis-modal"; // Add this import

type ExpectedData = {
  createAt: string;
  linkedKpi: number;
  pillarLead: string;
  statement: string;
  status: string;
  strategicObjectiveId: string;
  thematicAreas: string;
  updateAt: string;
};

export default function SOTable() {
  const head = ["Objective Name", "Linked KPIs", "Status", "Actions"];
  const [data, setData] = useState<ExpectedData[]>([]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openLinkedKPI, setOpenLinkedKPI] = useState(false);
  const [selectedObjectiveForKPIs, setSelectedObjectiveForKPIs] = useState<string>("");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // State to track which objective is being added to
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("");

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
    setActiveRowId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      // Optimistically update UI
      setData((prev) =>
        prev.filter((item) => item.strategicObjectiveId !== itemToDelete)
      );
      
      // Make DELETE request with proper endpoint and data
      const response = await axios.delete(
        `/api/strategic-objectivesAndKpi/delete`,
        {
          data: {
            strategicObjectiveId: itemToDelete
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status !== 200) {
        throw new Error("Delete failed");
      }
      
      console.log("Item deleted successfully");
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error: any) {
      // Refetch to ensure we have correct data
      try {
        const objectives = await getStrategicObjectives();
        setData(objectives);
      } catch (refetchError) {
        console.error("Error refetching data:", refetchError);
      }
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete item";
      console.error("Delete error:", error);
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const { addKPI, setAddKPI, handleAddKPI } =
    useStrategicObjectivesAndKPIsModal();

  // Modified function to handle KPI addition with the objective ID
  const handleAddKPIClick = (objectiveId: string) => {
    setSelectedObjectiveId(objectiveId);
    handleAddKPI(() => setActiveRowId(null));
  };

  // Handle opening linked KPIs modal
  const handleViewLinkedKPIs = (objectiveId: string) => {
    setSelectedObjectiveForKPIs(objectiveId);
    setOpenLinkedKPI(true);
  };

  // Get strategic objectives data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const objectives = await getStrategicObjectives();
        setData(objectives);
      } catch (error) {
        setError("Failed to load strategic objectives");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (id: string) => {
    setActiveRowId((prev) => (prev === id ? null : id));
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
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No strategic objectives found.</p>
      </div>
    );
  }

  return (
    <section>
      <Table
        checkbox
        idKey="strategicObjectiveId"
        tableHead={head}
        tableData={data}
        renderRow={(row) => (
          <>
            <td className="px-6 py-4 capitalize">{row.statement || "N/A"}</td>
            <td 
              onClick={() => handleViewLinkedKPIs(row.strategicObjectiveId)}
              className="px-6 py-4 hover:cursor-pointer hover:underline hover:text-(--primary)">
              {row.linkedKpi !== undefined ? row.linkedKpi : 0}
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 rounded-full text-xs capitalize ${
                  row.status === "Active"
                    ? "text-green-500"
                    : row.status === "Inactive"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}>
                {row.status || "Unknown"}
              </span>
            </td>
            <td className="px-6 py-4 relative">
              <div className="flex justify-center items-center">
                <Icon
                  icon="uiw:more"
                  width={22}
                  height={22}
                  className="cursor-pointer hover:text-gray-700 transition-colors"
                  color="#909CAD"
                  onClick={() => handleRowClick(row.strategicObjectiveId)}
                />
              </div>
              {activeRowId === row.strategicObjectiveId && (
                <AnimatePresence>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-52.5">
                    <ul className="text-sm">
                      <li
                        onClick={() => handleAddKPIClick(row.strategicObjectiveId)}
                        className="cursor-pointer hover:bg-gray-50 flex gap-2 p-3 items-center">
                        <Icon
                          icon="fluent:arrow-growth-24-regular"
                          height={20}
                          width={20}
                        />
                        Add Organizational KPI
                      </li>
                      <li className="cursor-pointer hover:bg-gray-50 flex gap-2 border-y border-gray-200 p-3 items-center">
                        <Icon
                          icon="ph:pencil-simple-line"
                          height={20}
                          width={20}
                        />
                        Edit
                      </li>
                      <li
                        onClick={() => handleDeleteClick(row.strategicObjectiveId)}
                        className="cursor-pointer hover:bg-red-50 text-red-600 flex gap-2 p-3 items-center">
                        <Icon
                          icon="pixelarticons:trash"
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

      {addKPI && (
        <AddKPIModal 
          isOpen={addKPI} 
          onClose={() => setAddKPI(false)} 
          strategicObjectiveId={selectedObjectiveId}
        />
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        heading="Delete Strategic Objective"
        subtitle="Are you sure you want to delete this strategic objective? This action cannot be undone."
        onDelete={handleDeleteConfirm}
      />

      {/* Linked KPI modal */}
      {openLinkedKPI && (
        <LinkedKPIsModal
          isOpen={openLinkedKPI}
          onClose={() => setOpenLinkedKPI(false)}
          strategicObjectiveId={selectedObjectiveForKPIs}
        />
      )}
    </section>
  );
}
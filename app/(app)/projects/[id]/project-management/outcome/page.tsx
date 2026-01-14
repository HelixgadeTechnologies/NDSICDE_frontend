"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEntityModal } from "@/utils/project-management-utility";
import ProjectOutcomeModal from "@/components/project-management-components/project-outcome-modal";
import EditProjectOutcomeModal from "@/components/project-management-components/edit-project-outcome";
import DeleteModal from "@/ui/generic-delete-modal";
import { ProjectOutcomeTypes } from "@/types/project-management-types";
import Link from "next/link";
import { getToken } from "@/lib/api/credentials";
import toast from "react-hot-toast";
import axios from "axios";

export default function ProjectOutcome() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectOutcomeTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);

  const head = [
    "Project Outcome Objective",
    "Outcome Type",
    "Linked to Impact",
    "Thematic Areas",
    "Responsible Person(s)",
    "Actions",
  ];

  // states for modals
  const {
    editEntity: editProjectOutcome,
    addEntity: addProjectOutcome,
    removeEntity: removeProjectOutcome,
    setAddEntity: setAddProjectOutcome,
    setEditEntity: setEditProjectOutcome,
    setRemoveEntity: setRemoveProjectOutcome,
    selectedEntity: selectedProjectOutcome,
    handleEditEntity: handleEditProjectOutcome,
    handleAddEntity: handleAddProjectOutcome,
    handleRemoveEntity: handleRemoveProjectOutcome,
  } = useEntityModal<ProjectOutcomeTypes>();

  // fetch outcome
  const fetchOutcome = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outcomes`);
      toast.success(response.data.message);
      setData(response.data.data);
    } catch (error) {
      console.error(`Error fetching outcome: ${error}`);
      toast.error('Error retrieving outcomes. Please try again');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOutcome();
  }, []);

  // delete outcome
  const deleteOutcome = async (outcomeId: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outcome/${outcomeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      toast.success("Project outcome deleted successfully!");
      setRemoveProjectOutcome(false);
      fetchOutcome();
    } catch (error) {
      console.error(`Error deleting outcome: ${error}`);
      toast.error("An error occured. Please try again later.")
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Add Project Outcome"
          icon="si:add-fill"
          onClick={handleAddProjectOutcome}
        />
      </div>

      <CardComponent>
        {isLoading ? (
           <div className="dots my-20 mx-auto">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"outcomeId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.outcomeStatement}</td>
              <td className="px-6">{row.outcomeType}</td>
              <td className="px-6">{row.impactStatement}</td>
              <td className="px-6">{row.thematicAreas}</td>
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
                      prev === row.outcomeId ? null : row.outcomeId
                    )
                  }
                />

                {activeRowId === row.outcomeId && (
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
                            handleEditProjectOutcome(row, setActiveRowId)
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
                            handleRemoveProjectOutcome(row, setActiveRowId)
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
                          href={
                            "/projects/1/project-management/outcome/indicator/add"
                          }
                          className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"si:add-fill"} height={20} width={20} />
                          Add Indicator
                        </Link>
                        <Link
                          href={
                            "/projects/1/project-management/outcome/indicator"
                          }
                          className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"hugeicons:view"}
                            height={20}
                            width={20}
                          />
                          View Indicator
                        </Link>
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                )}
              </td>
            </>
          )}
        />}
      </CardComponent>

      {/* modals */}
      <ProjectOutcomeModal
        isOpen={addProjectOutcome}
        onClose={() => setAddProjectOutcome(false)}
        onSuccess={fetchOutcome}
        mode="create"
      />

      {selectedProjectOutcome && (
        <ProjectOutcomeModal
          isOpen={editProjectOutcome}
          onClose={() => setEditProjectOutcome(false)}
          mode="edit"
          onSuccess={fetchOutcome}
          initialData={selectedProjectOutcome}
        />
      )}

      {selectedProjectOutcome && (
        <DeleteModal
          isOpen={removeProjectOutcome}
          onClose={() => setRemoveProjectOutcome(false)}
          heading="Do you want to remove this  Project Outcome?"
          onDelete={() => deleteOutcome(selectedProjectOutcome.outcomeId)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEntityModal } from "@/utils/project-management-utility";
import { ProjectOutputTypes } from "@/types/project-management-types";
import ProjectOutputModal from "@/components/project-management-components/project-output-modal";
import DeleteModal from "@/ui/generic-delete-modal";
import Link from "next/link";
import { getToken } from "@/lib/api/credentials";
import toast from "react-hot-toast";
import axios from "axios";

export default function ProjectOutput() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectOutputTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);

  const head = [
    "Project Impact Statement",
    "Linked to Outcome",
    "Thematic Areas",
    "Responsible Person(s)",
    "Actions",
  ];

  // states for modals
  const {
    editEntity: editProjectOutput,
    addEntity: addProjectOutput,
    removeEntity: removeProjectOutput,
    setAddEntity: setAddProjectOutput,
    setEditEntity: setEditProjectOutput,
    setRemoveEntity: setRemoveProjectOutput,
    selectedEntity: selectedProjectOutput,
    handleEditEntity: handleEditProjectOutput,
    handleAddEntity: handleAddProjectOutput,
    handleRemoveEntity: handleRemoveProjectOutput,
  } = useEntityModal<ProjectOutputTypes>();

  // fetch output
  const fetchOutput = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outputs`
      );
      toast.success(res.data.message);
      setData(res.data.data);
    } catch (error) {
      console.error(`Error fetching outputs: ${error}`);
      toast.error("Error retrieving outputs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // automatically fetch outputs
  useEffect(() => {
    fetchOutput();
  }, []);

  // delete outputs
  const deleteOutput = async (outputId: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/output/${outputId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Project output deleted successfully!");
      setRemoveProjectOutput(false);
      fetchOutput();
    } catch (error) {
      console.error(`Error deleting output: ${error}`);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Add Project Output"
          icon="si:add-fill"
          onClick={handleAddProjectOutput}
        />
      </div>

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
            idKey={"outputId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.outputStatement}</td>
                <td className="px-6">{row.outcomeStatement}</td>
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
                        prev === row.outputId ? null : row.outputId
                      )
                    }
                  />

                  {activeRowId === row.outputId && (
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
                              handleEditProjectOutput(row, setActiveRowId)
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
                              handleRemoveProjectOutput(row, setActiveRowId)
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
                              "/projects/1/project-management/output/indicator/add"
                            }
                            className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                            <Icon icon={"si:add-fill"} height={20} width={20} />
                            Add Indicator
                          </Link>
                          <Link
                            href={
                              "/projects/1/project-management/output/indicator"
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
          />
        )}
      </CardComponent>

      {/* modals */}
      <ProjectOutputModal
        isOpen={addProjectOutput}
        onClose={() => setAddProjectOutput(false)}
        mode="create"
        onSuccess={fetchOutput}
      />

      {selectedProjectOutput && (
        <ProjectOutputModal
          isOpen={editProjectOutput}
          onClose={() => setEditProjectOutput(false)}
          mode="edit"
          onSuccess={fetchOutput}
          initialData={selectedProjectOutput}
        />
      )}

      {selectedProjectOutput && (
        <DeleteModal
          isOpen={removeProjectOutput}
          onClose={() => setRemoveProjectOutput(false)}
          heading="Do you want to remove this  Project Output?"
          isDeleting={isDeleting}
          onDelete={() => deleteOutput(selectedProjectOutput.outputId)}
        />
      )}
    </div>
  );
}

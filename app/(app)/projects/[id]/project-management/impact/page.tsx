"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectImpactTypes } from "@/types/project-management-types";
import DeleteModal from "@/ui/generic-delete-modal";
import { useEntityModal } from "@/utils/project-management-utility";
import ProjectImpactModal from "@/components/project-management-components/project-impact-modal";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { getToken } from "@/lib/api/credentials";

export default function ProjectImpact() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectImpactTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);

  const head = [
    "Project Impact Statement",
    "Thematic Areas",
    "Responsible Person(s)",
    "Actions",
  ];

  // states for modals
  const {
    editEntity: editProjectImpact,
    addEntity: addProjectImpact,
    removeEntity: removeProjectImpact,
    setAddEntity: setAddProjectImpact,
    setEditEntity: setEditProjectImpact,
    setRemoveEntity: setRemoveProjectImpact,
    selectedEntity: selectedProjectImpact,
    handleEditEntity: handleEditProjectImpact,
    handleAddEntity: handleAddProjectImpact,
    handleRemoveEntity: handleRemoveProjectImpact,
  } = useEntityModal<ProjectImpactTypes>();

  // fetch impact
  const fetchImpact = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/impacts`
      );
      toast.success(response.data.message);
      setData(response.data.data);
    } catch (error) {
      console.log(`Error fetching impacts: ${error}`);
      toast.error("Error retrieving impacts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // automatically fetch impacts
  useEffect(() => {
    fetchImpact();
  }, []);

  // delete impact
  const deleteImpact = async (impactId: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/impact/${impactId}`, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      toast.success("Project impact deleted successfully!");
      setRemoveProjectImpact(false)
      fetchImpact();
    } catch (error) {
      console.error(`Error deleting impact: ${error}`);
      toast.error("An error occurred. Please try again later.")
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Add Project Impact"
          icon="si:add-fill"
          onClick={handleAddProjectImpact}
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
            idKey={"impactId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.statement}</td>
                <td className="px-6">{row.thematicArea}</td>
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
                        prev === row.impactId ? null : row.impactId
                      )
                    }
                  />

                  {activeRowId === row.impactId && (
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
                              handleEditProjectImpact(row, setActiveRowId)
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
                              handleRemoveProjectImpact(row, setActiveRowId)
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
                              "/projects/1/project-management/impact/indicator/add"
                            }
                            className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                            <Icon icon={"si:add-fill"} height={20} width={20} />
                            Add Indicator
                          </Link>
                          <Link
                            href={
                              "/projects/1/project-management/impact/indicator"
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
      <ProjectImpactModal
        isOpen={addProjectImpact}
        onClose={() => setAddProjectImpact(false)}
        onSuccess={fetchImpact}
        mode="create"
      />

      {selectedProjectImpact && (
        <ProjectImpactModal
          isOpen={editProjectImpact}
          onClose={() => setEditProjectImpact(false)}
          mode="edit"
          onSuccess={fetchImpact}
          initialData={selectedProjectImpact}
        />
      )}

      {selectedProjectImpact && (
        <DeleteModal
          isOpen={removeProjectImpact}
          onClose={() => setRemoveProjectImpact(false)}
          heading="Do you want to remove this  Project Impact?"
          onDelete={() => deleteImpact(selectedProjectImpact.impactId)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

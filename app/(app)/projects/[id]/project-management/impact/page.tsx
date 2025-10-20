"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectImpactTypes } from "@/types/project-management-types";
import DeleteModal from "@/ui/generic-delete-modal";
import { useEntityModal } from "@/utils/project-management-utility";
import AddProjectImpactModal from "@/components/project-management-components/add-project-impact";
import EditProjectImpactModal from "@/components/project-management-components/edit-project-impact";
import Link from "next/link";

export default function ProjectImpact() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const head = [
    "Project Impact Statement",
    "Thematic Areas",
    "Responsible Person(s)",
    "Actions",
  ];
  const data: ProjectImpactTypes[] = [
    {
      userId: "1",
      impactStatement: "Seplat",
      thematicAreas: "Thematic Areas",
      responsiblePerson: "Person 1",
    },
    {
      userId: "2",
      impactStatement: "Seplat",
      thematicAreas: "Thematic Areas",
      responsiblePerson: "Person 2",
    },
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
  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button
          content="Add Project Impact"
          icon="si:add-fill"
          onClick={handleAddProjectImpact}
        />
      </div>

      <CardComponent>
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"userId"}
          renderRow={(row) => (
            <>
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
                      prev === row.userId ? null : row.userId
                    )
                  }
                />

                {activeRowId === row.userId && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-[6px] border border-[#E5E5E5] shadow-md w-[200px]"
                    >
                      <ul className="text-sm">
                        <li
                          onClick={() =>
                            handleEditProjectImpact(row, setActiveRowId)
                          }
                          className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center"
                        >
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
                          className="cursor-pointer hover:text-[var(--primary-light)] border-y border-gray-300 flex gap-2 p-3 items-center"
                        >
                          <Icon
                            icon={"pixelarticons:trash"}
                            height={20}
                            width={20}
                          />
                          Remove
                        </li>
                        <Link href={"/projects/1/project-management/impact/indicator/add"} className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"si:add-fill"} height={20} width={20} />
                          Add Indicator
                        </Link>
                        <Link href={"/projects/1/project-management/impact/indicator"} className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
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
      </CardComponent>

      {/* modals */}
      <AddProjectImpactModal
        isOpen={addProjectImpact}
        onClose={() => setAddProjectImpact(false)}
      />

      {selectedProjectImpact && (
        <EditProjectImpactModal
        isOpen={editProjectImpact}
        onClose={() => setEditProjectImpact(false)}
        />
      )}

      {selectedProjectImpact && (
        <DeleteModal
          isOpen={removeProjectImpact}
          onClose={() => setRemoveProjectImpact(false)}
          heading="Do you want to remove this  Project Impact?"
        />
      )}
    </div>
  );
}

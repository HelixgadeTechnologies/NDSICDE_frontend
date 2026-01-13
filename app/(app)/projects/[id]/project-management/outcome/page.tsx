"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEntityModal } from "@/utils/project-management-utility";
import AddProjectOutcomeModal from "@/components/project-management-components/add-project-outcome";
import EditProjectOutcomeModal from "@/components/project-management-components/edit-project-outcome";
import DeleteModal from "@/ui/generic-delete-modal";
import { ProjectOutcomeTypes } from "@/types/project-management-types";
import Link from "next/link";

export default function ProjectOutcome() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const head = [
    "Project Outcome Objective",
    "Outcome Type",
    "Linked to Impact",
    "Thematic Areas",
    "Responsible Person(s)",
    "Actions",
  ];
  const data = [
    {
      userId: "1",
      projectOutcome: "Seplat",
      outcomeType: "Development",
      impact: "Development Outcome",
      thematicAreas: "Environment",
      responsiblePerson: "Person 2",
    },
    {
      userId: "2",
      projectOutcome: "Seplat",
      outcomeType: "Development",
      impact: "Development Outcome",
      thematicAreas: "Environment",
      responsiblePerson: "Person 2",
    },
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
        <Table
          tableHead={head}
          tableData={data}
          checkbox
          idKey={"userId"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.projectOutcome}</td>
              <td className="px-6">{row.outcomeType}</td>
              <td className="px-6">{row.impact}</td>
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
        />
      </CardComponent>

      {/* modals */}
      <AddProjectOutcomeModal
        isOpen={addProjectOutcome}
        onClose={() => setAddProjectOutcome(false)}
      />

      {selectedProjectOutcome && (
        <EditProjectOutcomeModal
          isOpen={editProjectOutcome}
          onClose={() => setEditProjectOutcome(false)}
        />
      )}

      {selectedProjectOutcome && (
        <DeleteModal
          isOpen={removeProjectOutcome}
          onClose={() => setRemoveProjectOutcome(false)}
          heading="Do you want to remove this  Project Outcome?"
        />
      )}
    </div>
  );
}

"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEntityModal } from "@/utils/project-management-utility";
import { ProjectOutputTypes } from "@/types/project-management-types";
import AddProjectOutputModal from "@/components/project-management-components/add-project-output";
import EditProjectOutputModal from "@/components/project-management-components/edit-project-output";
import DeleteModal from "@/ui/generic-delete-modal";
import Link from "next/link";

export default function ProjectOutput() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const head = [
    "Project Impact Statement",
    "Linked to Outcome",
    "Thematic Areas",
    "Responsible Person(s)",
    "Actions",
  ];
  const data = [
    {
      userId: "1",
      impactStatement: "Seplat",
      outcome: "Development Outcome",
      thematicAreas: "Development",
      responsiblePerson: "Person 1",
    },
    {
      userId: "2",
      impactStatement: "Seplat",
      outcome: "Development Outcome",
      thematicAreas: "Development",
      responsiblePerson: "Person 1",
    },
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

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-[75px]">
        <Button content="Add Project Output" icon="si:add-fill" onClick={handleAddProjectOutput} />
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
              <td className="px-6">{row.outcome}</td>
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
                        onClick={() => handleEditProjectOutput(row, setActiveRowId)}
                        className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                          <Icon icon={"ph:pencil-simple-line"} height={20} width={20} />
                          Edit
                        </li>
                        <li 
                        onClick={() => handleRemoveProjectOutput(row, setActiveRowId)}
                        className="cursor-pointer hover:text-[var(--primary-light)] border-y border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"pixelarticons:trash"} height={20} width={20} />
                          Remove
                        </li>
                        <Link href={"/project-management/output/indicator/add"} className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"si:add-fill"} height={20} width={20} />
                          Add Indicator
                        </Link>
                        <Link href={"/project-management/output/indicator"} className="cursor-pointer hover:text-blue-600 border-b border-gray-300 flex gap-2 p-3 items-center">
                          <Icon icon={"hugeicons:view"} height={20} width={20} />
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
      <AddProjectOutputModal
      isOpen={addProjectOutput}
      onClose={() => setAddProjectOutput(false)}
      />

      {selectedProjectOutput && (
        <EditProjectOutputModal
        isOpen={editProjectOutput}
        onClose={() => setEditProjectOutput(false)}
        />
      )}

      {selectedProjectOutput && (
        <DeleteModal
        isOpen={removeProjectOutput}
        onClose={() => setRemoveProjectOutput(false)}
        heading="Do you want to remove this  Project Output?"
        />
      )}
    </div>
  );
}

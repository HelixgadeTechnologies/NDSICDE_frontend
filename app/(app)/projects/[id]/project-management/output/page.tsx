"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useEntityModal } from "@/utils/project-management-utility";
import { ProjectOutputTypes } from "@/types/project-management-types";
import ProjectOutputModal from "@/components/project-management-components/project-output-modal";
import DeleteModal from "@/ui/generic-delete-modal";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/ui/loading-spinner";
import ActionMenu from "@/ui/action-menu";
import { toSentenceCase } from "@/utils/ui-utility";

export default function ProjectOutput() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectOutputTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const projectId = (params?.id as string) || "";

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outputs`,
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
        },
      );
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
          <LoadingSpinner />
        ) : (
          <Table
            tableHead={head}
            tableData={data}
            checkbox
            idKey={"outputId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{toSentenceCase(row.outputStatement ?? "")}</td>
                <td className="px-6">{toSentenceCase(row.outcomeStatement ?? "")}</td>
                <td className="px-6">{toSentenceCase(row.thematicAreas ?? "")}</td>
                <td className="px-6">{toSentenceCase(row.responsiblePerson ?? "")}</td>
                <td className="px-6 relative">
                  <Icon
                    icon={"uiw:more"}
                    width={22}
                    height={22}
                    className="cursor-pointer"
                    color="#909CAD"
                    onClick={() =>
                      setActiveRowId((prev) =>
                        prev === row.outputId ? null : row.outputId,
                      )
                    }
                  />
                  <ActionMenu
                    isOpen={activeRowId === row.outputId}
                    items={[
                      {
                        type: "button",
                        label: "Edit",
                        icon: "ph:pencil-simple-line",
                        onClick: () => handleEditProjectOutput(row, setActiveRowId),
                      },
                      {
                        type: "button",
                        label: "Remove",
                        icon: "pixelarticons:trash",
                        onClick: () => handleRemoveProjectOutput(row, setActiveRowId),
                        className: "hover:text-(--primary-light) border-y border-gray-300",
                      },
                      {
                        type: "link",
                        label: "Add Indicator",
                        icon: "si:add-fill",
                        href: `/projects/${projectId}/project-management/indicator?resultType=output&resultId=${row.outputId}&mode=add`,
                        className: "border-b border-gray-300",
                      },
                      {
                        type: "link",
                        label: "View Indicator",
                        icon: "hugeicons:view",
                        href: `/projects/${projectId}/project-management/indicator?resultType=output&resultId=${row.outputId}&mode=view`,
                        className: "border-b border-gray-300",
                      },
                    ]}
                  />
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

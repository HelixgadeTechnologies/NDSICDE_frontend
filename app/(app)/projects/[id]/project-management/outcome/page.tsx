"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useEntityModal } from "@/utils/project-management-utility";
import ProjectOutcomeModal from "@/components/project-management-components/project-outcome-modal";
import DeleteModal from "@/ui/generic-delete-modal";
import { ProjectOutcomeTypes } from "@/types/project-management-types";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/ui/loading-spinner";
import ActionMenu from "@/ui/action-menu";
import { toSentenceCase } from "@/utils/ui-utility";

export default function ProjectOutcome() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectOutcomeTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const projectId = (params?.id as string) || "";

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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outcomes`,
      );
      setData(response.data.data);
    } catch (error) {
      console.error(`Error fetching outcome: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutcome();
  }, []);

  // delete outcome
  const deleteOutcome = async (outcomeId: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outcome/${outcomeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchOutcome();
    } catch (error) {
      console.error(`Error deleting outcome: ${error}`);
      toast.error("An error occured. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

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
          <LoadingSpinner />
        ) : (
          <Table
            tableHead={head}
            tableData={data}
            checkbox
            idKey={"outcomeId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{toSentenceCase(row.outcomeStatement ?? "")}</td>
                <td className="px-6">{toSentenceCase(row.outcomeType ?? "")}</td>
                <td className="px-6">{toSentenceCase(row.impactStatement ?? "")}</td>
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
                        prev === row.outcomeId ? null : row.outcomeId,
                      )
                    }
                  />
                  <ActionMenu
                    isOpen={activeRowId === row.outcomeId}
                    items={[
                      {
                        type: "button",
                        label: "Edit",
                        icon: "ph:pencil-simple-line",
                        onClick: () => handleEditProjectOutcome(row, setActiveRowId),
                      },
                      {
                        type: "button",
                        label: "Remove",
                        icon: "pixelarticons:trash",
                        onClick: () => handleRemoveProjectOutcome(row, setActiveRowId),
                        className: "hover:text-(--primary-light) border-y border-gray-300",
                      },
                      {
                        type: "link",
                        label: "Add Indicator",
                        icon: "si:add-fill",
                        href: `/projects/${projectId}/project-management/indicator?resultType=outcome&resultId=${row.outcomeId}&mode=add`,
                        className: "border-b border-gray-300",
                      },
                      {
                        type: "link",
                        label: "View Indicator",
                        icon: "hugeicons:view",
                        href: `/projects/${projectId}/project-management/indicator?resultType=outcome&resultId=${row.outcomeId}&mode=view`,
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

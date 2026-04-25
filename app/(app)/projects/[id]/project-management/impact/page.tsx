"use client";

import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { ProjectImpactTypes } from "@/types/project-management-types";
import DeleteModal from "@/ui/generic-delete-modal";
import { useEntityModal } from "@/utils/project-management-utility";
import ProjectImpactModal from "@/components/project-management-components/project-impact-modal";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "@/lib/api/credentials";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/ui/loading-spinner";
import ActionMenu from "@/ui/action-menu";
import { toSentenceCase } from "@/utils/ui-utility";

export default function ProjectImpact() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectImpactTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const projectId = (params?.id as string) || "";

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/impacts/project/${projectId}`,
      );
      setData(response.data.data);
    } catch (error) {
      console.log(`Error fetching impacts: ${error}`);
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
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/impact/${impactId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchImpact();
    } catch (error) {
      console.error(`Error deleting impact: ${error}`);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

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
          <LoadingSpinner />
        ) : (
          <Table
            tableHead={head}
            tableData={data}
            checkbox
            idKey={"impactId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{toSentenceCase(row.statement ?? "")}</td>
                <td className="px-6">{toSentenceCase(row.thematicArea ?? "")}</td>
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
                        prev === row.impactId ? null : row.impactId,
                      )
                    }
                  />
                  <ActionMenu
                    isOpen={activeRowId === row.impactId}
                    items={[
                      {
                        type: "button",
                        label: "Edit",
                        icon: "ph:pencil-simple-line",
                        onClick: () => handleEditProjectImpact(row, setActiveRowId),
                      },
                      {
                        type: "button",
                        label: "Remove",
                        icon: "pixelarticons:trash",
                        onClick: () => handleRemoveProjectImpact(row, setActiveRowId),
                        className: "hover:text-(--primary-light) border-y border-gray-300",
                      },
                      {
                        type: "link",
                        label: "Add Indicator",
                        icon: "si:add-fill",
                        href: `/projects/${projectId}/project-management/indicator?resultType=impact&resultId=${row.impactId}&mode=add`,
                        className: "border-b border-gray-300",
                      },
                      {
                        type: "link",
                        label: "View Indicator",
                        icon: "hugeicons:view",
                        href: `/projects/${projectId}/project-management/indicator?resultType=impact&resultId=${row.impactId}&mode=view`,
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
      <ProjectImpactModal
        isOpen={addProjectImpact}
        onClose={() => setAddProjectImpact(false)}
        onSuccess={fetchImpact}
        mode="create"
        projectId={projectId}
        initialData={selectedProjectImpact ?? undefined}
      />

      {selectedProjectImpact && (
        <ProjectImpactModal
          isOpen={editProjectImpact}
          onClose={() => setEditProjectImpact(false)}
          mode="edit"
          onSuccess={fetchImpact}
          initialData={selectedProjectImpact}
          projectId={projectId}
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

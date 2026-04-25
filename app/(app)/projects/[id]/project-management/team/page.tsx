"use client";

import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";
import { useEntityModal } from "@/utils/project-management-utility";
import ProjectTeamModal from "@/components/project-management-components/project-team-modal";
// import ViewProjectTeamModal from "@/components/project-management-components/view-project-team";
import DeleteProjectTeamModal from "@/components/project-management-components/remove-project-team";
import axios from "axios";
import {
  DropdownOption,
  ProjectTeamDetails,
} from "@/types/project-management-types";
import { formatDate } from "@/utils/dates-format-utility";
import { getToken } from "@/lib/api/credentials";
import { toast } from "react-toastify";
import LoadingSpinner from "@/ui/loading-spinner";
import ActionMenu from "@/ui/action-menu";
import { useParams } from "next/navigation";


// Define the type for role from API
interface ApiRole {
  roleId: string;
  roleName: string;
  description: string;
  permission: string;
  createAt: string;
  updateAt: string;
  users: number;
}

// Define the type for dropdown options

export default function ProjectTeam() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectTeamDetails[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<DropdownOption[]>([]);
  const [rolesLoading, setRolesLoading] = useState<boolean>(false);
  const token = getToken();
  const [isDeleting, setIsDeleting] = useState(false);

  const params = useParams();
  const projectId = (params?.id as string) || "";

  // api call to get project team members
  const fetchProjectTeam = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/team-members/project/${projectId}`,
      );
      // Ensure data is an array
      const teamMembers = res.data.data || [];
      setData(Array.isArray(teamMembers) ? teamMembers : []);
    } catch (error) {
      console.error(`Error fetching team members: ${error}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTeam();
  }, []);

  // api call to get all roles and transform them for dropdown
  useEffect(() => {
    const getRoles = async () => {
      setRolesLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/roles`,
        );

        // Transform the API response to dropdown options
        const transformedRoles: DropdownOption[] = res.data.data.map(
          (role: ApiRole) => ({
            label: role.roleName,
            value: role.roleId,
          }),
        );

        setRoles(transformedRoles);
      } catch (error) {
        console.error(`Error fetching roles: ${error}`);
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };

    getRoles();
  }, []);

  const head = [
    "Full Name",
    "Email Address",
    "Role",
    "Project",
    "Last Active",
    "Actions",
  ];

  // states for modals
  const {
    editEntity: editMember,
    addEntity: addMember,
    removeEntity: removeMember,
    setAddEntity: setAddMember,
    setEditEntity: setEditMember,
    setRemoveEntity: setRemoveMember,
    selectedEntity: selectedMember,
    // viewEntity: viewMember,
    // setViewEntity: setViewMember,
    // handleViewEntity: handleViewMember,
    handleEditEntity: handleEditMember,
    handleAddEntity: handleAddMember,
    handleRemoveEntity: handleRemoveMember,
  } = useEntityModal<ProjectTeamDetails>();

  // Status options for dropdown
  const statusOptions: DropdownOption[] = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/team-member/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRemoveMember(false);
    } catch (error) {
      console.error(`Error deleting team member: ${error}`);
      toast.error("An error occured. Team member was not deleted.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative mt-12">
      {/* add button */}
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Add Team Member"
          icon="si:add-fill"
          onClick={handleAddMember}
        />
      </div>

      <CardComponent>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div className="w-3/5">
            <SearchInput
              name="search"
              value=""
              placeholder="Search team members"
              onChange={() => {}}
            />
          </div>
          <div className="w-2/5 flex items-end gap-4">
            <DropDown
              value=""
              name="role"
              placeholder={rolesLoading ? "Loading roles..." : "All Role"}
              onChange={() => {}}
              options={roles}
              isDisabled={rolesLoading}
            />
            <DropDown
              value=""
              name="status"
              placeholder="All Status"
              onChange={() => {}}
              options={statusOptions}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Table
            tableHead={head}
            tableData={data || []}
            checkbox
            idKey="teamMemberId"
            renderRow={(row) => (
              <>
                <td className="px-6">{row.fullName}</td>
                <td className="px-6">{row.email}</td>
                <td className="px-6">{row.roleName}</td>
                <td className="px-6">{row.projectName}</td>
                <td className="px-6">{formatDate(row.updateAt, "time")}</td>
                <td className="px-6 relative">
                  <div className="flex justify-center items-center">
                    <Icon
                      icon="uiw:more"
                      width={22}
                      height={22}
                      className="cursor-pointer"
                      color="#909CAD"
                      onClick={() =>
                        setActiveRowId((prev) =>
                          prev === row.teamMemberId ? null : row.teamMemberId,
                        )
                      }
                    />
                  </div>
                  <ActionMenu
                    isOpen={activeRowId === row.teamMemberId}
                    items={[
                      {
                        type: "button",
                        label: "Edit",
                        icon: "ph:pencil-simple-line",
                        onClick: () => handleEditMember(row, setActiveRowId),
                        className: "border-b border-gray-300",
                      },
                      {
                        type: "button",
                        label: "Remove",
                        icon: "pixelarticons:trash",
                        onClick: () => handleRemoveMember(row, setActiveRowId),
                        className: "hover:text-(--primary-light)",
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
      <ProjectTeamModal
        isOpen={addMember}
        onClose={() => setAddMember(false)}
        onSuccess={fetchProjectTeam}
        roles={roles}
        mode="create"
        projectId={projectId}
      />

      {/* {selectedMember && (
        <ViewProjectTeamModal
          isOpen={viewMember}
          onClose={() => setViewMember(false)}
          member={selectedMember}
          
        />
      )} */}

      {selectedMember && (
        <ProjectTeamModal
          isOpen={editMember}
          onClose={() => setEditMember(false)}
          onSuccess={fetchProjectTeam}
          roles={roles}
          mode="update"
          projectId={projectId}
          initialData={{
            email: selectedMember.email,
            roleId:
              roles.find((role) => role.label === selectedMember.roleName)
                ?.value || "",
            teamMemberId: selectedMember.teamMemberId,
          }}
        />
      )}

      {selectedMember && (
        <DeleteProjectTeamModal
          isOpen={removeMember}
          onClose={() => setRemoveMember(false)}
          member={selectedMember}
          handleDelete={() => handleDelete(selectedMember.teamMemberId)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}

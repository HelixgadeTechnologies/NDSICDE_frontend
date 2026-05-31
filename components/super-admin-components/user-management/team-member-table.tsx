"use client";

import { Icon } from "@iconify/react";
import { head } from "@/types/team-members";
import { useTeamMemberModal } from "@/utils/team-member-utility";
import { useUserManagementState } from "@/store/super-admin-store/user-management-store";
import { useEffect, useState } from "react";
import Table from "@/ui/table";
import ActionMenu from "@/ui/action-menu";
import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import SearchInput from "@/ui/form/search";
import ViewTeamMember from "./view-team-member";
import EditTeamMember from "./edit-team-member";
import DeleteTeamMember from "./delete-team-member";
import EmptyState from "@/ui/empty-state";
import { useRoleStore } from "@/store/role-store";
import { formatDate } from "@/utils/dates-format-utility";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { DropdownOption } from "@/types/project-management-types";
import { fetchRoles } from "@/lib/api/roles";
import { toSentenceCase } from "@/utils/ui-utility";
// import { TeamMember } from "@/types/team-members";

export default function TeamMembersTable() {
  const [filterRoleId, setFilterRoleId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [roleOptions, setRoleOptions] = useState<DropdownOption[]>([]);
  const { token } = useRoleStore();

  // Use our custom hook - replaces all the manual state management
  const { users, isFetching, refetch } = useTeamMembers(token);

  const {
    editTeamMember,
    viewTeamMember,
    deleteTeamMember,
    selectedUser,
    setEditTeamMember,
    setViewTeamMember,
    setDeleteTeamMember,
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
  } = useTeamMemberModal();

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Fetch roles on component mount
  useEffect(() => {
    loadRoles();
  }, []);

  // Listen for custom events from other components
  useEffect(() => {
    const handleTeamMemberUpdate = () => {
      refetch();
    };

    window.addEventListener("teamMemberUpdated", handleTeamMemberUpdate);

    return () => {
      window.removeEventListener("teamMemberUpdated", handleTeamMemberUpdate);
    };
  }, [refetch]);

  // Filter data based on search query, role, and status
  const filteredData = users.filter((item) => {
    // Search filter
    const matchesSearch = `${item.fullName} ${item.email} ${item.roleName} ${item.assignedProjectId}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());

    // Role filter (if filterRoleId is selected)
    const matchesRole = !filterRoleId || item.roleId === filterRoleId;

    // Status filter (if filterStatus is selected)
    const matchesStatus = !filterStatus || 
      item.status.toLowerCase() === filterStatus.toLowerCase() ||
      (filterStatus === "Active" && item.status.toLowerCase() === "active") ||
      (filterStatus === "inactive" && item.status.toLowerCase() === "inactive");

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Fetch roles and transform them to DropdownOption format
  const loadRoles = async () => {
    try {
      const rolesData = await fetchRoles();
      
      // Transform roles to DropdownOption format
      const transformedRoles = rolesData.map((role) => ({
        label: role.roleName,
        value: role.roleId
      }));

      // Add "All Roles" option at the beginning
      const optionsWithAll = [
        { label: "All Roles", value: "" },
        ...transformedRoles
      ];

      setRoleOptions(optionsWithAll);

    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Handle role filter change
  const handleRoleFilterChange = (value: string) => {
    setFilterRoleId(value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  // Determine what content to render
  const renderTableContent = () => {
    if (isFetching) {
      return (
        <div className="dots my-20 mx-auto">
          <div className=""></div>
          <div className=""></div>
          <div className=""></div>
        </div>
      );
    }

    // Has data but no search results
    if (filteredData.length === 0 && (query.trim() !== "" || filterRoleId || filterStatus)) {
      return (
        <EmptyState
          hasSearchQuery={true}
          searchQuery={query}
          userType="team members"
        />
      );
    }

    // Has data to display
    return (
      <Table
        checkbox
        idKey="userId"
        tableHead={head}
        tableData={filteredData}
         onClick={(row) => handleViewUser(row, setActiveRowId)}
        height="60px"
        renderRow={(row) => (
          <>
            <td className="px-6">{row.fullName}</td>
            <td className="px-6">{row.email}</td>
            <td className="px-6">{row.roleName}</td>
            <td
              className={`px-6 ${
                row.status == "Active" || row.status == "ACTIVE"
                  ? "text-green-500"
                  : "text-red-500"
              }`}>
              <span>{toSentenceCase(row.status ?? "")}</span>
            </td>
            {/* <td className="px-6">{formatDate(row.loginLast, "time")}</td> */}
            <td className="px-6">{row.department}</td>
            <td
              className="px-6 relative"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) =>
                      prev === row.userId ? null : row.userId,
                    )
                  }
                />
              </div>

              <ActionMenu
                isOpen={activeRowId === row.userId}
                onClose={() => setActiveRowId(null)}
                items={[
                  {
                    type: "button",
                    label: "View Profile",
                    icon: "hugeicons:view",
                    onClick: () => handleViewUser(row, setActiveRowId),
                  },
                  {
                    type: "button",
                    label: "Edit",
                    icon: "ph:pencil-simple-line",
                    onClick: () => handleEditUser(row, setActiveRowId),
                    className: "border-y border-gray-300",
                  },
                  {
                    type: "button",
                    label: "Remove",
                    icon: "pixelarticons:trash",
                    onClick: () => handleDeleteUser(row, setActiveRowId),
                    className: "hover:text-(--primary-light)",
                  },
                ]}
              />
            </td>
          </>
        )}
      />
    );
  };

  return (
    <section className="mt-10">
      <CardComponent>
        <div className="relative">
          {/* Search and filters - always visible */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 mb-6">
            <div className="w-full lg:w-3/5">
              <SearchInput
                name="search"
                placeholder="Search Team Members"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="w-full lg:w-2/5 flex flex-col sm:flex-row gap-4">
              <DropDown
                value={filterRoleId}
                label="Role"
                placeholder="All Role"
                name="role"
                onChange={handleRoleFilterChange}
                options={roleOptions}
              />
              <DropDown
                value={filterStatus}
                label="Status"
                placeholder="All Status"
                name="status"
                onChange={handleStatusFilterChange}
                options={[
                  { label: "All Status", value: "" },
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </div>
          </div>
          {/* Dynamic content based on state */}
          {renderTableContent()}
        </div>
      </CardComponent>

      {/* Modals - they will refetch data when closed */}
      {viewTeamMember && selectedUser && (
        <ViewTeamMember
          isOpen={viewTeamMember}
          onClose={() => setViewTeamMember(false)}
          user={selectedUser}
        />
      )}
      {editTeamMember && selectedUser && (
        <EditTeamMember
          isOpen={editTeamMember}
          onClose={() => setEditTeamMember(false)}
          onEdit={() => refetch()}
          user={selectedUser}
        />
      )}
      {deleteTeamMember && selectedUser && (
        <DeleteTeamMember
          isOpen={deleteTeamMember}
          onClose={() => setDeleteTeamMember(false)}
          onDelete={() => refetch()}
          user={selectedUser}
        />
      )}
    </section>
  );
}
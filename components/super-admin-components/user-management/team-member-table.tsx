"use client";

import { Icon } from "@iconify/react";
import { head } from "@/types/team-members";
import { useTeamMemberModal } from "@/utils/team-member-utility";
import { useUserManagementState } from "@/store/admin-store/user-management-store";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Table from "@/ui/table";
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

// Loading state component
const LoadingState = () => (
  <section className="flex justify-center items-center h-[300px]">
    <div className="dots">
      <div className=""></div>
      <div className=""></div>
      <div className=""></div>
    </div>
  </section>
);

export default function TeamMembersTable() {
  const { roleId, status, setField } = useUserManagementState();
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

  // Filter data based on search query
  const filteredData = users.filter((item) =>
    `${item.fullName} ${item.email} ${item.roleName} ${item.assignedProjectId}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  // Determine what content to render
  const renderTableContent = () => {
    if (isFetching) {
      return <LoadingState />;
    }

    // No data at all (initial empty state)
    if (users.length === 0) {
      return (
        <EmptyState
          hasSearchQuery={false}
          searchQuery=""
          userType="team members"
        />
      );
    }

    // Has data but no search results
    if (filteredData.length === 0 && query.trim() !== "") {
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
              }`}
            >
              <span className="capitalize">{row.status}</span>
            </td>
            <td className="px-6">{formatDate(row.loginLast, "short")}</td>
            <td className="px-6">{row.department}</td>
            <td className="px-6 relative">
              <div className="flex justify-center items-center">
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
              </div>

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
                        onClick={() => handleViewUser(row, setActiveRowId)}
                        className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center"
                      >
                        <Icon icon={"hugeicons:view"} height={20} width={20} />
                        View Profile
                      </li>
                      <li
                        onClick={() => handleEditUser(row, setActiveRowId)}
                        className="cursor-pointer hover:text-blue-600 flex gap-2 border-y border-gray-300 p-3 items-center"
                      >
                        <Icon icon={"cil:pencil"} height={20} width={20} />
                        Edit
                      </li>
                      <li
                        onClick={() => handleDeleteUser(row, setActiveRowId)}
                        className="cursor-pointer hover:text-[var(--primary-light)] flex gap-2 p-3 items-center"
                      >
                        <Icon
                          icon={"pixelarticons:trash"}
                          height={20}
                          width={20}
                        />
                        Remove
                      </li>
                    </ul>
                  </motion.div>
                </AnimatePresence>
              )}
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
          <div className="flex items-end gap-4 mb-6">
            <div className="w-3/5">
              <SearchInput
                name="search"
                placeholder="Search Team Members"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="w-2/5 flex gap-4">
              <DropDown
                value={roleId}
                label="Role"
                placeholder="All Role"
                name="role"
                onChange={(value: string) => setField("roleId", value)}
                options={[]}
              />
              <DropDown
                value={status}
                label="Status"
                placeholder="All Status"
                name="status"
                onChange={(value: string) => setField("status", value)}
                options={[]}
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

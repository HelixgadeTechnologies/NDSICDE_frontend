"use client";

import { Icon } from "@iconify/react";
import { head, UserDetails } from "@/types/team-members";
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
import { getUsers } from "@/lib/api/user-management";
import { useRoleStore } from "@/store/role-store";
import { UserManagementCredentials } from "@/lib/api/user-management";

export default function TeamMembersTable() {
  const { roleId, status, setField } = useUserManagementState();

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

  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState<UserDetails[]>([]);
  const { token } = useRoleStore();


  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      setIsFetching(true);

      try {
        const response = await getUsers(token);

        if (response.success && Array.isArray(response.data)) {
          const mappedUsers: UserDetails[] = response.data.map(
            (user: UserManagementCredentials) => ({
              userId: user.userId,
              fullName: user.fullName,
              email: user.email,
              address: user.address,
              phoneNumber: user.phoneNumber,
              roleId: user.roleId,
              roleName: user.roleName,
              status: user.status,
              assignedProjectId: user.assignedProjectId,
              department: user.department,
              community: user.community,
              state: user.state,
              localGovernmentArea: user.localGovernmentArea,
              profilePic: user.profilePic,
              profilePicMimeType: user.profilePicMimeType,
              loginLast: user.loginLast,
              createAt: user.createAt,
              updateAt: user.updateAt,
              password: user.password,
            })
          );

          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUsers();
  }, [token]);

  const [query, setQuery] = useState("");

  const filteredData = users.filter((item) =>
    `${item.fullName} ${item.email} ${item.roleName} ${item.assignedProjectId}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  return (
    <section className="mt-10">
      <CardComponent>
        <div className="relative">
          <div className="flex items-end gap-4 mb-6">
            <div className="w-3/5">
              <SearchInput
                name="search"
                placeholder="Search Projects"
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

          {isFetching ? (
            <section className="flex justify-center items-center h-[300px]">
                <div className="dots">
                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                </div>
            </section>
          ) : filteredData.length > 0 ? (
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
                      row.status == "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {row.status}
                  </td>
                  <td className="px-6">{row.loginLast}</td>
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
                              onClick={() =>
                                handleViewUser(row, setActiveRowId)
                              }
                              className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center"
                            >
                              <Icon
                                icon={"hugeicons:view"}
                                height={20}
                                width={20}
                              />
                              View Profile
                            </li>
                            <li
                              onClick={() =>
                                handleEditUser(row, setActiveRowId)
                              }
                              className="cursor-pointer hover:text-blue-600 flex gap-2 border-y border-gray-300 p-3 items-center"
                            >
                              <Icon
                                icon={"cil:pencil"}
                                height={20}
                                width={20}
                              />
                              Edit
                            </li>
                            <li
                              onClick={() =>
                                handleDeleteUser(row, setActiveRowId)
                              }
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
          ) : (
            <div className="text-center text-gray-500 py-10 text-sm rounded-lg">
              No results found matching{" "}
              <span className="font-medium">{`"${query}"`}</span>.
            </div>
          )}
        </div>
      </CardComponent>

      {/* Modals */}
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
          user={selectedUser}
        />
      )}
      {deleteTeamMember && selectedUser && (
        <DeleteTeamMember
          isOpen={deleteTeamMember}
          onClose={() => setDeleteTeamMember(false)}
          user={selectedUser}
        />
      )}
    </section>
  );
}

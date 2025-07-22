"use client";

import { Icon } from "@iconify/react";
import { head, data } from "@/types/team-members";
import { useTeamMemberModal } from "@/utils/team-member-utility";
import { useUserManagementState } from "@/store/user-management";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Table from "@/ui/table";
import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import SearchInput from "@/ui/form/search";
import ViewTeamMember from "./view-team-member";
import EditTeamMember from "./edit-team-member";
import DeleteTeamMember from "./delete-team-member";

export default function TeamMembersTable() {
  const { role, status, setField } = useUserManagementState();

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

  // Search functions
  const [query, setQuery] = useState("");

  // Search logic (case insensitive)
  const filteredData = data.filter((item) =>
    `${item.fullName} ${item.emailAddress} ${item.role} ${item.assignedProjects}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const [activeRowId, setActiveRowId] = useState<number | null>(null);

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
                value={role}
                label="Role"
                placeholder="All Role"
                name="role"
                onChange={(value: string) => setField("role", value)}
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
          {filteredData.length > 0 ? (
            <Table
              checkbox
              idKey="id"
              tableHead={head}
              tableData={filteredData}
              renderRow={(row) => (
                <>
                  <td className="px-6">{row.fullName}</td>
                  <td className="px-6">{row.emailAddress}</td>
                  <td className="px-6">{row.role}</td>
                  <td
                    className={`px-6 ${
                      row.status === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {row.status}
                  </td>
                  <td className="px-6">{row.lastActive}</td>
                  <td className="px-6">{row.assignedProjects}</td>
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
                            prev === row.id ? null : row.id
                          )
                        }
                      />
                    </div>

                    {activeRowId === row.id && (
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
                            <li onClick={() => handleDeleteUser(row, setActiveRowId)} className="cursor-pointer hover:text-[var(--primary-light)] flex gap-2 p-3 items-center">
                              <Icon icon={"pixelarticons:trash"} height={20} width={20} />
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

      {/* Pass the selected user to the modals */}
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
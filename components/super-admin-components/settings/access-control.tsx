"use client";

import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useUIStore } from "@/store/ui-store";
import RoleFormModal from "./role-form-modal";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchRoles, type RoleData } from "@/lib/api/roles";
import { formatDate } from "@/utils/dates-format-utility";

export default function AccessControl() {
  const head = [
    "Role Name",
    "Permission Level",
    "Users",
    "Created at",
    "Actions",
  ];
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);

  // Single reusable function to load roles
  const loadRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const rolesData = await fetchRoles();
      setRoles(rolesData);
      toast.success("Roles loaded successfully");
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles. Please try again.");
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const { isAddModalOpen, isEditModalOpen, openAddModal, openEditModal, closeAddModal, closeEditModal } =
    useUIStore();

  const handleEditClick = (role: RoleData) => {
    setSelectedRole(role);
    openEditModal();
  };

  const handleEditModalClose = () => {
    setSelectedRole(null);
    closeEditModal();
  };

  const handleAddModalClose = () => {
    closeAddModal();
  };

  return (
    <section>
      <CardComponent>
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4 md:gap-0">
          <Heading
            heading="User Roles & Permissions"
            subtitle="Manage user roles and their associated permissions"
            spacing="1"
          />
          <div className="w-57">
            <Button
              content="Add New Role"
              icon="si:add-fill"
              onClick={openAddModal}
            />
          </div>
        </div>

        {isLoadingRoles ? (
          <div className="dots my-20 mx-auto">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <Table
            tableHead={head}
            tableData={roles}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.roleName}</td>
                <td className="px-6">{row.permission}</td>
                <td className="px-6">{row.users}</td>
                <td className="px-6">
                  <span className="px-6">
                    {formatDate(row.createAt, "short")}
                  </span>
                </td>
                <td 
                  onClick={() => handleEditClick(row)}
                  className="px-6 cursor-pointer hover:text-[#111928]">
                  Edit
                </td>
              </>
            )}
            pagination={true}
            itemsPerPage={2}
          />
        )}
      </CardComponent>

      <RoleFormModal 
        onSuccess={loadRoles} 
        mode="create" 
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
      />

      <RoleFormModal 
        onSuccess={() => {
          loadRoles();
          handleEditModalClose();
        }} 
        mode="edit" 
        roleData={selectedRole || undefined}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
      />
    </section>
  );
}
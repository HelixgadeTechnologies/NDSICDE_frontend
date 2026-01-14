"use client";

import { useEffect, useState } from "react";
import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";
import { ProjectPartnerTypes, DropdownOption } from "@/types/project-management-types";
import { useEntityModal } from "@/utils/project-management-utility";
import ProjectPartnerModal from "@/components/project-management-components/project-partner-modal";
import DeleteModal from "@/ui/generic-delete-modal";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import toast from "react-hot-toast";
import { getToken } from "@/lib/api/credentials";

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

export default function ProjectPartner() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectPartnerTypes[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [roles, setRoles] = useState<DropdownOption[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const token = getToken();

  const head = [
    "Partner Organization Name",
    "Email Address",
    "Role",
    "Project",
    "Last Active",
    "Actions",
  ];

  // Fetch project partners
  const fetchProjectPartners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/partners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Partners API response:", response.data);
      
      // Ensure data is an array
      const partners = response.data?.data || [];
      setData(Array.isArray(partners) ? partners : []);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast.error("Failed to load project partners");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roles for dropdown
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Transform the API response to dropdown options
      const transformedRoles: DropdownOption[] = res.data.data.map(
        (role: ApiRole) => ({
          label: role.roleName,
          value: role.roleId,
        })
      );
      
      setRoles(transformedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectPartners();
    fetchRoles();
  }, []);

  // Handle delete partner
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/partners/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Project partner deleted successfully!");
      fetchProjectPartners();
      setRemovePartner(false);
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Failed to delete partner. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Status options for dropdown
  const statusOptions: DropdownOption[] = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  // states for modals
  const {
    editEntity: editPartner,
    addEntity: addPartner,
    removeEntity: removePartner,
    setAddEntity: setAddPartner,
    setEditEntity: setEditPartner,
    setRemoveEntity: setRemovePartner,
    selectedEntity: selectedPartner,
    handleEditEntity: handleEditPartner,
    handleAddEntity: handleAddPartner,
    handleRemoveEntity: handleRemovePartner,
  } = useEntityModal<ProjectPartnerTypes>();

  return (
    <div className="relative mt-12">
      <div className="absolute right-0 -top-18.75">
        <Button
          content="Add Project Partner"
          icon="si:add-fill"
          onClick={handleAddPartner}
        />
      </div>
      <CardComponent>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div className="w-3/5">
            <SearchInput
              name="search"
              value=""
              placeholder="Search partners"
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

        {isLoading ? (
          <div className="dots mx-auto my-20">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <Table
            tableHead={head}
            tableData={data || []}
            checkbox
            idKey={"partnerId"}
            renderRow={(row) => (
              <>
                <td className="px-6">{row.organizationName || "N/A"}</td>
                <td className="px-6">{row.email}</td>
                <td className="px-6">{row.roleName || "N/A"}</td>
                <td className="px-6">{row.projectName || "N/A"}</td>
                <td className="px-6">{formatDate(row.updateAt, "time")}</td>
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
                          prev === row.partnerId ? null : row.partnerId
                        )
                      }
                    />
                  </div>

                  {activeRowId === row.partnerId && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50"
                      >
                        <ul className="text-sm">
                          <li
                            onClick={() => handleEditPartner(row, setActiveRowId)}
                            className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center"
                          >
                            <Icon
                              icon={"ph:pencil-simple-line"}
                              height={20}
                              width={20}
                            />
                            Edit
                          </li>
                          <li
                            onClick={() =>
                              handleRemovePartner(row, setActiveRowId)
                            }
                            className="cursor-pointer hover:text-(--primary-light) flex gap-2 p-3 items-center"
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
        )}
      </CardComponent>

      {/* modals */}
      <ProjectPartnerModal
        isOpen={addPartner}
        onClose={() => setAddPartner(false)}
        onSuccess={fetchProjectPartners}
        roles={roles}
        mode="create"
      />

      {selectedPartner && (
        <ProjectPartnerModal
          isOpen={editPartner}
          onClose={() => setEditPartner(false)}
          onSuccess={fetchProjectPartners}
          roles={roles}
          mode="update"
          initialData={selectedPartner}
        />
      )}

      {selectedPartner && (
        <DeleteModal
          isOpen={removePartner}
          onClose={() => setRemovePartner(false)}
          heading="Do you want to remove this Project Partner?"
          onDelete={() => handleDelete(selectedPartner.partnerId)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
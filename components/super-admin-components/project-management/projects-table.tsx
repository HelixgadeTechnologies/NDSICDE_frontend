"use client";

import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { year_options } from "@/lib/config/general-config";
import Link from "next/link";
import { useRoleStore } from "@/store/role-store";
import axios from "axios";
import { formatDate } from "@/utils/dates-format-utility";
import Heading from "@/ui/text-heading";
import { ProjectApiResponse } from "@/types/admin-types";
import { useProjects } from "@/context/ProjectsContext";
import Modal from "@/ui/popup-modal";
import Button from "@/ui/form/button";

export default function ProjectsTable() {
  const { projects: data, isLoading: loading, refreshProjects } = useProjects();
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<ProjectApiResponse[]>([]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const { user } = useRoleStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null); // Add this
  const { token } = useRoleStore();

  // Status options for dropdown
  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Active", value: "Active" },
    { label: "Completed", value: "Completed" },
    { label: "On Hold", value: "On Hold" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    year: "",
  });

  // Apply filters whenever query or filters change
  useEffect(() => {
    let result = (data as unknown as ProjectApiResponse[]) || [];
    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter((item) => {
        const projectName = item.projectName || "";
        const community = item.community || "";
        const state = item.state || "";

        return (
          projectName.toLowerCase().includes(lowerQuery) ||
          community.toLowerCase().includes(lowerQuery) ||
          state.toLowerCase().includes(lowerQuery) ||
          item.strategicObjectiveStatement
            ?.toLowerCase()
            .includes(lowerQuery) ||
          item.thematicAreasOrPillar?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    setFilteredData(result);
  }, [query, filters, data]);

  // const handleFilterChange = (name: string, value: string) => {
  //   setFilters(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  const head = [
    "Project Name",
    // "Project ID",
    "SO Alignment",
    "Status",
    "Start Date",
    "End Date",
    "Thematic Areas",
    "Actions",
  ];

  const handleDelete = async (projectId: string) => {
    const payload = {
      projectId: projectId,
    };

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/delete`,
        {
          data: payload,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Deleted successfully:", response.data);
      // Refresh the table by re-fetching projects from context
      refreshProjects(true);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <CardComponent>
      <div className="flex justify-between items-end gap-4 mb-4">
        <div className="w-2/5">
          <SearchInput
            value={query}
            name="search"
            placeholder="Search Projects by name, community, or state"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-3/5 flex items-end gap-4">
          <DropDown
            name="status"
            value={filters.status}
            placeholder="All Status"
            onChange={() => {}}
            options={statusOptions}
            label="Status"
          />
          <DropDown
            name="strategetic-objectives"
            value={filters.status}
            placeholder="All Objective"
            onChange={() => {}}
            options={[]}
            label="Strategic Objectives"
          />
          <DropDown
            name="year"
            value={filters.year}
            onChange={() => {}}
            options={year_options}
            label="Year"
          />
        </div>
      </div>

      {loading ? (
        <section className="flex justify-center items-center h-40">
          <div className="dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </section>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-10">
          <Heading
            heading="No projects found"
            subtitle={query ? "Try a different search term." : "If you think this is a mistake, please refresh the page or check back later."}
          />
        </div>
      ) : (
        <Table
          tableHead={head}
          tableData={filteredData}
          idKey={"projectId"}
          checkbox={user?.role === "super-admin"}
          renderRow={(row) => (
            <>
              <td className="px-4 py-3">
                <Link
                  href={`/projects/${row.projectId}`}
                  className="hover:underline font-medium">
                  {row.projectName}
                </Link>
              </td>
              {/* <td className="px-4 py-3">
                <span className="font-mono text-sm text-gray-600">
                  {row.projectId.substring(0, 8)}...
                </span>
              </td> */}
              <td className="px-4 py-3">
                {row.strategicObjectiveStatement || "N/A"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center text-sm ${
                    row.status === "Active"
                      ? "text-green-500"
                      : row.status === "Completed"
                      ? "text-blue-500"
                      : row.status === "On Hold"
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}>
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {formatDate(row.startDate, "date-only")}
              </td>
              <td className="px-4 py-3">
                {formatDate(row.endDate, "date-only")}
              </td>
              <td className="px-4 py-3">
                <div
                  className="max-w-xs truncate"
                  title={row.thematicAreasOrPillar}>
                  {row.thematicAreasOrPillar || "N/A"}
                </div>
              </td>
              <td className="px-4 py-3 relative">
                <div className="flex justify-center items-center">
                  <Icon
                    icon={"uiw:more"}
                    width={22}
                    height={22}
                    className="cursor-pointer hover:text-gray-700 transition-colors"
                    color="#909CAD"
                    onClick={() =>
                      setActiveRowId((prev) =>
                        prev === row.projectId ? null : row.projectId
                      )
                    }
                  />
                </div>
                {activeRowId === row.projectId && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50"
                      onClick={(e) => e.stopPropagation()}>
                      <ul className="text-sm">
                        <li className="cursor-pointer hover:bg-gray-50 hover:text-blue-600 flex gap-2 p-3 items-center">
                          <Icon
                            icon={"ph:pencil-simple-line"}
                            height={20}
                            width={20}
                          />
                          Edit
                        </li>
                        {user?.role === "super-admin" && (
                          <li
                            onClick={() => {
                              setProjectToDelete(row.projectId); // Store the ID
                              setConfirmDelete(true);
                            }}
                            className="cursor-pointer hover:bg-gray-50 hover:text-red-600 border-t border-gray-200 flex gap-2 p-3 items-center">
                            <Icon
                              icon={"pixelarticons:trash"}
                              height={20}
                              width={20}
                            />
                            Remove
                          </li>
                        )}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                )}
              </td>
            </>
          )}
        />
      )}
      <Modal
        isOpen={confirmDelete}
        onClose={() => {
          setConfirmDelete(false);
          setProjectToDelete(null); // Clear the ID when closing
        }}>
        <div className="flex justify-center items-center flex-col gap-3">
          <Heading
            heading="Delete this project?"
            subtitle="This action is permanent and cannot be reversed!"
            className="text-center"
          />
          <div className="flex items-center gap-4">
            <Button
              content="Cancel"
              isSecondary
              onClick={() => {
                setConfirmDelete(false);
                setProjectToDelete(null); // Clear on cancel
              }}
            />
            <Button
              content="Delete"
              onClick={() => {
                if (projectToDelete) {
                  handleDelete(projectToDelete); // Use the stored ID
                  setConfirmDelete(false);
                  setProjectToDelete(null);
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </CardComponent>
  );
}

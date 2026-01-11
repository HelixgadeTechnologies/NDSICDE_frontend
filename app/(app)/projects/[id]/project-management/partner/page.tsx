"use client";

import { useEffect, useState } from "react";
import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Button from "@/ui/form/button";
import { ProjectPartnerTypes } from "@/types/project-management-types";
import { useEntityModal } from "@/utils/project-management-utility";
import ProjectPartnerModal from "@/components/project-management-components/project-partner-modal";
import EditProjectPartnerModal from "@/components/project-management-components/edit-project-partner";
import DeleteModal from "@/ui/generic-delete-modal";
import axios from "axios";

export default function ProjectPartner() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectPartnerTypes[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const head = [
    "Partner Organization Name",
    "Email Address",
    "Role",
    "Last Active",
    "Actions",
  ];

  const fetchProjectPartners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/partners`);
      setData(response.data.data);
    } catch (error) {
      console.error(`Error fetching partners: ${error}`)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProjectPartners();
  }, [])

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
          content="Add Project Partners"
          icon="si:add-fill"
          onClick={handleAddPartner}
        />
      </div>
      <CardComponent>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div className="w-4/5">
            <SearchInput
              name="search"
              value=""
              placeholder="Search Projects"
              onChange={() => {}}
            />
          </div>
          <div className="w-1/5 flex items-end gap-4">
            <DropDown
              value=""
              name="role"
              placeholder="All Role"
              onChange={() => {}}
              options={[]}
            />
          </div>
        </div>

        <Table
          tableHead={head}
          tableData={data || []}
          checkbox
          idKey={"partnerId"}
          renderRow={(row) => (
            // <>
            //   <td className="px-6">{row.name}</td>
            //   <td className="px-6">{row.email}</td>
            //   <td className="px-6">{row.role}</td>
            //   <td className="px-6">{row.lastActive}</td>
            //   <td className="px-6 relative">
            //     <div className="flex justify-center items-center">
            //       <Icon
            //         icon={"uiw:more"}
            //         width={22}
            //         height={22}
            //         className="cursor-pointer"
            //         color="#909CAD"
            //         onClick={() =>
            //           setActiveRowId((prev) =>
            //             prev === row.userId ? null : row.userId
            //           )
            //         }
            //       />
            //     </div>

            //     {activeRowId === row.userId && (
            //       <AnimatePresence>
            //         <motion.div
            //           initial={{ y: -10, opacity: 0 }}
            //           animate={{ y: 0, opacity: 1 }}
            //           exit={{ y: -10, opacity: 0 }}
            //           transition={{ duration: 0.2, ease: "easeOut" }}
            //           className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50"
            //         >
            //           <ul className="text-sm">
            //             <li
            //               onClick={() => handleEditPartner(row, setActiveRowId)}
            //               className="cursor-pointer hover:text-blue-600 flex gap-2 border-b border-gray-300 p-3 items-center"
            //             >
            //               <Icon
            //                 icon={"ph:pencil-simple-line"}
            //                 height={20}
            //                 width={20}
            //               />
            //               Edit
            //             </li>
            //             <li
            //               onClick={() =>
            //                 handleRemovePartner(row, setActiveRowId)
            //               }
            //               className="cursor-pointer hover:text-(--primary-light) flex gap-2 p-3 items-center"
            //             >
            //               <Icon
            //                 icon={"pixelarticons:trash"}
            //                 height={20}
            //                 width={20}
            //               />
            //               Remove
            //             </li>
            //           </ul>
            //         </motion.div>
            //       </AnimatePresence>
            //     )}
            //   </td>
            // </>
            <></>
          )}
        />
      </CardComponent>

      {/* modals */}
      <ProjectPartnerModal
        isOpen={addPartner}
        onClose={() => setAddPartner(false)}
        roles={[]}
      />

      {selectedPartner && (
        <EditProjectPartnerModal
          isOpen={editPartner}
          onClose={() => setEditPartner(false)}
        />
      )}

      {selectedPartner && (
        <DeleteModal
          isOpen={removePartner}
          onClose={() => setRemovePartner(false)}
          heading="Do you want to remove this  Project Partner?"
        />
      )}
    </div>
  );
}

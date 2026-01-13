"use client";

import Table from "@/ui/table";
import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useReportsCommentsModal } from "@/utils/reports-and-comments-utility";
import { reportsData, reportsHead } from "@/types/reports-and-comments";
import AddComment from "./add-comments";
import ViewAnalytics from "./view-analytics";

export default function ReportsTable() {
  const [activeRowId, setActiveRowId] = useState<number | null>(null);

  const {
    handleAddComments,
    handleViewAnalytics,
    addComments,
    viewAnalytics,
    selectedReport,
    setAddComments,
    setViewAnalytics,
  } = useReportsCommentsModal();

  return (
    <section>
      <CardComponent>
        <div className="flex items-end gap-4 mb-6">
          <div className="w-2/5">
            <SearchInput
              placeholder="Search reports by title or projects.."
              value=""
              onChange={() => {}}
              name="search"
            />
          </div>
          {/* select dropdowns */}
          <div className="w-3/5 flex justify-center items-end gap-4">
            <DropDown
              name="impact"
              value=""
              onChange={() => {}}
              options={[]}
              label="Impact"
              placeholder="All Impact"
            />
            <DropDown
              name="output"
              value=""
              onChange={() => {}}
              options={[]}
              label="Output"
              placeholder="All Output"
            />
            <DropDown
              name="outcome"
              value=""
              onChange={() => {}}
              options={[]}
              label="Outcome"
              placeholder="All Outcome"
            />
            <DropDown
              name="activities"
              value=""
              onChange={() => {}}
              options={[]}
              label="Activities"
              placeholder="All Activity"
            />
          </div>
        </div>

        {/* table */}
        <Table
          tableHead={reportsHead}
          tableData={reportsData}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.reportTitle}</td>
              <td className="px-6">{row.project}</td>
              <td className="px-6">{row.dateGenerated}</td>
              <td
                className={`px-6 ${
                  row.status === "Approved"
                    ? "text-green-500"
                    : row.status === "Pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                {row.status}
              </td>
              <td
                className={`px-6 ${
                  row.kpiStatus === "Met" ? "text-green-500" : "text-red-500"
                }`}>
                {row.kpiStatus}
              </td>
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
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-50">
                      <ul className="text-sm">
                        <li
                          onClick={() => handleAddComments(row, setActiveRowId)}
                          className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center">
                          <Icon icon={"si:add-fill"} height={20} width={20} />
                          Add Comments
                        </li>
                        <li
                          onClick={() =>
                            handleViewAnalytics(row, setActiveRowId)
                          }
                          className="cursor-pointer hover:text-blue-600 flex gap-2 border-y border-gray-300 p-3 items-center">
                          <Icon icon={"heroicons:eye"} height={20} width={20} />
                          View Analytics
                        </li>
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                )}
              </td>
            </>
          )}
        />
      </CardComponent>

      {addComments && selectedReport && (
        <AddComment
          isOpen={addComments}
          onClose={() => setAddComments(false)}
        />
      )}

      {viewAnalytics && selectedReport && (
        <ViewAnalytics
          isOpen={viewAnalytics}
          onClose={() => setViewAnalytics(false)}
        />
      )}
    </section>
  );
}

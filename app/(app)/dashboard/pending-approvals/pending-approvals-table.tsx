"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pendingReportApproval } from "@/lib/config/charts";

export default function PendingApprovalsTable() {
  const head = [
    "ID",
    "Type",
    "Project",
    "Requestor",
    "Date",
    "Priority",
    "Actions",
  ];

  const data = [
    {
      id: "APR-002",
      type: "Budget Increase",
      project: "Education Initiative",
      requestor: "Emily Johnson",
      date: "2025-11-15",
      priority: "Urgent",
    },
    {
      id: "APR-004",
      type: "Budget Increase",
      project: "Education Initiative",
      requestor: "Emily Johnson",
      date: "2025-11-15",
      priority: "Normal",
    },
    {
      id: "APR-006",
      type: "Budget Increase",
      project: "Education Initiative",
      requestor: "Emily Johnson",
      date: "2025-11-15",
      priority: "Normal",
    },
  ];

  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("All Approval");

  const filteredApprovals = pendingReportApproval.filter((approval) => {
    const matchesQuery = approval.project
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesTitle = title === "All Approval" || approval.title === title;
    return matchesQuery && matchesQuery && matchesTitle;
  });

  //   const titleOptions = [
  //     { value: "All Approval", label: "All Approval" },
  //     ...Array.from(new Set(pendingReportApproval.map((u) => u.title))).map(
  //       (title) => ({
  //         value: title,
  //         label: title,
  //       })
  //     ),
  //   ];

  return (
    <CardComponent>
      <div className="flex justify-between items-center mb-5">
        <Heading heading="Pending Approvals" />
        <div className="w-[530px] flex gap-4 items-end">
          <SearchInput
            name="search"
            placeholder="Search Approvals"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <DropDown
            label="Approvals"
            name="approvals"
            value={title}
            placeholder="All Approvals"
            onChange={setTitle}
            options={[]}
          />
        </div>
      </div>
      {filteredApprovals.length > 0 ? (
        <Table
          checkbox
          tableHead={head}
          tableData={data}
          idKey={"id"}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.id}</td>
              <td className="px-6">{row.type}</td>
              <td className="px-6">{row.project}</td>
              <td className="px-6">{row.requestor}</td>
              <td className="px-6">{row.date}</td>
              <td
                className={`px-6 ${
                  row.priority === "Urgent"
                    ? "text-[#EAB308]"
                    : "text-[#003B99]"
                }`}>
                {row.priority}
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
                      className="absolute top-full mt-2 right-0 bg-white z-30 rounded-md border border-[#E5E5E5] shadow-md w-[210px]">
                      <ul className="text-sm">
                        <li
                          // onClick={() => handleViewUser(row, setActiveRowId)}
                          className="cursor-pointer hover:text-blue-600 p-3">
                          View Details
                        </li>
                        <li className="cursor-pointer hover:text-blue-600 border-y border-gray-300 p-3">
                          Delegate Review
                        </li>
                        <li className="cursor-pointer text-[#22C55E] border-b border-gray-300  p-3">
                          Approve
                        </li>
                        <li className="cursor-pointer text-(--primary-light) p-3">
                          Reject
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
    </CardComponent>
  );
}

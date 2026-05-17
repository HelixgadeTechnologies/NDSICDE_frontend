"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Heading from "./text-heading";
import { usePersistState } from "@/hooks/usePersistState";

type TableWithAccordionProps<T, K> = {
  tableHead: Array<string>;
  tableData?: T[];
  renderRow: (row: T, index: number, isOpen: boolean, toggleOpen: () => void) => React.ReactNode;
  childrenKey: keyof T;
  renderChildRow: (child: K, index: number) => React.ReactNode;
  childTableHead?: Array<string>;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
  persistKey?: string;
  // Pagination props
  pagination?: boolean;
  itemsPerPage?: number;
  showPaginationControls?: boolean;
  onPageChange?: (page: number) => void;
};

export default function TableWithAccordion<T, K>({
  tableHead,
  tableData = [],
  renderRow,
  childrenKey,
  renderChildRow,
  childTableHead,
  emptyStateSubMessage = "There are no records to display at the moment.",
  emptyStateMessage = "No data available",
  persistKey,
  pagination = true,
  itemsPerPage = 3,
  showPaginationControls = true,
  onPageChange,
}: TableWithAccordionProps<T, K>) {
  const [openRows, setOpenRows] = usePersistState<number[]>(persistKey, []);
  const [currentPage, setCurrentPage] = useState(1);

  const safeTableData = Array.isArray(tableData) ? tableData : [];
  const totalItems = safeTableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to page 1 when tableData changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tableData]);

  // Get the data for the current page
  const paginatedData = pagination
    ? safeTableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : safeTableData;

  const toggleRow = (index: number) => {
    setOpenRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const isEmpty = safeTableData.length === 0;

  return (
    <div className="w-full h-fit overflow-visible rounded-lg border border-[#E5E7EB]">
      {isEmpty ? (
        <div className="w-full min-h-50 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gray-100 border border-gray-100">
            <Icon icon="lucide:clipboard-list" className="w-10 h-10 text-gray-500" />
          </div>
          <Heading heading={emptyStateMessage} subtitle={emptyStateSubMessage} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-[#F5F7FA] h-13 text-[#111928] text-sm font-medium">
                {tableHead.map((head, index) => (
                  <th key={index} className="px-6 py-3 whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedData.map((row, localIndex) => {
                const i = pagination ? (currentPage - 1) * itemsPerPage + localIndex : localIndex;
                const isOpen = openRows.includes(i);
                const children = (row[childrenKey] as unknown as K[]) || [];
                const hasChildren = children.length > 0;

                return (
                  <React.Fragment key={i}>
                    <tr onClick={() => toggleRow(i)} className="h-15 text-[#6B7280] bg-gray-50 transition-colors cursor-pointer">
                      {renderRow(row, i, isOpen, () => toggleRow(i))}
                    </tr>
                    {isOpen && hasChildren && 
                      children.map((child, childIdx) => (
                        <tr key={childIdx} className="h-11 text-[#4B5563] bg-white border-t border-[#E5E7EB] hover:bg-gray-50/50 transition-colors">
                          {renderChildRow(child, childIdx)}
                        </tr>
                      ))
                    }
                    {isOpen && !hasChildren && (
                      <tr>
                        <td colSpan={tableHead.length} className="bg-[#F9FAFB] px-6 py-4">
                          <p className="text-xs text-gray-400 italic">No indicators yet.</p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {pagination && showPaginationControls && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
              {/* Page info */}
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              
              {/* Desktop pagination */}
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span> of{" "}
                    <span className="font-medium">{totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                        currentPage === 1
                          ? "cursor-not-allowed bg-gray-50"
                          : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                        currentPage === totalPages
                          ? "cursor-not-allowed bg-gray-50"
                          : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Simple pagination info when controls are hidden */}
          {pagination && !showPaginationControls && totalPages > 1 && (
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-2">
              <p className="text-sm text-gray-600 text-center">
                Showing {paginatedData.length} of {totalItems} items (Page {currentPage} of {totalPages})
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

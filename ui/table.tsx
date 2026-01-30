"use client";
import { useState, useEffect } from "react";
import Checkbox from "./form/checkbox";
import Heading from "./text-heading";

type TableProps<T> = {
  tableHead: Array<string>;
  tableData?: T[];
  renderRow: (row: T, index: number, isChecked?: boolean) => React.ReactNode;
  checkbox?: boolean;
  idKey?: keyof T;
  onSelectionChange?: (selected: T[]) => void;
  isStraight?: boolean;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
  // Pagination props
  pagination?: boolean;
  itemsPerPage?: number;
  showPaginationControls?: boolean;
  onPageChange?: (page: number) => void;
};

export default function Table<T>({
  tableHead,
  tableData = [],
  renderRow,
  checkbox = false,
  idKey,
  isStraight = false,
  onSelectionChange,
  emptyStateMessage = "No data available",
  emptyStateSubMessage = "There are no records to display at the moment. If this seems like an error, please check back later or refresh the page.",
  // Pagination props
  pagination = false,
  itemsPerPage = 3, // Default to 3 items per page as requested
  showPaginationControls = true,
  onPageChange,
}: TableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Array<T[keyof T]>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate paginated data
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get the data for the current page
  const paginatedData = pagination
    ? tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : tableData;
  
  // Reset to page 1 when tableData changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tableData]);

  const isAllSelected =
    checkbox && tableData.length > 0 && selectedIds.length === tableData.length;

  const toggleRow = (id: T[keyof T]) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (!idKey) return;
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      const allIds = tableData.map((row) => row[idKey]);
      setSelectedIds(allIds);
    }
  };

  useEffect(() => {
    if (onSelectionChange && idKey) {
      const selectedRows = tableData.filter((row) =>
        selectedIds.includes(row[idKey])
      );
      onSelectionChange(selectedRows);
    }
  }, [selectedIds, idKey, onSelectionChange, tableData]);

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Check if table is empty
  const isEmpty = tableData.length === 0;

  return (
    <div className="w-full h-fit overflow-visible rounded-lg border border-[#E5E7EB]">
      {isEmpty ? (
        // Empty State
        <div className="w-full min-h-50 flex flex-col items-center justify-center p-8 text-center">
          {/* Icon Container */}
          <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gray-100 border border-gray-100">
            <svg
              className="w-10 h-10 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          
          {/* Message */}
          <Heading heading={emptyStateMessage} subtitle={emptyStateSubMessage} />
        </div>
      ) : (
        <>
          {/* Table Content */}
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-[#F5F7FA] h-13 text-[#111928] text-sm font-medium">
                {checkbox && (
                  <th className="px-6">
                    <Checkbox
                      name="select-all"
                      isChecked={isAllSelected}
                      onChange={toggleAll}
                    />
                  </th>
                )}
                {tableHead.map((head, index) => (
                  <th key={index} className={`px-6 py-3 ${isStraight && 'whitespace-nowrap'}`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => {
                if (checkbox && !idKey) {
                  return (
                    <tr
                      key={i}
                      className="border-t border-[#E5E7EB] h-15 text-[#6B7280]"
                    >
                      {renderRow(row, i, false)}
                    </tr>
                  );
                }

                const id = idKey ? row[idKey] : undefined;
                const isChecked = idKey ? selectedIds.includes(row[idKey]) : false;

                return (
                  <tr
                    key={i}
                    className="border-t border-[#E5E7EB] h-15 text-[#6B7280]"
                  >
                    {checkbox && idKey && (
                      <td className="px-6">
                        <Checkbox
                          name={`checkbox-${i}`}
                          isChecked={isChecked}
                          onChange={() => id && toggleRow(id)}
                        />
                      </td>
                    )}
                    {renderRow(row, i, isChecked)}
                  </tr>
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
        </>
      )}
    </div>
  );
}
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
}: TableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Array<T[keyof T]>>([]);

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
        // Table Content
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
            {tableData.map((row, i) => {
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
      )}
    </div>
  );
}
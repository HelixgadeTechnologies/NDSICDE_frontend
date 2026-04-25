"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Heading from "./text-heading";

type TableWithAccordionProps<T, K> = {
  tableHead: Array<string>;
  tableData?: T[];
  renderRow: (row: T, index: number, isOpen: boolean, toggleOpen: () => void) => React.ReactNode;
  childrenKey: keyof T;
  renderChildRow: (child: K, index: number) => React.ReactNode;
  childTableHead?: Array<string>;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
};

export default function TableWithAccordion<T, K>({
  tableHead,
  tableData = [],
  renderRow,
  childrenKey,
  renderChildRow,
  childTableHead,
  emptyStateMessage = "No data available",
  emptyStateSubMessage = "There are no records to display at the moment.",
}: TableWithAccordionProps<T, K>) {
  const [openRows, setOpenRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setOpenRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isEmpty = tableData.length === 0;

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
              {tableData.map((row, i) => {
                const isOpen = openRows.includes(i);
                const children = (row[childrenKey] as unknown as K[]) || [];
                const hasChildren = children.length > 0;

                return (
                  <React.Fragment key={i}>
                    <tr onClick={() => toggleRow(i)} className="h-15 text-[#6B7280] bg-gray-50 transition-colors">
                      {renderRow(row, i, isOpen, () => toggleRow(i))}
                    </tr>
                    {isOpen && hasChildren && (
                      <tr>
                        <td colSpan={tableHead.length + 1} className="bg-[#F9FAFB] p-0">
                          <div className="bg-white border-t border-[#E5E7EB]">
                            <table className="min-w-full text-xs text-left border border-[#E5E7EB] rounded-lg overflow-hidden">
                              {childTableHead && (
                                <thead>
                                  <tr className="bg-[#F3F4F6] h-10 text-[#374151] font-semibold">
                                    {childTableHead.map((head, idx) => (
                                      <th key={idx} className="py-2">
                                        {head}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                              )}
                              <tbody className="divide-y divide-[#F3F4F6]">
                                {children.map((child, childIdx) => (
                                  <tr key={childIdx} className="h-10 text-[#4B5563]">
                                    {renderChildRow(child, childIdx)}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

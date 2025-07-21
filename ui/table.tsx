"use client";
import { useState, useEffect } from "react";
import Checkbox from "./form/checkbox";

type TableProps<T> = {
  tableHead: Array<string>;
  tableData?: T[];
  renderRow: (row: T, index: number, isChecked?: boolean) => React.ReactNode;
  checkbox?: boolean;
  idKey?: keyof T;
  onSelectionChange?: (selected: T[]) => void;
};

export default function Table<T>({
  tableHead,
  tableData = [],
  renderRow,
  checkbox = false,
  idKey,
  onSelectionChange,
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

  return (
    <div className="w-full h-fit overflow-visible rounded-lg border border-[#E5E7EB]">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-[#F5F7FA] h-[52px] text-[#111928] text-sm font-medium">
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
              <th key={index} className="px-6 py-3 whitespace-nowrap">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => {
            const id = idKey ? row[idKey] : i;
            const isChecked = selectedIds.includes(id);

            return (
              <tr
                key={i}
                className="border-t border-[#E5E7EB] h-[60px] text-[#6B7280]"
              >
                {checkbox && (
                  <td className="px-6">
                    <Checkbox
                      name={`checkbox-${i}`}
                      isChecked={isChecked}
                      onChange={() => toggleRow(id)}
                    />
                  </td>
                )}
                {renderRow(row, i, isChecked)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

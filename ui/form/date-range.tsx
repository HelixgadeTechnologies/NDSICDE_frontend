"use client";

import { useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useUIStore } from "@/store/ui-store";

type DatePickerProps = {
  onChange?: (range: { startDate: Date; endDate: Date }) => void;
  label?: string;
};

export default function DateRangePicker({ onChange, label }: DatePickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Get state and actions from the store
  const {
    isDateRangePickerOpen,
    dateRange,
    closeDateRangePicker,
    toggleDateRangePicker,
    updateDateRange,
  } = useUIStore();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDateRangePicker();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDateRangePicker]);

  const displayValue = `${format(dateRange.startDate, "MM/dd/yyyy")} - ${format(
    dateRange.endDate,
    "MM/dd/yyyy"
  )}`;

  const handleChange = (item: import("react-date-range").RangeKeyDict) => {
    if (item.selection.startDate && item.selection.endDate) {
      // Update the store
      updateDateRange(
        item.selection.startDate as Date,
        item.selection.endDate as Date
      );
      
      // Call optional onChange prop
      if (onChange) {
        onChange({
          startDate: item.selection.startDate as Date,
          endDate: item.selection.endDate as Date,
        });
      }
    }
  };

  return (
    <div className="relative w-fit" ref={ref}>
      <label className="text-xs font-medium text-gray-900 block mb-2">{label}</label>
      <button
        onClick={toggleDateRangePicker}
        className="border border-[#B6D8FF] rounded-md px-3 py-[6px] flex items-center gap-2 text-sm text-[#667185] bg-[#F8F8F8] focus:outline-none min-w-[180px] h-10"
      >
        <Icon icon="solar:calendar-outline" width={18} height={18} />
        <span className="whitespace-nowrap">{displayValue}</span>
      </button>

      {isDateRangePickerOpen && (
        <div className="absolute z-50 mt-2 shadow-lg rounded-md">
          <DateRange
            editableDateInputs={true}
            onChange={handleChange}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            rangeColors={["#003B99"]}
            months={1}
            direction="vertical"
            className="bg-white rounded-md"
          />
        </div>
      )}
    </div>
  );
}
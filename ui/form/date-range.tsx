"use client";

import { useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useUIStore } from "@/store/ui-store";

type DatePickerProps = {
  onChange?: (range: { startDate: string; endDate: string }) => void;
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
      const startDate = item.selection.startDate as Date;
      const endDate = item.selection.endDate as Date;
      
      // Update the store
      updateDateRange(startDate, endDate);
      
      // Format dates in M/D/YYYY format (no leading zeros) as shown in Swagger
      const startDateString = format(startDate, "M/d/yyyy");
      const endDateString = format(endDate, "M/d/yyyy");
      
      // Call onChange prop with formatted dates
      if (onChange) {
        onChange({
          startDate: startDateString,
          endDate: endDateString,
        });
      }
    }
  };

  return (
    <div className="relative w-full sm:max-w-sm flex-1" ref={ref}>
      <label className="text-sm font-medium text-gray-900 block mb-2">{label}</label>
      <button
        onClick={toggleDateRangePicker}
        className="border border-[#B6D8FF] rounded-md px-3 py-[6px] flex items-center gap-2 text-sm text-[#667185] bg-[#F8F8F8] focus:outline-none min-w-[180px] w-full h-10"
      >
        <Icon icon="solar:calendar-outline" width={18} height={18} />
        <span className="whitespace-nowrap">{displayValue}</span>
      </button>

      {isDateRangePickerOpen && (
        <div className="absolute right-0 z-50 mt-2 shadow-lg rounded-md">
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
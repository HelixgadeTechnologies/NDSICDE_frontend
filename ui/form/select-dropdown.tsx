"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

type DropDownProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isBigger?: boolean;
  options: { value: string; label: string }[];
  isDisabled?: boolean;
  error?: string;
};

export default function DropDown({
  label,
  name,
  value,
  placeholder = "Select option",
  onChange,
  isBigger,
  options = [],
  isDisabled,
  error,
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const id = `select-${name}`;

  // ensure first option is always selected
  useEffect(() => {
    if (!value && options.length > 0) {
      onChange(options[0].value);
    }
  }, [options, value, onChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="space-y-2 relative flex-1" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#242424] block">
          {label}
        </label>
      )}

      {/* Custom dropdown trigger */}
      <div
        onClick={handleToggle}
        className={`${
          isBigger ? "h-12" : "h-10"
        } min-w-full md:w-fit outline-none border border-[#B6D8FF] focus:border-[var(--primary-light)] rounded-[6px] px-4 text-sm flex items-center justify-between gap-5 bg-white transition-colors duration-200 ${isDisabled ? 'cursor-not-allowed text-gray-400 border-gray-100 bg-gray-400' : 'cursor-pointer hover:border-[var(--primary-light)] '}`}
      >
        <span className="text-gray-500 whitespace-nowrap">{displayValue}</span>
        <Icon
          icon="formkit:down"
          width={25}
          height={25}
          color="#667185"
          className={`transition-transform duration-200 ${
            isOpen && !isDisabled ? "rotate-180" : ""
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && !isDisabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="absolute top-full w-full bg-white border border-gray-300 rounded-[6px] shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No options
              </div>
            ) : (
              options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.15,
                    delay: index * 0.05,
                    ease: "linear",
                  }}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                    value === option.value
                      ? "bg-[#FFECE5] text-[#D2091E]"
                      : "text-gray-500"
                  }`}
                >
                  {option.label}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

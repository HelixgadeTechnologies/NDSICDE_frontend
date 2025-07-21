import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  label?: string;
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select options",
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOption = (option: Option) => {
    const exists = selected.find((o) => o.value === option.value);
    if (exists) {
      onChange(selected.filter((o) => o.value !== option.value));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeTag = (option: Option) => {
    onChange(selected.filter((o) => o.value !== option.value));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (option: Option) =>
    selected.some((o) => o.value === option.value);

  return (
    <div className="w-full" ref={ref}>
      {label && <label className="text-xs font-medium text-[#242424] block mb-2">{label}</label>}
      <div
        className={classNames(
          "flex items-center flex-wrap px-3 py-2 border rounded-md cursor-pointer min-h-10",
          "border-[#cbd5e0] bg-white focus-within:border-red-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length > 0 ? (
          selected.map((item) => (
            <span
              key={item.value}
              className="flex items-center gap-1 bg-gray-100 text-gray-800 h-7 text-sm px-2 rounded mr-1"
            >
              {item.label}
              <Icon
                icon="akar-icons:cross"
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(item);
                }}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}

        <div className="ml-auto">
          <Icon icon="formkit:down" height={25} width={25} className={`text-gray-400 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isOpen && (
        <div className="border border-[#E5E5E5] bg-white rounded-md mt-2 max-h-48 overflow-y-auto shadow-md z-50 relative">
          {options.length === 0 ? (
            <div className="p-2 text-gray-400 text-sm">No options available</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleOption(option)}
                className={classNames(
                  "px-3 py-2 cursor-pointer text-sm h-10 overflow-y-auto",
                  isSelected(option)
                    ? "bg-blue-100 text-blue-700 hidden"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

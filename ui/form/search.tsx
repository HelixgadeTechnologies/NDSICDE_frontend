"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

type SearchProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    placeholder?: string;
}

export default function SearchInput({
    value,
    onChange,
    name,
    placeholder = "Search",
}: SearchProps) {
    const [isFocused, setIsFocused] = useState(false);
  return (
    <div className={`h-10 w-full outline-none border group rounded-lg px-4 text-sm flex gap-1 items-center ${isFocused ? 'border-[var(--primary-light)]' : 'border-gray-300 '}`}>
        <Icon icon={"iconamoon:search-light"} height={25} width={25} color="#98A2B3" />
        <input
        type="email"
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="outline-none h-4/5 px-2.5 w-full"
      />
    </div>
  )}
"use client";

import { Icon } from "@iconify/react";

export default function BackButton() {
  return (
    <button
     onClick={() => window.history.back()} 
    className="border border-[var(--primary)] bg-[#FFECE5] text-[var(--primary)] rounded-md h-8 w-8 flex justify-center items-center mb-4 cursor-pointer"
    >
      <Icon 
      icon={"famicons:arrow-back-outline"} 
      height={20} 
      width={20} 
      />
    </button>
  );
}

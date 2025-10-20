"use client";

import { Icon } from "@iconify/react";
import Heading from "./text-heading";

export default function BackButton({ header }: {header?: string }) {
  return (
    <div onClick={() => window.history.back()}  className="flex gap-2 items-end mb-4">
      <button
      className="border border-[var(--primary)] bg-[#FFECE5] text-[var(--primary)] rounded-md h-8 w-8 flex justify-center items-center cursor-pointer"
      >
        <Icon 
        icon={"famicons:arrow-back-outline"} 
        height={20} 
        width={20} 
        />
      </button>
      {header && <div><Heading heading={header} sm /></div>}
    </div>
  );
}

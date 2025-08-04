"use client";

import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ActivityFinancialRequest from "./activity-financial-request";
import RetirementRequest from "./retirement-request";


export default function RetirementManagersDashboardTable() {
  const tabs = [
    { tabName: "Activity Financial Request", id: 1 },
    { tabName: "Retirement Request", id: 2 },
  ];

  const [dropdown, setDropdown] = useState("");

  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <CardComponent>
      <div className="flex justify-between w-full items-end gap-4">
        {/* Hardcoded Tabs */}
        <div className="w-full h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg">
          {tabs.map((d) => {
            const isActive = activeTab === d.id;
            return (
              <div
                key={d.id}
                onClick={() => handleTabChange(d.id)}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab"
                    className="absolute inset-0 z-0 bg-white rounded-lg text-[#242424]"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <div
                  className={`relative z-10 px-3 md:px-6 h-10 flex items-center justify-center font-bold text-xs md:text-sm cursor-pointer whitespace-nowrap ${
                    isActive ? "text-[#242424]" : "text-[#7A7A7A]"
                  }`}
                >
                  {d.tabName}
                </div>
              </div>
            );
          })}
        </div>

        <SearchInput
          value=""
          name=""
          onChange={() => {}}
          placeholder="Search Project"
        />
        <DropDown
          label="Status"
          value={dropdown}
          name="status"
          placeholder="All Status"
          onChange={(value: string) => setDropdown(value)}
          options={[]}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="mt-6"
        >
          { activeTab === 1 && <ActivityFinancialRequest /> }
          { activeTab === 2 && <RetirementRequest /> }
        </motion.div>
      </AnimatePresence>
    </CardComponent>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TabType {
  tabName: string;
  id: number;
}

type TabProps = {
  data: Array<TabType>;
  renderContent?: (activeTabId: number) => React.ReactNode;
  width?: string;
//   onTabChange?: (tabId: number) => void;
};

export default function TabComponent({ 
    data,
    renderContent,
    width,
    // onTabChange,
 }: TabProps) {

  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    // onTabChange?.(index);
  }

  return (
    <div className="w-full space-y-4">
      {/* Tabs */}
      <div className={`${width ? `w-${width}`: 'w-full'} relative h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg overflow-x-auto`}>
        {data.map((d) => {
          const isActive = activeTab === d.id;
          return (
            <div key={d.id} onClick={() => handleTabChange(d.id)} className="relative z-10">
              {isActive && (
                <motion.div
                  layoutId="tab"
                  className="absolute inset-0 z-0 bg-white rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

      {/* Animated Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {renderContent?.(activeTab)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

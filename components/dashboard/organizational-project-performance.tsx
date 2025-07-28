"use client";

import BarChartComponent from "@/ui/bar-chart";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrganizationalProjectPerformance() {
  const data = [
    { label: "Project 1", value: 80 },
    { label: "Project 2", value: 90 },
    { label: "Project 3", value: 80 },
    { label: "Project 4", value: 50 },
    { label: "Project 5", value: 80 },
    { label: "Project 6", value: 80 },
    { label: "Project 7", value: 90 },
    { label: "Project 8", value: 50 },
  ];

  const colorsSpi = ["#0047AB", "#F44336", "#FBC02D"];
  const colorsCpi = ["#F44336", "#FBC02D", "#0047AB", "#22C55E",];

  const tabs = [
    { tabName: "CPI", id: 1 },
    { tabName: "SPI", id: 2 },
  ];

  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <CardComponent>
      <div className="flex justify-between items-center">
        <Heading
          heading="Organizational Project Performance"
          subtitle="Budget Performance by Project"
        />
        {/* Hardcoded Tabs */}
        <div className="w-[180px] h-14 flex items-center gap-4 p-2 bg-[#f1f5f9] rounded-lg">
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
                    className="absolute inset-0 z-0 bg-white rounded-lg"
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
      </div>
      <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="mt-5"
      >
        {activeTab === 1 && (
            <div className="h-[300px]">
                <BarChartComponent
                data={data}
                isSingleBar={true}
                colors={colorsCpi}
                xKey="label"
                labels={["Under Budget",  "As Planned", "No Spending", "Over Budget"]}
                />
            </div>
        )}
        {activeTab === 2 && (
            <div className="h-[300px]">
                <BarChartComponent
                data={data}
                isSingleBar={true}
                colors={colorsSpi}
                xKey="label"
                labels={["Behind Schedule", "Ahead of Schedule", "On Schedule"]}
                />
            </div>
        )}
      </motion.div>
    </AnimatePresence>
    </CardComponent>
  );
}

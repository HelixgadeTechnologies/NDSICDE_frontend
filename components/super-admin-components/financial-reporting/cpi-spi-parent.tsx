"use client";

import { useState } from "react";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import DropDown from "@/ui/form/select-dropdown";
import { motion, AnimatePresence } from "framer-motion";
import BarChartComponent from "@/ui/bar-chart";


const colorsSpi = ["#0047AB", "#F44336", "#FBC02D"];
const colorsCpi = ["#F44336", "#FBC02D", "#0047AB", "#22C55E"];

interface PerformanceMetric {
  name: string;
  value: number;
  [key: string]: unknown;
}


function CPI({ data }: { data: PerformanceMetric[] }) {
  return (
    <div className="h-[300px] mt-5">
      <BarChartComponent
        data={data}
        isSingleBar={true}
        colors={colorsCpi}
        xKey="name"
        labels={["Under Budget", "As Planned", "No Spending", "Over Budget"]}
      />
    </div>
  );
}

function SPI({ data }: { data: PerformanceMetric[] }) {
  return (
    <div className="h-[300px] mt-5">
      <BarChartComponent
        data={data}
        isSingleBar={true}
        colors={colorsSpi}
        xKey="name"
        labels={["Behind Schedule", "Ahead of Schedule", "On Schedule"]}
      />
    </div>
  );
}

interface FinancialPerformanceProps {
  performanceData: {
    projectName: string;
    cpi?: number;
    spi?: number;
  }[];
}

export default function FinancialPerformance({ performanceData }: FinancialPerformanceProps) {
  const tabs = [
    { tabName: "CPI", id: 1 },
    { tabName: "SPI", id: 2 },
  ];

  const [dropdown, setDropdown] = useState("");
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const cpiData = performanceData?.map(p => ({
    name: p.projectName,
    value: p.cpi || 0
  })) || [];

  const spiData = performanceData?.map(p => ({
    name: p.projectName,
    value: p.spi || 0
  })) || [];

  return (
    <CardComponent>
      <div className="flex justify-between items-center">
        <Heading
          heading="Financial Performance"
          subtitle="Project Cost Effective Analysis"
        />
        <div className="w-45 flex items-end gap-4">
          {/* <DropDown
            label="Projects"
            value={dropdown}
            name="projects"
            placeholder="All projects"
            onChange={(value: string) => setDropdown(value)}
            options={[]}
            isBigger
          /> */}

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
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 1 && <CPI data={cpiData} />}
          {activeTab === 2 && <SPI data={spiData} />}
        </motion.div>
      </AnimatePresence>
    </CardComponent>
  );
}


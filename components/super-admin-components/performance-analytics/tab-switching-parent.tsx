"use client";

import TabComponent from "@/ui/tab-component";
import ProjectResultPerformance from "./project-result-performance";
import FinancialPerformance from "./financial-performance";
import CustomReports from "./custom-reports";

export default function RestOfPage() {
  const tabs = [
    { tabName: "Project Result Performance", id: 1 },
    { tabName: "Financial Performance", id: 2 },
    { tabName: "Custom Reports", id: 3 },
  ];
  return (
    <div className="space-y-5">
      <TabComponent
        data={tabs}
        renderContent={(tabId) => {
          if (tabId === 1) {
            return <ProjectResultPerformance />;
          } else if (tabId === 2) {
            return <FinancialPerformance />;
          } else {
            return <CustomReports />;
          }
        }}
      />
    </div>
  );
}

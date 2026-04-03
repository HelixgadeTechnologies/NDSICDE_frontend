"use client";

import { useState } from "react";
import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import TabComponent from "@/ui/tab-component";
import SOTable from "./strategic-objective-table";
import KPITable from "./kpi-table";

export default function StrategicObjectivesAndKPIToggle() {
  const tabs = [
    { tabName: "Strategic Objectives", id: 1 },
    { tabName: "Key Performance Indicators", id: 2 },
  ];
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  return (
    <CardComponent>
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="w-3/5">
          <SearchInput
            placeholder="Search KPIs and Objectives"
            value={query}
            name="search"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-2/5 flex gap-2 items-center">
          <DropDown 
            name="status" 
            placeholder="All Status"
            value={statusFilter} 
            onChange={(val: string) => setStatusFilter(val)} 
            options={[{label: "All Status", value: ""}, {label: "Active", value: "Active"}, {label: "Inactive", value: "Inactive"}]} 
          />
          <DropDown 
            name="type" 
            placeholder="All Types"
            value={typeFilter} 
            onChange={(val: string) => setTypeFilter(val)} 
            options={[{label: "All Types", value: ""}, {label: "Quantitative", value: "Quantitative"}, {label: "Qualitative", value: "Qualitative"}]} 
          />
        </div>
      </div>
      <TabComponent
        data={tabs}
        renderContent={(tabId) => {
          if (tabId === 1) {
            return <SOTable searchQuery={query} statusFilter={statusFilter} />;
          } else {
            return <KPITable searchQuery={query} typeFilter={typeFilter} />;
          }
        }}
      />
    </CardComponent>
  );
}

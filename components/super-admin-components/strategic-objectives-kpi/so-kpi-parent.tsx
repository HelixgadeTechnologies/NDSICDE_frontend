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
          <DropDown name="" value="" onChange={() => {}} options={[]} />
          <DropDown name="" value="" onChange={() => {}} options={[]} />
        </div>
      </div>
      <TabComponent
        data={tabs}
        renderContent={(tabId) => {
          if (tabId === 1) {
            return <SOTable />;
          } else {
            return <KPITable />;
          }
        }}
      />
    </CardComponent>
  );
}

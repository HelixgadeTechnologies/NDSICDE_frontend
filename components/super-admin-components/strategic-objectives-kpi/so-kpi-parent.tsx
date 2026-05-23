"use client";

import { useState } from "react";
import CardComponent from "@/ui/card-wrapper";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import SOTable from "./strategic-objective-table";

export default function StrategicObjectivesAndKPIToggle() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  return (
    <CardComponent>
      <div className="flex flex-col lg:flex-row lg:justify-between items-stretch lg:items-center gap-4 mb-4">
        <div className="w-full lg:w-3/5">
          <SearchInput
            placeholder="Search KPIs and Objectives"
            value={query}
            name="search"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-full lg:w-2/5 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <DropDown
            name="status"
            placeholder="All Status"
            value={statusFilter}
            onChange={(val: string) => setStatusFilter(val)}
            options={[
              { label: "All Status", value: "" },
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
          <DropDown
            name="type"
            placeholder="All KPI Types"
            value={typeFilter}
            onChange={(val: string) => setTypeFilter(val)}
            options={[
              { label: "All Types", value: "" },
              { label: "Quantitative", value: "Quantitative" },
              { label: "Qualitative", value: "Qualitative" },
            ]}
          />
        </div>
      </div>

      <SOTable
        searchQuery={query}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />
    </CardComponent>
  );
}

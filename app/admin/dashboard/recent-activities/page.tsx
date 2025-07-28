"use client";

import { useState } from "react";
import { recentActivities } from "@/lib/config/charts";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import SearchInput from "@/ui/form/search";
import Button from "@/ui/form/button";

export default function RecentActivities() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredData = recentActivities.filter((activity) => {
    return (
      activity.name.toLowerCase().includes(query.toLowerCase()) ||
      activity.project.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <CardComponent>
      <div className="flex justify-between items-center">
        <Heading heading="Recent Activities" />
        <div className="w-[320px]">
          <SearchInput
            value={query}
            onChange={handleSearch}
            name="search"
            placeholder="Search by user, project"
          />
        </div>
      </div>
      <div className="space-y-4 my-4">
        {query && filteredData.length === 0 ? (
          <div className="flex justify-center items-center flex-col gap-2">
            <Heading
              heading={`No items found for "${query}"`}
              subtitle="Try refining your search or if you believe this is a problem, contact support."
              className="text-center"
            />
            <div className="w-[200px]">
              <Button content="Support" />
            </div>
          </div>
        ) : (
          filteredData.map((f) => (
            <div
              key={f.id}
              className="h-[94px] w-full rounded-2xl border border-gray-200 p-6 flex justify-between items-center"
            >
              <div className="flex gap-2 items-center">
                <div className="h-14 w-14 rounded-full bg-[#D9D9D9]"></div>
                <div className="space-y-1.5">
                  <h3 className="text-[#242424] font-medium text-base leading-5">
                    {f.name} ({f.role})
                  </h3>
                  <p className="text-sm leading-4">
                    <span className="capitalize font-semibold text-gray-500">
                      {f.activity}
                    </span>
                    <span className="font-normal"> update in </span>
                    <span className="font-semibold text-[#242424]">
                      {f.project}
                    </span>
                  </p>
                  <p className="text-xs text-[#737373]">{f.time}</p>
                </div>
              </div>
              <p
                className={`text-sm ${
                  f.status === "Success"
                    ? "text-[#22C55E]"
                    : f.status === "Pending"
                    ? "text-[#EAB308]"
                    : "text-[#EF4444]"
                }`}
              >
                {f.status}
              </p>
            </div>
          ))
        )}
      </div>
    </CardComponent>
  );
}

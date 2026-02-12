"use client";

import { useEffect, useState } from "react";
import { RecentActivities } from "@/lib/config/charts";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import SearchInput from "@/ui/form/search";
import Avatar from "@/ui/avatar";
import axios from "axios";
import BackButton from "@/ui/back-button";

export default function Recents() {
  const [query, setQuery] = useState("");
  const [recentActivities, setRecentActivities] = useState<RecentActivities[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard-overview/recent-activities`
        );
        setRecentActivities(res.data.data);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        setError("Failed to fetch recent activities");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredData = recentActivities?.filter((activity) => {
    const searchStr = query.toLowerCase();
    return (
      activity.actor?.toLowerCase().includes(searchStr) ||
      activity.projectName?.toLowerCase().includes(searchStr) ||
      activity.activityType?.toLowerCase().includes(searchStr) ||
      activity.title?.toLowerCase().includes(searchStr) ||
      activity.description?.toLowerCase().includes(searchStr)
    );
  }) || [];

  if (loading) {
    return (
      <CardComponent>
        <Heading heading="Recent Activities" />
        <div className="dots my-20 mx-auto">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </CardComponent>
    );
  }

  if (error) {
    return (
      <CardComponent>
        <Heading heading="Recent Activities" />
        <div className="flex flex-col items-center justify-center h-36">
          <Heading
            heading="Error"
            subtitle="Failed to fetch recent activities"
            sm
            className="text-center text-gray-300"
          />
        </div>
      </CardComponent>
    );
  }

  return (
    <>
    <BackButton/>
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
          </div>
        ) : (
          filteredData.map((f) => (
            <div
              key={f.activityId}
              className="w-full rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all hover:shadow-sm bg-white"
            >
              <div className="flex gap-4 items-start flex-1">
                <Avatar name={f.actor} />
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[#242424] font-semibold text-base leading-5">
                      {f.actor}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                      {f.activityType}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#242424]">
                      {f.title || `${f.activityType} recorded`}
                    </p>
                    {f.description && (
                      <p className="text-sm text-[#737373] leading-relaxed">
                        {f.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <p className="text-xs leading-4 flex items-center gap-1.5 grayscale opacity-70">
                      <span className="font-normal text-gray-500">Project:</span>
                      <span className="font-semibold text-[#242424]">
                        {f.projectName || "Unknown Project"}
                      </span>
                    </p>
                    <p className="text-xs text-[#737373] flex items-center gap-1.5 grayscale opacity-70">
                      <span className="font-normal text-gray-500">Time:</span>
                      <span>{f.timeAgo}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardComponent>
    </>
  );
}

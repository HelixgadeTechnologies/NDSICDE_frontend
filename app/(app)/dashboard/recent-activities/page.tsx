"use client";

import { useEffect, useState } from "react";
import { RecentActivities } from "@/lib/config/charts";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import SearchInput from "@/ui/form/search";
import DropDown from "@/ui/form/select-dropdown";
import Avatar from "@/ui/avatar";
import axios from "axios";
import BackButton from "@/ui/back-button";
import { fetchProjects, ProjectType } from "@/lib/api/projects";

const LIMIT_OPTIONS = [
  { value: "5", label: "5 activities" },
  { value: "10", label: "10 activities" },
  { value: "20", label: "20 activities" },
  { value: "50", label: "50 activities" },
  { value: "100", label: "100 activities" },
];

const DAYS_OPTIONS = [
  { value: "", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last year" },
];

export default function Recents() {
  const [query, setQuery] = useState("");
  const [recentActivities, setRecentActivities] = useState<RecentActivities[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Filters ──
  const [limit, setLimit] = useState("20"); // prefilled to 20 on first load
  const [days, setDays] = useState("");
  const [projectId, setProjectId] = useState("");

  const [projects, setProjects] = useState<ProjectType[]>([]);

  // Load the project list once to populate the project filter dropdown
  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((err) =>
        console.error("Error fetching projects for filter:", err),
      );
  }, []);

  // Refetch activities whenever a filter changes
  useEffect(() => {
    const fetchRecentActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = {};
        if (limit) params.limit = Number(limit);
        if (days) params.days = Number(days);
        if (projectId) params.projectId = projectId;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard-overview/recent-activities`,
          { params },
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
  }, [limit, days, projectId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const projectOptions = [
    { value: "", label: "All projects" },
    ...projects.map((p) => ({ value: p.projectId, label: p.projectName })),
  ];

  const filteredData =
    recentActivities?.filter((activity) => {
      const searchStr = query.toLowerCase();
      return (
        activity.actor?.toLowerCase().includes(searchStr) ||
        activity.projectName?.toLowerCase().includes(searchStr) ||
        activity.activityType?.toLowerCase().includes(searchStr) ||
        activity.title?.toLowerCase().includes(searchStr) ||
        activity.description?.toLowerCase().includes(searchStr)
      );
    }) || [];

  return (
    <>
      <BackButton />
      <CardComponent>
        <Heading heading="Recent Activities" />

        {/* ── Filters ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
          <SearchInput
            label="Search by project or user"
            value={query}
            onChange={handleSearch}
            name="search"
            placeholder="Search"
          />
          <DropDown
            name="projectId"
            label="Project"
            value={projectId}
            onChange={setProjectId}
            options={projectOptions}
            placeholder="All projects"
          />
          <DropDown
            name="limit"
            label="Limit"
            value={limit}
            onChange={setLimit}
            options={LIMIT_OPTIONS}
            placeholder="20 activities"
          />
          <DropDown
            name="days"
            label="Time period"
            value={days}
            onChange={setDays}
            options={DAYS_OPTIONS}
            placeholder="All time"
          />
        </div>

        <div className="space-y-4 my-4">
          {loading ? (
            <div className="dots my-20 mx-auto">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-36">
              <Heading
                heading="Error"
                subtitle="Failed to fetch recent activities"
                sm
                className="text-center text-gray-300"
              />
            </div>
          ) : query && filteredData.length === 0 ? (
            <div className="flex justify-center items-center flex-col gap-2">
              <Heading
                heading={`No items found for "${query}"`}
                subtitle="Try refining your search or if you believe this is a problem, contact support."
                className="text-center"
              />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex justify-center items-center flex-col gap-2 h-36">
              <Heading
                heading="No activities found"
                subtitle="Try adjusting the filters above."
                className="text-center"
              />
            </div>
          ) : (
            filteredData.map((f) => (
              <div
                key={f.activityId}
                className="w-full rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all hover:shadow-sm bg-white">
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
                      <p className="text-xs leading-4 flex items-start gap-1.5 grayscale opacity-70">
                        <span className="font-normal text-gray-500">
                          Project:
                        </span>
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

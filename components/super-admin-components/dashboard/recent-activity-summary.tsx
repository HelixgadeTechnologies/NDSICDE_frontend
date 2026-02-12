"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import Avatar from "@/ui/avatar";
import { RecentActivities } from "@/lib/config/charts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentActivityTab() {
  const [recentActivities, setRecentActivities] = useState<RecentActivities[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      setLoading(true);
      try {
       const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard-overview/recent-activities`);
        setRecentActivities(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        setError("Failed to fetch recent activities");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, [])

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
          <Heading heading="Error" subtitle="Failed to fetch recent activities"  sm className="text-center text-gray-300"/>
        </div>
      </CardComponent>
    );
  }

  if (!recentActivities || recentActivities.length === 0) {
    return (
      <CardComponent>
        <Heading heading="Recent Activities" />
        <div className="flex flex-col items-center justify-center h-36">
          <Heading heading="No recent activities found." subtitle="Check back later for updates."  sm/>
        </div>
      </CardComponent>
    );
  }
  
  return (
    <CardComponent>
      <Heading heading="Recent Activities" />
      <div className="space-y-2">
        {recentActivities?.slice(0, 2).map((activity) => (
          <div key={activity?.activityId} className="flex gap-4 items-center my-4">
            <Avatar name={activity?.actor} />
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#242424]">
                {activity?.actor} {activity?.activityType}
              </p>
              <span className="text-xs text-[#737373] block">
                Project: {activity?.projectName}
              </span>
              <span className="text-xs text-[#737373] block">
                {activity?.timeAgo}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Button
        content="View All Activities"
        href="/dashboard/recent-activities"
      />
    </CardComponent>
  );
}
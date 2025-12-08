"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import Avatar from "@/ui/avatar";
import { recentActivities } from "@/lib/config/charts";

export default function RecentActivityTab() {
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
          <div key={activity?.id} className="flex gap-4 items-center my-4">
            <Avatar name={activity?.name} />
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#242424]">
                {activity?.name} {activity?.activity}
              </p>
              <span className="text-xs text-[#737373] block">
                Project: {activity?.project}
              </span>
              <span className="text-xs text-[#737373] block">
                {activity?.time}
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
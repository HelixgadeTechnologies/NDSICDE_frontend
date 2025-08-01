"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import Avatar from "@/ui/avatar";
import { recentActivities } from "@/lib/config/charts";

export default function RecentActivityTab() {
  return (
    <CardComponent>
        <Heading heading="Recent Activities" />
        <div className="space-y-2">
            { recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32">
                    <p className="text-lg text-gray-700">No recent activities found.</p>
                    <p className="text-xs text-gray-500">Check back later for updates.</p>
                </div>
            ) : recentActivities.slice(0, 2).map((activity) => (
                <div key={activity.id} className="flex gap-4 items-center my-4">
                    <Avatar
                    name={activity.name}
                    />
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-[#242424]">{activity.name} {activity.activity}</p>
                        <span className="text-xs text-[#737373] block">Project: {activity.project}</span>
                        <span className="text-xs text-[#737373] block">{activity.time}</span>
                    </div>
                </div>
            ))}
        </div>
        <Button content="View All Activities" href="/admin/dashboard/recent-activities" />
    </CardComponent>
  );
}
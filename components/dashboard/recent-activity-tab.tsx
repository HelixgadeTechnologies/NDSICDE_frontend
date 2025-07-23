"use client";

import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import Button from "@/ui/form/button";
import Avatar from "@/ui/avatar";

export default function RecentActivityTab() {
    const recentActivities = [
        {
            id: 1,
            activity: "John Doe submitted a new report",
            project: "Water Sanitation",
            time: "2 hours ago",
        },
        {
            id: 2,
            activity: "Alice Smith updated KPI targets",
            project: "Food Security",
            time: "5 hours ago",
        },
        {
            id: 3,
            activity: "Michael Brown approved the financial request",
            project: "Infrastructure Development",
            time: "5 hours ago",
        },
        {
            id: 4,
            activity: "Emily Johnson added a new team member",
            project: "Health Outreach",
            time: "1 day ago",
        },
        {
            id: 5,
            activity: "David Wilson completed the project review",
            project: "Community Engagement",
            time: "2 days ago",
        },
        {
            id: 6,
            activity: "Sarah Davis submitted a new proposal",
            project: "Education Initiative",
            time: "3 days ago",
        },
    ];

  return (
    <CardComponent>
        <Heading heading="Recent Activities" />
        <div className="space-y-4">
            {recentActivities.slice(0, 2).map((activity) => (
                <div key={activity.id} className="flex gap-4 items-center my-4">
                    <Avatar
                    name="John Doe"
                    />
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-[#242424]">{activity.activity}</p>
                        <span className="text-xs text-[#737373] block">Project: {activity.project}</span>
                        <span className="text-xs text-[#737373] block">{activity.time}</span>
                    </div>
                </div>
            ))}
        </div>
        <Button content="View All Activities" />
    </CardComponent>
  );
}
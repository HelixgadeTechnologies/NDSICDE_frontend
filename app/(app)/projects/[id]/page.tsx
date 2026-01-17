"use client";

import ChartsAndTableParent from "@/components/organizational-kpi/charts-table-parent";
import ActivityOverviewComponent from "@/components/team-member-components/activity-overview-chart-table";
import CardComponent from "@/ui/card-wrapper";
import DashboardStat from "@/ui/dashboard-stat-card";
import Heading from "@/ui/text-heading";
import { useState, useEffect } from "react";

export default function ResultDashboard() {
  const [impacts, setImpacts] = useState("0");
  const [outcomes, setOutcomes] = useState("0");
  const [outputs, setOutputs] = useState("0");
  const [activities, setActivities] = useState("0");

  useEffect(() => {
    const fetchImpacts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/impacts`);
        const data = await response.json();
        setImpacts(data.data.length.toString());
      } catch (error) {
        console.error("Error fetching impacts:", error);
      }
    };

    const fetchOutcomes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outcomes`);
        const data = await response.json();
        setOutcomes(data.data.length.toString());
      } catch (error) {
        console.error("Error fetching outcomes:", error);
      }
    };

    const fetchOutputs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/outputs`);
        const data = await response.json();
        setOutputs(data.data.length.toString());
      } catch (error) {
        console.error("Error fetching outputs:", error);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projectManagement/activities`);
        const data = await response.json();
        setActivities(data.data.length.toString());
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchImpacts();
    fetchOutcomes();
    fetchOutputs();
    fetchActivities();
  }, []);

  const dashboardData = [
    {
      title: "Result & Activities",
      icon: "material-symbols:target",
      lists: [
        {title: "Total Impacts", count: impacts},
        {title: "Total Outcomes", count: outcomes},
        {title: "Total Outputs", count: outputs},
        {title: "Total Activity", count: activities},
      ],
    },
    {
      title: "KPIs due for reporting",
      icon: "material-symbols:target",
      lists: [
        {title: "Impacts", count: "0"},
        {title: "Outcomes", count: "0"},
        {title: "Outputs", count: "0"},
      ],
    },
    {
      title: "Overall Performance",
      icon: "material-symbols:target",
      lists: [
        {title: "Impacts", count: "0%"},
        {title: "Outcomes", count: "0%"},
        {title: "Outputs", count: "0%"},
        {title: "Total Activity", count: "0%"},
      ],
    },
  ];
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardStat data={dashboardData} bigger />
      </div>
      {/* activity overview */}
      <CardComponent>
        <Heading
          heading="Activity Overview"
          subtitle="Breakdown of activities by current activities"
          className="mb-4"
        />
        <ActivityOverviewComponent />
      </CardComponent>
      <ChartsAndTableParent />
    </section>
  );
}

import ChartsAndTableParent from "@/components/organizational-kpi/charts-table-parent";
import ActivityOverviewComponent from "@/components/team-member-components/activity-overview-chart-table";
import CardComponent from "@/ui/card-wrapper";
import DashboardStat from "@/ui/dashboard-stat-card";
import Heading from "@/ui/text-heading";

export const metadata = {
  title: "Project Result Dashboard - NDSCIDE",
  description: "View your result dashboard",
};

export default function ResultDashboard() {
  const dashboardData = [
    {
      title: "Result & Activities",
      icon: "material-symbols:target",
      lists: [
        {title: "Total Impacts", count: "5"},
        {title: "Total Outcomes", count: "7"},
        {title: "Total Outputs", count: "15"},
        {title: "Total Activity", count: "24"},
      ],
    },
    {
      title: "KPIs due for reporting",
      icon: "material-symbols:target",
      lists: [
        {title: "Impacts", count: "5"},
        {title: "Outcomes", count: "7"},
        {title: "Outputs", count: "15"},
      ],
    },
    {
      title: "Overall Performance",
      icon: "material-symbols:target",
      lists: [
        {title: "Impacts", count: "10%"},
        {title: "Outcomes", count: "40%"},
        {title: "Outputs", count: "80%"},
        {title: "Total Activity", count: "96%"},
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

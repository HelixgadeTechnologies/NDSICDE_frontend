import PartnersDashboardComponent from "@/components/partners-components/dashboard-component"
import DashboardStat from "@/ui/dashboard-stat-card"

export const metadata = {
    title: "Dashboard - NDSICDE",
    descrition: "View your dashboard for the NDSICDE Platform in detail"
}

export default function PartnersDashboardPage() {

    const dashboardData = [
    {
      title: "Total Assigned KPIs",
      value: 24,
      percentInfo: "Across 3 projects",
      icon: "et:piechart",
    },
    {
      title: "Pending Updates",
      value: 5,
      percentInfo: "Due within 7 days",
      icon: "weui:time-outlined",
    },
    {
      title: "Achieved Targets",
      value: 6,
      percentage: 75,
      percentInfo: "success rate",
      icon: "duo-icons:approved",
    },
]

    return (
        <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardStat data={dashboardData} />
              </div>
              <PartnersDashboardComponent/>
        </section>
    )
}
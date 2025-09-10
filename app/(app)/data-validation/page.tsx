import DashboardStat from "@/ui/dashboard-stat-card"
import DataValidationTable from "@/components/admin-components/data-validation/data-validation-table";

export const metadata = {
    title: "Data Validation - NDSICDE",
    description: "View reports of budget allocation regarding KPI"
}

export default function DataValidation() {
    const dashboardData = [
        {
            title: "Total Submissions",
            value: 24,
            percentage: 20.1,
            percentInfo: "from last month",
            icon: "proicons:graph",
        },
        {
            title: "Pending Review",
            value: 0,
            percentage: 1,
            percentInfo: " of total submissions",
            icon: "material-symbols:planner-review-rounded",
        },
        {
            title: "Approved",
            value: 7,
            percentage: 33,
            percentInfo: "approval rate",
            icon: "duo-icons:approved",
        },
        {
            title: "Rejected",
            value: 2,
            percentage: 23,
            percentInfo: "rejection rate",
            icon: "marketeq:rejected-file-2",
        },
          {
          title: "Pending Financial Requests",
          value: 13,
          percentInfo: "Awaiting approval",
        },
        {
          title: "Approved Retirements",
          value: 45,
          percentInfo: "Completed this period",
        },
    ];

    return (
        <section className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
                <DashboardStat data={dashboardData} />
            </div>
            <DataValidationTable />
        </section>
    )
}
import DashboardStat from "@/ui/dashboard-stat-card";
import DataValidationTable from "@/components/super-admin-components/data-validation/data-validation-table";

export const metadata = {
  title: "Data Validation - NDSICDE",
  description: "View reports of budget allocation regarding KPI",
};

export default function DataValidation() {
  const dashboardData = [
    {
      title: "Total Submissions",
      value: 0,
      percentage: 0,
      percentInfo: "from last month",
      icon: "proicons:graph",
    },
    {
      title: "Pending Review",
      value: 0,
      percentage: 0,
      percentInfo: " of total submissions",
      icon: "material-symbols:planner-review-rounded",
    },
    {
      title: "Approved",
      value: 0,
      percentage: 0,
      percentInfo: "approval rate",
      icon: "duo-icons:approved",
    },
    {
      title: "Rejected",
      value: 0,
      percentage: 0,
      percentInfo: "rejection rate",
      icon: "marketeq:rejected-file-2",
    },
    {
      title: "Pending Financial Requests",
      value: 0,
      percentInfo: "Awaiting approval",
    },
    {
      title: "Approved Retirements",
      value: 0,
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
  );
}

import RequestApprovalsTable from "@/components/admin-components/request-approval-table";
import DashboardStat from "@/ui/dashboard-stat-card";

export const metadata = {
  title: "Request Approvals - NDSICDE",
  description: "View requested approvals table on the platform.",
};

export default function RequestApprovals() {
  const dashboardData = [
    {
      title: "Total Request",
      value: "0",
      // percentage: 78,
      // percentInfo: "Overall KPI Performance",
      icon: "mdi:chart-box-outline",
    },
    {
      title: "Approved Requests",
      value: "0",
      icon: "mdi:check-circle-outline",
    },
    {
      title: "Rejected Requests",
      value: "0",
      icon: "mdi:close-circle-outline",
    },
    {
      title: "Pending Requests",
      value: "0",
      icon: "mdi:clock-outline",
    },
  ];
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
        <DashboardStat data={dashboardData} />
      </div>
      <RequestApprovalsTable />
    </section>
  );
}

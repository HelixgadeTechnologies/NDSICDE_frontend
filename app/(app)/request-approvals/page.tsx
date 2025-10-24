import RequestApprovalsTable from "@/components/admin-components/request-approval-table";
import DashboardStat from "@/ui/dashboard-stat-card";

export const metadata = {
  title: "Request Approvals - NDSICDE",
  description: "View requested approvals table on the platform.",
};

export default function RequestApprovals() {
  return (
    <section>
      <RequestApprovalsTable />
    </section>
  );
}

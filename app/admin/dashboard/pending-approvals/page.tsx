import BackButton from "@/ui/back-button";
import PendingApprovalsTable from "./pending-approvals-table";

export const metadata = {
    title: "Pending Approvals | Dashboard - NDSICDE",
    description: "View all pending approvals for your organization",
}

export default function PendingApprovals() {
    return (
        <section>
            <BackButton/>
            <PendingApprovalsTable/>
        </section>
    )
}
import TeamMembersTable from "@/components/user-management/team-member-table";

export const metadata = {
    title: "User Management and Team Members - NDSICDE",
    description: "Manage users and team members for your specific organization",
}

export default function UserManagement() {
    return <TeamMembersTable />
}
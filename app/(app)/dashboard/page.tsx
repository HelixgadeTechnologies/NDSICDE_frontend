"use client";

import { useRoleStore } from "@/store/role-store";
import AdminDashboardPage from "@/components/dashboard-components/admin-dashboard";
import PartnersDashboardPage from "@/components/dashboard-components/partners-dashboard";
import ManagementAndStaffDashboard from "@/components/dashboard-components/management-dashboard";
import RetirementManagersDashboard from "@/components/dashboard-components/retirement-managers-dashboard";
import TeamMemberDashboard from "@/components/dashboard-components/team-member-dashboard";

export default function Dashboard() {
  const { user } = useRoleStore();

  switch (user?.role) {
    case "admin": {
      return <AdminDashboardPage />;
    }

    case "partners": {
      return <PartnersDashboardPage />;
    }

    case "management": {
      return <ManagementAndStaffDashboard />;
    }

    case "r-managers": {
      return <RetirementManagersDashboard />;
    }

    case "team-member": {
      return <TeamMemberDashboard />;
    }

    default: {
      return (
        <section className="space-y-6">
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-500">
              Access Denied - Invalid User Role
            </h2>
          </div>
        </section>
      );
    }
  }
}

import ProjectsTable from "@/components/admin-components/project-management/projects-table";
import DashboardStat from "@/ui/dashboard-stat-card"

export const metadata = {
    title: "Project Management - NDSICDE",
    description: "Project Management",
}

export default function ProjectManagement() {
    const dashboardData = [
        {
            title: "Total Projects",
            icon: "flowbite:clipboard-outline",
            value: 24,
        },
        {
            title: "Active Projects",
            icon: "flowbite:clipboard-outline",
            value: 5,
        },
        {
            title: "Completed Projects",
            icon: "flowbite:clipboard-outline",
            value: 5,
        },
        {
            title: "On Hold Projects",
            icon: "flowbite:clipboard-outline",
            value: 5,
        },
    ];
    return (
        <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DashboardStat data={dashboardData} />
            </div>
            <ProjectsTable/>
        </section>
    )
}
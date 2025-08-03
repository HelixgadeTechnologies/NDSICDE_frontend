import AssignedKPITable from "@/components/partners-components/assigned-kpi-table"

export const metadata = {
    title: "Assigned KPI - NDSICDE",
    description: "Assigned Key Performance Indicators"
}

export default function KPIReporting() {
    return (
        <section className="mt-20">
            <AssignedKPITable />
        </section>
    )
}
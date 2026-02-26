import Heading from "@/ui/text-heading"
import EditKPIForm from "./edit-kpi-form"

export const metadata = {
    title: "Edit KPI - NDSICDE",
    description: "Edit KPI Report",
}

export default function EditKPIPage({ params }: { params: { id: string } }) {
    return (
        <section>
            <Heading heading="Edit KPI Report" subtitle="Update the details about your KPI"/>
            <div className="my-5 w-3/4">
                <EditKPIForm id={params.id} />
            </div>
        </section>
    )
}

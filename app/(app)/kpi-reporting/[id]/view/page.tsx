import Heading from "@/ui/text-heading"
import ViewKPIDetails from "./view-kpi-details"

export const metadata = {
    title: "View KPI - NDSICDE",
    description: "View KPI Report Details",
}

export default function ViewKPIPage({ params }: { params: { id: string } }) {
    return (
        <section>
            <Heading heading="View KPI Report" subtitle="Detailed information about this KPI"/>
            <div className="my-5 w-3/4">
                <ViewKPIDetails id={params.id} />
            </div>
        </section>
    )
}

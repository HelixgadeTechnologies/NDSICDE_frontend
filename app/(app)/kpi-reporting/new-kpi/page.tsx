import Heading from "@/ui/text-heading"
import AddNewKPIForm from "./add-new-form"

export const metadata = {
    title: "Add New KPI - NDSICDE",
    description: "Add a new KPI",
}

export default function AddNewKPIPage() {
    return (
        <section>
            <Heading heading="KPI Reporting" subtitle="Provide detailed information about KPI details"/>
            <div className="my-5 w-3/4">
                <AddNewKPIForm/>
            </div>
        </section>
    )
}
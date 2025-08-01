type ActivityProps = {
    project: string;
    title: string;
    type: string;
    status: string;
}

export default function ActivitySummaryCard({
    project,
    title,
    type,
    status
}: ActivityProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h3 className="font-medium text-sm text-[#242424]">{title}</h3>
                <div className="font-normal text-xs text-[#737373]">
                    {type}: {project}
                </div>
            </div>
            <div className={`h-[22px] w-[60px] rounded-full ${status === "Normal" ? "bg-[#22C55E]" : "bg-[#F59E0B]"} text-white flex items-center justify-center text-xs font-bold`}>
                {status}
            </div>
        </div>
    )
}
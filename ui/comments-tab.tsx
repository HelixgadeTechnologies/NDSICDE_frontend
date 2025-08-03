type CommentsProps = {
    name: string;
    date: string;
    time: string;
    comment: string;
}

export default function CommentsTab({
    name,
    date,
    time,
    comment,
}: CommentsProps) {
    return (
        <div className="min-h-[84px] w-full bg-[#F2F2F2] p-4 space-y-1.5">
            <div className="flex justify-between items-center">
            <p className="font-semibold text-black">{name}</p>
            <p className="space-x-1 text-[#475367] text-sm">
                <span>{date}.</span>
                <span>{time}</span>
            </p>
            </div>
            <p className="text-[#475367] text-sm">{comment}</p>
        </div>
    )
}

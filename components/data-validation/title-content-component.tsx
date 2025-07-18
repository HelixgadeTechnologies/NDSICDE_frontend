type CardProps = {
    title?: string;
    content: string;
}

export default function TitleAndContent({ title, content}: CardProps) {
    return (
        <div className="space-y-2 text-sm">
            <p className="text-[#475367]">{title}</p>
            <div className="w-full h-fit p-4 bg-[#F2F2F2] rounded-lg">
                <p>{content}</p>
            </div>
        </div>
    )
}
import { Icon } from "@iconify/react";

type PDFProp = {
    title: string;
    onClick?: () => void;
}

export default function PDF({ title, onClick }: PDFProp) {
    return (
        <div className="h-7 w-[63px] rounded-sm border border-gray-200 p-1 flex justify-center items-center cursor-pointer hover:bg-gray-50" onClick={onClick}>
            <Icon icon={"material-symbols:download-rounded"} />
            <p className="text-[#7A7A7A] text-sm leading-5">{title}</p>
        </div>
    )
}
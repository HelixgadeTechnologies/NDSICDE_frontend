import { Icon } from "@iconify/react";

type FiileProps = {
    filename: string;
    filesize: string;
}

export default function FileDisplay({filename, filesize}: FiileProps) {
    return (
        <div className="bg-[#F2F2F2] h-[52px] w-full flex justify-between items-center p-4 text-sm">
            <p className="text-[#475367]">{filename}</p>
            <div className="flex items-center gap-4 ">
                <p className="text-[#475367]">{filesize}</p>
                <div className="h-8 w-[123px] bg-white rounded-lg p-1 gap-1 flex items-center cursor-pointer">
                    <Icon icon={"material-symbols-light:download"} width={22} height={22} />
                    <span className="text-black">Download</span>
                </div>
            </div>
        </div>
    )
}
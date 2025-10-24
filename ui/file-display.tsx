import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "./popup-modal";
import Button from "./form/button";
import Heading from "./text-heading";

type FiileProps = {
    filename: string;
    filesize: string;
}

export default function FileDisplay({filename, filesize}: FiileProps) {
    const [openPreview, setOpenPreview] = useState(false);
    return (
        <>
            <div onClick={() => setOpenPreview(true)} className="bg-[#F2F2F2] h-[52px] w-full flex justify-between items-center p-4 text-sm">
                <p className="text-[#475367] hover:underline cursor-pointer truncate">{filename}</p>
                <div className="flex items-center gap-4 ">
                    <p className="text-[#475367]">{filesize}</p>
                    <div className="h-8 w-fit bg-white rounded-lg p-1 gap-1 flex items-center cursor-pointer">
                        <Icon icon={"material-symbols-light:download"} width={22} height={22} />
                        {/* <span className="text-black">Download</span> */}
                    </div>
                </div>
            </div>

            <Modal isOpen={openPreview} onClose={() => setOpenPreview(false)} width="500px">
                <Heading heading="View Document"/>
                <div className="h-[300px] w-[400px] bg-gray-100 my-5"></div>

                <div className="flex items-center gap-4">
                <Button content="Close" isSecondary onClick={() => setOpenPreview(false)} />
                <Button content="Download" />
                </div>
            </Modal>
        </>
    )
}
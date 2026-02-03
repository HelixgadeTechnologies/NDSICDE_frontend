import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "./popup-modal";
import Button from "./form/button";
import Heading from "./text-heading";

type FileProps = {
    filename: string;
    filesize: string;
    url?: string;
}

export default function FileDisplay({ filename, filesize, url }: FileProps) {
    const [openPreview, setOpenPreview] = useState(false);
    
    const handleDownload = () => {
        if (url) {
            // For Cloudinary URLs, you might want to add download parameters
            let downloadUrl = url;
            
            // Add Cloudinary download parameter if it's a Cloudinary URL
            if (url.includes('cloudinary.com')) {
                // Add fl_attachment parameter to force download
                downloadUrl = url.includes('?') 
                    ? `${url}&fl_attachment` 
                    : `${url}?fl_attachment`;
            }
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename || 'download';
            link.target = '_blank'; // Open in new tab
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn('No URL provided for download');
        }
    };

    return (
        <>
            <div className="bg-[#F2F2F2] h-13 w-full flex justify-between items-center p-4 text-sm cursor-pointer hover:bg-[#E8E8E8] transition-colors">
                <p 
                    className="text-[#475367] hover:underline truncate"
                    onClick={() => url && window.open(url, '_blank')}
                    title={url ? "Click to view" : "No URL available"}
                >
                    {filename}
                </p>
                <div className="flex items-center gap-4">
                    <p className="text-[#475367]">{filesize}</p>
                    <div 
                        className="h-8 w-fit bg-white rounded-lg p-1 gap-1 flex items-center cursor-pointer hover:bg-gray-50"
                        onClick={handleDownload}
                        title={url ? "Download file" : "No file available"}
                    >
                        <Icon icon={"material-symbols-light:download"} width={22} height={22} />
                    </div>
                </div>
            </div>
        </>
    );
}
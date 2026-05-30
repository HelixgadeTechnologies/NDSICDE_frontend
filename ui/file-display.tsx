import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "./popup-modal";
import Button from "./form/button";
import Heading from "./text-heading";

type FileProps = {
    filename: string;
    filesize?: string;
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
            <div className="bg-[#F2F2F2] h-13 w-full flex justify-between items-center p-4 text-sm hover:bg-[#E8E8E8] transition-colors rounded-md">
                <p 
                    className="text-[#475367] hover:underline truncate cursor-pointer"
                    onClick={() => url && window.open(url, '_blank')}
                    title={url ? "Click to view in new tab" : "No URL available"}
                >
                    {filename}
                </p>
                <div className="flex items-center gap-4">
                    <p className="text-[#475367]">{filesize}</p>
                    {url && (
                        <div 
                            className="h-8 w-fit bg-white rounded-lg p-1 gap-1 flex items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => setOpenPreview(true)}
                            title="Preview file"
                        >
                            <Icon icon={"material-symbols-light:visibility"} width={22} height={22} />
                        </div>
                    )}
                    <div 
                        className="h-8 w-fit bg-white rounded-lg p-1 gap-1 flex items-center cursor-pointer hover:bg-gray-50"
                        onClick={handleDownload}
                        title={url ? "Download file" : "No file available"}
                    >
                        <Icon icon={"material-symbols-light:download"} width={22} height={22} />
                    </div>
                </div>
            </div>

            <Modal isOpen={openPreview} onClose={() => setOpenPreview(false)} maxWidth="1000px" width="95%">
                <div className="flex flex-col h-[80vh]">
                    <div className="flex justify-between items-center mb-4">
                        <Heading heading="Document Preview" subtitle={filename} />
                        <div className="w-24">
                            <Button content="Close" isSecondary onClick={() => setOpenPreview(false)} />
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {url ? (
                            <iframe 
                                src={url} 
                                className="w-full h-full"
                                title="Document Preview"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                No document URL available
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}
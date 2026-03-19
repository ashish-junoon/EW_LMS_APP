import React from "react";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

const DownloadDoc = ({ fileUrl, fileType, fileName, btnName, label, disabled = false }) => {
    const handleDownload = async (e) => {
        e.preventDefault(); // Prevent form submission
        try {
            if (!fileUrl) {
                throw new Error("No file URL provided");
            }

            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch the file");
            }

            const blob = await response.blob();
            const type = fileType || blob.type || "application/octet-stream";
            const finalBlob = new Blob([blob], { type });

            saveAs(finalBlob, fileName || "download");
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };
// console.log("fileUrl", fileUrl);
    return (
        <>
            <span className="block mb-1 text-sm font-medium text-black">{label}</span>
            <div className="flex justify-center items-center">
                <a
                    href={fileUrl}
                    target="_blank"
                    download
                    className="text-xs font-bold border border-black text-black py-1.5 px-4 w-full rounded"
                >
                    {btnName}
                </a>

                {/* <button
                    type="button"
                    onClick={handleDownload}
                    disabled={disabled}
                    className="text-xs font-bold border border-black text-black py-1.5 px-4 w-full rounded"
                >
                    {btnName}
                </button> */}
            </div>
        </>
    );
};

export default DownloadDoc;

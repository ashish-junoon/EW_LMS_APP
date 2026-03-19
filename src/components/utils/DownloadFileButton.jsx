import React from "react";

const DownloadFileButton = ({ base64Data, fileName, fileType }) => {
    if (!base64Data) return null;

    // Detect the MIME type based on fileType
    const mimeTypes = {
        pdf: "application/pdf",
        png: "image/png",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
    };

    const mimeType = mimeTypes[fileType.toLowerCase()] || "application/octet-stream";

    // Function to trigger file download
    const handleDownload = () => {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.${fileType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={handleDownload} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Download {fileType.toUpperCase()}
        </button>
    );
};

export default DownloadFileButton;

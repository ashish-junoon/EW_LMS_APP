// JsontoExcel.js
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const JsontoExcel = ({ reportDetail, reportType }) => {
    const exportToExcel = () => {
        if (!reportDetail || reportDetail.length === 0) {
            toast.error("No data to export.");
            return;
        }

        // Create worksheet from data
        const worksheet = XLSX.utils.json_to_sheet(reportDetail);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        // Convert workbook to binary array
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        // Create Blob and trigger download
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${reportType}_${Date.now()}.xlsx`);
    };

    return (
        <div className="flex flex-col items-center mt-4">
            {/* <h2 className="text-lg font-bold mb-2">Download Report as Excel</h2> */}
            <button onClick={exportToExcel} className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Download Report
            </button>
            {/* {exportToExcel()} */}
        </div>
    );
};

export default JsontoExcel;

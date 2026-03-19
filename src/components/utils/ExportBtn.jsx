import Button from "../utils/Button";

function ExportBtn({ data, fileName = 'export.csv' }) {
    // CSV Export Function
    const exportToCSV = (data) => {
        if (!data || data.length === 0) return; // Check if there's data to export

        const csvRows = [];
        const headers = Object.keys(data[0]); // Extract column headers from the data
        csvRows.push(headers.join(',')); // Add headers as the first row

        data.forEach(row => {
            const values = headers.map(header => `"${row[header]}"`); // Map through each row to format values
            csvRows.push(values.join(',')); // Add the formatted values as a row
        });

        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName); // Allow custom file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Button
            btnName="Export"
            btnIcon={"RiFileExcelLine"}
            style="bg-primary text-white hover:bg-secondary hover:text-black"
            onClick={() => exportToCSV(data)} // Pass the data for export
        />
    );
}

export default ExportBtn;

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "../../components/Table";
import Icon from "../../components/utils/Icon";
import { GetEMISchedule } from "../../api/ApiFunction";

function EmiPage() {

    const [emiData, setEmiData] = useState([]);

    const location = useLocation();
    const loanId = location.state?.loan_id;
    const leadId = location.state?.lead_id;

    const getSchedule = async (req) => {
        try {
            const response = await GetEMISchedule(req);
            // console.log("API Response:", response); // Debug log

            if (response.status) {

                const data = response.emiSchedules
                console.log(data)

                setEmiData(data);
                // toast.success(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        }
    }

    useEffect(() => {
        if (loanId && leadId) {
            const req = {
                lead_id: leadId,
                loan_id: loanId
            };

            getSchedule(req);

        }
    }, [loanId, leadId]);

    const columnsData = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            width: '60px'
        },
        {
            name: 'Total Due    ',
            selector: row => row.remaining_amount,
            width: '120px'
        },
        {
            name: 'EMI Principal',
            selector: row => row.principl_due,
            width: '120px'
        },
        {
            name: 'EMI Interest',
            selector: row => row.interest_due,
            sortable: true,
            width: '125px',
        },
        {
            name: 'EMI Amount',
            selector: row => row.installment,
            width: '125px'
        },
        {
            name: 'Due Date',
            selector: row => row.emi_due_date,
            width: '110px'
        },
        {
            name: 'Status',
            // selector: row => row.is_emi_paid ? 'Paid' : 'Pending',
            width: '125px',
            cell: row => {
                const parseDate = (dateStr) => {
                    if (!dateStr || typeof dateStr !== "string") return null; // Validate input
                    const parts = dateStr.split("/").map(Number); // Split by "/"

                    if (parts.length !== 3 || parts.some(isNaN)) return null; // Ensure valid parts

                    const [day, month, year] = parts;
                    return new Date(year, month - 1, day); // Convert to Date (months are 0-indexed)
                };

                const dueDate = parseDate(row.emi_due_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time for date-only comparison

                if (!dueDate || isNaN(dueDate.getTime())) {
                    return (
                        <span className="text-gray-500 font-bold text-[10px] border border-gray-400 px-4 py-0.5 bg-gray-100 rounded-full shadow-md italic">
                            Invalid Date
                        </span>
                    );
                }

                return dueDate.getTime() < today.getTime() || !row.is_emi_paid ? (
                    <span className="text-danger font-bold text-[10px] border border-danger px-4 py-0.5 bg-red-100 rounded-full shadow-md italic">
                        Overdue
                    </span>
                ) : (
                    <span className="text-success font-bold text-[10px] border border-success px-4 py-0.5 bg-green-100 rounded-full shadow-md italic">
                        Due
                    </span>
                );
            }



        },
        {
            name: 'EMI Paid On',
            selector: row => row.emi_paid_date,
            cell: row => (
                <span>
                    {row.is_emi_paid ? row.emi_paid_date : '-'}
                </span>
            )
        },

    ];

    return (
        <>
            {Array.isArray(emiData) && emiData.length > 0 ? (
                <div className='flex justify-center'>
                    <div className='mt-8 w-9/12'>
                        <Table columns={columnsData} data={emiData} title="EMI Schedule" />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <p>No data available</p>
                </div>
            )}
        </>
    )
}
export default EmiPage
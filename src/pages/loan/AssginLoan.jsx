// pages/LeadsPage.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { toast } from 'react-toastify';
import Icon from '../../components/utils/Icon';
import { useNavigate } from 'react-router-dom';
import { getAllLeads } from '../../api/ApiFunction';
import Loader from '../../components/utils/Loader';

const AssginLoan = () => {
    const [tableData, setTableData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const req = {
                status: 1
            };
            try {
                const response = await getAllLeads(req);
                console.log("API Response:", response); // Debug log

                if (response.status) {
                    const transformedData = response.userleadlist.map((user, index) => ({
                        ...user, // Keep all original fields
                        serialNumber: index + 1, // Add a serial number if needed
                    }));

                    console.log("Transformed Data:", transformedData); // Debug log
                    setTableData(transformedData);
                    // toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data.");
            }
        };

        fetchData();
    }, []);

    const columnsData = [
        {
            name: 'User ID',
            selector: row => row.user_id,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Lead ID',
            selector: row => row.lead_id,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Applied Date',
            selector: row => row.applied_date,
            sortable: true
        },
        {
            name: 'Full Name',
            selector: row => row.full_name,
            sortable: true,
            width: '200px'
        },
        {
            name: 'Mobile No',
            selector: row => row.mobile_number
        },
        {
            name: 'State',
            selector: row => row.state,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            width: '100px',
            cell: row => {
                switch (row.status.toString()) {
                    case '1':
                        return 'New';
                    case '2':
                        return 'Verified';
                    case '3':
                        return 'Credit';
                    default:
                        return 'Unknown';
                }
            }
        },
        {
            name: 'Actions',
            cell: row => (
                <button
                    onClick={() => navigate('/assign-product/assign', {
                        state: { lead_id: row.lead_id, user_id: row.user_id }
                    })}
                    className="p-2 hover:text-secondary"
                >
                    <Icon name="MdOutlineRemoveRedEye" size={21} />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const filterConfig = [
        {
            type: 'date',
            field: 'fromDate',
            label: 'From Date'
        },
        {
            type: 'date',
            field: 'toDate',
            label: 'To Date'
        },
        {
            type: 'select',
            field: 'status',
            label: 'Status',
            options: [
                { value: '1', label: 'New' },
                { value: '2', label: 'Verified' },
                { value: '3', label: 'Credit' }
            ]
        },
        {
            type: 'select',
            field: 'source',
            label: 'Source',
            options: [
                { value: 'App', label: 'App' },
                { value: 'Facebook', label: 'Facebook' },
                { value: 'Insta', label: 'Insta' },
                { value: 'Google Add', label: 'Google Add' }
            ]
        }
    ];

    return (
        <>
            {Array.isArray(tableData) && tableData.length > 0 ? (
                <Table
                    title="Assign Product"
                    data={tableData}
                    columns={columnsData}
                    filterConfig={filterConfig}
                />
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p>No data available</p>
                </div>
            )}
        </>
    );
};

export default AssginLoan;

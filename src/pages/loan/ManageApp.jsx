// pages/LeadsPage.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { toast } from 'react-toastify';
import DateInput from '../../components/fields/DateInput';
import SelectInput from '../../components/fields/SelectInput'
import Icon from '../../components/utils/Icon';
import { branchList } from '../../components/content/Data';
import Button from '../../components/utils/Button';
import FilterCard from '../../components/utils/FilterCard';
import { useNavigate } from 'react-router-dom';
import { getAllLeads } from '../../api/ApiFunction';
import { Helmet } from 'react-helmet';
import Loader from '../../components/utils/Loader';
import LoginPageFinder from '../../components/utils/LoginPageFinder';
import { maskData } from '../../components/utils/maskData';
import { useAuth } from '../../context/AuthContext';

const ManageApp = () => {
    const [tableData, setTableData] = useState([]);
    const [filterBtn, setFilterBtn] = useState();
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [branch, setBranch] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { adminUser } = useAuth();

    const pageAccess = LoginPageFinder('page_display_name', 'rejected leads');
    const permission = pageAccess?.[0].read_write_permission;
    const funder = adminUser.role === 'Funder' ? true : false

    const dateToday = new Date(new Date().setDate(new Date().getDate() - 0)).toISOString().split("T")[0];
    const preTenDay = new Date(new Date().setDate(new Date().getDate() - 60)).toISOString().split("T")[0];

    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            const req = {
                status: "7,8",
                from_date: preTenDay,
                to_date: dateToday,
                branch: "",
                source: ""
            };
            try {
                const response = await getAllLeads(req);
                // console.log("API Response:", response); // Debug log

                if (response.status) {
                    const transformedData = response.userleadlist.map((user, index) => ({
                        ...user, // Keep all original fields
                        serialNumber: index + 1, // Add a serial number if needed
                    }));

                    // console.log("Transformed Data:", transformedData); // Debug log
                    setTableData(transformedData);
                    setIsLoading(false)
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data.");
            }
            setIsLoading(false)
        };

        fetchData();
    }, []);

    const handleFilter = async () => {
        setIsLoading(true)
        const req = {
            status: "7,8",
            from_date: fromDate,
            to_date: toDate,
            branch: branch,
            source: ""
        };
        try {
            const response = await getAllLeads(req);
            // console.log("API Response:", response); // Debug log

            if (response.status) {
                const transformedData = response.userleadlist.map((user, index) => ({
                    ...user, // Keep all original fields
                    serialNumber: index + 1, // Add a serial number if needed
                }));

                // console.log("Transformed Data:", transformedData); // Debug log
                setTableData(transformedData);
                setIsLoading(false)
                // toast.success(response.message);
            } else {
                toast.error(response.message);
                setIsLoading(false)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
            setIsLoading(false)
        }
    };

    const handleFilterBtn = () => {
        setFilterBtn(!filterBtn)
    }

    if (isLoading) return <Loader />;


    const columnsData = [
        
        {
            name: 'Actions',
            cell: row => (
                <button
                    onClick={() => navigate('/lead/rejected-application', {
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
            name: 'Lead Date',
            selector: row => row.created_date,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Full Name',
            selector: row => row.full_name,
            sortable: true,
            // width: '250px'
        },
        {
            name: 'Gender',
            selector: row => row.gender,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Mobile No',
            selector: row => funder ? maskData(row.mobile_number, 'mobile') : row.mobile_number,
            width: '150px'
        },
        {
            name: 'Salary',
            selector: row => row.net_monthly_salary,
            width: '100px'
        },
        {
            name: 'State',
            selector: row => row.state,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            width: '120px',
            cell: row => {
                if (row.status.toString() === '8') {
                    return <span className="text-warning font-bold text-[10px] border border-warning px-2 py-0.5 rounded-full shadow-md italic">Follow-up</span>;
                } else if (row.status.toString() === '7') {
                    return <span className="text-danger font-bold text-[10px] border border-danger px-2 py-0.5 rounded-full shadow-md italic">Rejected</span>;
                } else {
                    return <span className="text-dark text-xs border border-dark px-2 py-1 rounded-full">N/A</span>;
                }
            }
        },
    ];

    return (
        <>
            <Helmet>
                <title>Leads Rejected</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            {filterBtn && (
                <FilterCard onClick={handleFilterBtn}>
                    <div className='pb-5 px-0 md:px-4'>
                        <div className='p-4 grid grid-cols-2 md:grid-cols-3 gap-5'>
                            <div className='mx-md:grid-cols-1'>
                                <DateInput
                                    label={"From Date"}
                                    name={"fromDate"}
                                    id={"formData"}
                                    value={fromDate}
                                    max={dateToday}
                                    onChange={(event) => setFromDate(event.target.value)}
                                />
                            </div>
                            <div className='mx-md:grid-cols-1'>
                                <DateInput
                                    label={"To Date"}
                                    name={"toDate"}
                                    id={"toDate"}
                                    value={toDate}
                                    max={dateToday}
                                    onChange={(event) => setToDate(event.target.value)}
                                />
                            </div>
                            {/* <div>
                                <SelectInput
                                    label="City"
                                    icon="IoLocationOutline"
                                    name="branchCity"
                                    placeholder="Select"
                                    options={branchList}
                                    onChange={(event) => setBranch(event.target.value)}
                                />
                            </div> */}
                            <div className='md:flex md:justify-center md:items-center max-md:col-span-2'>
                                <Button
                                    btnName={"Apply Filter"}
                                    btnIcon={"MdFilterAlt"}
                                    type="button"
                                    onClick={handleFilter}
                                    title="Search"
                                    style="bg-primary text-white min-w-48 mt-6 max-md:w-full"
                                />
                            </div>
                        </div>
                    </div>
                </FilterCard>
            )}

            <div className='mt-8'>
                <Table
                    columns={columnsData}
                    data={tableData}
                    title="Leads Rejected"
                    handleFilter={handleFilterBtn}
                    exportable={permission}
                />
            </div>

        </>
    );
};

export default ManageApp;

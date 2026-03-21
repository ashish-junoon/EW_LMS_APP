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
import { GetActiveLeads } from '../../api/ApiFunction';
import { Helmet } from 'react-helmet';
import Loader from '../../components/utils/Loader';
import TextInput from '../../components/fields/TextInput';
import LoginPageFinder from '../../components/utils/LoginPageFinder';
import { maskData } from '../../components/utils/maskData';
import { useAuth } from '../../context/AuthContext';

const ManageLoan = () => {
    const [tableData, setTableData] = useState([]);
    const [filterBtn, setFilterBtn] = useState();
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [pan, setPan] = useState("")
    const [type, setType] = useState("A")
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { adminUser } = useAuth();

    const pageAccess = LoginPageFinder('page_display_name', 'accounts');
    const permission = pageAccess?.[0].read_write_permission;
    const funder = adminUser.role === 'Funder' ? true : false

    const dateToday = new Date(new Date().setDate(new Date().getDate() - 0)).toISOString().split("T")[0];
    const preTenDay = new Date(new Date().setDate(new Date().getDate() - 60)).toISOString().split("T")[0];



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const req = {
                company_id: import.meta.env.VITE_COMPANY_ID,
                product_name: import.meta.env.VITE_PRODUCT_NAME,
                pannumber: "",
                type: "A", //D=Due, A=Active, O=Overdue
                fromdate: "",
                todate: ""
            };
            try {
                const response = await GetActiveLeads(req);
                // console.log("API Response:", response); // Debug log

                if (response.status) {
                    const transformedData = response.activeloans.map((user, index) => ({
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


    useEffect(() => {
        if (type) {
            setPan("");
        }
    }, [type]);


    const handleFilter = async () => {
        setIsLoading(true)
        const req = {
            company_id: import.meta.env.VITE_COMPANY_ID,
            product_name: import.meta.env.VITE_PRODUCT_NAME,
            pannumber: pan,
            type: pan ? "A" : type, //D=Due, A=Active, O=Overdue, C=Closed
            fromdate: fromDate,
            todate: toDate
        };
        try {
            const response = await GetActiveLeads(req);

            if (response.status) {
                const transformedData = response.activeloans.map((user, index) => ({
                    ...user, // Keep all original fields
                    serialNumber: index + 1, // Add a serial number if needed
                }));
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

    const handleFilterBtn = () => {
        setFilterBtn(!filterBtn)
    }

    const columnsData = [
        {
            name: 'Actions',
            cell: row => (
                <button
                    onClick={() => navigate('/loan/loan-details', {
                        state: { lead_id: row.lead_id, user_id: row.user_id, loan_id: row.loan_id }
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
            name: 'Loan Id',
            selector: row => row.loan_id,
            sortable: true,
            width: '180px'
        },
        {
            name: 'Applicant Name',
            selector: row => row.name,
            sortable: true,
            width: '200px'
        },
        {
            name: 'Mobile No',
            selector: row => funder ? maskData(row.mobile_number, 'mobile') : row.mobile_number,
        },
        {
            name: 'Loan Amount',
            selector: row => row.loan_amount,
        },
        {
            name: 'Repay Amount',
            selector: row => row.loan_collection_amount,
            sortable: true,
            // width: '100px'
        },
        {
            name: 'Disburse Date',
            selector: row => row.disbursement_date,
            sortable: true,
            width: '135px'
        },
        {
            name: type === "A" ? 'Due Date' : 'Closed Date',
            selector: row => type === "A" ? row.collection_date : row.loan_closed_date,
            sortable: true,
            omit : type === "N",
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'State',
            selector: row => row.state ? row.state : "N/A",  //Added For State
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: '150px',
            cell: row => {
                if (row.loan_status === 'Active') {
                    return <span className='text-green-600 bg-green-100 text-nowrap px-4 py-0.5 font-semibold rounded'>{row.loan_status}</span>
                } else if (row.loan_status === 'Closed') {
                    return <span className='text-red-600 bg-red-100 text-nowrap px-4 py-0.5 font-semibold rounded'>{row.loan_status}</span>
                } else if (row.loan_status === 'Settled') {
                    return <span className='text-gray-600 bg-gray-300 text-nowrap px-4 py-0.5 font-semibold rounded'>{row.loan_status}</span>
                } else {
                    return <span className='text-gray-600 bg-gray-300 text-nowrap px-4 py-0.5 font-semibold rounded'>{row.loan_status}</span>
                }
            }
        },
    ];

    if (isLoading) return <Loader />;

    return (
        <>
            <Helmet>
                <title>Active Loan</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            {filterBtn && (
                <FilterCard onClick={handleFilterBtn}>
                    <div className='pb-5 px-0 lg:px-4'>
                        <div className='p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5'>
                            <div>
                                <DateInput
                                    label={"From Date"}
                                    name={"fromDate"}
                                    id={"formData"}
                                    max={dateToday}
                                    value={fromDate}
                                    onChange={(event) => setFromDate(event.target.value)}
                                />
                            </div>
                            <div>
                                <DateInput
                                    label={"To Date"}
                                    name={"toDate"}
                                    id={"toDate"}
                                    value={toDate}
                                    max={dateToday}
                                    onChange={(event) => setToDate(event.target.value)}
                                />
                            </div>
                            <div>
                                <TextInput
                                    label="Unique Id"
                                    type="text"
                                    name="panCard"
                                    icon={"RiIdCardLine"}
                                    // placeholder="Enter PAN Card"
                                    placeholder="Pan, Loan Id etc."
                                    value={pan}
                                    onBlur={(event) => setPan(event.target.value)}
                                    onChange={(event) => setPan(event.target.value)}
                                />
                            </div>
                            <div>
                                <SelectInput
                                    label="Status"
                                    icon="IoLocationOutline"
                                    name="branchCity"
                                    placeholder="Select"
                                    value={type}
                                    options={branchList}
                                    onChange={(event) => setType(event.target.value)}
                                />
                            </div>
                            <div className='md:flex md:justify-center md:items-center col-span-1'>
                                <Button
                                    btnName={"Apply Filter"}
                                    btnIcon={"MdFilterAlt"}
                                    type="button"
                                    onClick={handleFilter}
                                    title="Search"
                                    style="bg-primary text-white min-w-48 mt-6 max-lg:w-full"
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
                    title="Manage Active Loan"
                    handleFilter={handleFilterBtn}
                    exportable={permission}
                />
            </div>
        </>
    );


};

export default ManageLoan;

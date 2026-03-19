import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { toast } from 'react-toastify';
import Icon from '../../components/utils/Icon';
import { useNavigate } from 'react-router-dom';
import { GetBranchList } from '../../api/ApiFunction';
import LinkBtn from '../../components/utils/LinkBtn';
import Loader from '../../components/utils/Loader';
import { Helmet } from 'react-helmet';
import LoginPageFinder from '../../components/utils/LoginPageFinder';

const ManageBranch = () => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [filterBtn, setFilterBtn] = useState()
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [branch, setBranch] = useState("")
    const navigate = useNavigate();

    const pageAccess = LoginPageFinder('page_display_name', 'manage branch');
    const permission = pageAccess?.[0].read_write_permission;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const req = {
                id: 0,
                branch_name: ""
            };
            try {
                const response = await GetBranchList(req);
                // console.log("API Response:", response); // Debug log

                if (response.status) {
                    const transformedData = response.getBranches.map((user, index) => ({
                        ...user, // Keep all original fields
                        serialNumber: index + 1, // Add a serial number if needed
                    }));
                    setTableData(transformedData);
                    setIsLoading(false)
                } else {
                    console.log(response.message)
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
            status: "1",
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
                // toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        }
        setIsLoading(false)
    };

    const columnsData = [

        {
            name: 'Branch Id',
            selector: row => row.branch_id,
            sortable: true,
            width: '200px'
        },
        {
            name: 'Branch Name',
            selector: row => row.branch_name,
            sortable: true,
            width: '200px'
        },

        {
            name: 'Branch State',
            selector: row => row.state,
            sortable: true,
            width: '200px'
        },
        {
            name: 'Branch City',
            selector: row => row.District,
            width: '200px'
        },
        {
            name: 'Status',
            selector: row => row.is_active,
            sortable: true,
            width: '200px',
            cell: row => {
                if (row.is_active) {
                    return <span className="text-green-500 bg-green-100 font-bold text-[10px] border border-green-500 px-2 py-0.5 rounded-full shadow-md italic">Active</span>;
                } else {
                    return <span className="text-danger font-bold text-[10px] border border-danger px-2 py-0.5 rounded-full shadow-md italicl">Inactive</span>;
                }
            }
        },
        {
            name: 'Actions',
            width: '200px',
            cell: row => (
                <button
                    onClick={() => navigate('/admin/branch-details', {
                        state: { id: row.id }
                    })}
                    className="p-2 hover:text-secondary"
                >
                    <Icon name="MdOutlineRemoveRedEye" size={21} />
                </button>
            ),
            ignoreRowClick: true,
            allowoverflow: true,
            button: 'true',
        }
    ];

    const handleFilterBtn = () => {
        setFilterBtn(!filterBtn)
    }

    if (isLoading) return <Loader />;

    return (
        <>
            <Helmet>
                <title>Manage Branch</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="border border-gray-200 shadow px-5 py-2 mb-5 bg-blue-50 rounded">
                <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col justify-start">
                        <h1 className="text-lg font-bold text-black">Manage Branch</h1>
                        <p className="text-xs font-light text-secondary">Manage & Control Branch</p>
                    </div>
                    <div className="flex justify-end py-2">
                        {permission && (
                            <LinkBtn
                                linkName={"Add Branch"}
                                linkUrl={'/admin/add-branch'}
                                icon={"MdOutlineAdd"}
                                className={"bg-primary text-white"}
                            />
                        )}

                    </div>
                </div>
            </div>



            {Array.isArray(tableData) && tableData.length > 0 ? (
                <div className='w-full'>
                    <Table columns={columnsData} data={tableData} title="Manage Branch" handleFilter={handleFilterBtn} />
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <p>No data available</p>
                </div>
            )}
        </>
    );
};

export default ManageBranch;
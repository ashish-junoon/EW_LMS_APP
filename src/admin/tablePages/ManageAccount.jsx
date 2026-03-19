import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { toast } from 'react-toastify';
import { GetCompanyBankAcount } from '../../api/ApiFunction';
import LinkBtn from '../../components/utils/LinkBtn';
import Loader from '../../components/utils/Loader';
import { Helmet } from 'react-helmet';
import LoginPageFinder from '../../components/utils/LoginPageFinder';

const ManageAccount = () => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [filterBtn, setFilterBtn] = useState()

    const pageAccess = LoginPageFinder('page_display_name', 'manage accounts');
    const permission = pageAccess?.[0].read_write_permission;



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await GetCompanyBankAcount();
                // console.log("API Response:", response); // Debug log

                if (response.status) {
                    const transformedData = response.companyBankNames.map((user, index) => ({
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

    const columnsData = [

        {
            name: '#',
            selector: row => row.bank_id,
            sortable: true,
            // width: 'px'
        },
        {
            name: 'Account Number',
            selector: row => row.account_number,
            sortable: true,
            // width: '250px'
        },
        {
            name: 'Bank Name',
            selector: row => row.bank_name,
            sortable: true,
            // width: '250px'
        },


        {
            name: 'IFSC Code',
            selector: row => row.ifsc_code,
            sortable: true,
            // width: '200px'
        },
        {
            name: 'Branch',
            selector: row => row.branch_name,
            // width: '150px'
        },
        // {
        //     name: 'Actions',
        //     width: '100px',
        //     cell: row => (
        //         <button
        //             onClick={() => navigate('/admin/branch-details', {

        //             })}
        //             className="p-2 hover:text-secondary"
        //         >
        //             <Icon name="MdOutlineRemoveRedEye" size={21} />
        //         </button>
        //     ),
        //     ignoreRowClick: true,
        //     allowoverflow: true,
        //     button: 'true',
        // }
    ];

    const handleFilterBtn = () => {
        setFilterBtn(!filterBtn)
    }

    if (isLoading) return <Loader />;

    return (
        <>
            <Helmet>
                <title>Manage Bank Accounts</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="border border-gray-200 shadow px-5 py-2 mb-5 bg-blue-50 rounded">
                <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col justify-start">
                        <h1 className="text-lg font-bold text-black">Manage Bank Accounts</h1>
                        <p className="text-xs font-light text-secondary">Manage & Control Bank Accounts</p>
                    </div>
                    <div className="flex justify-end py-2">
                        {permission && (
                            <LinkBtn
                                linkName={"Add Bank Account"}
                                linkUrl={'/admin/add-bank-account'}
                                icon={"MdOutlineAdd"}
                                className={"bg-primary text-white"}
                            />
                        )}

                    </div>
                </div>
            </div>



            {Array.isArray(tableData) && tableData.length > 0 ? (
                <div className='mt-5 max-w-full'>
                    <Table columns={columnsData} data={tableData} title="Manage Bank Accounts" handleFilter={handleFilterBtn} />
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <p>No data available</p>
                </div>
            )}
        </>
    );
};

export default ManageAccount;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet';
import Table from '../../components/Table';
import DateInput from '../../components/fields/DateInput';
import Icon from '../../components/utils/Icon';
import Button from '../../components/utils/Button';
import FilterCard from '../../components/utils/FilterCard';
import Modal from '../../components/utils/Modal';
import Loader from '../../components/utils/Loader';
import { GetActiveLeads, PullNACHPayment, UpdateLoanStatus } from '../../api/ApiFunction';
import LoginPageFinder from '../../components/utils/LoginPageFinder';
import { maskData } from '../../components/utils/maskData';
import { useAuth } from '../../context/AuthContext';

const ManageOverdue = () => {
    const [openData, setOpenData] = useState({});
    const [tableData, setTableData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filterBtn, setFilterBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState(null);

    const { adminUser } = useAuth();

    const pageAccess = LoginPageFinder('page_display_name', 'overdues');
    const permission = pageAccess?.[0].read_write_permission;
    const funder = adminUser.role === 'Funder' ? true : false


    const navigate = useNavigate();

    useEffect(() => {
        fetchData('', '');
    }, []);

    const fetchData = async (fromdate, todate) => {
        setIsLoading(true);
        const req = {
            company_id: import.meta.env.VITE_COMPANY_ID,
            product_name: import.meta.env.VITE_PRODUCT_NAME,
            type: "O",
            pannumber: "",
            fromdate,
            todate
        };
        try {
            const response = await GetActiveLeads(req);
            if (response.status) {
                const transformedData = (response.activeloans || []).map((user, index) => ({
                    ...user,
                    serialNumber: index + 1,
                }));
                setTableData(transformedData);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilter = () => fetchData(fromDate, toDate);

    const handleFilterBtn = () => setFilterBtn(prev => !prev);

    const columnsData = [
        {
            name: 'Actions',
            cell: row => (
                <button
                    onClick={() => {
                        setSelectedIds(row);
                        setIsOpen(true);
                    }}
                    className="p-2 hover:text-secondary"
                >
                    <Icon name="MdOutlineRemoveRedEye" size={21} />
                </button>
            ),
            ignoreRowClick: false,
        },
        {
            name: 'Loan Id',
            selector: row => row.loan_id,
            sortable: true,
            width: '180px',
        },
        {
            name: 'Applicant Name',
            selector: row => row.name,
            sortable: true,
            width: '200px',
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
        },
        {
            name: 'Due Date',
            selector: row => row.collection_date,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category,
            
        },
        {
            name: 'Status',
            selector: row => row.loan_status,
            sortable: true,
            width: '120px',
            cell: row => (
                <span className="text-red-600 bg-red-100 font-bold px-4 py-0.5">
                    {row.loan_status}
                </span>
            )
        },
    ];

    if (isLoading) return <Loader />;

    return (
        <>
            <Helmet>
                <title>Manage Overdue</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            {filterBtn && (
                <div className='flex justify-center items-center'>
                    <div className='w-full'>
                        <FilterCard onClick={handleFilterBtn}>
                            <div className='pb-5 px-0 md:px-4'>
                                <div className='p-4 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-5'>
                                    <div className='col-span-1'>
                                        <DateInput
                                            label="From Date"
                                            name="fromDate"
                                            id="fromDate"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                        />
                                    </div>
                                    <div className='col-span-1'>
                                        <DateInput
                                            label="To Date"
                                            name="toDate"
                                            id="toDate"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                        />
                                    </div>
                                    <div className='md:flex md:justify-center md:items-center max-md:col-span-2'>
                                        <Button
                                            btnName="Apply Filter"
                                            btnIcon="MdFilterAlt"
                                            type="button"
                                            onClick={handleFilter}
                                            title="Search"
                                            style="bg-primary text-white min-w-48 mt-6 max-md:w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </FilterCard>
                    </div>
                </div>
            )}

            <div className='flex justify-center'>
                <div className='mt-8 w-full'>
                    <Table
                        columns={columnsData}
                        data={tableData}
                        title="Manage Overdue"
                        handleFilter={handleFilterBtn}
                        exportable={permission}
                    />
                </div>
            </div>

            {/* View Loan Details Modal */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className='flex items-center justify-between bg-primary text-white -m-5 px-5 py-1'>
                    <div className=''>
                        <h1 className='text-2xl font-semibold'>Loan Details</h1>
                        <span>Loan Id: {selectedIds?.loan_id}</span>
                    </div>
                    <div>
                        {/* <div className='flex items-center bg-white text-primary px-4 py-1 font-bold rounded'>
                            Active
                        </div> */}
                    </div>
                </div>
                <div>
                    <div className=''>
                        <div className='flex items-center justify-between mt-8'>
                            <span className='font-bold text-xl ml-2'>Applicant Information</span>
                            <div className='bg-red-100 px-4 text-red-500 text-sm font-semibold rounded py-0.5 shadow-md border border-red-500'>
                                {selectedIds?.loan_status}
                            </div>
                        </div>
                    </div>
                    <div className='my-5'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="font-medium flex items-center gap-1">
                                    <Icon name="IoPersonOutline" size={16} />
                                    {selectedIds?.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Mobile Number</p>
                                <p className="font-medium flex items-center gap-1">
                                    <Icon name="IoCallOutline" size={16} />
                                    {funder ? maskData(selectedIds?.mobile_number, 'mobile') : selectedIds?.mobile_number}
                                </p>
                            </div>
                        </div>
                        <hr className='my-5' />
                    </div>

                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-blue-100 rounded-lg overflow-hidden shadow">
                                <div className="bg-blue-50 px-4">
                                    <h3 className="text-lg text-primary font-semibold ">Disbursement Details</h3>
                                </div>
                                <div className="pt-2 px-4 pb-2">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Loan Amount</p>
                                            <p className="text-xl font-bold text-primary">₹{selectedIds?.loan_amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Disbursement Amount</p>
                                            <p className="text-lg font-semibold">₹{selectedIds?.disbursement_amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Disbursement Date</p>
                                            <p className="flex items-center gap-1">
                                                <Icon name="IoCalendarOutline" size={16} />
                                                {dayjs(selectedIds?.disbursement_date).format('DD-MM-YYYY')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-blue-100 rounded-lg overflow-hidden shadow">
                                <div className=" bg-blue-50 px-4">
                                    <h3 className="text-lg text-primary font-semibold">Collection Details</h3>
                                </div>
                                <div className="pt-2 px-4 pb-2">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Collection Amount</p>
                                            <p className="text-xl font-bold text-primary">₹{selectedIds?.loan_collection_amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Collection Date</p>
                                            <p className="flex items-center gap-1">
                                                <Icon name="IoCalendarOutline" size={16} />
                                                {dayjs(selectedIds?.collection_date).format('DD-MM-YYYY')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Penal Charges</p>
                                            <p className="font-semibold capitalize">{selectedIds?.penal_charges}% per day</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-0">
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start gap-3">
                                <Icon name="IoInformationCircleOutline" size={24} />
                                <div>
                                    <p className="font-medium text-primary">Payment Information</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        The total repayment amount is ₹{selectedIds?.loan_collection_amount}, which includes
                                        principal and interest. Late payments are subject to a penal charge of {selectedIds?.penal_charges}% per
                                        day.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-5">
                        <Button
                            btnName={"Close"}
                            style={"border border-danger hover:bg-danger hover:text-white text-danger font-medium py-2 px-4 rounded"}
                            btnIcon={"IoCloseOutline"}
                            onClick={() => { setIsOpen(false) }}
                        />
                        <Button
                            btnName={"Loan Info"}
                            style={"bg-primary hover:bg-primary text-white font-medium py-2 px-4 rounded"}
                            btnIcon={"IoArrowForwardOutline"}
                            onClick={() => navigate('/loan/loan-details', {
                                state: { lead_id: selectedIds.lead_id, user_id: selectedIds?.user_id,loan_id:selectedIds?.loan_id }
                            })}
                        />
                    </div>


                </div>
            </Modal>
        </>
    );
};

export default ManageOverdue;

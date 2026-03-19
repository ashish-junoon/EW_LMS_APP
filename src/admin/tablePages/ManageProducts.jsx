import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { toast } from 'react-toastify';
import { GetLoanProductList } from '../../api/ApiFunction';
import LinkBtn from '../../components/utils/LinkBtn';
import Modal from '../../components/utils/Modal';
import { ProductStatusChange } from '../../api/ApiFunction';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet';
import LoginPageFinder from '../../components/utils/LoginPageFinder';

const ManageProducts = () => {
    const [tableData, setTableData] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { adminUser } = useAuth();

    const pageAccess = LoginPageFinder('page_display_name', 'manage products');
    const permission = pageAccess?.[0].read_write_permission;

    const handleProduct = (row) => {
        setSelectedProduct(row);
        setIsModal(true);
    }

    const handleStatus = async (row) => {
        setIsModal(false);
        const req = {
            is_active: !row.is_active,
            product_code: row.product_code,
            updated_by: adminUser.emp_code
        }

        try {
            const response = await ProductStatusChange(req);
            if (response.status) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        }

        window.location.reload();

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetLoanProductList();
                console.log("API Response:", response);

                if (response.status) {
                    const transformedData = response.getProductLists.map((user, index) => ({
                        ...user, // Keep all original fields
                        serialNumber: index + 1, // Add a serial number
                    }));

                    console.log("Transformed Data:", transformedData); // Debug log
                    setTableData(transformedData);
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
            name: 'P_Code',
            selector: row => row.product_code,
            sortable: true,
            width: '100px',
            cell: row => {
                return (
                    <button
                        onClick={() => handleProduct(row)}
                        className='text-primary font-bold text-[10px] px-2 italic hover:underline hover:underline-offset-5'
                    >
                        {row.product_code}
                    </button>
                );
            }

        },
        {
            name: 'Product Name',
            selector: row => row.product_name,
            sortable: true,
            width: '180px'
        },
        {
            name: 'Product Type',
            selector: row => row.product_type,
            sortable: true
        },
        {
            name: 'Loan Amount',
            selector: row => row.loan_amount,
            sortable: true
        },
        {
            name: 'Tenure',
            selector: row => row.tenure
        },
        {
            name: 'Interest',
            selector: row => `${row.interest_rate}%`,
        },
        {
            name: 'Frequency',
            selector: row => row.repayment_frequency,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.is_active,
            sortable: true,
            width: '100px',
            cell: row => {
                if (row.is_active === true) {
                    return (
                        <span className="text-success font-bold text-[10px] border border-primary px-4 py-0.5 rounded-full shadow-md italic">
                            Active
                        </span>
                    );
                } else {
                    return (
                        <span className="text-danger font-bold text-[10px] border border-danger px-3 py-0.5 rounded-full shadow-md italic">
                            Inactive
                        </span>
                    );
                }
            }

        }
    ];


    // Debug log for render
    console.log("Current tableData:", tableData);

    return (
        <>
            <Helmet>
                <title>Manage Products </title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>
            <div className="border border-gray-200 shadow px-5 py-2 mb-5 bg-blue-50 rounded">
                <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col justify-start">
                        <h1 className="text-lg font-bold text-black">Product Management</h1>
                        <p className="text-xs font-light text-secondary">Manage & Control Product</p>
                    </div>
                    <div className="flex justify-end py-2">
                        {permission && (
                            <LinkBtn
                                linkName={"Add Product"}
                                linkUrl={'/admin/add-product'}
                                icon={"MdOutlineAdd"}
                                className={"bg-primary text-white"}
                            />
                        )}

                    </div>
                </div>
            </div>
            {Array.isArray(tableData) && tableData.length > 0 ? (
                <div className='mt-8 w-11/12'>
                    <div className='flex justify-center items-center'>
                        <Table columns={columnsData} data={tableData} title="Products" />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p>No data available</p>
                </div>
            )}

            {/* Product details modal */}
            <Modal
                isOpen={isModal}
                onClose={() => setIsModal(false)}
                heading={"Product Details"}
            >
                {selectedProduct && (
                    <div className="space-y-4">

                        <div className='flex justify-between items-center'>
                            <div className="mb-4">
                                <h3 className="text-lg font-bold">{selectedProduct.product_name}</h3>
                                <div className="text-xs text-gray-500">Product Code: {selectedProduct.product_code}</div>
                            </div>
                            <div className="p-2 text-sm font-semibold">
                                Status:
                                {selectedProduct.is_active ? (
                                    <span className="text-success font-bold text-base ml-2">Active</span>
                                ) : (
                                    <span className="text-danger font-bold text-base ml-2">Inactive</span>
                                )}
                            </div>

                        </div>


                        {/* Excel-style table */}
                        <div className="border border-gray-300 rounded overflow-hidden">
                            {/* Row 1 */}
                            <div className="grid grid-cols-4 border-b border-gray-300">
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm border-r border-gray-300">Loan Amount</div>
                                <div className="p-2 text-sm font-bold border-r border-gray-300">{selectedProduct.loan_amount}</div>
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">Tenure</div>
                                <div className="p-2 text-sm font-semibold">{selectedProduct.tenure}</div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-4 border-b border-gray-300">
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">Interest Rate</div>
                                <div className="p-2 text-sm font-semibold border-r border-gray-300">{selectedProduct.interest_rate}%</div>
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">Interest Type</div>
                                <div className="p-2 text-sm font-semibold">{selectedProduct.interest_type}</div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-4 border-b border-gray-300">
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">Product Type</div>
                                <div className="p-2 text-sm font-semibold border-r border-gray-300">{selectedProduct.product_type}</div>
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">Frequency</div>
                                <div className="p-2 text-sm font-semibold">{selectedProduct.repayment_frequency}</div>
                            </div>
                            {/* Row 4 */}
                            <div className="grid grid-cols-4 border-b border-gray-300">
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">Processing Fee</div>
                                <div className="p-2 text-sm font-semibold border-r border-gray-300">{selectedProduct.processing_fee}%</div>
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">Insurance</div>
                                <div className="p-2 text-sm font-semibold">
                                    {selectedProduct.insurance_rate}%
                                </div>
                            </div>


                            {/* Row 5  */}
                            <div className="grid grid-cols-4 border-b border-gray-300">
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">IRR</div>
                                <div className="p-2 text-sm font-semibold border-r border-gray-300">{selectedProduct.irr}%</div>
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">APR</div>
                                <div className="p-2 text-sm font-semibold">{selectedProduct.apr}%</div>
                            </div>

                            {/* Row 6 */}
                            <div className="grid grid-cols-4">
                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">EIR</div>
                                <div className="p-2 text-sm font-semibold border-r border-gray-300">{selectedProduct.eir}%</div>

                                <div className="p-2 bg-gray-50 text-gray-800 text-sm  border-r border-gray-300">GST</div>
                                <div className="p-2 text-sm font-semibold">
                                    {parseFloat(selectedProduct.cgst) + parseFloat(selectedProduct.sgst) + parseFloat(selectedProduct.igst)}%
                                </div>
                            </div>
                        </div>

                        <div className='mt-5 flex justify-end gap-5'>
                            <div>
                                {selectedProduct.is_active && (
                                    <button
                                        className='px-4 py-1 shadow border border-danger bg-red-50 text-danger rounded-full text-xs font-bold'
                                        onClick={() => handleStatus(selectedProduct)}
                                    >
                                        Set Inactive
                                    </button>
                                )}

                                {permission && !selectedProduct.is_active && (
                                    <div>
                                        <button
                                            className='px-6 py-1 shadow border border-success bg-green-50 text-success rounded-full text-xs font-bold'
                                            onClick={() => handleStatus(selectedProduct)}
                                        >
                                            Set Active
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <button
                                    className='px-8 py-1 shadow border border-black bg-gray-50 text-black rounded-full text-xs font-bold'
                                    onClick={() => setIsModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ManageProducts;
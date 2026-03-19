import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { MultiSelect } from "react-multi-select-component";
import Button from "../utils/Button";
import { useNavigate } from "react-router-dom";
import Card from "../utils/Card";
import Icon from "../utils/Icon";
import { GetLoanProductList, AssignLoanProducts, AddPaydayLoanProducts, UpdateUserLead } from "../../api/ApiFunction";
import Modal from "../utils/Modal";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SelectInput from "../fields/SelectInput";
import TextInput from "../fields/TextInput";
import { assessmentRemarks } from "../content/Data";
import DateInput from "../fields/DateInput";
import ErrorMsg from "../utils/ErrorMsg";
import LoginPageFinder from "../utils/LoginPageFinder";


function OfferLoan({btnEnable = false}) {

    const [loanOptions, setLoanOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loanProduct, setLoanProduct] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [openApporve, setOpenApporve] = useState(false);
    const [paydayProduct, setPaydayProduct] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirm, setisConfirm] = useState(false);
    const [isPayday, setIsPayday] = useState(false);
    const [openRejcet, setOpenRejcet] = useState(false);
    const navigate = useNavigate();
    const { leadInfo } = useOpenLeadContext();
    const { adminUser } = useAuth();

    const today = dayjs();
    const maxTenureDate = today.add(45, 'day');
    const minTenureDate = today.add(7, 'day');

    const pageAccess = LoginPageFinder('page_display_name', 'credit assessment');
    const permission = pageAccess?.[0].read_write_permission;

    // alert(JSON.stringify(pageAccess));

    // Fetch loan products and set options for MultiSelect
    useEffect(() => {
        const fetchLoanProduct = async () => {
            try {
                const response = await GetLoanProductList();
                if (response && response.getProductLists) {
                    setLoanProduct(response.getProductLists);
                    const options = response.getProductLists.map((product) => ({
                        label: `${product.product_name} (${product.product_code})`,
                        value: product.product_code,
                    }));
                    setLoanOptions(options);
                }
            } catch (error) {
                console.error("Error fetching loan products:", error);
            }
        };
        fetchLoanProduct();
    }, []);

    const formik = useFormik({
        initialValues: {
            reason: '',
            remarks: ''
        },
        validationSchema: Yup.object({
            reason: Yup.string().required('Required'),
            remarks: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            const req = {
                lead_id: leadInfo.lead_id,
                step_status: 7, //Rejected status
                is_prove: false,
                updated_by: adminUser.emp_code,
                reason: formik.values.reason,
                remarks: formik.values.remarks
            };

            confirmLead(req);
            setOpenRejcet(!openRejcet);
        },
    });

    // Handle selection changes in MultiSelect
    const handleChange = (selectedOptions) => {
        setSelected(selectedOptions);
        const selectedCodes = selectedOptions.map((option) => option.value);
        const filteredLoans = loanProduct.filter((loan) =>
            selectedCodes.includes(loan.product_code)
        );
        setSearchResults(filteredLoans);
    };

    const confirmLead = async (req) => {
        try {
            const response = await UpdateUserLead(req);

            if (response.status) {
                toast.success(response.message);
                navigate("/manage-leads/credit-assessment");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        }
    };

    // handle Approve confirm Yes button
    const handleApproveYes = () => {
        const req = {
            lead_id: leadInfo.lead_id,
            step_status: 4,
            is_prove: true,
            updated_by: adminUser.emp_code,
            reason: "Credit Approved ",
            remarks: "Credit assessed & loan offered, forwarded for eKYC."

        };

        confirmLead(req);
        setOpenApporve(false);
    };


    // handle Reject lead No button
    const handleRejectNo = () => {
        setOpenRejcet(!openRejcet);
    };

    //Handle Assgin Loan Products
    const handleAssignLoan = async (productCode) => {
        const product_code_value =
            productCode?.trim?.() ||
            (selected?.length > 0 ? selected.map(option => option.value).join(',') : '');


        const req = {
            user_id: leadInfo.user_id,
            lead_id: leadInfo.lead_id,
            product_code: product_code_value,
            updated_by: adminUser.emp_code
        };

        try {
            const response = await AssignLoanProducts(req);
            if (response.status) {
                handleApproveYes();
            } else {
                toast.error(response.message);
            }
            navigate("/manage-leads/credit-assessment");
        } catch (error) {
            console.error("Error assigning loan:", error);
        }
    };


    //handle Approve confirm No button
    const handleApproveNo = () => {
        setOpenApporve(!openApporve);
    }



    // alert(today.toDate());


    const addProduct = useFormik({
        initialValues: {
            loanAmount: '',
            tenure: '',
            interestRate: '',
            interestType: '',
            processFee: '',
            cgst: "9",
            sgst: "9",
            igst: "0",
            irr: "0",
            apr: "0",
            eir: "0",
            insurance: '0'
        },
        validationSchema: Yup.object({
            loanAmount: Yup.number()
                .required('Required')
                .min(1000, 'Minimum amount ₹1,000')
                .max(9000000, 'Maximum amount ₹9000000'),

            tenure: Yup.date()
                .required('Required')
                .min(minTenureDate.toDate(), 'Minimum Tenure 7 days')
                .max(maxTenureDate.toDate(), 'Maximum Tenure 45 days'),

            interestRate: Yup.number()
                .required('Required')
                .min(0.1, 'Minimum interest rate 0.1%')
                .max(1, 'Maximum interest rate 1%'),

            insurance: Yup.number()
                .required('Required')
                .min(0, 'Minimum premium 0%')
                .max(10, 'Maximum premium 10%'),

            interestType: Yup.string().required('Required'),

            processFee: Yup.number()
                .required('Required')
                .min(1, 'Minimum processing fee 1%')
                .max(15, 'Maximum processing fee 15%'),

            cgst: Yup.number()
                .max(15, 'CGST must not exceed 15%'),

            sgst: Yup.number()
                .max(15, 'SGST must not exceed 15%'),

            igst: Yup.number()
                .max(15, 'IGST must not exceed 15%'),

            irr: Yup.number()
                .max(15, 'IRR must not exceed 15%'),

            apr: Yup.number()
                .max(15, 'APR must not exceed 15%'),

            // eir: Yup.number()
            //     .max(15, 'EIR must not exceed 15%'),
        }),
        

        onSubmit: async (values, { setSubmitting }) => {
            if(!isConfirm){
                setisConfirm(true);
                return;
            }
            setisConfirm(false);
            setIsPayday(true);

            // Check if CIBIL score is missing
            if (!leadInfo?.cibilCreditScores || leadInfo.cibilCreditScores.length === 0) {
                toast.error("Please get CIBIL score first.");
                setSubmitting(false);
                setIsPayday(false);
                return;
            }

            try {
                const userRequest = {
                    loan_amount: values?.loanAmount,
                    repayment_date: values?.tenure,
                    interest_rate: values?.interestRate,
                    interest_type: values?.interestType,
                    processing_fee: values?.processFee,
                    insurance_rate: values?.insurance,
                    cgst: values?.cgst,
                    sgst: values?.sgst,
                    igst: values?.igst,
                    irr: values?.irr,
                    apr: values?.apr,
                    eir: values?.eir,
                    created_by: adminUser.emp_code
                };

                const response = await AddPaydayLoanProducts(userRequest);

                if (response.status) {
                    // toast.success(response.message);
                    if (response.product_code) {
                        setPaydayProduct(response.product_code);
                        handleAssignLoan(response.product_code); // pass directly!
                    } else {
                        toast.error("Product code not found.");
                    }
                }

            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("Error updating employment info:", error);
            } finally {
                setSubmitting(false);
                setIsOpen(false);
            }
        }

    });

    // alert(paydayProduct);

    const renderError = (field) =>
        addProduct.touched[field] && addProduct.errors[field] ? (
            <div className="text-red-500 text-sm">{addProduct.errors[field]}</div>
        ) : null;


    return (
        <div className="">
            <div className="w-full bg-light text-black border border-light px-5 py-0.5 rounded-t-md">
                <h2 className="font-semibold">Assign Loan Products</h2>
            </div>

            <div className="flex items-center justify-end mt-5">
                {permission && (
                    <Button
                        btnName={"Create Payday Product"}
                        btnIcon={"IoCloseCircleOutline"}
                        type={"IoCheckmarkCircleSharp"}
                        onClick={() => setIsOpen(true)}
                        disabled={btnEnable}
                        style="min-w-[150px] max-lg:w-full text-sm italic font-semibold md:w-auto my-4 py-1 max-lg:py-3 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success"
                    />
                )}

            </div>

            <div className="px-5">
                {/* {!isPayday && (
                    <>
                        <div className="my-5">
                            {permission && (
                                <MultiSelect
                                    options={loanOptions}
                                    value={selected}
                                    onChange={handleChange}
                                    labelledBy="Select Loan Product"
                                />
                            )}

                        </div>


                        Selected Loan Products Card
                        <div className="">
                            <div className="grid grid-cols-3 gap-8 my-5">
                                {searchResults.length > 0 ? (
                                    searchResults.map((loan) => (
                                        <Card
                                            key={loan.product_code}
                                            icon={"GiMoneyStack"}
                                            heading={`${loan.product_name} - ₹${loan.loan_amount}`}
                                            style={"p-5"}
                                        >
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <div className="text-xs italic text-dark font-semibold">
                                                        Loan Amount
                                                    </div>
                                                    <div className="flex items-center text-sm font-bold">
                                                        <Icon
                                                            name={"MdCurrencyRupee"}
                                                            size={14}
                                                        />
                                                        {loan.loan_amount}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs italic text-dark font-semibold">
                                                        Loan Tenure
                                                    </div>
                                                    <div className="text-xs font-bold">
                                                        {loan.tenure}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs italic text-dark font-semibold">
                                                        Interest Rate
                                                    </div>
                                                    <div className="text-sm font-bold">
                                                        {loan.interest_rate}%
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs italic text-dark font-semibold">
                                                        Processing Fee
                                                    </div>
                                                    <div className="text-sm font-bold">
                                                        {loan.processing_fee}%
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs italic text-dark font-semibold">
                                                        CGST
                                                    </div>
                                                    <div className="text-sm font-bold">
                                                        {loan.cgst}%
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs italic text-dark font-semibold">
                                                        SGST
                                                    </div>
                                                    <div className="text-sm font-bold">
                                                        {loan.sgst}%
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="col-span-3 text-center text-sm italic">
                                        No loan products selected.
                                    </p>
                                )}
                            </div>
                        </div>.
                    </>
                )} */}


                {/* Approve Button */}
                {permission && (
                    <div className='flex justify-end gap-5'>
                        {searchResults.length >= 1 && (
                            <Button
                                btnName={"Mark as Approved"}
                                btnIcon={"IoCloseCircleOutline"}
                                type={"IoCheckmarkCircleSharp"}
                                onClick={() => setOpenApporve(true)}
                                style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                            />
                        )}

                        <Button
                            btnName={"Mark as Rejected"}
                            btnIcon={"IoCloseCircleOutline"}
                            type={""}
                            disabled={btnEnable}
                            onClick={() => setOpenRejcet(true)}
                            style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                        />
                    </div>
                )}
            </div>

            {/* Approve Modal */}
            <Modal
                isOpen={openApporve}
                onClose={() => setOpenApporve(false)}
            >
                <div className='text-center font-semibold'>
                    <h1>Are you sure you want to approve?</h1>
                </div>
                <div className="flex justify-end gap-4 mt-2">
                    <Button
                        btnName="YES"
                        btnIcon="IoCheckmarkCircleSharp"
                        type="submit"
                        onClick={handleAssignLoan}
                        style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                    />
                    <Button
                        btnName={"NO"}
                        btnIcon={"IoCloseCircleOutline"}
                        type={"button"}
                        onClick={handleApproveNo}
                        style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                    />
                </div>

            </Modal>
            {/* Reject Modal */}
            <Modal
                isOpen={openRejcet}
                onClose={() => setOpenRejcet(false)}
                heading={"Reject Lead"}
            >
                <div className='px-5'>
                    <form onSubmit={formik.handleSubmit} className='my-4'>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <SelectInput
                                    label="Rejection Reason"
                                    placeholder="Select"
                                    icon="RiDraftLine"
                                    name="reason"
                                    id="reason"
                                    options={assessmentRemarks}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.reason}
                                />
                                {formik.touched.reason && formik.errors.reason && (
                                    <ErrorMsg error={formik.errors.reason} />
                                )}
                            </div>
                            <div className="col-span-2">
                                <TextInput
                                    label="Remarks"
                                    icon="GoPencil"
                                    placeholder="Write Remarks"
                                    name="remarks"
                                    id="remarks"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.remarks}
                                />
                                {formik.touched.remarks && formik.errors.remarks && (
                                    <ErrorMsg error={formik.errors.remarks} />
                                )}
                            </div>


                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                            <Button
                                btnName="Reject"
                                btnIcon="IoCheckmarkCircleSharp"
                                type="submit"
                                style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                            />
                            <Button
                                btnName={"Cancel"}
                                btnIcon={"IoCloseCircleOutline"}
                                type={"button"}
                                onClick={handleRejectNo}
                                style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                            />
                        </div>

                    </form>

                </div>

            </Modal>

            {/* Create Payday Loan Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >

                <div className="w-full px-5 py-4">
                    {isConfirm && <p className="text-danger text-2xl font-bold mb-5">Please Confirm Details before Approving!</p>}
                    <form onSubmit={addProduct.handleSubmit}>
                        <div className="grid grid-cols-3 gap-3">

                            <div className="col-span-1">
                                <TextInput
                                    label="Loan Amount"
                                    icon="RiMoneyRupeeCircleLine"
                                    placeholder="Enter Amount"
                                    name="loanAmount"
                                    maxLength={7}
                                    type="text"
                                    {...addProduct.getFieldProps("loanAmount")}
                                />
                                {renderError("loanAmount")}
                            </div>

                            <div className="col-span-1">
                                <TextInput
                                    label="Interest Rate"
                                    icon="MdOutlinePercent"
                                    placeholder="Enter Interest Rate"
                                    name="interestRate"
                                    maxLength={4}
                                    type="text"
                                    {...addProduct.getFieldProps("interestRate")}
                                />
                                {renderError("interestRate")}
                            </div>

                            <div className="col-span-1">
                                <SelectInput
                                    label="Interest Type"
                                    icon="RiBillLine"
                                    name="interestType"
                                    placeholder="Select"
                                    options={[
                                        { label: "Reducing", value: "reducing" },
                                        { label: "Fixed", value: "fixed" },
                                        { label: "Floating", value: "floating" },
                                    ]}
                                    {...addProduct.getFieldProps("interestType")}
                                />
                                {renderError("interestType")}
                            </div>

                            <div className="col-span-1">
                                <DateInput
                                    label="Repayment Date"
                                    placeholder="DD-MM-YYYY"
                                    name="tenure"
                                    id="tenure"
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={addProduct.handleChange}
                                    onBlur={addProduct.handleBlur}
                                    value={addProduct.values.tenure}
                                />
                                {renderError("tenure")}
                            </div>

                            <div className="col-span-1">
                                <TextInput
                                    label="Proccessing Fee (%)"
                                    icon="CiPercent"
                                    placeholder="Proccesing Fee"
                                    name="processFee"
                                    type="text"
                                    maxLength={4}
                                    {...addProduct.getFieldProps("processFee")}
                                />
                                {renderError("processFee")}
                            </div>

                            <div className="col-span-1 hidden">
                                <TextInput
                                disabled={true}
                                    label="Insurance (%)"
                                    icon="CiPercent"
                                    placeholder="Enter Insurance"
                                    name="insurance"
                                    maxLength={4}
                                    type="text"
                                    {...addProduct.getFieldProps("insurance")}
                                />
                                {renderError("insurance")}
                            </div>

                            <div className="col-span-1">
                                <TextInput
                                    label="CGST (%)"
                                    icon="CiPercent"
                                    placeholder="Enter CGST"
                                    disabled
                                    name="cgst"
                                    type="text"
                                    maxLength={3}
                                    {...addProduct.getFieldProps("cgst")}
                                />
                                {renderError("cgst")}
                            </div>
                            <div className="col-span-1">
                                <TextInput
                                    label="SGST (%)"
                                    icon="CiPercent"
                                    placeholder="Enter SGST"
                                    disabled
                                    name="sgst"
                                    type="text"
                                    maxLength={3}
                                    {...addProduct.getFieldProps("sgst")}
                                />
                                {renderError("sgst")}
                            </div>
                            <div className="col-span-1 hidden">
                                <TextInput
                                    label="IGST (%)"
                                    icon="CiPercent"
                                    disabled
                                    placeholder="Enter IGST"
                                    name="igst"
                                    type="text"
                                    maxLength={3}
                                    {...addProduct.getFieldProps("igst")}
                                />
                                {renderError("igst")}
                            </div>
                            <div className="col-span-1 hidden">
                                <TextInput
                                    label="IRR (%)"
                                    icon="CiPercent"
                                    placeholder="Enter IRR"
                                    name="irr"
                                    disabled
                                    maxLength={3}
                                    type="text"
                                    {...addProduct.getFieldProps("irr")}
                                />
                                {renderError("irr")}
                            </div>
                            <div className="col-span-1 hidden">
                                <TextInput
                                    label="APR (%)"
                                    icon="CiPercent"
                                    placeholder="Enter APR"
                                    disabled
                                    name="apr"
                                    maxLength={3}
                                    type="text"
                                    {...addProduct.getFieldProps("apr")}
                                />
                                {renderError("apr")}
                            </div>
                            <div className="col-span-1 hidden">
                                <TextInput
                                    label="EIR (%)"
                                    icon="CiPercent"
                                    placeholder="Enter EIR"
                                    name="eir"
                                    disabled
                                    maxLength={3}
                                    type="text"
                                    {...addProduct.getFieldProps("eir")}
                                />
                                {renderError("eir")}
                            </div>

                        </div>


                        <div className="flex justify-end mt-5 gap-5">
                            <Button
                                btnName="Close"
                                btnIcon="IoCloseCircleOutline"
                                onClick={() => setIsOpen(false)}
                                style="mt-5 border border-red-500 text-red-500 min-w-32"
                            />
                            
                            {isConfirm ? (
                            <Button
                                btnName="Approve"
                                btnIcon="IoAddCircleSharp"
                                type="submit"
                                style="mt-5 bg-primary text-white min-w-32"
                            />) : (
                                <Button
                                btnName="Assign"
                                btnIcon="IoCloseCircleOutline"
                                type="submit"
                                style="mt-5 bg-primary text-white min-w-32"
                            />
                            )}

                            {/* <Button
                                btnName="Assign & Approve"
                                btnIcon="IoAddCircleSharp"
                                type="submit"
                                style="mt-5 bg-primary text-white min-w-32"
                            /> */}
                        </div>
                    </form>
                </div>
            </Modal>

        </div>

    )
}
export default OfferLoan
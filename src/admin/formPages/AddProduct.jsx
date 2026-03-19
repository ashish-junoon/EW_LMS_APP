import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Card from "../../components/utils/Card"
import SelectInput from "../../components/fields/SelectInput";
import TextInput from "../../components/fields/TextInput";
import Button from "../../components/utils/Button";
import { AddLoanProduct } from "../../api/ApiFunction";
import { interestType, loanTenure, productType, repaymentFrequency } from "../../components/content/Data";
import ErrorMsg from "../../components/utils/ErrorMsg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from "react-helmet";


function AddProduct() {

    const { adminUser } = useAuth()
    const navigate = useNavigate();


    useEffect(() => {
        const allGroups = adminUser?.loginGroupNames || [];

        // Flatten all login pages across groups
        const allLoginPages = allGroups.flatMap(group => group.loginpageNames || []);

        const hasAccessToPageId3 = allLoginPages.some(page => page.page_id === 12);

        if (!hasAccessToPageId3) {
            navigate("/");
        }
    }, [adminUser]);


    const formik = useFormik({
        initialValues: {
            productName: '',
            productType: '',
            frequency: '',
            loanAmount: '',
            tenure: '',
            interestRate: '',
            interestType: '',
            processFee: '',
            cgst: '',
            sgst: '',
            igst: '',
            irr: '',
            apr: '',
            eir: '',
            // insurance: ''
        },
        validationSchema: Yup.object({
            productName: Yup.string().required("Required"),
            productType: Yup.string().required("Required"),
            frequency: Yup.string().required("Required"),
            loanAmount: Yup.number().required("Required"),
            tenure: Yup.string().required("Required"),
            interestRate: Yup.number().required("Required"),
            interestType: Yup.string().required("Required"),
            processFee: Yup.number().required("Required"),
            cgst: Yup.number().required("Required"),
            sgst: Yup.number().required("Required"),
            igst: Yup.number().required("Required"),
            irr: Yup.number().required("Required"),
            apr: Yup.number().required("Required"),
            eir: Yup.number().required("Required"),
            // insurance: Yup.string().required("Required")
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const userRequest = {
                    product_name: values?.productName,
                    product_type: values?.productType,
                    loan_amount: values?.loanAmount,
                    processing_fee: values?.processFee,
                    interest_rate: values?.interestRate,
                    interest_type: values?.interestType,
                    cgst: values?.cgst,
                    sgst: values?.sgst,
                    igst: values?.igst,
                    tenure: values?.tenure,
                    repayment_frequency: values?.frequency,
                    irr: values?.irr,
                    apr: values?.apr,
                    eir: values?.eir,
                    is_active: false,
                    created_by: adminUser.emp_code
                };

                const response = await AddLoanProduct(userRequest);

                if (response.status) {
                    toast.success(response.message);
                    navigate("/admin/manage-products")
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("Error updating employment info:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const renderError = (field) =>
        formik.touched[field] && formik.errors[field] ? (
            <ErrorMsg error={formik.errors[field]} />
        ) : null;

    return (
        <>
            <Helmet>
                <title>Add Product</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="w-full xl:w-9/12 m-auto">
                <Card heading={"Add Product"}>
                    <div className="px-2 md:px-8 py-5">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div className="col-span-1">
                                    <TextInput
                                        label="Product Name"
                                        icon="MdDriveFileRenameOutline"
                                        placeholder="Enter Product Name"
                                        name="productName"
                                        type="text"
                                        {...formik.getFieldProps("productName")}
                                    />
                                    {renderError("productName")}
                                </div>

                                <div className="col-span-1">
                                    <SelectInput
                                        label="Product Type"
                                        icon="RiBillLine"
                                        name="productType"
                                        placeholder="Select"
                                        options={productType}
                                        {...formik.getFieldProps("productType")}
                                    />
                                    {renderError("productType")}
                                </div>
                                <div className="col-span-1">
                                    <SelectInput
                                        label="Repayment Frequency"
                                        icon="PiWaveformThin"
                                        name="frequency"
                                        placeholder="Select"
                                        options={repaymentFrequency}
                                        {...formik.getFieldProps("frequency")}
                                    />
                                    {renderError("frequency")}
                                </div>
                                <div className="col-span-1">
                                    <TextInput
                                        label="Loan Amount"
                                        icon="RiMoneyRupeeCircleLine"
                                        placeholder="Enter Amount"
                                        name="loanAmount"
                                        type="text"
                                        {...formik.getFieldProps("loanAmount")}
                                    />
                                    {renderError("loanAmount")}
                                </div>
                                <div className="col-span-1">
                                    <SelectInput
                                        label="Tenure"
                                        icon="IoTimeOutline"
                                        name="tenure"
                                        placeholder="Select"
                                        options={loanTenure}
                                        {...formik.getFieldProps("tenure")}
                                    />
                                    {renderError("tenure")}
                                </div>

                                <div className="col-span-1">
                                    <TextInput
                                        label="Interest Rate"
                                        icon="MdOutlinePercent"
                                        placeholder="Enter Interest Rate"
                                        name="interestRate"
                                        type="text"
                                        {...formik.getFieldProps("interestRate")}
                                    />
                                    {renderError("interestRate")}
                                </div>
                                <div className="col-span-1">
                                    <SelectInput
                                        label="Interest Type"
                                        icon="RiBillLine"
                                        name="interestType"
                                        placeholder="Select"
                                        options={interestType}
                                        {...formik.getFieldProps("interestType")}
                                    />
                                    {renderError("interestType")}
                                </div>

                                <div className="col-span-1">
                                    <TextInput
                                        label="Proccessing Fee (%)"
                                        icon="CiPercent"
                                        placeholder="Proccesing Fee"
                                        name="processFee"
                                        type="text"
                                        {...formik.getFieldProps("processFee")}
                                    />
                                    {renderError("processFee")}
                                </div>
                                <div className="col-span-1">
                                    <TextInput
                                        label="CGST (%)"
                                        icon="CiPercent"
                                        placeholder="Enter CGST"
                                        name="cgst"
                                        type="text"
                                        {...formik.getFieldProps("cgst")}
                                    />
                                    {renderError("cgst")}
                                </div>
                                <div className="col-span-1">
                                    <TextInput
                                        label="SGST (%)"
                                        icon="CiPercent"
                                        placeholder="Enter SGST"
                                        name="sgst"
                                        type="text"
                                        {...formik.getFieldProps("sgst")}
                                    />
                                    {renderError("sgst")}
                                </div>
                                <div className="col-span-1">
                                    <TextInput
                                        label="IGST (%)"
                                        icon="CiPercent"
                                        placeholder="Enter IGST"
                                        name="igst"
                                        type="text"
                                        {...formik.getFieldProps("igst")}
                                    />
                                    {renderError("igst")}
                                </div>
                                <div className="col-span-1">
                                    <TextInput
                                        label="IRR (%)"
                                        icon="CiPercent"
                                        placeholder="Enter IRR"
                                        name="irr"
                                        type="text"
                                        {...formik.getFieldProps("irr")}
                                    />
                                    {renderError("irr")}
                                </div>
                                <div className="col-span-1">
                                    <TextInput
                                        label="APR (%)"
                                        icon="CiPercent"
                                        placeholder="Enter APR"
                                        name="apr"
                                        type="text"
                                        {...formik.getFieldProps("apr")}
                                    />
                                    {renderError("apr")}
                                </div>
                                <div className="col-span-1">
                                    <TextInput
                                        label="EIR (%)"
                                        icon="CiPercent"
                                        placeholder="Enter EIR"
                                        name="eir"
                                        type="text"
                                        {...formik.getFieldProps("eir")}
                                    />
                                    {renderError("eir")}
                                </div>
                                {/* <div className="col-span-1">
                                <TextInput
                                    label="Insurance (%)"
                                    icon="CiPercent"
                                    placeholder="Enter Insurance"
                                    name="insurance"
                                    type="text"
                                    {...formik.getFieldProps("insurance")}
                                />
                                {renderError("insurance")}
                            </div> */}
                            </div>


                            <div className="flex justify-center">
                                <Button
                                    btnName="Add Product"
                                    btnIcon="IoAddCircleSharp"
                                    type="submit"
                                    style="mt-5 bg-primary text-white min-w-44"
                                />
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </>
    )
}
export default AddProduct
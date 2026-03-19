import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../components/utils/Card";
import ErrorMsg from "../../components/utils/ErrorMsg";
import SelectInput from "../../components/fields/SelectInput";
import TextInput from "../../components/fields/TextInput";
import { GetBankList, AddCompanyBankAcount } from "../../api/ApiFunction";
import Button from "../../components/utils/Button";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from "react-helmet";
// import {bankListData} from "../../components/content/Data"

function AddBankAccount() {


    const [bankList, setBankList] = useState([]);

    const navigate = useNavigate();
    const { adminUser } = useAuth();

    useEffect(() => {
        const allGroups = adminUser?.loginGroupNames || [];

        // Flatten all login pages across groups
        const allLoginPages = allGroups.flatMap(group => group.loginpageNames || []);

        const hasAccessToPageId3 = allLoginPages.some(page => page.page_id === 15);

        if (!hasAccessToPageId3) {
            navigate("/");
        }
    }, [adminUser]);


    // Fetch States on component mount
    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await GetBankList();
                setBankList(response.data);
            } catch (error) {
                console.error('Error fetching States:', error);
            }
        };
        fetchState();
    }, []);

    // Fetch Cities when state is selected


    const formik = useFormik({
        initialValues: {
            bankName: "",
            ifsc: "",
            accountNumber: "",
            confirmAccountNumber: "",
            branchName: ""
        },
        validationSchema: Yup.object({
            bankName: Yup.string().required("Required"),
            branchName: Yup.string()
                .required("Required")
                .min(2, "Must be 3 characters or more")
                .max(50, "Must be 50 characters or less"),
            ifsc: Yup.string()
                .required("Required")
                .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
            accountNumber: Yup.string()
                .required("Account Number is required")
                .matches(/^\d{8,18}$/, "Account Number must be between 8 to 18 digits"),

            confirmAccountNumber: Yup.string()
                .required("Confirm Account Number is required")
                .oneOf([Yup.ref("accountNumber"), null], "Account Numbers must match"),



        }),
        onSubmit: async (values) => {
            try {
                const request = {
                    bank_name: values.bankName,
                    ifsc_code: values.ifsc,
                    account_number: values.accountNumber,
                    branch_name: values.branchName,
                    company_id: import.meta.env.VITE_COMPANY_ID,
                    product_name: import.meta.env.VITE_PRODUCT_NAME,
                    created_by: adminUser.emp_code
                }
                const response = await AddCompanyBankAcount(request);
                if (response.status) {
                    toast.success(response.message);
                    navigate("/admin/manage-bank-account")
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
                console.error('Error updating employment info:', error);
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
                <title>Add Bank Account</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="container m-auto">
                <div className="flex justify-center items-center mt-10">
                    <div className="w-full xl:w-6/12">
                        <Card heading="Add Bank Account" style={"px-2 md:px-8 py-6"}>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="">
                                        <SelectInput
                                            label="Bank Name"
                                            icon="PiBankDuotone"
                                            name="bankName"
                                            placeholder="Select"
                                            options={bankList.map((city) => ({
                                                value: city.bank_name,
                                                label: city.bank_name
                                            }))}
                                            {...formik.getFieldProps('bankName')}
                                        />
                                        {renderError("bankName")}
                                    </div>
                                    <div className="col-span-1">
                                        <TextInput
                                            label="IFSC Code"
                                            icon="PiBankDuotone"
                                            placeholder="Enter Name"
                                            name="ifsc"
                                            maxLength={11}
                                            type="text"
                                            {...formik.getFieldProps("ifsc")}
                                        />
                                        {renderError("ifsc")}
                                    </div>
                                    <div className="col-span-1">
                                        <TextInput
                                            label="Account Number"
                                            icon="PiBankDuotone"
                                            placeholder="Enter Name"
                                            name="accountNumber"
                                            maxLength={18}
                                            type="text"
                                            {...formik.getFieldProps("accountNumber")}
                                        />
                                        {renderError("accountNumber")}
                                    </div>
                                    <div className="col-span-1">
                                        <TextInput
                                            label="Confirm Account Number"
                                            icon="PiBankDuotone"
                                            placeholder="Enter Name"
                                            name="confirmAccountNumber"
                                            maxLength={18}
                                            type="text"
                                            {...formik.getFieldProps("confirmAccountNumber")}
                                        />
                                        {renderError("confirmAccountNumber")}
                                    </div>
                                    <div className="col-span-2">
                                        <TextInput
                                            label="Branch"
                                            icon="RiMapPinLine"
                                            placeholder="Enter Address"
                                            name="branchName"
                                            maxLength={20}
                                            type="text"
                                            {...formik.getFieldProps("branchName")}
                                        />
                                        {renderError("branchName")}
                                    </div>
                                </div>


                                <div className="flex justify-center">
                                    <Button
                                        btnName="Add Account"
                                        btnIcon="IoAddCircleSharp"
                                        type="submit"
                                        style="mt-10 bg-primary text-white min-w-44"
                                    />
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddBankAccount
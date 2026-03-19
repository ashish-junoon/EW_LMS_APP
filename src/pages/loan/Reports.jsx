import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import SelectInput from "../../components/fields/SelectInput";
import ErrorMsg from "../../components/utils/ErrorMsg";
import DateInput from "../../components/fields/DateInput";
import { useAuth } from "../../context/AuthContext";

import {
    exportDataType,
    exportLeadSource,
    exportStatusSource,
    exportCollectionSource,
} from "../../components/content/Data";
import JsontoExcel from "../../components/utils/JsontoExcel";
import { GetDisbursementReport, GetRejectedReport, GetMasterReport, GetRecoveryReport } from "../../api/ApiFunction";
import { Loader2 } from "lucide-react";

function Reports() {
    const [isLoading, setIsLoading] = useState(false);
    const [sourceOptions, setSourceOptions] = useState([]);
    const [reportData, setReportData] = useState(null);

    const { adminUser } = useAuth();

    const formik = useFormik({
        initialValues: {
            fromDate: "",
            toDate: "",
            dataType: "",
        },
        validationSchema: Yup.object({
            fromDate: Yup.string().required("From date is required"),
            toDate: Yup.string()
                .required("To date is required")
                .test(
                    'is-greater-or-equal',
                    'To date must be equal to or greater than from date',
                    function (value) {
                        const { fromDate } = this.parent;
                        if (!fromDate || !value) return true; // Skip validation if either date is empty
                        return new Date(value) >= new Date(fromDate);
                    }
                )
                .test(
                    'max-90-days',
                    'Date range cannot exceed 3 months',
                    function (value) {
                        const { fromDate } = this.parent;
                        if (!fromDate || !value) return true; // Skip validation if either date is empty
                        const from = new Date(fromDate);
                        const to = new Date(value);
                        const diffInDays = (to - from) / (1000 * 60 * 60 * 24);
                        return diffInDays <= 92;
                    }
                ),
            dataType: Yup.string().required("Data Type is required"),
        }),
        onSubmit: async ({ fromDate, toDate, dataType }) => {
            setIsLoading(true);

            const req = {
                from_date: fromDate,
                to_date: toDate,
                login_employee: adminUser?.emp_code
            };

            try {
                let response;

                // Call different APIs based on the selected dataType
                switch (dataType) {
                    case 'rejected':
                        response = await GetRejectedReport(req);
                        break;
                    case 'disbursement':
                        response = await GetDisbursementReport(req);
                        break;
                    case 'master':
                        response = await GetMasterReport(req);
                        break;
                    case 'recovery':
                        response = await GetRecoveryReport(req);
                        break;
                    default:
                        toast.error("Invalid data type selected");
                        setIsLoading(false);
                        return;
                }

                // Handle the response
                if (response?.status) {
                    setIsLoading(false);
                    if (dataType === 'rejected') {
                        setReportData(response.rejectionReports || []);
                    } else if (dataType === 'disbursement') {
                        setReportData(response.disbursementReports || []);
                    } else if (dataType === 'master') {
                        setReportData(response._loanMasterData || []);
                    } else if (dataType === 'recovery') {
                        setReportData(response.RecoveryReports || []);
                    }
                } else {
                    toast.error(response?.message);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data.");
            }

            setIsLoading(false);
        }

    });




    // Update Source options based on selected Data Type
    useEffect(() => {
        // console.log("DataType changed:", formik.values.dataType); 

        // Clear source options if no dataType is selected
        if (!formik.values.dataType) {
            console.log("Clearing source options"); // Debug log
            setSourceOptions([]);
            formik.setFieldValue("source", "");
            return;
        }

        let newSourceOptions = [];
        switch (formik.values.dataType) {
            case "Lead":
                newSourceOptions = exportLeadSource;
                break;
            case "Loan":
                newSourceOptions = exportStatusSource;
                break;
            case "Collection":
                newSourceOptions = exportCollectionSource;
                break;
            default:
                newSourceOptions = [];
        }

        setSourceOptions(newSourceOptions);
        formik.setFieldValue("source", ""); // Reset source on dataType change
    }, [formik.values.dataType]);


    // Handle reset button click
    const handleReset = () => {
        formik.resetForm();
        setReportData(null);
    };

    return (
        <>
            <Helmet>
                <title>Reports</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <form onSubmit={formik.handleSubmit}>
                <span className="md:text-lg italic font-semibold bg-primary text-white rounded-t-lg px-5 py-1">Reports Summary </span>
                <div className="grid md:grid-cols-3 md:gap-5 border border-gray-200 p-4 md:p-8">
                    {/* Data Type */}
                    <div className="max-md:col-span-3">
                        <SelectInput
                            label="Data Type"
                            icon="RiDatabase2Line"
                            name="dataType"
                            id="dataType"
                            options={exportDataType}
                            placeholder="Select"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.dataType}
                        />
                        {formik.touched.dataType && formik.errors.dataType && (
                            <ErrorMsg error={formik.errors.dataType} />
                        )}
                    </div>
                    {/* From Date */}
                    <div className="max-md:col-span-3">
                        <DateInput
                            label="From Date"
                            name="fromDate"
                            id="fromDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.fromDate}
                        />
                        {formik.touched.fromDate && formik.errors.fromDate && (
                            <ErrorMsg error={formik.errors.fromDate} />
                        )}
                    </div>

                    {/* To Date */}
                    <div className="max-md:col-span-3">
                        <DateInput
                            label="To Date"
                            name="toDate"
                            id="toDate"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.toDate}
                        />
                        {formik.touched.toDate && formik.errors.toDate && (
                            <ErrorMsg error={formik.errors.toDate} />
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-3 flex justify-center items-center mt-4">
                        {reportData === null ? (
                            <button
                                type="submit"
                                className="border border-primary  text-primary items-center px-5 py-1 rounded shadow-sm hover:bg-primary hover:text-white transition duration-300 ease-in-out courser-pointer w-1/2 mx-auto font-semibold"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                ) : (
                                    "Generate Report"
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="border border-primary  text-primary items-center px-5 py-1 rounded shadow-sm hover:bg-primary hover:text-white transition duration-300 ease-in-out courser-pointer w-1/2 mx-auto font-semibold"
                            >
                                Reset Form
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <div className="">
                {reportData && reportData.length > 0 ? (
                    isLoading ? (
                        <div className="flex items-center justify-center">
                            <h1>Please wait...</h1>
                        </div>
                    ) : (
                        <div className="">
                            <JsontoExcel reportDetail={reportData} reportType={formik.values.dataType} />
                        </div>
                    )
                ) :
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-5">
                        <h3 className="font-medium text-blue-800">Information</h3>
                        <ul className="text-sm text-blue-600 mt-2 space-y-1">
                            <li>• Select a Data Type and Date Range to generate the report.</li>
                            <li>• Each Data Type provides a different summarized report.</li>
                            <li>• Summary reports tailored to business requirements can be downloaded.</li>
                        </ul>
                    </div>
                }
            </div>
        </>
    );
}

export default Reports;
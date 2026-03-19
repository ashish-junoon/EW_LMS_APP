import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ErrorMsg from '../../components/utils/ErrorMsg';
import SelectInput from '../../components/fields/SelectInput';
import DateInput from '../../components/fields/DateInput';
import JsontoExcel from '../../components/utils/JsontoExcel';
import { DisbursmentCollectionReport } from '../../api/ApiFunction';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DisbursementCollectionReport = () => {
    // Data type options
    const { adminUser } = useAuth();
    const exportDataType = [
        { value: 'Lead', label: 'Lead' },
        { value: 'Loan', label: 'Loan' },
        { value: 'Collection', label: 'Collection' }
    ];

    // Data source options based on data type
    const dataSourceOptions = {
        Lead: [
            { value: '0', label: 'Incomplete' },
            { value: '1', label: 'New Leads' },
            { value: '2', label: 'In-Process' },
            { value: '3', label: 'Assessment' },
            { value: '4', label: 'Under KYC' },
            { value: '5', label: 'Disbursment' },
            { value: '7', label: 'Rejected' }
        ],
        Loan: [
            { value: '1', label: 'Active' },
            { value: '10', label: 'Closed' },
            { value: '11', label: 'Foreclosure' },
            { value: '15', label: 'Settled' },
            { value: '22', label: 'Due' },
            { value: '23', label: 'Overdue' }
        ],
        Collection: [
            { value: '30', label: '0 to 30 Days' },
            { value: '60', label: '31 to 60 Days' },
            { value: '90', label: '61 to 90 Days' },
            { value: '91', label: 'More than 90 Days' }
        ]
    };

    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const formik = useFormik({
        initialValues: {
            fromDate: "",
            toDate: "",
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
                ),

        }),
        onSubmit: async ({ fromDate, toDate, dataType, source }) => {
            setIsLoading(true);
            const req = {
                from_date: fromDate,
                to_date: toDate,
                login_user:adminUser?.emp_code
            };

            try {
                const response = await DisbursmentCollectionReport(req);
                if (response.status) {
                    setIsLoading(false);
                    // setReportData(formatKey(response.CICReports));
                    const formattedReports = response.completeReports.map((item) => {
                        const formattedItem = {};
                        Object.entries(item).forEach(([key, value]) => {
                        formattedItem[formatKey(key)] = value;
                        });
                        return formattedItem;
                    });

                    setReportData(formattedReports);
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data.");
            }
            setIsLoading(false);
        },
    });

    const formatKey = (key) => {
        return key
            // insert space before capital letters
            .replace(/([A-Z])/g, " $1")
            // capitalize first letter
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };
    // Handle reset button click
    const handleReset = () => {
        formik.resetForm();
        setReportData(null);
    };

    // Get current source options based on selected data type
    const currentSourceOptions = formik.values.dataType
        ? dataSourceOptions[formik.values.dataType] || []
        : [{ value: '', label: 'First select a Data Type' }];

    return (
        <>
            <span className="md:text-lg italic font-semibold bg-primary text-white rounded-t-lg px-5 py-1">Disbursement Collection Report </span>
            <div className="border border-gray-200 rounded shadow-sm">
                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="p-2 md:p-6 space-y-6">
                    {/* Data Type Field */}
                    <div className="grid grid-cols-2 gap-2 md:gap-5">

                        <div className='max-md:col-span-4'>
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
                        <div className='max-md:col-span-4'>
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
                        <div className="col-span-4 flex justify-center items-center">
                            {reportData === null ?
                                <button
                                    type="submit"
                                    className="border border-primary text-primary font-semibold hover:bg-primary hover:text-white shadow items-center px-5 py-1 rounded w-1/2 mt-3"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="animate-spin" />
                                        </div>
                                    ) : (
                                        "Generate Report"
                                    )}
                                </button>
                                :
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="border border-primary text-primary font-semibold hover:bg-primary hover:text-white shadow items-center px-5 py-1 rounded w-1/2 mt-3"
                                >
                                    Reset Form
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>

            {/* Info Box */}
            {reportData === null ?
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-5">
                    <h3 className="font-medium text-blue-800">Information</h3>
                    <ul className="text-sm text-blue-600 mt-2 space-y-1">
                        <li>• Select a Data Type first to see available Sources</li>
                        <li>• Each Data Type has different status options</li>
                        <li>• Data will be exported based on your selection</li>
                        <li>• Download all reports based on application status.</li>
                    </ul>
                </div>
                :
                <JsontoExcel reportDetail={reportData} reportType="Disbursement-Collection-Reporting" />
            }

 

        </>
    );
};

export default DisbursementCollectionReport;
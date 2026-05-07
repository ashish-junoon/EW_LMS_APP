import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Personal from "../../components/form/Personal";
import Employment from "../../components/form/Employment";
import Address from "../../components/form/Address";
import KycInfo from "../../components/form/KycInfo";
import Gaurantor from "../../components/form/Gaurantor";
import BankInfo from "../../components/form/BankInfo";
import OthersDocs from "../../components/form/OthersDocs";
import AppCard from "../../components/form/AppCard";
import FormSidebar from "../../components/form/FormSidebar";
import TextInput from "../../components/fields/TextInput";
import { getCustomerLoanHistory, getLeadDetails } from "../../api/ApiFunction";
import ErrorMsg from "../../components/utils/ErrorMsg";
import Loader from "../../components/utils/Loader";
import { useAuth } from "../../context/AuthContext";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { Helmet } from "react-helmet";
import Table from "../../components/Table";

const CustomerLoanHistory = () => {
  const [LoanHistoryData, setLoanHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { adminUser } = useAuth();

  const fetchData = async ({ customerId }) => {
    setIsLoading(true);
    const req = {
      customerId: customerId,
    };
    try {
      const response = await getCustomerLoanHistory(req);
      if (response.status) {
        setLoanHistoryData(response.customerLoanHistories);
      } else {
        toast.error(response.message);
        setLoanHistoryData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      customerId: "",
    },
    validationSchema: Yup.object({
      customerId: Yup.string().required("customerId is required"),
    }),
    onSubmit: async (values) => {
      fetchData({ customerId: values.customerId });
    },
  });

  const columnsData = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.full_name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile_number,
      width: "115px",
    },
    {
      name: "Loan Id",
      selector: (row) => row.loan_id,
      sortable: true,
      width: "200px",
    },
    {
      name: "User Id",
      selector: (row) => row.user_id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Lead Id",
      selector: (row) => row.lead_id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Loan Amount",
      selector: (row) => row.loan_amount,
      sortable: true,
      width: "100px",
    },
    {
      name: "Loan Collection Amount",
      selector: (row) => row.loan_collection_amount,
      sortable: true,
      width: "150px",
    },
    {
      name: "Due Date",
      selector: (row) => row.due_date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Product",
      selector: (row) => row.product_name,
      sortable: true,
      width: "100px",
    },
    {
      name: "Processing Fee",
      selector: (row) => row.processing_fee + "%",
      width: "100px",
    },
    {
      name: "Interest",
      selector: (row) => row.interest_rate + "%",
      width: "100px",
    },
    {
      name: "Loan Closer Date",
      selector: (row) => row.loan_closed_date || "N/A",
      sortable: true,
      width: "140px",
    },
    {
      name: "Status",
      sortable: true,
      selector: (row) => row.loan_status,
      //   cell: (row) => (
      //     <span
      //       className={`${row.loan_status == "Active" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"} px-2 py-1 rounded`}
      //     >
      //       {row.loan_status}
      //     </span>
      //   ),

      cell: (row) => (
        <span className={`px-2 py-1 font-semibold`}>{row.loan_status}</span>
      ),
      width: "150px",
    },
  ];

  const handleFilterBtn = () => {
    toast.info("No filter available for this page.");
  };

  if (isLoading) {
    return <Loader />;
  }

  //   console.log(LoanHistoryData);

  return (
    <>
      <Helmet>
        <title>Customer Loan History</title>
        <meta name="New Leads" content="New Leads" />
      </Helmet>
      <div className="bg-white p-4 shadow rounded mb-10">
        <h1 className="text-xl font-bold">Customer Loan History</h1>

        <div className="mt-5 px-0 md:px-0 mb-5">
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="col-span-1">
                <TextInput
                  label="Customer Id"
                  icon="IoPersonOutline"
                  placeholder="Enter PAN/Mobile/Aadhaar"
                  name="customerId"
                  type="text"
                  maxLength={12}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.customerId}
                />
                {formik.touched.customerId && formik.errors.customerId && (
                  <ErrorMsg error={formik.errors.customerId} />
                )}
              </div>
              <div className="max-md:col-span-1">
                <button
                  className="bg-primary text-white py-1.5 px-4 rounded mt-6 w-full cursor-pointer hover:bg-primary/80"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Search"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {LoanHistoryData.length > 0 && (
        <div className="mt-8">
          <Table
            columns={columnsData}
            data={LoanHistoryData}
            title="Customer Loan History"
            filename="Customer_Loan_History"
            handleFilter={handleFilterBtn}
            exportable={true}
          />
        </div>
      )}

      {/* {LoanHistoryData.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-500 rounded-md overflow-hidden shadow-sm text-center">
            <thead className="bg-primary text-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-2 py-1 border-b text-nowrap">S. No</th>
                <th className="px-2 py-1 border-b text-nowrap">Full Name</th>
                <th className="px-2 py-1 border-b text-nowrap">Mobile No.</th>
                <th className="px-2 py-1 border-b text-nowrap">Loan Id</th>
                <th className="px-2 py-1 border-b text-nowrap">User Id</th>
                <th className="px-2 py-1 border-b text-nowrap">Lead Id</th>
                <th className="px-2 py-1 border-b text-nowrap">Loan Amount</th>
                <th className="px-2 py-1 border-b text-nowrap">
                  Collection Amount
                </th>
                <th className="px-2 py-1 border-b text-nowrap">Due Date</th>
                <th className="px-2 py-1 border-b text-nowrap">Product</th>
                <th className="px-2 py-1 border-b text-nowrap">
                  Processing Fee
                </th>
                <th className="px-2 py-1 border-b text-nowrap">Interest</th>
                <th className="px-2 py-1 border-b text-nowrap">
                  Loan Closer Date
                </th>
                <th className="px-2 py-1 border-b text-nowrap">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 border-gray-100">
              {LoanHistoryData?.map((elm, index) => {
                return (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-1 text-nowrap">{index + 1}</td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.full_name || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.mobile_number || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.loan_id || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.user_id || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.lead_id || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.loan_amount || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.loan_collection_amount || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.due_date || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.product_name || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.processing_fee || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.interest_rate || "N/A"}
                    </td>
                    <td className="px-6 py-1 text-nowrap">
                      {elm?.loan_closed_date || "N/A"}
                    </td>
                    <td className={`px-6 py-1 text-nowrap`}>
                      <span
                        className={`px-3 py-0.5 rounded-full font-semibold ${elm?.loan_status === "Active" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}`}
                      >
                        {elm?.loan_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )} */}
    </>
  );
};

export default CustomerLoanHistory;

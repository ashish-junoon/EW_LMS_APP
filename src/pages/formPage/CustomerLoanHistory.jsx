import { useEffect, useState } from "react";
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
import {
  CustomerLoanDetail,
  CustomerLoanHistoryWithPaymentDetails,
  getCustomerLoanHistory,
  getLeadDetails,
} from "../../api/ApiFunction";
import ErrorMsg from "../../components/utils/ErrorMsg";
import Loader from "../../components/utils/Loader";
import { useAuth } from "../../context/AuthContext";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { Helmet } from "react-helmet";
import Table from "../../components/Table";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Modal from "../../components/utils/Modal";
import CustomerLoanDetails from "../loan/CustomerLoanDetails";
import LoginPageFinder from "../../components/utils/LoginPageFinder";

const CustomerLoanHistory = () => {
  const [LoanHistoryData, setLoanHistoryData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoanHistoryvisible, setisLoanHistoryvisible] = useState(false);
  const [schedule, setschedule] = useState(null);
  const { adminUser } = useAuth();

  const navigate = useNavigate();

  // const [params] = useSearchParams();
  // const PAN = params.get("customerId");

  const PAN = JSON.parse(sessionStorage.getItem("customerId"))?.customerId;

  // const PANData = localStorage.getItem("customerId")
  // const PAN = JSON.parse(PANData)?.customerId

  const pageAccess = LoginPageFinder("page_display_name", "loan history");
  const permission = pageAccess?.[0]?.read_write_permission;

  const [openCards, setOpenCards] = useState([]);

  const toggleAccordion = (index) => {
    setOpenCards(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // close
          : [...prev, index], // open
    );
  };

  const fetchData = async ({ customerId }) => {
    setIsLoading(true);
    const req = {
      customerId: customerId,
    };
    try {
      const response = await CustomerLoanHistoryWithPaymentDetails(req);
      if (response.status) {
        setLoanHistoryData(response.customerLoanHistories);
        // window.history.replaceState({}, "", window.location.pathname);
        if (permission) {
          sessionStorage.removeItem("customerId");
        }
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
      customerId: PAN || "",
    },
    validationSchema: Yup.object({
      customerId: Yup.string().required("customerId is required"),
    }),
    onSubmit: async (values) => {
      fetchData({ customerId: values.customerId });
    },
  });

  useEffect(() => {
    if (PAN) {
      // fetchData({customerId : PAN})
      formik.submitForm();
    }
  }, []);

  useEffect(() => {
    if (!permission && !PAN) {
      navigate("/");
    }
  });

  const CustomerLoanHistory = async (req) => {
    try {
      setIsLoading(true);
      const response = await CustomerLoanDetail(req);
      if (response.status) {
        setschedule(response);
        setisLoanHistoryvisible(true);
      } else {
        toast.info(response.message || "Cant fetch loan history!");
      }
    } catch (error) {
      console.error("Error in CustomerLoanHistory: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewLoanHistory = (data) => {
    const req = {
      loan_id: data?.loan_id,
      lead_id: data?.lead_id,
    };
    CustomerLoanHistory(req);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>Customer Loan History</title>
        <meta name="New Leads" content="New Leads" />
      </Helmet>

      {permission && (
        <div className="bg-white p-4 border border-gray-300/70 shadow rounded mb-10">
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
                    // onChange={formik.handleChange}
                    onChange={(e)=> formik.setFieldValue("customerId", e.target.value?.toUpperCase())}
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
      )}

      {LoanHistoryData.length > 0 && (
        <div className="space-y-2">
          {LoanHistoryData.map((elm, index) => {
            const isOpen = openCards.includes(index);

            return (
              <div
                key={index}
                className={`rounded-lg border border-gray-300/70 ${elm?.product_name?.toLowerCase() == "pu" && "bg-[#003397]/70"} ${elm?.product_name?.toLowerCase() == "ew" && "bg-primary/80"} shadow-sm hover:shadow-md transition`}
              >
                {/* HEADER */}
                <div
                  onClick={() => toggleAccordion(index)}
                  className="flex justify-between items-center p-5 cursor-pointer"
                >
                  {/* LEFT */}
                  <div>
                    <p className="text-lg font-semibold text-gray-100">
                      {elm?.full_name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-100 mt-0.5">
                      Loan ID: {elm?.loan_id || "N/A"}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-100">Loan Amount</p>
                      <p className="text-base font-semibold text-gray-100">
                        ₹{elm?.loan_amount || "0"}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        elm?.loan_status === "Active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {elm?.loan_status}
                    </span>

                    <span
                      className={`text-gray-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* BODY */}
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden border-t bg-white">
                    {/* DETAILS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Mobile</p>
                        <p className="font-medium text-gray-800">
                          {elm?.mobile_number || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">User ID</p>
                        <p className="font-medium text-gray-800">
                          {elm?.user_id || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Lead ID</p>
                        <p className="font-medium text-gray-800">
                          {elm?.lead_id || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Product Name</p>
                        <p className="font-medium text-gray-800">
                          {elm?.product_name?.toLowerCase() == "pu" && "PAISA UDHAR"}
                          { elm?.product_name?.toLowerCase() == "ew" && "EARLY WAGES"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Sanction Amount</p>
                        <p className="font-medium text-gray-800">
                          {elm?.loan_amount || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Interest</p>
                        <p className="font-medium text-gray-800">
                          {elm?.interest_rate + "%" || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Processing Fee</p>
                        <p className="font-medium text-gray-800">
                          {elm?.processing_fee + "%" || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Collection</p>
                        <p className="font-medium text-gray-800">
                          {elm?.loan_collection_amount || "N/A"}
                        </p>
                      </div>

                      

                      <div>
                        <p className="text-xs text-gray-400">Due Date</p>
                        <p className="font-medium text-gray-800">
                          {elm?.due_date || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Closed Date</p>
                        <p className="font-medium text-gray-800">
                          {elm?.loan_closed_date || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Action</p>
                        <button
                          className="text-primary border-primary font-semibold"
                          onClick={() => handleViewLoanHistory(elm)}
                        >
                          View History
                        </button>
                      </div>
                    </div>

                    {/* PAYMENT HISTORY */}
                    <div className="px-5 pb-5">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Payment History
                      </p>

                      {elm.paymentHistories?.length > 0 ? (
                        <div className="overflow-x-auto border rounded-lg">
                          <table className="w-full text-sm text-gray-700">
                            <thead className={`${elm?.product_name == "PU" && "!bg-[#003397]/70"} ${elm?.product_name == "EW" && "!bg-primary/80"} text-xs uppercase text-white text-left`}>
                              <tr>
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">Principal</th>
                                <th className="px-4 py-2">Interest</th>
                                <th className="px-4 py-2">Penal Interest</th>
                                <th className="px-4 py-2">DPD</th>
                                <th className="px-4 py-2">Mode</th>
                                <th className="px-4 py-2">Paid</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Settled</th>
                              </tr>
                            </thead>

                            <tbody>
                              {elm.paymentHistories.map((item, i) => (
                                <tr
                                  key={i}
                                  className="border-t hover:bg-gray-50"
                                >
                                  <td className="px-4 py-2">{i + 1}</td>
                                  <td className="px-4 py-2">
                                    ₹{item.principl_collect || 0}
                                  </td>
                                  <td className="px-4 py-2">
                                    ₹{item.total_interest || 0}
                                  </td>
                                  <td className="px-4 py-2">
                                    ₹{item.penal_interest || 0}
                                  </td>
                                  <td className="px-4 py-2">{item.dpd || 0}</td>
                                  <td className="px-4 py-2">
                                    {item.payment_mode || "-"}
                                  </td>
                                  <td className="px-4 py-2 font-medium text-gray-800">
                                    ₹{item.paid_amount || 0}
                                  </td>
                                  <td className="px-4 py-2">
                                    {item.paid_on || (
                                      <span className="text-gray-400">--</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    ₹{item.waive_off_amount || 0}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center py-6 text-gray-400 text-sm">
                          No payment history available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isLoanHistoryvisible}
        onClose={() => {
          (setisLoanHistoryvisible(false), setschedule(null));
        }}
        heading="Customer Loan History"
        width="w-full"
      >
        <CustomerLoanDetails schedule={schedule} />
      </Modal>
    </>
  );
};

export default CustomerLoanHistory;

import React, { useEffect, useState } from "react";
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
  LeadStatusReport,
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

const MasterSearch = () => {
  const [leadStatusReport, setleadStatusReport] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setschedule] = useState(null);
  const { adminUser } = useAuth();

  const navigate = useNavigate();

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
      search_param: customerId,
    };
    try {
      const response = await LeadStatusReport(req);
      if (response.status) {
        setleadStatusReport(response.leadStatusReport);
      } else {
        toast.info(
          response.message == "Data not found"
            ? "Loan history is not available for PU and EW!"
            : response.message,
        );
        setleadStatusReport([]);
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>Master Search</title>
        <meta name="New Leads" content="New Leads" />
      </Helmet>

      <div className="bg-white p-4 border border-gray-300/70 shadow rounded mb-10">
        <h1 className="text-xl font-bold">Master Search</h1>

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
                  maxLength={40}
                  // onChange={formik.handleChange}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "customerId",
                      e.target.value?.toUpperCase(),
                    )
                  }
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

      {leadStatusReport.length > 0 && (
        <div className="space-y-2">
          {leadStatusReport.map((elm, index) => {
            const isOpen = openCards.includes(index);

            const steps = [
              { key: "is_personal_info_fill", label: "Personal" },
              { key: "is_employment_info_fill", label: "Employment" },
              { key: "is_address_info", label: "Address" },
              { key: "is_kyc_info_fill", label: "KYC" },
              { key: "is_bank_info_fill", label: "Bank" },
              { key: "is_selfie_uploaded", label: "Selfie" },
              { key: "is_aadhaar_verified", label: "Adhar Verification" },
              { key: "is_pan_verified", label: "Pan Verification" },
            ];

            return (
              <div className="grid gap-4">
                <div
                  key={index}
                  className="bg-gray-100 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  {/* TOP SECTION */}
                  <div
                    onClick={() => toggleAccordion(index)}
                    className="p-4 flex justify-between items-center cursor-pointer"
                  >
                    {/* LEFT */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 uppercase">
                        {elm.full_name} • { }
                        {/* {elm.status_msg} */}
                        {
                        elm.status_count == "0" ? "Incomplete Leads" : 
                        elm.status_count == "1" ? "New Leads" : 
                        elm.status_count == "2" ? "Leads Verification" : 
                        elm.status_count == "3" ? "Credit Assessment" : 
                        elm.status_count == "4" ? "Leads In Kyc" : 
                        elm.status_count == "5" ? "Manage Disbursal" : 
                        elm.status_count == "6" ? "Active Loans" : 
                        elm.status_count == "7" ? "Rejected Leads" : 
                        elm.status_count == "8" ? "Follow Up" : 
                        elm.status_count == "9" ? "Disbursement Hold" : 
                        elm.status_count == "10" ? "Closed Loan" : 
                        elm.status_count == "11" ? "ForeClouser" : 
                        elm.status_count == "12" ? "Settled" : 
                        elm.status_count == "24" ? "Pending For Disbursement Approval" : 
                        elm.status_count == "25" ? "Approved For Payout" : 
                        elm.status_count == "26" ? "Amount Refunded" : 
                        elm.status_count == "26" ? "Disbursal In Process" : 
                        elm.status_msg
                        }
                      </h2>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right font-semibold">
                      <p className="text-xs text-gray-500">
                        {elm.lead_id} • {elm.user_id} • {elm?.loan_id}
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        {elm.mobile_number}
                      </p>

                      {/* <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                        Completed
                      </span> */}
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-2">
                      {steps.map((step, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-sm font-semibold ${
                            elm[step.key]
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* EXPAND SECTION */}
                  <div
                    className={`transition-all duration-300 ${
                      isOpen ? "max-h-[500px]" : "max-h-0 overflow-hidden"
                    }`}
                  >
                    <div className="border-t px-4 py-4 bg-gray-50">
                      {/* GRID DETAILS */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs">Email</p>
                          <p className="font-medium uppercase">{elm.email_id}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">PAN</p>
                          <p className="font-medium">{elm.pan_card_number}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">Aadhaar</p>
                          <p className="font-medium">{elm.aadhaar_number}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">Bank</p>
                          <p className="font-medium">{elm.bank_name}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">Account</p>
                          <p className="font-medium">{elm.account_number}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">IFSC</p>
                          <p className="font-medium">{elm.ifsc_code}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">Created By</p>
                          <p className="font-medium uppercase">{elm.created_by}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">Updated By</p>
                          <p className="font-medium">{elm.emp_name?.trim() || elm.updated_by}</p>
                        </div>

                        <div>
                          <p className="text-gray-400 text-xs">Salary</p>
                          <p className="font-medium">
                            {elm.net_monthly_salary}
                          </p>
                        </div>

                        {/* REMARKS FULL WIDTH */}
                        <div className="col-span-2 md:col-span-3">
                          <p className="text-gray-400 text-xs">Remarks</p>
                          <p className="font-medium text-gray-700">
                            {elm.remarks}
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      {/* <div className="mt-4 flex justify-end gap-3">
                            <button
                              onClick={() =>
                                window.open(
                                  `/new-lead/lead-details?lead_id=${elm.lead_id}&user_id=${elm.user_id}`,
                                  "_blank",
                                )
                              }
                              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/80"
                            >
                              View Full Profile
                            </button>
                          </div> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MasterSearch;

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/utils/Loader";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { useAuth } from "../../context/AuthContext";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import ClosedCard from "../../components/utils/ClosedCard";

const CustomerLoanDetails = ({schedule}) => {
  const { adminUser } = useAuth();
  const navigate = useNavigate();

  const pageAccess = LoginPageFinder("page_display_name", "accounts");
  const permission = pageAccess?.[0].read_write_permission;
  const funder = adminUser.role === "Funder" ? true : false;

  const activeLoan = schedule?.activeLoanDetails;
  const closedLoan = schedule?.closedLoanDetails;

  //Loan history Status
  const paymentStatus = schedule?.payment_status
    ?.toLowerCase()
    .replaceAll(" ", "");
  const isActive =
    paymentStatus === "pending" ||
    paymentStatus === "processing" ||
    paymentStatus === "active" ||
    paymentStatus === "partially" ||
    paymentStatus === "due" ||
    schedule?.payment_status == 1;
  const isClosed =
    paymentStatus === "paid" ||
    paymentStatus === "settled" ||
    paymentStatus === "foreclosure" ||
    paymentStatus === "waiveoff";
  const isOverdue =
    isActive &&
    schedule?.activeLoanDetails?.loan_status?.toLowerCase() == "overdue";
  const btnEnable = true;

  const loanDetails = isActive
    ? [
        {
          label: "Loan Amount",
          value: `₹${activeLoan?.loan_amount}`,
          className: "text-gray-500",
        },
        {
          label: "Interest Rate",
          value: `${activeLoan?.interest_rate}% PD`,
          className: "text-gray-500",
        },
        {
          label: "Tenure",
          value: activeLoan?.tenure,
          className: "text-gray-500",
        },
        {
          label: "Number of EMIs",
          value: activeLoan?.number_of_installment,
          className: "text-gray-500",
        },
        {
          label: "Repay Frequency",
          value: activeLoan?.repayment_frequency,
          className: "text-gray-500",
        },

        {
          label: "Disbursed Amount",
          value: `₹${activeLoan?.disbursed_amount}`,
          className: "text-gray-500",
        },
        {
          label: "Repayment Amount",
          value: `₹${activeLoan?.repayment_amount}`,
          className: "text-gray-500",
        },
        {
          label: "Disbursement Date",
          value: activeLoan?.disbursement_date,
          className: "text-gray-500",
        },
        {
          label: "Repayment Date",
          value: `${activeLoan?.repayment_date}`,
          className: "text-gray-500",
        },
        {
          label: "Loan Status",
          value: `${activeLoan?.loan_status}`,
          className: "text-gray-500",
        },

        {
          label: "Current Tenure",
          value: `${activeLoan?.current_tenure}`,
          className: "text-gray-500",
        },
        {
          label: "Penal Day",
          value: `${activeLoan?.penalty_days}`,
          className: "text-gray-500",
        },
        {
          label: "Total Interest",
          value: `₹${activeLoan?.due_interest_on_current_day}`,
          className: "text-gray-500",
        },
        {
          label: "Penal Charges",
          value: `₹${activeLoan?.penal_charges}`,
          className: "text-gray-500",
        },
        {
          label: "Total Outstanding",
          value: `₹${activeLoan?.due_amount_on_current_day}`,
          className: "text-gray-500",
        },
      ]
    : [
        {
          label: "Loan Amount",
          value: `₹${closedLoan?.loan_amount}`,
          className: "text-gray-500",
        },
        {
          label: "Interest Rate",
          value: `${closedLoan?.interest_rate}% PD`,
          className: "text-gray-500",
        },
        {
          label: "Current Tenure",
          value: closedLoan?.tenure,
          className: "text-gray-500",
        },
        {
          label: "Number of EMIs",
          value: closedLoan?.number_of_installment,
          className: "text-gray-500",
        },
        {
          label: "Repay Frequency",
          value: closedLoan?.repayment_frequency,
          className: "text-gray-500",
        },

        {
          label: "Disbursed Amount",
          value: `₹${closedLoan?.disbursed_amount}`,
          className: "text-gray-500",
        },
        {
          label: "Repayment Amount",
          value: `₹${closedLoan?.repayment_amount}`,
          className: "text-gray-500",
        },
        {
          label: "Disbursement Date",
          value: closedLoan?.disbursement_date,
          className: "text-gray-500",
        },
        {
          label: "Repayment Date",
          value: `${closedLoan?.repayment_date}`,
          className: "text-gray-500",
        },
        {
          label: "Loan Status",
          value: `${closedLoan?.loan_status}`,
          className: "text-gray-500",
        },

        {
          label: "Total Tenure",
          value: `${closedLoan?.total_tenure}`,
          className: "text-gray-500",
        },
        {
          label: "Total Penal Days",
          value: `${closedLoan?.penalty_days}`,
          className: "text-gray-500",
        },
        {
          label: "Total Interest",
          value: `₹${closedLoan?.total_interest_amount}`,
          className: "text-gray-500",
        },
        {
          label: "Total Penal Charges",
          value: `₹${closedLoan?.total_penal_interest}`,
          className: "text-gray-500",
        },
        {
          label: "Closing Amount",
          value: `₹${closedLoan?.total_collection_amount}`,
          className: "text-gray-500",
        },
        {
          label: "Closing Date",
          value: closedLoan?.closed_date,
          className: "text-gray-500",
        },
        {
          label: "Waive Off Amount",
          value: `₹${closedLoan?.waive_off_amount}`,
          className: "text-gray-500",
        },
      ];


  return (
    <>
      <div className="max-full mx-auto py-5">
        <div className="overflow-hidden rounded-xl shadow-lg bg-white">
          <div
            className={`px-6 py-1 ${
              (isOverdue && "bg-red-600") ||
              (isActive && "bg-gradient-to-r from-blue-500 to-indigo-600") ||
              (!isActive && "bg-gradient-to-r from-green-500 to-green-600")
            }`}
          />
          <div
            className={`grid grid-cols-2 lg:grid-cols-5 ${
              (isOverdue && "bg-gradient-to-r from-red-100 to-red-200/70") ||
              (isActive && "bg-gradient-to-r from-blue-50 to-indigo-100/70") ||
              (!isActive && "bg-gradient-to-r from-green-50 to-green-100/70")
            }`}
          >
            {loanDetails.map((item, index) => (
              <div
                key={index}
                className={`px-4 py-2 ${index < 8 ? "" : ""} ${
                  (index + 1) % 4 !== 0 ? "" : ""
                }`}
              >
                <p
                  className={`text-sm text-gray-800 font-bold ${item.className} mb-1`}
                >
                  {item.label}
                </p>
                <p className="bg-gray-000 text-primary py-1 px-4">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          {!funder && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 ${
                (isOverdue && "bg-gradient-to-r from-red-100 to-red-200/70") ||
                (isActive &&
                  "bg-gradient-to-r from-blue-50 to-indigo-100/70") ||
                (!isActive && "bg-gradient-to-r from-green-50 to-green-100/70")
              }`}
            ></div>
          )}
        </div>

        {schedule?.paymentHistories?.length > 0 ? (
        <div className="relative overflow-x-auto sm:rounded-lg mt-10">
          <table className="w-full text-sm text-center text-slate-800 mb-5">
            <thead className="text-xs text-white font-bold bg-primary">
              <tr>
                <th className="px-6 py-2">#</th>
                <th className="px-6 py-2">Principal</th>
                <th className="px-6 py-2">Interest</th>
                <th className="px-6 py-2">DPD (Days)</th>
                <th className="px-6 py-2">Payment Mode</th>
                <th className="px-6 py-2">Amount Paid</th>
                <th className="px-6 py-2">Paid On</th>
                <th className="px-6 py-2">Settled</th>
              </tr>
            </thead>
            <tbody>
              {schedule?.paymentHistories?.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-slate-200 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-2">{index + 1}</td>
                  <td className="px-6 py-2">{item.principl_collect || "0"}</td>
                  <td className="px-6 py-2">
                    {item.total_interest_collect || "0"}
                  </td>
                  <td className="px-6 py-2">{item.dpd || "0"}</td>
                  <td className="px-6 py-2">{item.payment_mode || "0"}</td>
                  <td className="px-6 py-2">{item.total_paid_amount || "0"}</td>
                  <td className="px-6 py-2">
                    {item.paid_on || (
                      <span className="text-primary text-xs">--</span>
                    )}
                  </td>
                  <td className="px-6 py-2">{item.waive_off_amount || "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p>No data available</p>
        </div>
      )}
      </div>
    </>
  );
};

export default CustomerLoanDetails;

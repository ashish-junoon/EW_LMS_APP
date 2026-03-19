import { useEffect, useState } from "react";
import {
  GetEMISchedule,
  getLoanHistory,
  GetLoanDocuments,
} from "../../api/ApiFunction";
import Modal from "./Modal";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Icon from "./Icon";
import { useNavigate } from "react-router-dom";

function LoanHistory({ btnEnable = false, pan, data, loan_Id }) {
  const { adminUser } = useAuth();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isHistoryOpen, setisHistoryOpen] = useState(false);
  const [loanId, setloanId] = useState(null);
  // const loanId = data?.selectedproduct?.[0]?.loan_id;
  const userId = data?.user_id;
  const leadId = data?.lead_id;
  const activeLoan = schedule?.activeLoanDetails;
  const closedLoan = schedule?.closedLoanDetails;
  const funder = adminUser?.role === "Funder" ? true : false;
  

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

  const handleShowCloseLead = (loanid) => {
    setloanId(loanid);
    setisHistoryOpen(true);
    console.log(loanid);
  };

  // Newly Added for Loan History
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

  // Document Data
  const documentData = [
    {
      doc_type: "sanction_letter",
      label: "Sanction Letter",
    },
    {
      doc_type: "aggrement_letter",
      label: "Loan Agreement",
    },
    {
      doc_type: "disbursal_letter",
      label: "Disbursal Letter",
    },
    {
      doc_type: "NOC_letter",
      label: "NOC",
    },
  ];

  const history = async () => {
    const payload = {
      pan_number: pan,
    };
    const response = await getLoanHistory(payload);
    if (response.status) {
      setHistoryData(response?.loanHistories);
    } else {
      toast.error(response.message);
    }
  };

  // const GetAgreement = async () => {
  //   const req = {
  //     lead_id: leadId,
  //     user_id: userId,
  //     doc_type: "aggrement_letter",
  //     loan_id: loanId,
  //     lead_status: "A",
  //   };
  //   try {
  //     setIsLoading(true);
  //     const response = await GetLoanDocuments(req);

  //     if (response.status) {
  //       // Open in new tab
  //       const blob = new Blob([response.document], { type: "text/html" });
  //       const url = URL.createObjectURL(blob);
  //       window.open(url, "_blank");
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast.error("An error occurred while fetching data.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const GetSanction = async () => {
  //   const req = {
  //     lead_id: leadId,
  //     user_id: userId,
  //     doc_type: "sanction_letter",
  //     loan_id: loanId,
  //     lead_status: "A",
  //   };

  //   try {
  //     setIsLoading(true);
  //     const response = await GetLoanDocuments(req);

  //     if (response.status) {
  //       // Open in new tab
  //       const blob = new Blob([response.document], { type: "text/html" });
  //       const url = URL.createObjectURL(blob);
  //       window.open(url, "_blank");
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast.error("An error occurred while fetching data.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const GetDisbursal = async () => {
  //   const req = {
  //     lead_id: leadId,
  //     user_id: userId,
  //     doc_type: "disbursal_letter",
  //     loan_id: loanId,
  //     lead_status: "A",
  //   };

  //   try {
  //     setIsLoading(true);
  //     const response = await GetLoanDocuments(req);

  //     if (response.status) {
  //       // Open in new tab
  //       const blob = new Blob([response.document], { type: "text/html" });
  //       const url = URL.createObjectURL(blob);
  //       window.open(url, "_blank");
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast.error("An error occurred while fetching data.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const GetNOC = async () => {
  //   const req = {
  //     lead_id: leadId,
  //     user_id: userId,
  //     doc_type: "NOC_letter",
  //     loan_id: loanId,
  //     lead_status: "C",
  //   };

  //   try {
  //     setIsLoading(true);
  //     const response = await GetLoanDocuments(req);

  //     if (response.status) {
  //       // Open in new tab
  //       const blob = new Blob([response.document], { type: "text/html" });
  //       const url = URL.createObjectURL(blob);
  //       window.open(url, "_blank");
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast.error("An error occurred while fetching data.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // common function to get documents
  const GetDocuments = async (doc) => {
    const req = {
      lead_id: leadId,
      user_id: userId,
      doc_type: doc,
      loan_id: loanId,
      lead_status: "C",
    };

    try {
      setIsLoading(true);
      const response = await GetLoanDocuments(req);

      if (response.status) {
        // Open in new tab
        const blob = new Blob([response.document], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Newly Added End

  useEffect(() => {
    if (!loanId || !leadId) return; // Changed Loan id loan_id to loanId
    const fetchData = async () => {
      try {
        const response = await GetEMISchedule({
          loan_id: loanId,
          lead_id: leadId,
        }); // Changed Loan id loan_id to loanId
        if (response.status) {
          setSchedule(response);
          setTableData(response.emi_Schedules || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [loanId, leadId]); // Changed Loan id loan_id to loanId
    

  const handleOpen = (item) => {
    const data = {
      user_id: userId,
      lead_id: item?.lead_id,
      loan_Id: item?.loan_id,
    };

    sessionStorage.setItem("newWindowData", JSON.stringify(data));
    window.open("/loan/loan-history", "_blank");
  };

  useEffect(() => {
    history();
  }, []);
  return (
    <>
      <div>
        {historyData?.length > 0 ? (
          <div className="w-full mt-5 overflow-x-auto">
            <table className="min-w-max w-full border border-gray-300 bg-white shadow-md">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="border px-2 py-2 text-xs text-left">#</th>
                  <th className="border px-2 py-2 text-xs text-left">
                    Loan ID
                  </th>
                  <th className="border px-2 py-2 text-xs text-left">
                    Loan Amount
                  </th>
                  <th className="border px-2 py-2 text-xs text-left">
                    Due Date
                  </th>
                  <th className="border px-2 py-2 text-xs text-left">Status</th>
                  <th className="border px-2 py-2 text-xs text-left">
                    Closed Date
                  </th>
                  <th className="border px-2 py-2 text-xs text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {historyData?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="border px-2 py-2 text-xs">{index + 1}</td>
                    <td className="border px-2 py-2 text-xs">{item.loan_id}</td>
                    <td className="border px-2 py-2 text-xs">
                      {item.loan_amount}
                    </td>
                    <td className="border px-2 py-2 text-xs">
                      {item.due_date}
                    </td>
                    <td className="border px-2 py-2 text-xs">
                      {item.loan_status}
                    </td>
                    <td className="border px-2 py-2 text-xs">
                      {item.loan_closed_date}
                    </td>
                    <td className="border px-2 py-2 text-xs">
                      <button
                        // onClick={() => handleShowCloseLead(item.loan_id)}
                        // onClick={() => navigate('/loan/loan-history', {state: { loan_id: item?.loan_id, lead_id: leadId, user_id: userId }})}
                        // onClick={() => {
                        //   window.open(
                        //     `/loan/loan-history?loan_id=${item?.loan_id}&lead_id=${leadId}&user_id=${userId}`,
                        //     "_blank",
                        //   );
                        // }}
                        onClick={() => handleOpen(item)}
                        className="text-primary font-bold w-full"
                      >
                        View
                      </button>

                      {/* <Link
                          to="/loan/loan-history"
                          state={{
                            loan_id: item?.loan_id,
                            lead_id: leadId,
                            user_id: userId
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-bold w-full"
                        >
                          View
                        </Link> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full mt-5 overflow-x-auto">
            <h1 className="text-center">No History Found</h1>
          </div>
        )}
      </div>

      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setisHistoryOpen(false)}
        heading={`Loan Id : ${loanId}`}
        width="80%"
      >
        <div className="max-full mx-auto p-6">
          <div className="overflow-hidden rounded-xl shadow-lg bg-white">
            <div
              className={`px-6 py-1 ${
                (isOverdue && "bg-red-600") ||
                (isActive && "bg-gradient-to-r from-blue-500 to-indigo-600") ||
                (!isActive && "bg-gradient-to-r from-green-500 to-green-600")
              }`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
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
                  <p className="bg-gray-50 text-primary py-1 px-4">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            {!funder && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 bg-white">
                {/* To Get Documents */}
                {documentData?.map((document, i) => {
                  return (
                    <div key={i}>
                      {isActive && document.doc_type == "NOC_letter" ? (
                        ""
                      ) : (
                        <div className="px-4 py-2">
                          <p className="text-sm text-gray-800 font-bold mb-1">
                            {document?.label}
                          </p>
                          {btnEnable ? (
                            <button className="bg-primary/50 text-white py-1 px-4 w-full shadow rounded cursor-not-allowed">
                              View
                            </button>
                          ) : (
                            <button
                              className="bg-primary text-white py-1 px-4 w-full shadow rounded flex justify-center items-center gap-2 hover:bg-primary/80"
                              onClick={() => GetDocuments(document.doc_type)}
                            >
                              <Icon name="IoDocumentTextOutline" size={15} />
                              <span>View</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
export default LoanHistory;

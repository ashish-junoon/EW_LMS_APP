import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AppCard from "../../components/form/AppCard";
import TabWrap from "../../components/utils/TabWrap";
import {
  GetEMISchedule,
  getLeadDetails,
  GetLoanDocuments,
  ReloanLead,
} from "../../api/ApiFunction";
import Loader from "../../components/utils/Loader";
import LeadHistory from "../../components/utils/LeadHistory";
import EMISchedule from "../../components/utils/EMISchedule";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { Helmet } from "react-helmet";
import { useAuth } from "../../context/AuthContext";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import ClosedCard from "../../components/utils/ClosedCard";
import Icon from "../../components/utils/Icon";

const LoanHistoryPage = () => {
  // const [openApporve, setOpenApporve] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);
  const [data, setData] = useState(null);
  // const lead_id = location.state?.lead_id;
  // const user_id = location.state?.user_id;
  // const loanId = location.state?.loan_id;

  const { adminUser } = useAuth();
  const { leadInfo, setLeadInfo } = useOpenLeadContext();

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

  // Set Data to -> SetData -> data
  useEffect(() => {
    const storedData = sessionStorage.getItem("newWindowData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  //To Fetch lead data for AppCard
  useEffect(() => {
    const storedData = sessionStorage.getItem("newWindowData");
    const { lead_id, user_id } = JSON.parse(storedData);
    if (lead_id && user_id) {
      fetchData({ lead_id, user_id });
    } else {
      navigate("/");
    }
  }, []);

  // function to Fetch Data
  const fetchData = async (data) => {
    setIsLoading(true);
    const req = {
      lead_id: data?.lead_id,
      user_id: data?.user_id,
      login_user: adminUser?.emp_code,
      permission: "w",
    };
    try {
      const response = await getLeadDetails(req);
      if (response.status) {
        setUserData(response);
        setLeadInfo(response);
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

  // To Fetch EMI Shedule Data for History
  useEffect(() => {
    if (!data?.loan_Id || !data?.lead_id) return; // Changed Loan id loan_id to loanId
    const fetchData = async () => {
      try {
        const response = await GetEMISchedule({
          loan_id: data?.loan_Id,
          lead_id: data?.lead_id,
        }); // Changed Loan id loan_id to loanId
        if (response.status) {
          setSchedule(response);
          //   setTableData(response.emi_Schedules || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data?.loan_Id, data?.lead_id]); // Changed Loan id loan_id to loanId

  //Common Method for Documents
  const GetDocuments = async (doc) => {
    const req = {
      lead_id: data?.lead_id,
      user_id: data?.user_id,
      doc_type: doc,
      loan_id: data?.loan_Id,
    //lead_status: "C",
      lead_status: doc == "NOC_letter" ? "C" : "A",
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

  if (isLoading) {
    return <Loader />;
  }

  if (!userData) {
    return <div>No data available</div>;
  }

  const tabData = [
    // ...(leadInfo?.lead_status === 6
    //     ? [{
    //         label: 'EMI Schedule',
    //         content: <EMISchedule data={userData} loan_Id={loanId} />
    //     }]
    //     : [
    //         {
    //             label: 'Loan Details',
    //             content: <ClosedCard data={userData} />
    //         }
    //     ]
    // ),
    {
      label: "EMI Schedule",
      content: (
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
                (isActive &&
                  "bg-gradient-to-r from-blue-50 to-indigo-100/70") ||
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
                  (isOverdue &&
                    "bg-gradient-to-r from-red-100 to-red-200/70") ||
                  (isActive &&
                    "bg-gradient-to-r from-blue-50 to-indigo-100/70") ||
                  (!isActive &&
                    "bg-gradient-to-r from-green-50 to-green-100/70")
                }`}
              >
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
                          {!btnEnable ? (
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
      ),
    },
    {
      label: "History",
      content: <LeadHistory data={userData} btnEnable={permission} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Loan History</title>
        <meta name="Leads Verification" content="Leads Verification" />
      </Helmet>
      <AppCard data={userData} />
      <TabWrap tabData={tabData} />
    </>
  );
};

export default LoanHistoryPage;

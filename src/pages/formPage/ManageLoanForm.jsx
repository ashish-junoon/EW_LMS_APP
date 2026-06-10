import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Personal from "../../components/form/Personal";
import Employment from "../../components/form/Employment";
import Address from "../../components/form/Address";
import KycInfo from "../../components/form/KycInfo";
import Card from "../../components/utils/Card";
import Gaurantor from "../../components/form/Gaurantor";
import AppCard from "../../components/form/AppCard";
import BankInfo from "../../components/form/BankInfo";
import Button from "../../components/utils/Button";
import FormSidebar from "../../components/form/FormSidebar";
import TabWrap from "../../components/utils/TabWrap";
import {
  CancelPresentment,
  getLeadDetails,
  GetPaymentLinkDetails,
  ReloanLead,
} from "../../api/ApiFunction";
import Loader from "../../components/utils/Loader";
import LeadHistory from "../../components/utils/LeadHistory";
import EMISchedule from "../../components/utils/EMISchedule";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { Helmet } from "react-helmet";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import SelectInput from "../../components/fields/SelectInput";
import DateInput from "../../components/fields/DateInput";
import OthersDocs from "../../components/form/OthersDocs";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import ClosedCard from "../../components/utils/ClosedCard";
import LoanHistory from "../../components/utils/LoanHistory";
import OtherBankInfo from "../../components/form/OtherBankInfo";
import MandateHistory from "../../components/utils/MandateHistory";
import Icon from "../../components/utils/Icon";

const ManageAppForm = () => {
  // const [openApporve, setOpenApporve] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableDataNew, setTableDataNew] = useState([]);
  const [searchParams] = useSearchParams();

  const [isCancelOpen, setisCancelOpen] = useState(false);
  const [cancelData, setCancelData] = useState({});

  const lead_id = location.state?.lead_id || searchParams.get("lead_id");
  const user_id = location.state?.user_id || searchParams.get("user_id");
  const loanId = location.state?.loan_id || searchParams.get("loan_id");
  const { adminUser } = useAuth();
  const { leadInfo, setLeadInfo } = useOpenLeadContext();

  const navigate = useNavigate();
  const today = dayjs();
  const maxTenureDate = today.add(45, "day");
  const maxReloanDate = today.add(2, "day");
  const minTenureDate = today.add(7, "day");

  const pageAccess = LoginPageFinder("page_display_name", "accounts");
  const permission = pageAccess?.[0].read_write_permission;
  const funder = adminUser.role === "Funder" ? true : false;

  useEffect(() => {
    if (lead_id && user_id) {
      fetchData();
    } else {
      navigate("/");
    }
  }, [lead_id, user_id]);

  const fetchData = async () => {
    setIsLoading(true);
    const req = {
      lead_id: lead_id,
      user_id: user_id,
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

  //Add Payday products for Reloan Lead
  const addProduct = useFormik({
    initialValues: {
      loanAmount: "",
      reloanDate: "",
      tenure: "",
      interestRate: "",
      interestType: "",
      processFee: "",
      cgst: "",
      sgst: "",
      igst: "",
      irr: "",
      apr: "",
      // eir: '',
      insurance: "",
    },
    validationSchema: Yup.object({
      loanAmount: Yup.number()
        .required("Required")
        .min(1000, "Minimum amount ₹1,000")
        .max(9000000, "Maximum amount ₹9000000"),

      tenure: Yup.date()
        .required("Required")
        .min(minTenureDate.toDate(), "Minimum Tenure 7 days")
        .max(maxTenureDate.toDate(), "Maximum Tenure 45 days"),

      reloanDate: Yup.date()
        .required("Required")
        .min(today.startOf("day").toDate(), "Date can't be in past")
        .max(maxReloanDate.toDate(), "Invalid date"),

      interestRate: Yup.number()
        .required("Required")
        .min(0.5, "Minimum interest rate 0.5%")
        .max(2, "Maximum interest rate 2%"),

      insurance: Yup.number()
        .required("Required")
        .min(0, "Minimum interest rate 0.5%")
        .max(10, "Maximum interest rate 10%"),

      interestType: Yup.string().required("Required"),

      processFee: Yup.number()
        .required("Required")
        .min(1, "Minimum processing fee 1%")
        .max(15, "Maximum processing fee 15%"),

      cgst: Yup.number().max(15, "CGST must not exceed 15%"),

      sgst: Yup.number().max(15, "SGST must not exceed 15%"),

      igst: Yup.number().max(15, "IGST must not exceed 15%"),

      irr: Yup.number().max(15, "IRR must not exceed 15%"),

      apr: Yup.number().max(15, "APR must not exceed 15%"),

      // eir: Yup.number()
      //     .max(15, 'EIR must not exceed 15%'),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      // Check if CIBIL score is missing
      if (
        !leadInfo?.cibilCreditScores ||
        leadInfo.cibilCreditScores.length === 0
      ) {
        toast.error("Please get CIBIL score first.");
        setSubmitting(false);
        return;
      }

      try {
        const userRequest = {
          user_id: user_id,
          lead_id: lead_id,
          loan_amount: values?.loanAmount,
          processing_fee: values?.processFee,
          interest_rate: values?.interestRate,
          interest_type: values?.interestType,
          cgst: values?.cgst,
          sgst: values?.sgst,
          igst: values?.igst,
          repayment_date: values?.tenure,
          re_loan_date: values?.reloanDate,
          insurance_rate: values?.insurance,
          irr: values?.irr,
          apr: values?.apr,
          eir: "0",
          created_by: adminUser.emp_code,
        };

        const response = await ReloanLead(userRequest);

        if (response.status) {
          // toast.success(response.message);
          if (response.product_code) {
            setIsOpen(false);
            toast.success(response.message);
            navigate(-1);
          } else {
            toast.error("Product code not found.");
          }
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error updating employment info:", error);
      } finally {
        setSubmitting(false);
        setIsOpen(false);
      }
    },
  });

  const handleCancelPresentment = async () => {
    setisCancelOpen(false);

    if (!cancelData.transaction_id)
      return toast.info("transaction_id is required!");

    try {
      const req = {
        transaction_id: cancelData.transaction_id,
      };
      const response = await CancelPresentment(req);

      if (response.status) {
        toast.success(response.message || "Presentment canceled!");
        fetchData();
      } else {
        toast.info(response.message || "Something went wrong!");
      }
    } catch (error) {
      console.log("Error in handleCancelPresentment", error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  const renderError = (field) =>
    addProduct.touched[field] && addProduct.errors[field] ? (
      <div className="text-red-500 text-sm">{addProduct.errors[field]}</div>
    ) : null;

  const fetchEMICollectionData = async () => {
    try {
      const response = await GetPaymentLinkDetails({
        loan_id: userData?.getAssignProduct[0]?.loan_id,
        lead_id: userData?.lead_id,
      });

      if (response.status) {
        setTableDataNew(response.getPaymentLinkDetails || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!userData?.getAssignProduct[0]?.loan_id || !userData?.lead_id) {
      return;
    }
    fetchEMICollectionData();
  }, [userData?.getAssignProduct[0]?.loan_id, userData?.lead_id]);

  if (isLoading) {
    return <Loader />;
  }

  console.log(tableDataNew);

  if (!userData) {
    return <div>No data available</div>;
  }

  const tabData = [
    ...(leadInfo?.lead_status === 6
      ? [
          {
            label: "EMI Schedule",
            content: (
              <EMISchedule
                fetchEMICollectionData={fetchEMICollectionData}
                data={userData}
                loan_Id={loanId}
                fetchData={fetchData}
              />
            ),
          },
        ]
      : [
          {
            label: "Loan Details",
            content: <ClosedCard data={userData} />,
          },
        ]),
    {
      label: "Lead Application",
      content: (
        <div className="grid lg:grid-cols-7 gap-4 mt-5">
          <div className="lg:col-span-2 py-5">
            <div>{!funder && <FormSidebar data={userData} />}</div>
          </div>
          <div
            className={`${!funder ? "lg:col-span-5" : "lg:col-span-7"} py-5`}
          >
            <Card heading={"Applicant Details"} style={"p-2"}>
              <Personal />
              <Employment />
              <Address />
              <KycInfo />
              <BankInfo />
              <OtherBankInfo />
              <Gaurantor />
              <OthersDocs />
            </Card>
          </div>
        </div>
      ),
    },
    {
      label: "History",
      content: <LeadHistory data={userData} btnEnable={permission} />,
    },
    {
      label: "Loan History",
      content: (
        <div className="mb-5">
          <LoanHistory
            pan={userData?.kycInfo[0]?.pan_card_number}
            data={userData}
            loan_Id={loanId}
          />
        </div>
      ),
    },
    {
      label: "Mandate History",
      content: <MandateHistory data={userData} />,
    },
    ...(leadInfo?.lead_status !== 6
      ? [
          {
            label: "Pull Payment History",
            content: (
              <>
                {userData?.pullPaymentHistories?.length > 0 ? (
                  <div className="overflow-x-auto border mt-8 broder-gray-50 rounded-md">
                    <table className="min-w-full text-sm text-left border border-gray-500 rounded-md overflow-hidden shadow-sm text-center">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Cancel Presentment
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Collection Status
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Mandate Id
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Provider
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Amount
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Collection Date
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Comment
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Request Created Date
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Created by
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Pull Amount
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Message
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Request Send Date/Time
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Presentment Id
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Presentment Date
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Response Type
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Transaction Ref. No.
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Bank Ref. No.
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Pull Status.
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Bank Name
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Account No
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            IFSC
                          </th>
                          <th className="px-2 py-1 border-b text-nowrap">
                            Transaction Id
                          </th>

                          {/* <th className="px-2 py-1 border-b text-nowrap">Collection Time</th> */}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200 border-gray-100">
                        {userData?.pullPaymentHistories?.map((elm, index) => {
                          return (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="px-6 py-2 text-nowrap w-full">
                                <button
                                  disabled={elm?.presentment_id}
                                  onClick={() => {
                                    setCancelData(elm);
                                    setisCancelOpen(true);
                                  }}
                                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200"
                                >
                                  <Icon name="MdCancel" size={14} />
                                  <span>Cancel</span>
                                </button>
                              </td>
                              <td className="px-6 py-1 text-nowrap capitalize">
                                {elm?.collection_status}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.emandate_id}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.provider}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.amount}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.collection_date}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.comment}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.request_created_date}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.request_created_by}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.pull_amount}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.message}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.request_send_datetime}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.presentment_id}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.presentment_date}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.responce_type}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.transaction_reference_number}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.bank_reference_number}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.job_pull_status}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.bank_name}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.customer_account_number}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.customer_ifsc}
                              </td>
                              <td className="px-6 py-1 text-nowrap">
                                {elm?.transaction_id}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-10">
                    <p>No Data Found!</p>
                  </div>
                )}
              </>
            ),
          },
        ]
      : ""),

    {
      label: "Collection Payment Link",
      content: (
        <>
          {tableDataNew.length > 0 ? (
            <div className="relative overflow-x-auto sm:rounded-lg mt-10">
              <table className="w-full text-sm text-center text-slate-800 mb-5">
                <thead className="text-xs text-white font-bold bg-primary">
                  <tr>
                    <th className="px-6 py-2">#</th>
                    {/* <th className="px-6 py-2">Name</th>
                    <th className="px-6 py-2">Email</th>
                    <th className="px-6 py-2">Phone</th> */}
                    <th className="px-6 py-2">Amount</th>
                    {/* <th className="px-6 py-2">Vendor</th> */}
                    {/* <th className="px-6 py-2">Lead ID</th>
                    <th className="px-6 py-2">Loan ID</th> */}
                    <th className="px-6 py-2">Message</th>
                    <th className="px-6 py-2">Expiry</th>
                    <th className="px-6 py-2">Collection Status</th>
                    <th className="px-6 py-2">Settled Amount</th>
                    <th className="px-6 py-2">Payment Status</th>
                    <th className="px-6 py-2">Transaction ID</th>
                    <th className="px-6 py-2">Created On</th>
                    <th className="px-6 py-2">Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataNew?.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-slate-200 ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-2">{index + 1}</td>

                      {/* <td className="px-6 py-2">{item.name || "--"}</td>
                      <td className="px-6 py-2">{item.email || "--"}</td>
                      <td className="px-6 py-2">{item.phone || "--"}</td> */}
                      <td className="px-6 py-2">₹ {item.amount || "0"}</td>
                      {/* <td className="px-6 py-2">{item.vandor_code || "--"}</td> */}
                      {/* <td className="px-6 py-2">{item.lead_id || "--"}</td> */}
                      {/* <td className="px-6 py-2">{item.loan_id || "--"}</td> */}
                      <td className="px-6 py-2">{item.message || "--"}</td>

                      <td className="px-6 py-2">
                        {item.expiry_date
                          ? new Date(item.expiry_date).toLocaleDateString()
                          : "--"}
                      </td>

                      <td className="px-6 py-2">
                        {item.collection_status || "--"}
                      </td>

                      <td className="px-6 py-2">
                        ₹ {item.settled_amount || "0"}
                      </td>

                      {/* Payment Status Badge */}
                      <td className="px-6 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.payment_status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.payment_status || "--"}
                        </span>
                      </td>

                      <td className="px-6 py-2 text-xs break-all">
                        {item.transaction_id || "--"}
                      </td>

                      <td className="px-6 py-2">
                        {item.createdOn
                          ? new Date(item.createdOn).toLocaleString()
                          : "--"}
                      </td>
                      <td className="px-6 py-2 text-xs break-all text-nowrap">
                        {item.createdBy || "--"}
                      </td>
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
        </>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Active Loan</title>
        <meta name="Leads Verification" content="Leads Verification" />
      </Helmet>
      <AppCard data={userData} />
      <TabWrap tabData={tabData} />

      {/* Create Payday Loan Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full px-5 py-4">
          <form onSubmit={addProduct.handleSubmit}>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <TextInput
                  label="Loan Amount"
                  icon="RiMoneyRupeeCircleLine"
                  placeholder="Enter Amount"
                  name="loanAmount"
                  maxLength={7}
                  type="text"
                  {...addProduct.getFieldProps("loanAmount")}
                />
                {renderError("loanAmount")}
              </div>

              <div className="col-span-1">
                <TextInput
                  label="Interest Rate"
                  icon="MdOutlinePercent"
                  placeholder="Enter Interest Rate"
                  name="interestRate"
                  maxLength={3}
                  type="text"
                  {...addProduct.getFieldProps("interestRate")}
                />
                {renderError("interestRate")}
              </div>

              <div className="col-span-1">
                <SelectInput
                  label="Interest Type"
                  icon="RiBillLine"
                  name="interestType"
                  placeholder="Select"
                  options={[
                    { label: "Reducing", value: "reducing" },
                    { label: "Fixed", value: "fixed" },
                    { label: "Floating", value: "floating" },
                  ]}
                  {...addProduct.getFieldProps("interestType")}
                />
                {renderError("interestType")}
              </div>

              <div className="col-span-1">
                <DateInput
                  label="Reloan Date"
                  name="reloanDate"
                  id="reloanDate"
                  onChange={addProduct.handleChange}
                  onBlur={addProduct.handleBlur}
                  value={addProduct.values.reloanDate}
                />
                {renderError("reloanDate")}
              </div>

              <div className="col-span-1">
                <DateInput
                  label="Repayment Date"
                  name="tenure"
                  id="tenure"
                  onChange={addProduct.handleChange}
                  onBlur={addProduct.handleBlur}
                  value={addProduct.values.tenure}
                />
                {renderError("tenure")}
              </div>

              <div className="col-span-1">
                <TextInput
                  label="Proccessing Fee (%)"
                  icon="CiPercent"
                  placeholder="Proccesing Fee"
                  name="processFee"
                  type="text"
                  maxLength={3}
                  {...addProduct.getFieldProps("processFee")}
                />
                {renderError("processFee")}
              </div>

              <div className="col-span-1">
                <TextInput
                  label="Insurance (%)"
                  icon="CiPercent"
                  placeholder="Enter Insurance"
                  name="insurance"
                  maxLength={3}
                  type="text"
                  {...addProduct.getFieldProps("insurance")}
                />
                {renderError("insurance")}
              </div>

              <div className="col-span-1">
                <TextInput
                  label="CGST (%)"
                  icon="CiPercent"
                  placeholder="Enter CGST"
                  name="cgst"
                  type="text"
                  maxLength={3}
                  {...addProduct.getFieldProps("cgst")}
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
                  maxLength={3}
                  {...addProduct.getFieldProps("sgst")}
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
                  maxLength={3}
                  {...addProduct.getFieldProps("igst")}
                />
                {renderError("igst")}
              </div>
              <div className="col-span-1">
                <TextInput
                  label="IRR (%)"
                  icon="CiPercent"
                  placeholder="Enter IRR"
                  name="irr"
                  maxLength={3}
                  type="text"
                  {...addProduct.getFieldProps("irr")}
                />
                {renderError("irr")}
              </div>
              <div className="col-span-1">
                <TextInput
                  label="APR (%)"
                  icon="CiPercent"
                  placeholder="Enter APR"
                  name="apr"
                  maxLength={3}
                  type="text"
                  {...addProduct.getFieldProps("apr")}
                />
                {renderError("apr")}
              </div>
              {/* <div className="col-span-1">
                                <TextInput
                                    label="EIR (%)"
                                    icon="CiPercent"
                                    placeholder="Enter EIR"
                                    name="eir"
                                    maxLength={3}
                                    type="text"
                                    {...addProduct.getFieldProps("eir")}
                                />
                                {renderError("eir")}
                            </div> */}
            </div>

            <div className="flex justify-end mt-5 gap-5">
              <Button
                btnName="Close"
                btnIcon="IoCloseCircleOutline"
                onClick={() => setIsOpen(false)}
                style="mt-5 border border-red-500 text-red-500 min-w-32"
              />

              <Button
                btnName="Assign & Reloan"
                btnIcon="IoAddCircleSharp"
                type="submit"
                style="mt-5 bg-primary text-white min-w-32"
              />
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isCancelOpen} onClose={() => setisCancelOpen(false)}>
        <div className="text-center font-semibold">
          <h1>Are you sure want to Cancel Presentment?</h1>
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <Button
            btnName="Yes"
            btnIcon="IoCheckmarkCircleSharp"
            type="button"
            onClick={() => handleCancelPresentment()}
            // disabled={formik.isSubmitting}
            style="min-w-[80px] md:w-auto mt-4 py-1 px-4 border border-primary text-primary hover:border-success hover:bg-success hover:text-white hover:font-semibold"
          />

          <Button
            btnName="No"
            btnIcon="IoCloseCircleOutline"
            type="button"
            onClick={() => {
              setisCancelOpen(false);
            }}
            style="min-w-[80px] md:w-auto mt-4 py-0.5 px-4 border border-primary text-primary hover:border-dark hover:bg-dark hover:text-white hover:font-semibold"
          />
        </div>
      </Modal>
    </>
  );
};

export default ManageAppForm;

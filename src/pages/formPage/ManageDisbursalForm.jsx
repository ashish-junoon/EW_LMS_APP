import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppStatus from "../../components/utils/AppStatus";
import AppCard from "../../components/form/AppCard";
import KYCStatusCard from "../../components/form/KYCStatusCard";
import Button from "../../components/utils/Button";
import { getLeadDetails } from "../../api/ApiFunction";
import TabWrap from "../../components/utils/TabWrap";
import Modal from "../../components/utils/Modal";
import SelectInput from "../../components/fields/SelectInput";
import {
  disburesementMode,
  disbursedRemarks,
} from "../../components/content/Data";
import TextInput from "../../components/fields/TextInput";
import DateInput from "../../components/fields/DateInput";
import Loader from "../../components/utils/Loader";
import {
  UpdateLeadDisbursement,
  UpdateUserLead,
  VerifyBankDetails,
  GetAgreementLetter,
  GetLoanDocuments,
  UpdateMenualNACH,
  funderOption,
  GetFundStatus,
} from "../../api/ApiFunction";
import ErrorMsg from "../../components/utils/ErrorMsg";
import LeadHistory from "../../components/utils/LeadHistory";
import { useAuth } from "../../context/AuthContext";
import { useGetData } from "../../context/GetDataContext";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { Helmet } from "react-helmet";
import Personal from "../../components/form/Personal";
import Employment from "../../components/form/Employment";
import Address from "../../components/form/Address";
import KycInfo from "../../components/form/KycInfo";
import Gaurantor from "../../components/form/Gaurantor";
import OthersDocs from "../../components/form/OthersDocs";
import BankInfo from "../../components/form/BankInfo";
import FormSidebar from "../../components/form/FormSidebar";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import Images from "../../components/content/Images";
import LoanHistory from "../../components/utils/LoanHistory";
import OtherBankInfo from "../../components/form/OtherBankInfo";
import MandateHistory from "../../components/utils/MandateHistory";

const ManageDisbursalForm = () => {
  const [open, setOpen] = useState(false);
  const [isReadyOpen, setIsReadyOpen] = useState(false);
  const [openReject, setOpenRejcet] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNachOpen, setIsNachOpen] = useState(false);
  const [funderOptions, setFunderOptions] = useState([]);
  const [fundStatus, setFundStatus] = useState({});

  const location = useLocation();
  const lead_id = location.state?.lead_id;
  const user_id = location.state?.user_id;
  const isOnHold = location.state?.isOnHold;

  const { adminUser } = useAuth();
  const { setLeadInfo } = useOpenLeadContext();
  const { compayBankAcount } = useGetData();

  const navigate = useNavigate();
  const data = userData?.bankInfo[0];
  const today = dayjs().startOf("day");
  const threeDaysAgo = today.subtract(3, "day");
  const isBankVerified = userData?.is_bank_verified;
  const pageAccess = LoginPageFinder("page_display_name", "manage disbursal");
  const permission = pageAccess?.[0].read_write_permission;
  const funder = adminUser.role === "Funder" ? true : false;
  const isInsufficient =
    fundStatus?.funds?.[0]?.left_funds <=
    userData?.selectedproduct?.[0]?.disburesement_amount
      ? true
      : false;

  // alert(JSON.stringify(yesterday, null, 2));

  useEffect(() => {
    if (!lead_id && !user_id) {
      navigate("/");
    }
  }, [lead_id, user_id]);

  useEffect(() => {
    getFounder();
  }, []);

  const getFounder = async () => {
    try {
      const response = await funderOption();
      if (response.status) {
        setFunderOptions(response._SelectFundersLists);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching dataaaa:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

  const updateDisbursment = async (req) => {
    try {
      const response = await UpdateLeadDisbursement(req);
      // console.log("API Response:", response); // Debug log

      if (response.status) {
        toast.success(response.message);
        navigate("/manage-leads/manage-disbursal");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

  const confirmLead = async (req) => {
    try {
      const response = await UpdateUserLead(req);

      if (response.status) {
        toast.success(response.message);
        navigate("/manage-leads/manage-disbursal");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

  const handleApproveYes = async () => {
      const payload = {
        lead_id: lead_id,
        step_status: 24,
        is_prove: true,
        updated_by: adminUser?.emp_code,
        reason: "Ready for Disbursed ",
        remarks: "Lead is Ready for Disbursed, forwarded for Ready for Disbursed Page."
      };
      try {
        const response = await UpdateUserLead(payload);
        if (response.status) {
                toast.success(response.message);
                navigate("/manage-leads/manage-disbursal");
            } else {
                toast.error(response.message);
            }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      }
    };
  
    const handleApproveNo = () => {
      setIsReadyOpen(false);
    };

  const formik = useFormik({
    enableReinitialize: true, // ✅ Important: allows initialValues to update when userData changes
    initialValues: {
      bankName: "",
      paymentMode: "",
      refNo: "",
      disbursAmount:
        userData?.selectedproduct?.[0]?.disburesement_amount?.toString() || "",
      transDate: "",
      funderName: "",
    },
    validationSchema: Yup.object({
      bankName: Yup.string().required("Bank name is required."),
      paymentMode: Yup.string().required("Payment mode is required."),
      refNo: Yup.string().required("Reference number is required."),
      disbursAmount: Yup.string().required("Disbursal amount is required."),
      transDate: Yup.date()
        .required("Transaction date is required.")
        .test(
          "within-allowed-range",
          "Transaction date must be within the last 4 days including today.",
          (value) => {
            if (!value) return false;
            const date = dayjs(value).startOf("day");
            return (
              date.isSame(today) ||
              (date.isAfter(threeDaysAgo) && date.isBefore(today)) ||
              date.isSame(threeDaysAgo)
            );
          }
        ),
      funderName: Yup.string().required("Funder name is required."),
    }),
    onSubmit: async (values) => {
      const req = {
        lead_id: userData?.lead_id,
        product_code: userData?.selectedproduct?.[0]?.product_code,
        step_status: 6,
        payment_mode: values.paymentMode,
        reference_no: values.refNo,
        disbursement_amount: Math.floor(Number(values.disbursAmount)),
        disbursement_date: values.transDate,
        bank_name: values.bankName,
        updated_by: adminUser?.emp_code,
        funder_id: values.funderName,
      };

      updateDisbursment(req);
      setOpen(!open);
    },
  });

  const getFundInfo = async (payload) => {
    try {
      const response = await GetFundStatus(payload);
      if (response.status) {
        setFundStatus(response);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching dataaaa:", error);
    }
  };

  useEffect(() => {
    const funderId = formik.values.funderName;

    if (!funderId) return;

    const payload = { funder_id: funderId };
    getFundInfo(payload);
  }, [formik.values.funderName]);

  const rejectFormik = useFormik({
    initialValues: {
      reason: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Required"),
      remarks: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const req = {
        lead_id: lead_id,
        step_status: 7, //Rejected status
        is_prove: false,
        updated_by: adminUser.emp_code,
        reason: rejectFormik.values.reason,
        remarks: rejectFormik.values.remarks,
      };

      confirmLead(req);
      setOpenRejcet(!openReject);
      // toast.success('Application Rejected');
    },
  });

  const applicantData = {
    productName: userData?.selectedproduct[0]?.product_name,
    // productCode: userData?.selectedproduct[0]?.product_name,
    productType: userData?.selectedproduct[0]?.product_type,
    creditAmount: "₹" + userData?.selectedproduct[0]?.loan_amount,
    tenure: userData?.selectedproduct[0]?.tenure,
    interestRate: userData?.selectedproduct[0]?.interest_rate + "% PD",
    proccesingFee: userData?.selectedproduct[0]?.processing_fee + "%",
    insurance: userData?.selectedproduct[0]?.insurance_rate + "%",
    GSTRate:
      userData?.selectedproduct[0]?.cgst +
      userData?.selectedproduct[0]?.sgst +
      userData?.selectedproduct[0]?.igst +
      "%",
    intrestAmount: "₹" + userData?.selectedproduct[0]?.interest_amount,
    proccesingAmount: "₹" + userData?.selectedproduct[0]?.processing_fee_amount,
    insuranceAmount: "₹" + userData?.selectedproduct[0]?.insurance_premium,
    GSTAmount: "₹" + Number(userData?.selectedproduct[0]?.total_gst_amount).toFixed(2),
    disbursmentAmount: "₹" + Math.round(userData?.selectedproduct[0]?.disburesement_amount),
    repaymentAmount: "₹" + userData?.selectedproduct[0]?.emi_amount,
    repaymentFrequency: userData?.selectedproduct[0]?.repayment_frequency,
  };

  const bankDetails = {
    bankName: data?.bank_name,
    accountNumber: data?.account_number,
    IFSCCode: data?.ifsc_code,
  };

  const verifyBank = async () => {
    // const req = {
    //   user_id: user_id,
    //   lead_id: lead_id,
    //   account_number: data?.account_number,
    //   ifsc_code: data?.ifsc_code,
    //   company_id: import.meta.env.VITE_COMPANY_ID,
    //   product_name: import.meta.env.VITE_PRODUCT_NAME,
    // };

    const req={
        account_number: data?.account_number,
        account_ifsc: data?.ifsc_code,
        verification_type: "pennyless",
        lead_id: lead_id,
        user_id: user_id,
        type: 1
    }

    try {
      setIsLoading(true);
      const response = await VerifyBankDetails(req);
      // if (response.success) {
      if (response.success && response.data.is_valid) {
        setIsLoading(false);
        setBankVerified(response?.data?.is_valid);
        toast.success("Bank verified successfully.");
        fetchData();
      } else {
        // toast.error(response.message || "Bank verification failed!");
        toast.error(response.data.failure_reason || response.data.npci_error_description || "Bank verification failed!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
    setIsLoading(false);
  };

  const GetAgreement = async () => {
    const req = {
      lead_id: lead_id,
      user_id: user_id,
      doc_type: "aggrement_letter",
      loan_id: "",
      lead_status: "I",
    };
    try {
      setIsLoading(true);
      const response = await GetLoanDocuments(req);

      if (response.status) {
        setIsLoading(false);
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
    }
    setIsLoading(false);
  };

  const GetSanction = async () => {
    const req = {
      lead_id: lead_id,
      user_id: user_id,
      doc_type: "sanction_letter",
      loan_id: "",
      lead_status: "I",
    };

    try {
      setIsLoading(true);
      const response = await GetLoanDocuments(req);

      if (response.status) {
        setIsLoading(false);
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
    }

    setIsLoading(false);
  };

  const activateNach = useFormik({
    initialValues: {
      customerId: "",
      tokenId: "",
    },
    validationSchema: Yup.object({
      customerId: Yup.string()
        .required("Customer ID is required.")
        .matches(/^cust_/, 'Must start with "cust_".'),

      tokenId: Yup.string()
        .required("Token ID is required.")
        .matches(/^token_/, 'Must start with "token_".'),
    }),
    onSubmit: async (values) => {
      const req = {
        lead_id: lead_id,
        customer_id: values.customerId,
        token_id: values.tokenId,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        provider: "RAZORPAY",
      };

      try {
        const response = await UpdateMenualNACH(req);
        if (response.status) {
          setLeadInfo((prev) => ({
            ...prev,
            is_e_nach_activate: true,
          }));
          setIsNachOpen(false);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      }
      setIsNachOpen(false);
    },
  });

  const handleRejectNo = () => {
    setOpenRejcet(!openReject);
  };

  // const capitalizeWords = (str) =>
  //     str.replace(/([A-Z])/g, ' $1').trim().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const capitalizeWords = (str) =>
    str.replace(/_/g, " ").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim().split(/\s+/)
      .map((word) =>
        ["ifsc", "id", "api", "gst", "pan"].includes(word.toLowerCase())
          ? word.toUpperCase()
          : word[0]?.toUpperCase() + word.slice(1)
    ).join(" ");

  useEffect(() => {
    if (lead_id && user_id) {
      fetchData();
    }
  }, [lead_id, user_id]);

  const tabData = [
    {
      label: "Disbursal Details",
      content: (
        <div>
          <div className="flex flex-wrap lg:justify-end items-center mt-5 lg:gap-5 gap-2">
            {permission && (
              <Button
                btnName={"Verify Bank"}
                btnIcon={"PiBank"}
                type={"button"}
                onClick={verifyBank}
                disabled={isOnHold}
                style="max-w-42 border border-primary hover:bg-primary hover:text-white text-primary font-medium py-2 px-4 rounded"
              />
            )}
            <Button
              btnName={"Get Agreement"}
              btnIcon={"IoDocumentText"}
              type={"button"}
              disabled={isOnHold || funder}
              onClick={GetAgreement}
              style="max-w-42 bg-primary text-white py-2 px-4 rounded hover:bg-white font-semibold border hover:border-primary hover:text-primary"
            />
            <Button
              btnName={"Get Sanction"}
              btnIcon={"IoDocumentText"}
              type={"button"}
              disabled={isOnHold || funder}
              onClick={GetSanction}
              style="max-w-42 bg-primary text-white py-2 px-4 rounded hover:bg-white font-semibold border hover:border-primary hover:text-primary"
            />
            {userData?.is_e_nach_activate === false && (
              <div className="">
                <div className="flex justify-end">
                  <Button
                    btnName={"Update e-NACH Token"}
                    btnIcon={"MdAutoMode"}
                    type={""}
                    onClick={() => setIsNachOpen(!isNachOpen)}
                    style="min-w-[150px] bg-primary text-white font-medium py-2 px-4 rounded"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center mt-8">
            <KYCStatusCard data={userData} />
          </div>
          <hr className="my-5"></hr>
          <div className="my-5 lg:px-5 px-2">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <div className="lg:col-span-1">
                <div
                  className={`border rounded mt-5 ${
                    bankVerified || isBankVerified
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                >
                  <span
                    className={`w-full ${
                      bankVerified || isBankVerified
                        ? "bg-green-500"
                        : "bg-red-500"
                    } rounded-t flex justify-center text-white items-center`}
                  >
                    Bank Details
                  </span>
                  <div className="px-5 mb-0.5 ">
                    {Object.entries(bankDetails).map(([key, value]) => (
                      <div key={key} className="mt-2">
                        <h5 className="text-xs">{capitalizeWords(key)}</h5>
                        <span className="font-semibold text-primary">
                          {value}
                        </span>
                      </div>
                    ))}

                    {(bankVerified || isBankVerified) && (
                        <div className="flex justify-end items-center mb-2">
                          <img
                            src={Images.verifiedStamp}
                            alt="disbursal"
                            className="w-1/3"
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 gap-5">
                <div className="grid grid-cols-3 md:grid-cols-4 mb-5 gap-1">
                  {Object.entries(applicantData).map(([key, value]) => (
                    <div key={key} className="mt-2">
                      <h5 className="text-xs text-primary">
                        {capitalizeWords(key)}
                      </h5>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Borrower Application",
      content: (
        <div className="grid lg:grid-cols-7 gap-4 mt-5">
          <div className="lg:col-span-2 py-5">
            <div>{!funder && <FormSidebar data={userData} />}</div>
          </div>
          <div className={`${!funder ? "lg:col-span-5" : "lg:col-span-7"} py-5`}>
            <Personal />
            <Employment />
            <Address />
            <KycInfo />
            <BankInfo />
            <OtherBankInfo />
            <Gaurantor />
            <OthersDocs btnEnable={true} />
          </div>
        </div>
      ),
    },
    {
      label: "History",
      content: (
        <LeadHistory data={userData} btnEnable={!isOnHold && permission} />
      ),
    },
    {
      label: "Loan History",
      content: (
        <div className="mb-5">
          <LoanHistory
            btnEnable={isOnHold}
            pan={userData?.kycInfo[0]?.pan_card_number}
            data={userData} 
          />
        </div>
      ),
    },
    {
      label: "Mandate History",
      content: <MandateHistory
        data={userData}
      />
    }
  ];

  const fetchData = async () => {
    setIsLoading(true);
    const req = {
      lead_id: lead_id,
      user_id: user_id,
      login_user: adminUser.emp_code,
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

  const handleConfirm = () => {
    setOpen(!open);
  };

  const handleReadyDisbursed = () => {
    setIsReadyOpen(!isReadyOpen)
  }
  

  if (isLoading) {
    return <Loader />;
  }

  if (!userData) {
    return <div>No data available</div>;
  }


  return (
    <>
      <Helmet>
        <title>Manage Disbursal</title>
        <meta name="Leads Verification" content="Leads Verification" />
      </Helmet>
      <AppStatus appStatus={userData?.lead_status} rejectedStatus={false} />
      <AppCard data={userData} />

      <TabWrap tabData={tabData} />

      {permission && (
        <div className="col-span-2">
          <div className="flex justify-end mt-3 gap-5">
            <Button
              btnName={"Ready for Disbursed"}
              btnIcon={"MdOutlineCheckCircleOutline"}
              type={"submit"}
              disabled={isOnHold}
              onClick={handleReadyDisbursed}
              style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 border-primary px-4 text-white bg-primary border hover:border-primary text-primary hover:bg-white hover:text-primary"
            />
            <Button
              btnName={"Mark as Disbursed"}
              btnIcon={"MdOutlineCheckCircleOutline"}
              type={"submit"}
              disabled={isOnHold}
              onClick={handleConfirm}
              style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success"
            />
            <Button
              btnName={"Mark as Rejected"}
              btnIcon={"IoCloseCircleOutline"}
              type={"button"}
              disabled={isOnHold}
              onClick={() => setOpenRejcet(!openReject)}
              style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-danger text-danger bg-white hover:border-danger hover:bg-danger hover:text-white"
            />
          </div>
        </div>
      )}

      {/* Update Disbusment Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        heading={"Update Disbusment"}
        confirmText={"Update"}
        onConfirm={formik.handleSubmit}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-4 px-8">
            <div className="col-span-2">
              <SelectInput
                label={"Funder Name"}
                icon={"RiBankLine"}
                placeholder="Select"
                name={"funderName"}
                id={"funderName"}
                required
                options={funderOptions.map((funder) => ({
                  label: funder.funder_name,
                  value: funder.funder_id,
                }))}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.funderName}
              />
              {formik.touched.funderName && formik.errors.funderName && (
                <ErrorMsg error={formik.errors.funderName} />
              )}
            </div>
            {isInsufficient && (
              <span className="col-span-2 text-danger text-sm italic">
                {isInsufficient && "Insufficient Funds"}
              </span>
            )}

            {fundStatus?.status && (
              <div className="col-span-2">
                <div className="grid grid-cols-3 gap-4 w-max mx-auto">
                  <div
                    className={`border py-1 px-5 rounded shadow-sm ${
                      isInsufficient
                        ? "bg-red-100 text-danger border-red-500"
                        : "bg-green-100 text-success border-success"
                    }`}
                  >
                    <p className="text-md text-center italic">
                      Available Funds
                    </p>
                    <p className="font-bold text-center">
                      {fundStatus?.funds[0]?.left_funds}
                    </p>
                  </div>
                  <div className="border border-primary py-1 px-5 rounded shadow-sm">
                    <p className="text-md text-black text-center italic">
                      Total Funds
                    </p>
                    <p className="font-bold text-primary text-center">
                      {fundStatus?.funds[0]?.total_funds}
                    </p>
                  </div>
                  <div className="border border-primary py-1 px-5 rounded shadow-sm">
                    <p className="text-md text-black text-center italic">
                      Funds Disbursed{" "}
                    </p>
                    <p className="font-bold text-primary text-center">
                      {fundStatus?.funds[0]?.used_funds}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="col-span-2">
              <SelectInput
                label={"Disbursement Bank"}
                icon={"RiBankLine"}
                placeholder="Select"
                name={"bankName"}
                id={"bankName"}
                required
                options={compayBankAcount.map((bankName) => ({
                  label: bankName.bank_name,
                  value: bankName.bank_name,
                }))}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bankName}
              />
              {formik.touched.bankName && formik.errors.bankName && (
                <ErrorMsg error={formik.errors.bankName} />
              )}
            </div>
            <div className="col-span-1">
              <SelectInput
                label={"Disbursement Mode"}
                icon={"RiSecurePaymentLine"}
                placeholder="Select"
                name={"paymentMode"}
                id={"paymentMode"}
                required
                options={disburesementMode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.paymentMode}
              />
              {formik.touched.paymentMode && formik.errors.paymentMode && (
                <ErrorMsg error={formik.errors.paymentMode} />
              )}
            </div>
            <div className="col-span-1">
              <TextInput
                label={"Reference Number"}
                placeholder={"Reference"}
                icon={"MdNumbers"}
                name={"refNo"}
                id={"refNo"}
                maxLength={22}
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.refNo}
              />
              {formik.touched.refNo && formik.errors.refNo && (
                <ErrorMsg error={formik.errors.refNo} />
              )}
            </div>
            <div className="col-span-1">
              <TextInput
                label={"Disbursed Amount"}
                placeholder={"Disbursed Amount"}
                icon={"MdCurrencyRupee"}
                name={"disbursAmount"}
                id={"disbursAmount"}
                disabled={true}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.disbursAmount}
              />
              {formik.touched.disbursAmount && formik.errors.disbursAmount && (
                <ErrorMsg error={formik.errors.disbursAmount} />
              )}
            </div>
            <div className="col-span-1">
              <DateInput
                label="Disbursement Date"
                name="transDate"
                id="transDate"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.transDate}
                // max={new Date().getFullYear() - 0 } // Limit to 18 years ago
                // max={new Date().toISOString().split("T")[0]}
                max={new Date().toLocaleDateString("en-CA")}
              />
              {formik.touched.transDate && formik.errors.transDate && (
                <ErrorMsg error={formik.errors.transDate} />
              )}
            </div>
          </div>
          <div className="flex justify-end items-center gap-5 my-3">
            <Button
              btnName="Update"
              btnIcon="RiFileList3Line"
              type="submit"
              disabled={isInsufficient}
              style="min-w-[100px] md:w-auto mt-4 py-1 px-4 bg-success text-white"
            />
            <Button
              btnName={"Cancel"}
              btnIcon={"IoCloseCircleOutline"}
              type={"button"}
              onClick={() => setOpen(false)}
              style="min-w-[100px] border border-red-500 text-red-500 mt-4 py-1 px-4"
            />
          </div>
        </form>
      </Modal>

      {/* Reject Disbusment Modal */}
      <Modal
        Modal
        isOpen={openReject}
        onClose={() => setOpenRejcet(false)}
        heading={"Reject Disbusment"}
      >
        <div className="px-5">
          <form onSubmit={rejectFormik.handleSubmit} className="my-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <SelectInput
                  label="Rejection Reason"
                  placeholder="Select"
                  icon="RiDraftLine"
                  name="reason"
                  id="reason"
                  options={disbursedRemarks}
                  onChange={rejectFormik.handleChange}
                  onBlur={rejectFormik.handleBlur}
                  value={rejectFormik.values.reason}
                />
                {rejectFormik.touched.reason && rejectFormik.errors.reason && (
                  <ErrorMsg error={rejectFormik.errors.reason} />
                )}
              </div>
              <div className="col-span-2">
                <TextInput
                  label="Remarks"
                  icon="GoPencil"
                  placeholder="Write Remarks"
                  name="remarks"
                  id="remarks"
                  onChange={rejectFormik.handleChange}
                  onBlur={rejectFormik.handleBlur}
                  value={rejectFormik.values.remarks}
                />
                {rejectFormik.touched.remarks &&
                  rejectFormik.errors.remarks && (
                    <ErrorMsg error={rejectFormik.errors.remarks} />
                  )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <Button
                btnName="Reject"
                btnIcon="IoCheckmarkCircleSharp"
                type="submit"
                style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success"
              />
              <Button
                btnName={"Cancel"}
                btnIcon={"IoCloseCircleOutline"}
                type={"button"}
                onClick={handleRejectNo}
                style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-danger text-danger hover:bg-danger hover:text-white"
              />
            </div>
          </form>
        </div>
      </Modal>

      {/* Update Nach Modal */}
      <Modal
        Modal
        isOpen={isNachOpen}
        onClose={() => setIsNachOpen(false)}
        heading={"Update eNACH Token"}
      >
        <div className="px-5">
          <form onSubmit={activateNach.handleSubmit} className="my-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <TextInput
                  label="Customer ID"
                  icon="IoPersonOutline"
                  placeholder="cust_QVtdI1U8xPGPMH"
                  name="customerId"
                  id="customerId"
                  maxLength={25}
                  onChange={activateNach.handleChange}
                  onBlur={activateNach.handleBlur}
                  value={activateNach.values.customerId}
                />
                {activateNach.touched.customerId &&
                  activateNach.errors.customerId && (
                    <ErrorMsg error={activateNach.errors.customerId} />
                  )}
              </div>
              <div className="col-span-2">
                <TextInput
                  label="Token ID"
                  icon="IoPersonOutline"
                  placeholder="token_QVtzGtj2FDJWvJ"
                  name="tokenId"
                  maxLength={25}
                  id="tokenId"
                  onChange={activateNach.handleChange}
                  onBlur={activateNach.handleBlur}
                  value={activateNach.values.tokenId}
                />
                {activateNach.touched.tokenId &&
                  activateNach.errors.tokenId && (
                    <ErrorMsg error={activateNach.errors.tokenId} />
                  )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <Button
                btnName="Update"
                btnIcon="IoCheckmarkCircleSharp"
                type="submit"
                style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-primary px-4 text-white bg-primary border hover:border-primary text-white  hover:bg-white hover:text-primary"
              />
              <Button
                btnName={"Close"}
                btnIcon={"IoCloseCircleOutline"}
                type={"button"}
                onClick={() => setIsNachOpen(false)}
                style="min-w-[100px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger"
              />
            </div>
          </form>
        </div>
      </Modal>

    {/* Ready for disbursed Confirmation model  */}
      <Modal isOpen={isReadyOpen} onClose={() => setIsReadyOpen(false)}>
        <div className="text-center font-semibold my-3">
          <h1>Are you sure to mark this Profile as Ready for Disbursed ?</h1>
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <Button
            btnName="Yes"
            btnIcon="IoCheckmarkCircleSharp"
            type="submit"
            onClick={handleApproveYes}
            style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
          />
          <Button
            btnName={"No"}
            btnIcon={"IoCloseCircleOutline"}
            type={"button"}
            onClick={handleApproveNo}
            style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
          />
        </div>
      </Modal>
    </>
  );
};

export default ManageDisbursalForm;

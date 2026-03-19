import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AppStatus from "../../components/utils/AppStatus";
import AppCard from "../../components/form/AppCard";
import KYCStatusCard from "../../components/form/KYCStatusCard";
import {
  getLeadDetails,
  UpdateUserLead,
  UpdateMenualNACH,
  getbankCodeListByCode,
  registerEMandateEaseBuze,
} from "../../api/ApiFunction";
import SelectInput from "../../components/fields/SelectInput";
import TextInput from "../../components/fields/TextInput";
import { eKYCRemarks } from "../../components/content/Data";
import Button from "../../components/utils/Button";
import Modal from "../../components/utils/Modal";
import ErrorMsg from "../../components/utils/ErrorMsg";
import Loader from "../../components/utils/Loader";
import { useAuth } from "../../context/AuthContext";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { Helmet } from "react-helmet";
import TabWrap from "../../components/utils/TabWrap";
import FormSidebar from "../../components/form/FormSidebar";
import LeadHistory from "../../components/utils/LeadHistory";
import Personal from "../../components/form/Personal";
import Employment from "../../components/form/Employment";
import Address from "../../components/form/Address";
import KycInfo from "../../components/form/KycInfo";
import Gaurantor from "../../components/form/Gaurantor";
import BankInfo from "../../components/form/BankInfo";
import SelectedLoan from "../../components/form/SelectedLoan";
import OthersDocs from "../../components/form/OthersDocs";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import LoanHistory from "../../components/utils/LoanHistory";
import { paymentType } from "../../components/content/Data";
import OtherBankInfo from "../../components/form/OtherBankInfo";
import DateInput from "../../components/fields/DateInput";
import AddBank from "../../components/form/AddBank";
import MandateHistory from "../../components/utils/MandateHistory";

const LeadKYCForm = () => {
  const [openApporve, setOpenApporve] = useState(false);
  const [openReject, setOpenRejcet] = useState(false);
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNachOpen, setIsNachOpen] = useState(false);
  const [isBankOpen, setisBankOpen] = useState(false);
  const [Error, SetError] = useState(null);
  const [EmandateData, SetEmandateData] = useState(null);
  const [MandateLink, SetMandateLink] = useState(null);
  //   const [authMode, setAuthMode] = useState("");
  const [bankCodeListByCode, setbankCodeListByCode] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const lead_id = location.state?.lead_id;
  const user_id = location.state?.user_id;
  const isOnHold = location.state?.isOnHold;

  const transactionId = searchParams.get("id");
  const transactinType = searchParams.get("type");

  const navigate = useNavigate();
  const { setLeadInfo } = useOpenLeadContext();
  const { adminUser } = useAuth();

  const pageAccess = LoginPageFinder("page_display_name", "leads in kyc");
  const permission = pageAccess?.[0].read_write_permission;
  const funder = adminUser.role === "Funder" ? true : false;

  const addOneDay = (d) => {
  const [dd, mm, yy] = d.split("-").map(Number);
  const dt = new Date(yy, mm - 1, dd + 1);
  return `${String(dt.getDate()).padStart(2,0)}-${String(dt.getMonth()+1).padStart(2,0)}-${dt.getFullYear()}`;
};



  const FLAG_MAP = {
    netbank_flag: {
      value: "NetBanking",
      label: "Net banking",
    },
    adhar_flag: {
      value: "DebitCard",
      label: "Debit Card",
    },
    // adharFlag: {
    //   value: "aadhaar",
    //   label: "Aadhaar",
    // },
    // panFlag: {
    //   value: "pan",
    //   label: "PAN",
    // },
    // custidFlag: {
    //   value: "customer_id",
    //   label: "Customer ID",
    // },
  };

  useEffect(() => {
    if (lead_id && user_id) {
      fetchData();
    } else {
      navigate("/");
    }
  }, [lead_id, user_id]);

  const confirmLead = async (req) => {
    try {
      const response = await UpdateUserLead(req);
      console.log("API Response:", response); // Debug log

      if (response.status) {
        toast.success(response.message);
        navigate("/manage-leads/leads-in-kyc");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

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
        // console.log("lead info: ", response)
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

  //   To get AuthMode 0n the basis of bank code
  const getEnatchMethods = async (req) => {
    try {
      SetError(null);
      setbankCodeListByCode([]);

      const response = await getbankCodeListByCode(req);
      if (!response.success) {
        SetError(response.message);
      }

      if (response.success) {
        const enabledMethods = Object.entries(response?.data || {})
          .filter(([key, value]) => value === true && FLAG_MAP[key])
          .map(([key]) => FLAG_MAP[key]);

        setbankCodeListByCode(enabledMethods);

        if (!enabledMethods.length) {
          setBank.setFieldValue("authMode", "");
        }
      }
    } catch (error) {
      setBank.setFieldValue("authMode", "");
      console.error(
        "Get Token Post Emandate:",
        error.response?.data || error.message,
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      reason: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Bank name is required."),
      remarks: Yup.string().required("Bank name is required."),
    }),
    onSubmit: async (values) => {
      const req = {
        lead_id: lead_id,
        step_status: 7, //Rejected status
        is_prove: false,
        updated_by: adminUser.emp_code,
        reason: formik.values.reason,
        remarks: formik.values.remarks,
      };

      confirmLead(req);
      console.log("values:", req);
      setOpenRejcet(!openReject);
      // toast.success('Application Rejected');
    },
  });

  //Activate Nach function
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

  const setBank = useFormik({
    initialValues: {
      userBank: "",
      authMode: "",
      ifsc: "",
      account_number: "",
      account_holder_name: "",
      expiry_date: "",
      message: "",
      final_collection_date: "",
      email: "",
    },
    validationSchema: Yup.object({
      userBank: Yup.string().required("Bank is required"),
      authMode: Yup.string().required("Enach Mode is required"),
      account_number: Yup.string().required("Payment type required"),
      ifsc: Yup.string().required("Payment type required"),
      account_holder_name: Yup.string().required("Payment type required"),
      message: Yup.string().required("Message required"),
      email: Yup.string()
        .nullable()
        .notRequired()
        .test(
          "email-validation",
          "Invalid email format",
          (value) => !value || Yup.string().email().isValidSync(value),
        ),
        expiry_date: Yup.date().required("Expiry date is required")
        .min(new Date(new Date().setHours(0, 0, 0, 0)), "Expiry date cannot be in the past"),
      // expiry_date: Yup.date()
      //   .min(
      //     new Date(new Date().setHours(0, 0, 0, 0)),
      //     "Expiry date cannot be in the past",
      //   )
      //   .required("Expiry date is required"),

      // final_collection_date: Yup.date()
      //   .min(
      //     new Date(new Date().setHours(0, 0, 0, 0)),
      //     "Final collection date cannot be in the past",
      //   )
      //   .test(
      //     "before-expiry",
      //     "Final collection date must be before expiry date",
      //     function (value) {
      //       const { expiry_date } = this.parent;
      //       if (!value || !expiry_date) return true; // let required handle empties
      //       return value < expiry_date;
      //     },
      //   )
      //   .required("Final collection date is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .notRequired(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      //for expiry Date DD-MM-YY to YY-DD-MM
      const formattedDate = values.expiry_date
        ? values.expiry_date.split("-").reverse().join("-")
        : "";

        const formattedDate2 = addOneDay(formattedDate)

      //for Final Collection Date Date DD-MM-YY to YY-DD-MM
      // const formattedDate2 = values.final_collection_date
      //   ? values.final_collection_date.split("-").reverse().join("-")
      //   : "";

      const req = {
        email: values.email || userData?.personalInfo[0]?.email_id,
        phone: values.phone || userData?.mobile_number,
        amount: "1.00",
        name: userData.personalInfo[0].full_name.trim(),
        lead_id: userData?.lead_id,
        user_id: userData?.user_id,
        loan_id: "",
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_code: import.meta.env.VITE_PRODUCT_NAME,
        message: values.message,
        expiry_date: formattedDate,
        is_auto_debit_link: true,
        is_auto_debit_seamless: true,

        auth_details: {
          // max_debit_amount: 10.0,
          max_debit_amount:
            userData?.getAssignProduct[0]?.loan_amount * 4 || 100000, // Asking permision of 4x of loan amt. or  1lakh for mandate,
          final_collection_date: formattedDate2,
          auto_debit_type: "ENACH",
          holder_account_number: values.account_number,
          holder_account_type: "SAVINGS",
          holder_bank_ifsc: values.ifsc,
          auth_mode: values.authMode,
          amount_rule: "MAX",
          holder_bank_code: values.ifsc?.slice(0, 4),
          frequency: "DAILY",
        },
      };

      try {
        const response = await registerEMandateEaseBuze(req);
        if (response.status) {
          SetEmandateData(response);
          SetMandateLink(response?.data?.payment_url)
          resetForm();
        } else {
          const errorMsg = response?.message || "Something went wrong";
          toast.error(errorMsg);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const userBank = setBank.values.userBank;
  useEffect(() => {
    if (!userBank) {
      setBank.setFieldValue("account_holder_name", "");
      setBank.setFieldValue("ifsc", "");
      setBank.setFieldValue("account_number", "");
      setBank.setFieldValue("bank_code", "");
      setBank.setFieldValue("authMode", "");
      return;
    }

    const bank = userData?.secondarybankinfo?.find(
      (b) => b.ifsc_code.slice(0, 4) === userBank,
    );

    if (!bank) return;

    setBank.setValues((prev) => ({
      ...prev,
      account_holder_name: bank.account_holder_name || "",
      ifsc: bank.ifsc_code || "",
      account_number: bank.account_number || "",
      bank_code: bank.ifsc_code.slice(0, 4) || "",
    }));

    // call your API
    getEnatchMethods(userBank);
  }, [userBank]);

  // const handleNachOpen = () => {
  //     setIsNachOpen(true);
  // };

  // handle Approve confirm Yes button
  const handleApproveYes = () => {
    const { is_e_kyc_done, is_e_nach_activate, is_loan_consent, video_kyc_verified } = userData;

    if (!is_e_kyc_done || !is_e_nach_activate || !is_loan_consent || !video_kyc_verified) {
      toast.error("Wait for applicant to complete application.");
      return;
    }

    const req = {
      lead_id,
      step_status: 5,
      is_prove: true,
      updated_by: adminUser.emp_code,
      reason: "eKYC Done",
      remarks: "eKYC, eMandate complete. Loan applied, sent for disbursal.",
    };

    // check for enach for primary bank
    // const primaryBank = userData?.bankInfo?.[0];
    // if(!primaryBank?.is_e_nach_created) toast.error(`Enach not set to Primary bank: ${primaryBank?.bank_name}`)

    // check for enach for all secondary banks
    // userData?.secondarybankinfo?.map((bank) => !bank?.is_e_nach_created && toast.error(`Enach not set to Secondary bank: ${bank?.bank_name}`))

    // return in any case
    // if(userData?.secondarybankinfo?.some((bank) => !bank?.is_e_nach_created) || !primaryBank?.is_e_nach_created) return;

    confirmLead(req);
    setOpenApporve(false); // Close modal after approval
    // navigate("/manage-leads/leads-in-kyc");
  };

  //handle Approve confirm No button
  const handleApproveNo = () => {
    setOpenApporve(!openApporve);
  };

  // handle Reject lead No button
  const handleRejectNo = () => {
    setOpenRejcet(!openReject);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!userData) {
    return <div>No data available</div>;
  }

  //To Copy Link
  const HandleCopyLink = async (data) => {
    try {
      await navigator.clipboard.writeText(data);
      toast.success("Link Copied Successfully!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const tabData = [
    {
      label: "Application Status",
      content: (
        <div className="my-8">
          <KYCStatusCard />
          <div className="mt-5 mx-auto">
            <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
              <div className="">
                <SelectedLoan />
              </div>
              <div className="">
                <div className="flex flex-wrap gap-2">
                  {/* <div className=''>
                      <AddBank fetchData={fetchData} />
                  </div> */}
                  {permission &&
                  <Button
                    btnName={"Create Mandate"}
                    btnIcon={"MdAutoMode"}
                    type={""}
                    disabled={isOnHold}
                    onClick={() => {
                      userData?.secondarybankinfo.length
                        ? setisBankOpen(!isBankOpen)
                        : toast.info("No Banks Found for Mandate!");
                    }}
                    style="min-w-[150px] bg-primary text-sm text-white font-medium border border-primary py-2 px-4 rounded hover:bg-white hover:text-primary"
                  />}
                  {permission && userData?.is_e_nach_activate === false && (
                    <Button
                      btnName={"Update e-NACH Token"}
                      btnIcon={"MdAutoMode"}
                      type={""}
                      disabled={isOnHold}
                      onClick={() => setIsNachOpen(!isNachOpen)}
                      style="min-w-[150px] bg-primary text-sm text-white font-medium border border-primary py-2 px-4 rounded hover:bg-white hover:text-primary"
                    />
                  )}
                </div>

                {MandateLink && 
                <div className="mt-5 font-semibold text-sm">
                  <p>Mandate Link:</p>
                  <div className="flex gap-1 w-full">
                    <div className="bg-gray-100 overflow-auto no-scrollbar border border-gray-200 text-sm font-semibold text-primary px-1 min-w-[300px] max-w-[300px]">{MandateLink}</div>
                    <Button
                        // btnName={"Update e-NACH Token"}
                        btnIcon={"FaCopy"}
                        type={""}
                        disabled={isOnHold}
                        onClick={()=> HandleCopyLink(MandateLink)}
                        style="bg-primary text-sm text-white font-medium border border-primary p-2 rounded hover:bg-white hover:text-primary"
                    />
                  </div>
                </div>
                }
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
            <div className="lg:px-5">
              <Personal />
              <Employment />
              <Address />
              <KycInfo />
              <BankInfo btnEnable={true} />
              <OtherBankInfo />
              <Gaurantor btnEnable={true} />
              <OthersDocs btnEnable={true} />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Lead Remarks",
      content: (
        <div className="mb-5">
          <LeadHistory data={userData} btnEnable={!isOnHold && permission} />
        </div>
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
      content: (
        <div className="mb-5">
          <MandateHistory
            data={userData}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Leads eKYC</title>
        <meta name="Leads Verification" content="Leads Verification" />
      </Helmet>
      <div>
        <AppStatus appStatus={userData?.lead_status} rejectedStatus={false} />
        <AppCard data={userData} />
      </div>
      <div className="mt-4">
        <TabWrap tabData={tabData} />
      </div>
      {permission && userData?.lead_status === 4 && (
        <div className="flex justify-end gap-5 mt-5">
          <Button
            btnName={"Mark as Approved"}
            btnIcon={"IoCloseCircleOutline"}
            type={""}
            disabled={isOnHold}
            onClick={() => setOpenApporve(!openApporve)}
            style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success"
          />

          <Button
            btnName={"Mark as Rejected"}
            btnIcon={"IoCloseCircleOutline"}
            type={""}
            disabled={isOnHold}
            onClick={() => setOpenRejcet(!openReject)}
            style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-danger text-danger bg-white hover:border-danger hover:bg-danger hover:text-white"
          />
        </div>
      )}

      {/* Approve Modal */}
      <Modal isOpen={openApporve} onClose={() => setOpenApporve(false)}>
        <div className="text-center font-semibold">
          <h1>Are you sure you want to approve?</h1>
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <Button
            btnName="YES"
            btnIcon="IoCheckmarkCircleSharp"
            type="submit"
            onClick={handleApproveYes}
            style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
          />
          <Button
            btnName={"NO"}
            btnIcon={"IoCloseCircleOutline"}
            type={"button"}
            onClick={handleApproveNo}
            style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
          />
        </div>
      </Modal>
      {/* Reject Modal */}
      <Modal
        Modal
        isOpen={openReject}
        onClose={() => setOpenRejcet(false)}
        heading={"Reject Lead"}
      >
        <div className="px-5">
          <form onSubmit={formik.handleSubmit} className="my-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <SelectInput
                  label="Rejection Reason"
                  placeholder="Select"
                  icon="RiDraftLine"
                  name="reason"
                  id="reason"
                  options={eKYCRemarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.reason}
                />
                {formik.touched.reason && formik.errors.reason && (
                  <ErrorMsg error={formik.errors.reason} />
                )}
              </div>
              <div className="col-span-2">
                <TextInput
                  label="Remarks"
                  icon="GoPencil"
                  placeholder="Write Remarks"
                  name="remarks"
                  id="remarks"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.remarks}
                />
                {formik.touched.remarks && formik.errors.remarks && (
                  <ErrorMsg error={formik.errors.remarks} />
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

      <Modal
        Modal
        isOpen={isBankOpen}
        onClose={() => setisBankOpen(false)}
        heading={EmandateData ? "" : "Create Mandate Request Link"}
      >
        {EmandateData ? (
          <div className="w-full px-5 py-4">
            <div className="text-center font-semibold">
              <h1>Your Mandate Request Send Successfully!</h1>
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <Button
                btnName="Copy Link"
                btnIcon="IoCheckmarkCircleSharp"
                type="button"
                onClick={() => HandleCopyLink(EmandateData?.data?.payment_url)}
                style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-success hover:bg-white hover:text-success hover:font-bold"
              />
              <Button
                btnName="Back"
                btnIcon="IoCheckmarkCircleSharp"
                type="button"
                onClick={() => {
                  (setisBankOpen(false), SetEmandateData(null));
                }}
                style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-primary px-4 text-white bg-primary border hover:border-primary text-primary hover:bg-white hover:text-primary hover:font-bold"
              />
            </div>
          </div>
        ) : (
          <div className="w-full px-5 py-4">
            <form onSubmit={setBank.handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <SelectInput
                    label="Select Bank"
                    icon="PiBankDuotone"
                    name="userBank"
                    placeholder="Select"
                    options={userData?.secondarybankinfo?.map((bank) => ({
                      value: bank.ifsc_code.slice(0, 4),
                      label: bank.bank_name,
                      isdisable: bank.is_e_nach_created,
                    }))}
                    {...setBank.getFieldProps("userBank")}
                  />
                  {setBank.touched.userBank && setBank.errors.userBank && (
                    <ErrorMsg error={setBank.errors.userBank} />
                  )}
                </div>

                <div className="col-span-1">
                  <SelectInput
                    disabled={!userBank}
                    label="ENach Mode"
                    icon="MdOutlineAddModerator"
                    name="authMode"
                    placeholder="Select"
                    options={bankCodeListByCode.map((mode) => ({
                      value: mode.value,
                      label: mode.label,
                    }))}
                    {...setBank.getFieldProps("authMode")}
                  />
                  {Error ? (
                    <ErrorMsg error={Error} />
                  ) : (
                    setBank.touched.authMode &&
                    setBank.errors.authMode && (
                      <ErrorMsg error={setBank.errors.authMode} />
                    )
                  )}
                </div>

                <div className="col-span-1">
                  <TextInput
                    readOnly
                    label="Account Holder Name"
                    icon="MdDriveFileRenameOutline"
                    placeholder="Enter Name"
                    name="account_holder_name"
                    maxLength={11}
                    type="text"
                    {...setBank.getFieldProps("account_holder_name")}
                  />
                  {setBank.touched.account_holder_name &&
                    setBank.errors.account_holder_name && (
                      <ErrorMsg error={setBank.errors.account_holder_name} />
                    )}
                </div>
                <div className="col-span-1">
                  <TextInput
                    readOnly
                    label="IFSC Code"
                    icon="PiBankDuotone"
                    placeholder="Enter Name"
                    name="ifsc"
                    maxLength={11}
                    type="text"
                    {...setBank.getFieldProps("ifsc")}
                  />
                  {setBank.touched.ifsc && setBank.errors.ifsc && (
                    <ErrorMsg error={setBank.errors.ifsc} />
                  )}
                </div>
                <div className="col-span-1">
                  <TextInput
                    readOnly
                    label="Account Number"
                    icon="PiBankDuotone"
                    placeholder="Enter Name"
                    name="account_number"
                    maxLength={18}
                    type="text"
                    {...setBank.getFieldProps("account_number")}
                  />
                  {setBank.touched.account_number &&
                    setBank.errors.account_number && (
                      <ErrorMsg error={setBank.errors.account_number} />
                    )}
                </div>

                <div className="col-span-1">
                  <TextInput
                    label="Enter Message"
                    icon="MdOutlineMessage"
                    placeholder="Enter Message"
                    name="message"
                    maxLength={50}
                    type="text"
                    {...setBank.getFieldProps("message")}
                  />
                  {setBank.touched.message && setBank.errors.message && (
                    <ErrorMsg error={setBank.errors.message} />
                  )}
                </div>
                <div className="col-span-1">
                  <DateInput
                    label="Expiry Date"
                    name="expiry_date"
                    id="expiry_date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]} // 👈 blocks past dates
                    value={setBank.values.expiry_date}
                    onChange={setBank.handleChange}
                    onBlur={setBank.handleBlur}
                    placeholder="Enter your expiry_date"
                  />

                  {setBank.touched.expiry_date &&
                    setBank.errors.expiry_date && (
                      <ErrorMsg error={setBank.errors.expiry_date} />
                    )}
                </div>

                {/* <div className="col-span-1">
                  <DateInput
                    label="Final Collection Date"
                    name="final_collection_date"
                    id="final_collection_date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]} // 👈 blocks past dates
                    value={setBank.values.final_collection_date}
                    onChange={setBank.handleChange}
                    onBlur={setBank.handleBlur}
                    placeholder="Enter your final_collection_date"
                  />
                  {setBank.touched.final_collection_date &&
                    setBank.errors.final_collection_date && (
                      <ErrorMsg error={setBank.errors.final_collection_date} />
                    )}
                </div> */}

                <div className="col-span-1">
                  <TextInput
                    label="Enter Phone"
                    icon="MdCall"
                    placeholder="Enter Phone"
                    name="phone"
                    maxLength={10}
                    type="text"
                    {...setBank.getFieldProps("phone")}
                  />
                  {setBank.touched.phone && setBank.errors.phone && (
                    <ErrorMsg error={setBank.errors.phone} />
                  )}
                </div>

                <div className="col-span-1">
                  <TextInput
                    label="Enter Email"
                    icon="MdOutlineAlternateEmail"
                    placeholder="Enter Email"
                    name="email"
                    maxLength={35}
                    type="email"
                    {...setBank.getFieldProps("email")}
                  />
                  {setBank.touched.email && setBank.errors.email && (
                    <ErrorMsg error={setBank.errors.email} />
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-5 gap-5">
                <Button
                  btnName="Close"
                  btnIcon="IoCloseCircleOutline"
                  onClick={() => setisBankOpen(false)}
                  style="mt-5 border border-red-500 text-red-500 min-w-32"
                />

                <Button
                  btnName="Submit"
                  btnIcon="IoAddCircleSharp"
                  type="submit"
                  style="mt-5 bg-primary text-white min-w-32"
                />
              </div>
            </form>
          </div>
        )}
      </Modal>
    </>
  );
};

export default LeadKYCForm;

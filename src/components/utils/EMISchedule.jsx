import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  GetEMISchedule,
  PullNACHPayment,
  WavedOffAmount,
  UpdateMenualEMIPayment,
  UpdateLeadDisbursement,
  GetLoanDocuments,
  funderOption,
  GetUpdateLoanEMI,
  PullNACHPaymentEaseBuzz,
  PullPaymentUsingEaseBuzz,
  getMandateHistory,
} from "../../api/ApiFunction";
import Button from "./Button";
import Modal from "./Modal";
import dayjs from "dayjs";
import Icon from "./Icon";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import DateInput from "../fields/DateInput";
import UploadInput from "../fields/UploadInput";
import ErrorMsg from "./ErrorMsg";
import { toast } from "react-toastify";
import { FileConverter } from "./FileConverter";
import { useAuth } from "../../context/AuthContext";
import { useGetData } from "../../context/GetDataContext";
import {
  emiStaus,
  collectionPaymentMode,
  disburesementMode,
} from "../content/Data";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import Images from "../content/Images";
import LoginPageFinder from "./LoginPageFinder";
import TimeInput from "../fields/TimeInput";
import EditCollectionForm from "../form/EditCollectionForm";

// Extend dayjs with the plugin
dayjs.extend(isSameOrBefore);

function EMISchedule({ data, loan_Id, hideincollection, fetchData }) {
  const [tableData, setTableData] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [IsOpen, setIsOpen] = useState(false);
  const [IsEditColOpen, setIsEditColOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPullNach, setIsPullNach] = useState(false);
  const [initialFile, setInitialFile] = useState(null);
  const [isWriteoff, setIsWriteoff] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [utrUpdate, setUtrUpdate] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  // const [isMandateAuthorized, setisMandateAuthorized] = useState(false);
  const [mandateselectedBank, setmandateselectedBank] = useState(null);

  const isMandateAuthorized = historyData?.find((elm)=> elm?.mandate_id == mandateselectedBank?.mandate_id)?.status == 'authorized'
  // setisMandateAuthorized(mandateData?.status == 'authorized')

  const [isDisbursed, setIsDisbursed] = useState(false);

  const [funderOptions, setFunderOptions] = useState([]);
  const [fundStatus, setFundStatus] = useState({});
  const [updateEMI, setUpdateEMI] = useState([]);

  const [mandateAccountDetails, setMandateAccountDetails] = useState({});
  const defaultMandateBank = data?.enachModel.find(
    (mandate) => mandate?.account_type == 1,
  )?.bank_name;
  const [selectedBank, setSelectedBank] = useState(defaultMandateBank);
  // console.log("default primary ", defaultMandateBank)

  const navigate = useNavigate();
  const { adminUser } = useAuth();
  const loanId = data?.selectedproduct?.[0]?.loan_id;
  const userId = data?.user_id;
  const leadId = data?.lead_id;
  const activeLoan = schedule?.activeLoanDetails;
  const { compayBankAcount } = useGetData();
  const pageAccess = LoginPageFinder("page_display_name", "accounts");
  const permission = pageAccess?.[0]?.read_write_permission;
  const funder = adminUser?.role === "Funder" ? true : false;
  const disbursedDate = dayjs(activeLoan?.disbursement_date).format(
    "DD-MM-YYYY",
  );
  const isInsufficient =
    fundStatus?.funds?.[0]?.left_funds <= activeLoan?.disburesement_amount
      ? true
      : false;

  const role = adminUser?.role;
  const emp_code = adminUser?.emp_code;
  const pullPaymentHistoriesData = data?.pullPaymentHistories;

  // Get today and yesterday for validation
  const today = dayjs().startOf("day");
  const threeDaysAgo = today.subtract(3, "day");

  // const isEasebuzz = data?.enachModel[0]?.provider === "EASEBUZZ"; // your condition for Easebuzz or Razorpay
  const [isEasebuzz, setIsEasebuzz] = useState(null);

  // const totalOutstanding = activeLoan?.due_amount_on_current_day;
  const [totalOutstanding, setTotalOutstanding] = useState(
    activeLoan?.due_amount_on_current_day,
  );

  const isHardUpdateAllowed = adminUser.emp_code == "JC0020";

  const loanDetails = [
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
    { label: "Tenure", value: activeLoan?.tenure, className: "text-gray-500" },
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
      label: "Current Interest",
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
  ];

  // alert(JSON.stringify(activeLoan?.disbursed_amount))

  useEffect(() => {
    if (!loan_Id || !leadId) return;
    const fetchData = async () => {
      try {
        const response = await GetEMISchedule({
          loan_id: loan_Id,
          lead_id: leadId,
        });
        if (response.status) {
          setSchedule(response);
          setTableData(response.emi_Schedules || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [loanId, leadId]);

  useEffect(() => {
    const checkDisbursementStatus = () => {
      if (!disbursedDate) return;

      const [day, month, year] = disbursedDate.split("-").map(Number);

      // Use local time to avoid timezone issues
      const disbursed = new Date(year, month - 1, day); // JS months are 0-based
      const today = new Date();

      // Zero out time
      disbursed.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      // Difference in milliseconds
      const diffTime = today.getTime() - disbursed.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      // console.log('Disbursed:', disbursed.toDateString());
      // console.log('Today:', today.toDateString());
      // console.log('DiffDays:', diffDays);

      if (diffDays >= 0 && diffDays <= 4) {
        setIsDisbursed(true);
      } else {
        setIsDisbursed(false);
      }
    };

    checkDisbursementStatus();
  }, [disbursedDate]);

  // const getMinDate = (role, emp_code) => {
  //   if(emp_code == "JC0020"){
  //   }else if (
  //     role == "admin" ||
  //     role == "administrator" ||
  //     emp_code == "JC0001" ||
  //     emp_code == "JC0043" ||
  //     emp_code == "JC0002"
  //   ) {
  //     const today = new Date();
  //     today.setDate(today.getDate() - 30); // 30 days after today
  //     const mindate = today.toISOString().split("T")[0];
  //     return mindate;
  //   } else {
  //     const today = new Date();
  //     today.setDate(today.getDate() - 4); // 5 days after today
  //     const mindate = today.toISOString().split("T")[0];
  //     return mindate;
  //   }
  // };

  const getMinDate = (role, emp_code) => {
    if (
      emp_code == "JC0020" ||
      emp_code == "JC0037" ||
      emp_code == "JC0001" ||
      emp_code == "JC0044" ||
      emp_code == "JC0061"
    ) {
      return;
    } else if (
      role == "admin" ||
      emp_code == "JC0043"
      // role == "administrator" ||
    ) {
      const today = new Date();
      today.setDate(today.getDate() - 30); // 30 days after today
      const mindate = today.toISOString().split("T")[0];
      return mindate;
    } else {
      const today = new Date();
      today.setDate(today.getDate() - 4); // 5 days after today
      const mindate = today.toISOString().split("T")[0];
      return mindate;
    }
  };

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

  const fetchMandateHistory = async (selectedMandate) => {
      const req = { lead_id: leadId };
      // const req = {lead_id : "JRE6453"} // To test Only
  
      try {
        // setIsLoading(true);
        const response = await getMandateHistory(req);
  
        if (response.status) {
          setHistoryData(response?.data);

          // const mandateData = response?.data?.find((elm)=> elm.mandate_id == selectedMandate?.mandate_id)
          // setisMandateAuthorized(mandateData?.status == 'authorized')
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (activeLoan?.disbursed_amount) {
      formik.setFieldValue("disbursAmount", activeLoan.disbursed_amount);
    }
  }, [activeLoan?.disbursed_amount]);

  // filter the selected bank/mandate details to pull payment
  useEffect(() => {
    const selectedMandate = data?.enachModel?.find(
      (el) => el.bank_name === selectedBank,
    );

    setmandateselectedBank(selectedMandate)

    setMandateAccountDetails(selectedMandate);
    setIsEasebuzz(selectedMandate?.provider === "EASEBUZZ");

  }, [selectedBank, data]);

  useEffect(()=> {
    fetchMandateHistory();
  },[])
  

  // alert(JSON.stringify(schedule, null, 2))

  // formik for pull payment
  const pullPaymentFormik = useFormik({
    initialValues: {
      collection_status: "",
      amount: "",
      collection_date: "",
      collection_time: "12:00",
      comment: "",
      request_created_date: "",
      request_is_process_status: "",
    },
    validationSchema: Yup.object({
      collection_status: Yup.string().required("Collection status is required"),
      amount: Yup.number()
        .required("Amount is required")
        .min(10)
        .max(activeLoan?.due_amount_on_current_day),
      collection_date: Yup.date()
        .min(
          new Date(new Date().setHours(0, 0, 0, 0)),
          "Collection date cannot be in the past",
        )
        .required("Collection date is required"),
      // collection_time: Yup.string()
      //   .required("Collection time is required")
      //   .test(
      //     "valid-time-window",
      //     "Collection time must be between 6:00 AM and 11:59 PM",
      //     function (time) {
      //       if (!time) return true;

      //       const [hours, minutes] = time.split(":").map(Number);

      //       // 06:00 → 23:59
      //       const isAfterSixAM = hours > 6 || (hours === 6 && minutes >= 0);

      //       const isBeforeMidnight =
      //         hours < 24 && !(hours === 24 || hours === 0);

      //       return isAfterSixAM && isBeforeMidnight;
      //     },
      //   )
      //   .test(
      //     "future-time",
      //     "Collection time cannot be in the past",
      //     function (time) {
      //       const { collection_date } = this.parent;
      //       if (!collection_date || !time) return true;

      //       const now = new Date();
      //       const selected = new Date(collection_date);
      //       const [h, m] = time.split(":");
      //       selected.setHours(h, m, 0, 0);

      //       return (
      //         selected.toDateString() !== now.toDateString() || selected > now
      //       );
      //     },
      //   ),
      comment: Yup.string().notRequired(),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(values);
        if (!selectedBank) {
          toast.error("Please select a bank");
          return;
        }

        if(!isMandateAuthorized){
          toast.info("Mandate is not authorized!")
          return;
        }

        pullNachPaymentEaseBuz(values);
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });
  
  useEffect(() => {
    if (pullPaymentFormik.values.collection_status === "close") {
      pullPaymentFormik.setFieldValue(
        "amount",
        activeLoan?.due_amount_on_current_day || "",
      );
    } else {
      pullPaymentFormik.setFieldValue("amount", "");
    }
  }, [pullPaymentFormik.values.collection_status, activeLoan]);

  const formik = useFormik({
    initialValues: {
      bankName: "",
      paymentMode: "",
      refNo: "",
      disbursAmount: activeLoan?.disbursed_amount || "", // Add fallback
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
          },
        ),
      funderName: Yup.string().required("Funder name is required."),
    }),

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const req = {
          lead_id: leadId,
          product_code: activeLoan?.product_code,
          step_status: 6,
          payment_mode: values.paymentMode,
          reference_no: values.refNo,
          disbursement_amount: Math.floor(Number(values.disbursAmount)),
          disbursement_date: values.transDate,
          bank_name: values.bankName,
          updated_by: adminUser?.emp_code,
          funder_id: values.funderName,
        };

        const response = await UpdateLeadDisbursement(req);
        if (response.status) {
          toast.success(response.message);
          setUtrUpdate(false);
          window.location.reload();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const UpdatePayment = useFormik({
    initialValues: {
      collectionMode: "",
      collectedAmount: "",
      transactionId: "",
      collectionDate: "",
      file: null,
      status: "",
      remarks: "",
      bank: "",
      waiveOff: "0", // Default to 0 to avoid NaN issues
    },

    validationSchema: Yup.object({
      collectionMode: Yup.string().required("Collection Mode is required"),
      collectedAmount: Yup.number()
        .required("Collected Amount is required")
        .test(
          "close-loan-validation",
          "Does not match total outstanding amount",
          function (value) {
            // console.log(
            //   "total---------",
            //   totalOutstanding,
            //   activeLoan?.due_amount_on_current_day,
            // );
            const { status } = this.parent;

            // Check if status is 10 or 11 and collected amount doesn't match total outstanding
            // Status 6 is excluded from this validation
            if (parseInt(status) === 10 || parseInt(status) === 11) {
              return parseFloat(value) === parseFloat(totalOutstanding);
              // return parseFloat(value) === parseFloat(totalOutstanding);
            }
            return true;
          },
        )
        .test(
          "amount-validation",
          "Does not match total outstanding amount",
          function (value) {
            const { status, waiveOff, collectedAmount } = this.parent;
            const collected = parseFloat(collectedAmount || 0);
            const waived = parseFloat(waiveOff || 0);

            // Only validate if status is provided and not 10, 11, or 6
            // Status 6 is excluded from total outstanding validation
            if (
              status &&
              parseInt(status) !== 10 &&
              parseInt(status) !== 11 &&
              parseInt(status) !== 6 &&
              // parseInt(status) !== 12 &&
              parseInt(status) !== 13
            ) {
              return collected + waived === parseFloat(totalOutstanding);
            }
            return true;
          },
        )
        // ✅ Partially Paid
        .test(
          "partial-paid-validation",
          "Amount cannot exceed current due amount",
          function (value) {
            const { status } = this.parent;
            const collected = parseFloat(value || 0);
            const dueToday = parseFloat(totalOutstanding || 0);

            if (
              parseInt(status) === 6 ||
              parseInt(status) === 12 ||
              parseInt(status) === 13
            ) {
              return collected <= dueToday;
            }

            return true;
          },
        ),
      transactionId: Yup.string().required("Transaction ID is required"),
      collectionDate: Yup.date().required("Collection Date is required"),
      file: Yup.mixed().required("File is required"),
      status: Yup.string().required("Status is required"),
      remarks: Yup.string().required("Remarks is required").min(3).max(50),
      // bank: Yup.string().required("Bank is required"),
      bank: Yup.string().when("collectionMode", {
        is: (value) => value !== "CASH", // if NOT cash → required
        then: (schema) => schema.required("Bank is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      waiveOff: Yup.number()
        .min(0, "Waived amount cannot be negative")
        .test(
          "waive-off-required",
          "Settled amount is required",
          function (value) {
            const { status } = this.parent;
            // Required if status is NOT 10, 11, or 6
            if (
              status &&
              parseInt(status) !== 10 &&
              parseInt(status) !== 11 &&
              parseInt(status) !== 6
            ) {
              return value !== undefined && value !== null && value !== "";
            }
            return true; // Not required for status 10, 11, or 6
          },
        )
        .test(
          "waive-off-validation",
          "Does not match total outstanding amount",
          function (value) {
            const { status, collectedAmount } = this.parent;
            const collected = parseFloat(collectedAmount || 0);
            const waived = parseFloat(value || 0);

            // Only validate if status is provided and not 10, 11, or 6
            // Status 6 is excluded from total outstanding validation
            if (
              status &&
              parseInt(status) !== 10 &&
              parseInt(status) !== 11 &&
              parseInt(status) !== 6
            ) {
              return collected + waived === parseFloat(totalOutstanding);
            }
            return true;
          },
        ),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        let convertedBase64 = null;
        let fileName = "";
        let fileExtension = "";

        if (values.file && values.file !== initialFile) {
          convertedBase64 = await FileConverter(values.file);
          convertedBase64 = convertedBase64.replace(/^data:.*;base64,/, "");
          fileName = values.file.name.split(".").slice(0, -1).join(".");
          fileExtension = values.file.name.split(".").pop();
        }

        const req = {
          lead_id: leadId,
          user_id: data?.user_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
          loan_id: loanId,
          collection_amount: Math.floor(Number(values.collectedAmount)),
          payment_mode: values.collectionMode,
          transction_id: values.transactionId,
          collection_date: values.collectionDate,
          collection_status: values.status,
          remarks: values.remarks,
          payment_recipt_name: fileName,
          payment_recipt_exention: fileExtension,
          payment_recipt_data: convertedBase64,
          receiver_bank_name: values.bank,
          updated_by: adminUser?.emp_code,
          waive_off_amount: values.waiveOff,
        };

        const response = await UpdateMenualEMIPayment(req);
        if (response.status) {
          toast.success(response.message);
          setIsOpen(false);
          if (values.status === "6") {
            setTimeout(() => {
              window.location.reload();
            }, 300);
          } else {
            navigate("/manage-loans/accounts");
          }
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.errors?.updated_by[0] ||
            error?.message ||
            "Something went wrong",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const pullNachPaymentRazorPay = async () => {
    setIsPullNach(false);
    setIsLoading(true);
    try {
      const req = {
        lead_id: leadId,
        name: data?.personalInfo[0]?.full_name,
        email: data?.personalInfo[0]?.email_id,
        contact: data?.mobile_number,
        amount: activeLoan?.due_amount_on_current_day,
        loan_account: loanId,
        receipt: "Receipt No " + data?.mobile_number,
        currency: "INR",
        order_notes: {
          notes_key_1: `EMI Payment Pull for loan id ${loanId}`,
          notes_key_2: `EMI Payment Pull for ${data?.personalInfo[0]?.full_name}`,
        },
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      };

      const response = await PullNACHPayment(req);
      if (response.success) {
        setPaymentInfo(response);
        setIsCollected(true);

        setTimeout(() => {
          setIsCollected(false);
          navigate("/manage-loans/accounts");
        }, 5000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const pullNachPaymentEaseBuz = async (values) => {
    setIsPullNach(false);
    setIsLoading(true);
    try {
      const req = {
        emandate_id: mandateAccountDetails?.mandate_id,
        // amount: 10,
        amount: Number(values?.amount), //
        // request_type: "PAYMENTCOLLECTION",
        lead_id: leadId,
        user_id: data?.user_id,
        loan_id: loanId,
        collection_status: values?.collection_status,
        provider: mandateAccountDetails?.provider,
        collection_date: values?.collection_date,
        collection_time: values?.collection_time,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        product_token:
          "dmVyaWZpZWR1MjAyNkBnbWFpbC5jb20gSnVub29uIENhcGl0YWwgU2VydmljZXMgUFZUIExURA==", //
        product_vendor_code: "EWPL",
        comment: values?.comment,
        // Created_By: adminUser.emp_code
        request_created_by: adminUser.emp_code,
      };

      console.log("payload: ", req);

      // const response = await PullNACHPaymentEaseBuzz(req);
      const response = await PullPaymentUsingEaseBuzz(req);

      if (response.status) {
        toast.success(response?.message);
        setPaymentInfo(response);
        // setIsCollected(true);

        setTimeout(() => {
          setIsCollected(false);
          navigate("/manage-loans/accounts");
        }, 5000);
        pullPaymentFormik.resetForm();
        fetchData()
      } else {
        toast.info(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(paymentInfo);

  const waveOff = useFormik({
    initialValues: {
      writeOff: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      writeOff: Yup.number()
        .required("Write Off amount is required")
        .min(100, "Write Off amount must be at least 100."),
      remarks: Yup.string()
        .required("Remarks is required")
        .min(20, "Remarks must be at least 20 characters.")
        .max(200, "Remarks must be at most 200 characters."),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const req = {
          lead_id: leadId,
          loan_id: loanId,
          waive_off_amount: Math.floor(Number(values.writeOff)),
          comment: values.remarks,
          updated_by: adminUser?.emp_code,
        };

        const response = await WavedOffAmount(req);
        if (response.status) {
          setIsWriteoff(false);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const GetAgreement = async () => {
    const req = {
      lead_id: leadId,
      user_id: userId,
      doc_type: "aggrement_letter",
      loan_id: loanId,
      lead_status: "A",
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

  const GetSanction = async () => {
    const req = {
      lead_id: leadId,
      user_id: userId,
      doc_type: "sanction_letter",
      loan_id: loanId,
      lead_status: "A",
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

  const GetDisbursal = async () => {
    const req = {
      lead_id: leadId,
      user_id: userId,
      doc_type: "disbursal_letter",
      loan_id: loanId,
      lead_status: "A",
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

  const updateEmi = async (e) => {
    const dateID = e.target.value;

    const req = {
      lead_id: leadId,
      // user_id: userId,
      // doc_type: "disbursal_letter",
      loan_id: loanId,
      collection_date: dateID,
    };

    try {
      // setIsLoading(true);
      const response = await GetUpdateLoanEMI(req);

      if (response.status) {
        // Open in new tab
        setUpdateEMI(response.activeLoanDetails);
        //    totalOutstanding=response.activeLoanDetails.due_amount_on_current_day;
        setTotalOutstanding(
          response.activeLoanDetails.due_amount_on_current_day,
        );
      } else {
        setUpdateEMI();
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (UpdatePayment.values.status === "10") {
      UpdatePayment.setFieldValue(
        "collectedAmount",
        updateEMI.due_amount_on_current_day ||
          activeLoan.due_amount_on_current_day,
      );
    } else {
      UpdatePayment.setFieldValue("collectedAmount", "");
    }
  }, [UpdatePayment.values.status, totalOutstanding]);

  if (isLoading) {
    return <Loader msg="Initializing do not refresh ..." />;
  }

  return (
    <>
      <div>
        {!hideincollection && (
          <div className="flex lg:justify-between max-lg:flex-col lg:items-center my-5 gap-5">
            <div>
              <h2>
                Loan Account:{" "}
                <span className="text-lg font-semibold">{loan_Id}</span>
              </h2>
            </div>
            <div className="flex flex-wrap md:gap-5 gap-2">
              {permission && (
                <>
                  {/* <Button
                  btnName={"Write Off Amount"}
                  btnIcon={"MdOutlineReceipt"}
                  type={"button"}
                  disabled={!permission}
                  onClick={() => setIsWriteoff(true)}
                  style="min-w-[170px] hover:shadow-lg bg-primary text-white font-medium py-2 px-4 rounded"
              /> */}
                  <Button
                    btnName={"Pull Payment"}
                    btnIcon={"RiSecurePaymentLine"}
                    type={"button"}
                    disabled={!permission}
                    onClick={() => setIsPullNach(true)}
                    style="min-w-[170px] hover:shadow-lg bg-primary text-white font-medium py-2 px-4 rounded"
                  />
                  <Button
                    btnName={"Update Collection"}
                    btnIcon={"MdOutlineReceipt"}
                    type={"button"}
                    disabled={!permission}
                    onClick={() => {
                      (setIsOpen(true),
                        setTotalOutstanding(
                          activeLoan?.due_amount_on_current_day,
                        ));
                    }}
                    style="min-w-[170px] hover:shadow-lg bg-primary text-white font-medium py-2 px-4 rounded"
                  />
                  {isHardUpdateAllowed && (
                    <Button
                      btnName={"Hard Collection Update"}
                      btnIcon={"MdOutlineReceipt"}
                      type={"button"}
                      disabled={!permission}
                      onClick={() =>
                        navigate("/admin/edit-collection", {
                          state: { user_id: userId, lead_id: leadId },
                        })
                      }
                      style="min-w-[170px] hover:shadow-lg bg-primary text-white font-medium py-2 px-4 rounded"
                    />
                  )}
                  {isDisbursed && (
                    <Button
                      btnName={"Update UTR"}
                      btnIcon={"MdOutlineReceipt"}
                      type={"button"}
                      disabled={!permission}
                      onClick={() => setUtrUpdate(true)}
                      style="min-w-[170px] hover:shadow-lg bg-primary text-white font-medium py-2 px-4 rounded"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div className="max-full mx-auto lg:p-6">
          <div className="overflow-hidden rounded-xl shadow-lg bg-white">
            <div
              className={`px-6 py-1 ${
                activeLoan?.loan_status === "Overdue"
                  ? "bg-red-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}
            />
            <div className="grid grid-cols-2 lg:grid-cols-5 py-5">
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
              {!funder && !hideincollection && (
                <>
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-800 font-bold mb-1">
                      Sanction Letter
                    </p>
                    <button
                      className="bg-primary text-white py-1 px-4 w-full shadow rounded"
                      onClick={GetSanction}
                    >
                      View
                    </button>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-800 font-bold mb-1">
                      Loan Agreement
                    </p>
                    <button
                      className="bg-primary text-white py-1 px-4 w-full shadow rounded"
                      onClick={GetAgreement}
                    >
                      View
                    </button>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-800 font-bold mb-1">
                      Disbursal Letter{" "}
                    </p>
                    <button
                      className="bg-primary text-white py-1 px-4 w-full shadow rounded"
                      onClick={GetDisbursal}
                    >
                      View
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {tableData.length > 0 ? (
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
              {tableData.map((item, index) => (
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

      {/* Update Payment */}
      <Modal
        isOpen={IsOpen}
        onClose={() => setIsOpen(false)}
        heading={"Update Payment"}
      >
        <div className="md:px-5">
          <div className="flex justify-evenly items-center gap-2 border border-primary py-2 max-md:px-1 rounded shadow-sm">
            <div className="flex flex-col justify-center items-center">
              <p className="text-xs md:text-sm font-semibold italic text-primary">
                Current Outstanding{" "}
              </p>
              <p className="md:text-lg text-gray-800 font-bold">
                ₹
                {updateEMI.due_amount_on_current_day &&
                updateEMI.due_amount_on_current_day
                  ? updateEMI.due_amount_on_current_day
                  : activeLoan?.due_amount_on_current_day}
              </p>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="text-xs md:text-sm font-semibold italic text-primary">
                Current Interest
              </p>
              <p className="md:text-lg text-gray-800 font-bold">
                ₹
                {updateEMI.due_interest_on_current_day &&
                updateEMI.due_interest_on_current_day
                  ? updateEMI.due_interest_on_current_day
                  : activeLoan?.due_interest_on_current_day}
              </p>
            </div>

            <div className="flex flex-col justify-center items-center">
              <p className="text-xs md:text-sm font-semibold italic text-primary">
                Penal Charges
              </p>
              <p className="md:text-lg text-gray-800 font-bold">
                ₹
                {updateEMI.penal_charges && updateEMI.penal_charges
                  ? updateEMI.penal_charges
                  : activeLoan?.penal_charges}
              </p>
            </div>
          </div>
          <form onSubmit={UpdatePayment.handleSubmit} className="my-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <DateInput
                  label="Collection Date"
                  icon="IoCalendarOutline"
                  placeholder="DD-MM-YYYY"
                  name="collectionDate"
                  id="collectionDate"
                  min={getMinDate(role, emp_code)}
                  // max={new Date().toISOString().split("T")[0]}
                  max={new Date().toLocaleDateString("en-CA")}
                  // onChange={UpdatePayment.handleChange}
                  onChange={(e) => {
                    UpdatePayment.handleChange(e); // Formik function
                    updateEmi(e); // Your custom function
                  }}
                  onBlur={UpdatePayment.handleBlur}
                  value={UpdatePayment.values.collectionDate}
                />
                {UpdatePayment.touched.collectionDate &&
                  UpdatePayment.errors.collectionDate && (
                    <ErrorMsg error={UpdatePayment.errors.collectionDate} />
                  )}
              </div>
              <div className="col-span-1">
                <SelectInput
                  label="Payment Status"
                  placeholder="Select"
                  icon="MdModelTraining"
                  name="status"
                  id="status"
                  options={emiStaus}
                  onChange={UpdatePayment.handleChange}
                  onBlur={UpdatePayment.handleBlur}
                  value={UpdatePayment.values.status}
                />
                {UpdatePayment.touched.status &&
                  UpdatePayment.errors.status && (
                    <ErrorMsg error={UpdatePayment.errors.status} />
                  )}
              </div>

              <div className="col-span-1">
                <SelectInput
                  label="Collection Mode"
                  placeholder="Select"
                  icon="RiSecurePaymentLine"
                  name="collectionMode"
                  id="collectionMode"
                  options={collectionPaymentMode}
                  onChange={UpdatePayment.handleChange}
                  onBlur={UpdatePayment.handleBlur}
                  value={UpdatePayment.values.collectionMode}
                />
                {UpdatePayment.touched.collectionMode &&
                  UpdatePayment.errors.collectionMode && (
                    <ErrorMsg error={UpdatePayment.errors.collectionMode} />
                  )}
              </div>
              <div className="col-span-1">
                <TextInput
                  readOnly={UpdatePayment.values.status === "10"}
                  label="Collected Amount"
                  icon="RiMoneyRupeeCircleFill"
                  placeholder="Ex: 8000"
                  name="collectedAmount"
                  id="collectedAmount"
                  onChange={UpdatePayment.handleChange}
                  onBlur={UpdatePayment.handleBlur}
                  value={UpdatePayment.values.collectedAmount}
                />
                {UpdatePayment.touched.collectedAmount &&
                  UpdatePayment.errors.collectedAmount && (
                    <ErrorMsg error={UpdatePayment.errors.collectedAmount} />
                  )}
              </div>

              {UpdatePayment.values.status !== "10" &&
                UpdatePayment.values.status !== "11" &&
                UpdatePayment.values.status !== "6" && (
                  <div className="col-span-1">
                    <TextInput
                      label="Settled Amount"
                      icon="IoDocumentTextOutline"
                      placeholder="Enter waive off amount (required for status other than 10 or 11)"
                      name="waiveOff"
                      id="waiveOff"
                      type="number"
                      min="0"
                      step="0.01"
                      onChange={UpdatePayment.handleChange}
                      onBlur={UpdatePayment.handleBlur}
                      value={UpdatePayment.values.waiveOff}
                    />
                    {UpdatePayment.touched.waiveOff &&
                      UpdatePayment.errors.waiveOff && (
                        <ErrorMsg error={UpdatePayment.errors.waiveOff} />
                      )}
                  </div>
                )}

              <div className="col-span-1">
                <TextInput
                  label="Transaction Id"
                  icon="MdOutlineSendToMobile"
                  placeholder="Transaction Id"
                  name="transactionId"
                  id="transactionId"
                  onChange={UpdatePayment.handleChange}
                  onBlur={UpdatePayment.handleBlur}
                  value={UpdatePayment.values.transactionId}
                />
                {UpdatePayment.touched.transactionId &&
                  UpdatePayment.errors.transactionId && (
                    <ErrorMsg error={UpdatePayment.errors.transactionId} />
                  )}
              </div>

              <div className="col-span-1">
                <UploadInput
                  label="Payment Slip"
                  name="file"
                  icon="MdUploadFile"
                  maxSize={"w-full"}
                  acceptedFormats="application/pdf image/jpeg image/jpg image/png"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    UpdatePayment.setFieldValue("file", file);
                  }}
                  onBlur={UpdatePayment.handleBlur}
                />
                {UpdatePayment.touched.file && UpdatePayment.errors.file && (
                  <ErrorMsg error={UpdatePayment.errors.file} />
                )}
              </div>

              <div
                className={
                  UpdatePayment.values.status === "11" ||
                  UpdatePayment.values.status === "10" ||
                  UpdatePayment.values.status === "6"
                    ? "col-span-2"
                    : "col-span-1"
                }
              >
                <SelectInput
                  label="Recipient Bank"
                  placeholder="Select"
                  icon="RiBankLine"
                  name="bank"
                  id="bank"
                  options={[
                    { value: "IDFC Bank", label: "IDFC Bank" },
                    { value: "ICICI Bank", label: "ICICI Bank" },
                    { value: "Bharatpay", label: "Bharatpay" },
                    { value: "Razorpay", label: "Razorpay" },
                  ]}
                  onChange={UpdatePayment.handleChange}
                  onBlur={UpdatePayment.handleBlur}
                  value={UpdatePayment.values.bank}
                />
                {UpdatePayment.touched.bank && UpdatePayment.errors.bank && (
                  <ErrorMsg error={UpdatePayment.errors.bank} />
                )}
              </div>

              <div className="col-span-2">
                <TextInput
                  label="Remarks"
                  icon="IoPersonOutline"
                  placeholder="Write Remarks"
                  name="remarks"
                  id="remarks"
                  onChange={UpdatePayment.handleChange}
                  onBlur={UpdatePayment.handleBlur}
                  value={UpdatePayment.values.remarks}
                />
                {UpdatePayment.touched.remarks &&
                  UpdatePayment.errors.remarks && (
                    <ErrorMsg error={UpdatePayment.errors.remarks} />
                  )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <Button
                btnName="Update"
                btnIcon="RiFileList3Line"
                type="submit"
                style="min-w-[100px] md:w-auto mt-4 py-1 px-4 bg-success text-white"
              />
              <Button
                btnName={"Cancel"}
                btnIcon={"IoCloseCircleOutline"}
                type={"button"}
                onClick={() => setIsOpen(false)}
                style="min-w-[100px] border border-red-500 text-red-500 mt-4 py-1 px-4"
              />
            </div>
          </form>
        </div>
      </Modal>

      {/* Update Payment */}
      {/* <Modal
        isOpen={IsEditColOpen}
        onClose={() => setIsEditColOpen(false)}
        // heading={"Update Payment"}
      >
        <div className="">
          <EditCollectionForm />
        </div>
      </Modal> */}

      {/* Write Off */}
      <Modal
        isOpen={isWriteoff}
        onClose={() => setIsWriteoff(false)}
        heading={"Payments Write Off"}
      >
        <div className="px-5">
          <div className="border border-b border-light-gray py-4 shadow my-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col justify-center items-center">
                <span className="text-sm italic font-bold">Current Tenure</span>
                <span className="">{activeLoan?.penalty_days}</span>
              </div>
              <div className="flex flex-col justify-center items-center">
                <span className="text-sm italic font-bold">
                  Current Interest
                </span>
                <span>₹{activeLoan?.due_interest_on_current_day}</span>
              </div>
              <div className="flex flex-col justify-center items-center">
                <span className="text-sm italic font-bold">Penal Charges</span>
                <span>₹{activeLoan?.penal_charges}</span>
              </div>
              <div className="flex flex-col justify-center items-center">
                <span className="text-sm italic font-bold">
                  Total Outstanding
                </span>
                <span>₹{activeLoan?.due_amount_on_current_day}</span>
              </div>
            </div>
          </div>

          <form onSubmit={waveOff.handleSubmit} className="my-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <TextInput
                  label="Write Off Amount"
                  icon="RiMoneyRupeeCircleFill"
                  placeholder="Ex: 8000"
                  name="writeOff"
                  id="writeOff"
                  maxLength={5}
                  onChange={waveOff.handleChange}
                  onBlur={waveOff.handleBlur}
                  value={waveOff.values.writeOff}
                />
                {waveOff.touched.writeOff && waveOff.errors.writeOff && (
                  <ErrorMsg error={waveOff.errors.writeOff} />
                )}
              </div>

              <div className="col-span-2">
                <TextInput
                  label="Remarks"
                  icon="IoPersonOutline"
                  placeholder="Write Remarks"
                  name="remarks"
                  id="remarks"
                  onChange={waveOff.handleChange}
                  onBlur={waveOff.handleBlur}
                  value={waveOff.values.remarks}
                />
                {waveOff.touched.remarks && waveOff.errors.remarks && (
                  <ErrorMsg error={waveOff.errors.remarks} />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <Button
                btnName="Write Off"
                btnIcon="RiFileList3Line"
                type="submit"
                style="min-w-[100px] md:w-auto mt-4 py-1 px-4 bg-success text-white"
              />
              <Button
                btnName={"Cancel"}
                btnIcon={"IoCloseCircleOutline"}
                type={"button"}
                onClick={() => setIsWriteoff(false)}
                style="min-w-[100px] border border-red-500 text-red-500 mt-4 py-1 px-4"
              />
            </div>
          </form>
        </div>
      </Modal>

      {/* Pull Nach */}
      <Modal isOpen={isPullNach} onClose={() => setIsPullNach(false)}>
        <div className="flex items-center justify-between bg-primary text-white -m-5 px-2 md:px-5 py-1">
          <div className="">
            <h1 className="text-2xl font-semibold">Loan Details</h1>
            <p className="flex md:gap-5 max-md:flex-col">
              <span>Loan Id: {loanId}</span>{" "}
              <span>Provider: {mandateAccountDetails?.provider || "N/A"}</span>
            </p>
          </div>
        </div>
        {/* <br /> */}
        {/* <div className="flex justify-end">
          <button className="bg-gray-200 px-3 py-1 text-sm my-2 font-semibold rounded-sm">Show History</button>
        </div> */}
        {pullPaymentHistoriesData?.length > 0 ? (
          <div className="overflow-x-auto border mt-8 broder-gray-50 rounded-md">
            <table className="min-w-full text-sm text-left border border-gray-500 rounded-md overflow-hidden shadow-sm text-center">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-2 py-1 border-b text-nowrap">Collection Status</th>
                  <th className="px-2 py-1 border-b text-nowrap">Mandate Id</th>
                  <th className="px-2 py-1 border-b text-nowrap">Provider</th>
                  <th className="px-2 py-1 border-b text-nowrap">Amount</th>
                  <th className="px-2 py-1 border-b text-nowrap">Collection Date</th>
                  <th className="px-2 py-1 border-b text-nowrap">Comment</th>
                  <th className="px-2 py-1 border-b text-nowrap">Request Created Date</th>
                  <th className="px-2 py-1 border-b text-nowrap">Created by</th>
                  <th className="px-2 py-1 border-b text-nowrap">Pull Amount</th>
                  <th className="px-2 py-1 border-b text-nowrap">Message</th>
                  <th className="px-2 py-1 border-b text-nowrap">Request Send Date/Time</th>
                  <th className="px-2 py-1 border-b text-nowrap">Presentment Id</th>
                  <th className="px-2 py-1 border-b text-nowrap">Presentment Date</th>
                  <th className="px-2 py-1 border-b text-nowrap">Response Type</th>
                  <th className="px-2 py-1 border-b text-nowrap">Transaction Ref. No.</th>
                  <th className="px-2 py-1 border-b text-nowrap">Bank Ref. No.</th>
                  <th className="px-2 py-1 border-b text-nowrap">Pull Status.</th>
                  <th className="px-2 py-1 border-b text-nowrap">Bank Name</th>
                  <th className="px-2 py-1 border-b text-nowrap">Account No</th>
                  <th className="px-2 py-1 border-b text-nowrap">IFSC</th>
                  <th className="px-2 py-1 border-b text-nowrap">Transaction Id</th>

                  {/* <th className="px-2 py-1 border-b text-nowrap">Collection Time</th> */}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 border-gray-100">
                {pullPaymentHistoriesData?.map((elm, index) => {
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-1 text-nowrap capitalize">
                        {elm?.collection_status}
                      </td>
                      <td className="px-6 py-1 text-nowrap">
                        {elm?.emandate_id}
                      </td>
                      <td className="px-6 py-1 text-nowrap">
                        {elm?.provider}
                      </td>
                      <td className="px-6 py-1 text-nowrap">{elm?.amount}</td>
                      <td className="px-6 py-1 text-nowrap">
                        {elm?.collection_date}
                      </td>
                      <td className="px-6 py-1 text-nowrap">{elm?.comment}</td>
                      <td className="px-6 py-1 text-nowrap">
                        {elm?.request_created_date}
                      </td>
                      <td className="px-6 py-1 text-nowrap">{elm?.request_created_by}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.pull_amount}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.message}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.request_send_datetime}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.presentment_id}</td>
                      <td className="px-6 py-1 text-nowrap">
                        {elm?.presentment_date}
                      </td>
                      <td className="px-6 py-1 text-nowrap">
                        {elm?.responce_type}
                      </td>
                      <td className="px-6 py-1 text-nowrap">
                        {elm?.transaction_reference_number}
                      </td>
                      <td className="px-6 py-1 text-nowrap">{elm?.bank_reference_number}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.job_pull_status}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.bank_name}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.customer_account_number}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.customer_ifsc}</td>
                      <td className="px-6 py-1 text-nowrap">{elm?.transaction_id}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )}

        <div>
          <div className="col-span-2 border border-blue-100 rounded-lg overflow-hidden shadow mt-10">
            <div className=" bg-blue-50 ps-3 p-2 flex gap-5 md:items-center md:justify-between max-md:flex-col">
              <h3 className="text-lg text-primary font-semibold">
                Pull Payment Details
              </h3>
              <div className="flex md:gap-5 items-center">
                <SelectInput
                  // label="Bank: "
                  placeholder={"Select Bank"}
                  icon="MdOutlineAccountBalance"
                  name="pull_bank"
                  id="pull_bank"
                  // disabled={!isEditing}
                  options={data?.enachModel.map((mandate) => ({
                    label: mandate?.bank_name,
                    value: mandate?.bank_name,
                  }))}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  // onBlur={pullPaymentFormik.handleBlur}
                  value={selectedBank}
                  defaultValue={defaultMandateBank}
                />
              </div>
            </div>
            <div className="pt-1 px-4 pb-1">
              <div className="space-y-2 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Interest
                  </p>
                  <p className="font-semibold capitalize">
                    ₹{activeLoan?.due_interest_on_current_day}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penal Charges</p>
                  <p className="font-semibold capitalize">
                    ₹{activeLoan?.penal_charges}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Outstanding
                  </p>
                  <p className="text-xl font-bold text-primary">
                    ₹{activeLoan?.due_amount_on_current_day}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="font-bold text-xl">Mandate Information</span>
            <div className="bg-green-100 px-4 text-green-500 text-sm font-semibold rounded py-0.5 shadow-md border border-green-500">
              {activeLoan?.loan_status}
            </div>
          </div>
          <div className="my-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium flex items-center gap-1 uppercase">
                  <Icon name="IoPersonOutline" size={16} />
                  {/* {data?.personalInfo?.[0]?.full_name} */}
                  {mandateAccountDetails?.customer_name ||
                    data?.personalInfo?.[0]?.full_name ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p className="font-medium flex items-center gap-1">
                  <Icon name="IoCallOutline" size={16} />
                  {data?.mobile_number || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mandate Id</p>
                <p className="font-medium flex items-center gap-1">
                  {/* <Icon name="IoCallOutline" size={16} /> */}
                  {mandateAccountDetails?.mandate_id || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-medium flex items-center gap-1">
                  {/* <Icon name="IoCallOutline" size={16} /> */}
                  {mandateAccountDetails?.customer_account_number || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bank IFSC</p>
                <p className="font-medium flex items-center gap-1">
                  {/* <Icon name="IoCallOutline" size={16} /> */}
                  {mandateAccountDetails?.customer_ifsc || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium flex items-center gap-1">
                  {/* <Icon name="IoCallOutline" size={16} /> */}
                  {{
                    1: "Primary",
                    2: "Secondary",
                  }[mandateAccountDetails?.account_type] || "N/A"}
                </p>
              </div>
            </div>
            <hr className="my-3" />
          </div>

          <form onSubmit={pullPaymentFormik.handleSubmit}>
            {mandateAccountDetails?.provider == "EASEBUZZ" && (
              <div className="grid grid-cols-6 gap-4 gap-y-3 mt-5">
                <div className="col-span-3">
                  <SelectInput
                    label="Collection Status"
                    placeholder={"Select"}
                    icon="MdOutlineAccountBalance"
                    name="collection_status"
                    id="collection_status"
                    // disabled={!isEditing}
                    options={[
                      {
                        label: "Partial",
                        value: "partial",
                      },
                      {
                        label: "Close",
                        value: "close",
                      },
                    ]}
                    onChange={pullPaymentFormik.handleChange}
                    onBlur={pullPaymentFormik.handleBlur}
                    value={pullPaymentFormik.values.collection_status}
                  />
                  {pullPaymentFormik.touched.collection_status &&
                    pullPaymentFormik.errors.collection_status && (
                      <ErrorMsg
                        error={pullPaymentFormik.errors.collection_status}
                      />
                    )}
                </div>
                <div className="col-span-3">
                  <TextInput
                    label="Amount"
                    icon="RiFileTextLine"
                    placeholder="Enter Amount"
                    name="amount"
                    id="amount"
                    readOnly={
                      pullPaymentFormik.values.collection_status === "close"
                    }
                    onChange={pullPaymentFormik.handleChange}
                    onBlur={pullPaymentFormik.handleBlur}
                    value={pullPaymentFormik.values.amount}
                  />
                  {pullPaymentFormik.touched.amount &&
                    pullPaymentFormik.errors.amount && (
                      <ErrorMsg error={pullPaymentFormik.errors.amount} />
                    )}
                </div>

                <div className="col-span-3">
                  <DateInput
                    label="Collection Date"
                    icon="IoCalendarOutline"
                    placeholder="DD-MM-YYYY"
                    name="collection_date"
                    id="collection_date"
                    min={new Date().toISOString().split("T")[0]}
                    // disabled={!isEditing}
                    onChange={pullPaymentFormik.handleChange}
                    onBlur={pullPaymentFormik.handleBlur}
                    value={pullPaymentFormik.values.collection_date}
                  />

                  {pullPaymentFormik.touched.collection_date &&
                    pullPaymentFormik.errors.collection_date && (
                      <ErrorMsg
                        error={pullPaymentFormik.errors.collection_date}
                      />
                    )}
                </div>

                {/* <div className="col-span-3">
                  <TimeInput
                    label="Collection Time"
                    icon="IoTimeOutline"
                    placeholder="HH:mm"
                    name="collection_time"
                    id="collection_time"
                    // min="06:00"
                    // max="23:59"
                    // disabled={!isEditing}
                    onChange={pullPaymentFormik.handleChange}
                    onBlur={pullPaymentFormik.handleBlur}
                    value={pullPaymentFormik.values.collection_time}
                  />
                  {pullPaymentFormik.touched.collection_time &&
                    pullPaymentFormik.errors.collection_time && (
                      <ErrorMsg
                        error={pullPaymentFormik.errors.collection_time}
                      />
                    )}
                </div> */}

                <div className="col-span-6">
                  <TextInput
                    label="Comment"
                    icon="RiFileTextLine"
                    placeholder="Enter comment"
                    name="comment"
                    id="comment"
                    // disabled={!isEditing}
                    onChange={pullPaymentFormik.handleChange}
                    onBlur={pullPaymentFormik.handleBlur}
                    value={pullPaymentFormik.values.comment}
                  />
                  {pullPaymentFormik.touched.comment &&
                    pullPaymentFormik.errors.comment && (
                      <ErrorMsg error={pullPaymentFormik.errors.comment} />
                    )}
                </div>
              </div>
            )}

            <div className="pt-0">
              <div className="mt-2 p-2">
                <div className="flex flex-wrap items-start gap-3">
                  Please confirm your action by clicking on 'Pull Amount' to
                  pull the payment.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {/* <Button
              btnName={"Pull Amount"}
              style={
                "bg-primary hover:bg-primary text-white font-medium py-2 px-4 rounded"
              }
              btnIcon={"IoArrowForwardOutline"}
              onClick={pullNachPaymentEaseBuz}
            /> */}

              <Button
                // disabled={!isEasebuzz}
                disabled={
                  pullPaymentFormik.isSubmitting ||
                  !mandateAccountDetails?.provider
                }
                btnName={
                  isEasebuzz ? "Easebuzz Pull Amount" : "RazorPay Pull Amount"
                }
                style={`${data?.enachModel[0]?.provider ? "bg-primary hover:bg-primary" : "bg-gray-500"} text-white font-medium py-2 px-4 rounded`}
                btnIcon={"IoArrowForwardOutline"}
                // onClick={isEasebuzz ? pullNachPaymentEaseBuz : pullNachPaymentRazorPay}
                type={isEasebuzz ? "submit" : "button"}
                onClick={() => {
                  !isEasebuzz && pullNachPaymentRazorPay();
                }}
              />

              <Button
                btnName={"Close"}
                style={
                  "border border-danger hover:bg-danger hover:text-white text-danger font-medium py-2 px-4 rounded"
                }
                btnIcon={"IoCloseOutline"}
                onClick={() => {
                  setIsPullNach(false);
                  pullPaymentFormik.resetForm();
                }}
              />
            </div>
          </form>
        </div>
      </Modal>

      {/* Payment Information */}
      <Modal isOpen={isCollected} onClose={() => setIsCollected(false)}>
        <div className="p-6 border border-gray-200 rounded shadow-md flex flex-col items-center justify-center">
          {paymentInfo?.success === true && (
            <div className="flex flex-col items-center justify-center">
              <img src={Images.verified} alt="Success" />
              <h2 className="text-lg font-semibold italic mt-2 text-green-500">
                Payment Success!
              </h2>
              <h6 className="text-center text-xs text-gray-500 mt-2">
                Payment has been collected successfully!
              </h6>
              <div className="grid grid-cols-2 gap-3 my-5">
                {!isEasebuzz && (
                  <div className="col-span-2">
                    <div className="text-xs text-center">Customer ID</div>
                    <div className="text-xs font-semibold text-black">
                      {paymentInfo?.token_data?.customer_id}
                    </div>
                  </div>
                )}

                <div className="col-span-1">
                  <div className="flex flex-col justify-center items-center">
                    <div className=" text-xs">
                      {isEasebuzz ? "Transaction ID" : "Payment ID"}
                    </div>
                    <div className="text-xs text-black font-semibold uppercase">
                      {isEasebuzz
                        ? paymentInfo?.data?.mandate?.transaction_id
                        : paymentInfo?.token_data?.payment_id}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex flex-col justify-center items-center">
                    <div className=" text-xs">
                      {isEasebuzz ? "Status" : "Token"}
                    </div>
                    <div className="text-xs text-black font-semibold">
                      {isEasebuzz
                        ? paymentInfo?.data?.status_at_bank?.replaceAll(
                            "_",
                            " ",
                          )
                        : paymentInfo?.token_data?.token}
                    </div>
                  </div>
                </div>

                {isEasebuzz && (
                  <div className="col-span-2 text-center">
                    <div className="text-xs">Payment Description</div>
                    <div className="text-xs font-semibold text-black">
                      {paymentInfo?.data?.response_meta?.description}
                    </div>
                  </div>
                )}
              </div>
              <button
                className="mt-4 shadow-md text-primary border border-primary hover:bg-primary hover:text-white text-xs w-full font-bold py-2 px-4 rounded"
                onClick={() => navigate("/manage-loans/accounts")}
              >
                OK
              </button>
            </div>
          )}
          {paymentInfo?.success === false && (
            <div className="flex flex-col items-center justify-center">
              <img src={Images.verified} alt="Failed" />
              <h2 className="text-lg font-semibold italic mt-2 text-danger">
                Payment Failed!
              </h2>
              <h6 className="text-center text-xs text-gray-700 mt-2">
                Your payment has failed.
              </h6>
              <button
                className="mt-4 shadow-md text-primary border border-primary hover:bg-primary hover:text-white text-xs w-full font-bold py-2 px-4 rounded"
                onClick={() => navigate("/manage-loans/accounts")}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Update UTR Modal */}
      <Modal
        isOpen={utrUpdate}
        onClose={() => setUtrUpdate(false)}
        heading={"Update UTR"}
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
                // maxDate={new Date().getFullYear() - 0} // Limit to 18 years ago
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
              onClick={() => setUtrUpdate(false)}
              style="min-w-[100px] border border-red-500 text-red-500 mt-4 py-1 px-4"
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

export default EMISchedule;

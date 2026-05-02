import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
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
import { getLeadDetails, ReloanLead } from "../../api/ApiFunction";
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

const ManageAppForm = () => {
  // const [openApporve, setOpenApporve] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const lead_id = location.state?.lead_id;
  const user_id = location.state?.user_id;
  const loanId = location.state?.loan_id;
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

  const renderError = (field) =>
    addProduct.touched[field] && addProduct.errors[field] ? (
      <div className="text-red-500 text-sm">{addProduct.errors[field]}</div>
    ) : null;

  if (isLoading) {
    return <Loader />;
  }

  if (!userData) {
    return <div>No data available</div>;
  }

  const tabData = [
    ...(leadInfo?.lead_status === 6
      ? [
          {
            label: "EMI Schedule",
            content: <EMISchedule data={userData} loan_Id={loanId} fetchData={fetchData} />,
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
    </>
  );
};

export default ManageAppForm;

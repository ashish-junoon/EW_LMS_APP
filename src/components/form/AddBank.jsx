import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../utils/Button";
import {
  GetBankList,
  AddUserBankInfo,
  VerifyBankDetails,
  VerifyIFSC,
} from "../../api/ApiFunction";
import Modal from "../utils/Modal";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SelectInput from "../fields/SelectInput";
import TextInput from "../fields/TextInput";
import ErrorMsg from "../utils/ErrorMsg";
import UploadInput from "../fields/UploadInput";
import { FileConverter } from "../utils/FileConverter";
// import {bankListData} from "../content/Data"
const accountType = [
  { label: "Primary", value: "1" },
  { label: "Secondary", value: "2" },
];

const AddBank = ({fetchData}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [initialFile, setInitialFile] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const { leadInfo } = useOpenLeadContext();
  const { adminUser } = useAuth();
  const data = leadInfo?.bankInfo[0];

  const generateDummyBase64 = () => {
    const text = `EMPTY_${Date.now()}_${Math.random()}`;
    return btoa(text);
  };

  const addBank = useFormik({
    initialValues: {
      bankName: "",
      ifsc: "",
      accountHolderName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      accountType: "2",
      // branchName: "",
      file: null, // Initialize as null, we'll set it after component mounts
    },
    validationSchema: Yup.object({
      bankName: Yup.string().required("Bank Name is Required"),
      ifsc: Yup.string()
        .required("IFSC Code is Required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),

      accountHolderName: Yup.string()
        .required("Account Holder Name is required")
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 50 characters or less"),

      accountNumber: Yup.string()
        .required("Account Number is required")
        .matches(/^\d{8,18}$/, "Account Number must be between 8 to 18 digits"),

      confirmAccountNumber: Yup.string()
        .required("Confirm Account Number is required")
        .oneOf([Yup.ref("accountNumber"), null], "Account Numbers must match"),

      accountType: Yup.string().required("Required"),

      file: Yup.mixed()
        .required("Bank Statement is required")
        .test(
          "fileSize",
          "File size is too large. Maximum size is 5MB.",
          (value) => {
            if (!value) return false;
            return value.size <= 5 * 1024 * 1024;
          },
        ),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {

      if(values.accountType == '1' && !leadInfo.is_bank_verified){
        toast.info("Please verify primary bank first!")
        return
      }

      setSubmitting(true);
      try {
        const isVerified = await verifyBank(values);
        if (!isVerified) {
          setSubmitting(false);
          return; // stop here
        }

        //Try
        let convertedBase64 = null;
        // console.log(testbase64);

        // If a new file was uploaded, use that
        if (values.file && values.file !== initialFile) {
          convertedBase64 = await FileConverter(values.file); // data url base64
          convertedBase64 = convertedBase64.replace(
            "data:application/pdf;base64,",
            "",
          ); // raw base64
        }

        // get bank name from bank id
        const bankname = bankList.find(
          (bank) => bank?.bank_id == values?.bankName,
        )?.bank_name;
        // console.log(bankname);
        const userRequest = {
          lead_id: leadInfo?.lead_id,
          bank_name: bankname,
          bank_statement_image_name: values.file?.name,
          bank_statement_image_extn:
            values.file?.name.split(".").pop(),
          bank_statement_data: convertedBase64,
          account_holder_name: values.accountHolderName?.trim(),
          account_number: values.accountNumber?.trim(),
          ifsc_code: values.ifsc?.trim(),
          created_by: adminUser?.emp_code,
          account_type: values.accountType,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
        };

        // console.log(values, convertedBase64, userRequest);

        const response = await AddUserBankInfo(userRequest);
        if (response.status) {
          toast.success(response.message);
          setIsOpen(false);
          resetForm();
          fetchData()
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(
          error?.message || "Something went wrong. Please try again.",
        );
        console.error("Error updating add bank info:", error);
      } finally {
        //Finally
        setSubmitting(false);
      }
    },
  });

  const VerifyIFSCCode = async () => {
    const req = {
      ifsc_code: addBank.values.ifsc,
    };

    try {
      const response = await VerifyIFSC(req);
      if (response.data.is_valid && response.success) {
        return true;
      } else {
        toast.error(response.data?.failure_reason || "Invalid IFSC Code!");
        return false;
      }
    } catch (error) {}
  };

  const verifyBank = async (values) => {
    // Check if IFSC is of selected bank
    if (values?.ifsc.slice(0, 4) != values?.bankName) {
      toast.error("IFSC Code Does Not Match With Bank Name!");
      return;
    }

    // Check if IFSC is valid
    const isIFSCVerified = await VerifyIFSCCode();
    if (!isIFSCVerified) {
      // setIsLoading(false);
      return; // stop here
    }

    // Check if IFSC & a/c exists
    const req = {
      account_number: addBank.values.accountNumber,
      account_ifsc: addBank.values.ifsc,
      verification_type: "pennyless",
      lead_id: leadInfo.lead_id,
      user_id: leadInfo.user_id,
      type: 0,
    };

    try {
      const response = await VerifyBankDetails(req);

      if (response.data.is_valid && response.success) {
        // toast.success("Bank verified successfully.");
        return true;
      } else {
        toast.error(
          response.data?.failure_reason || "Bank verification failed.",
        );
        return false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while verifying bank.");
      return false;
    }
  };

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await GetBankList();
        // console.log("bank list: ", response.data)
        if(response.success) {
          setBankList(response.data);
        }
      } catch (error) {
        console.error("Error fetching States:", error);
      }
    };
    fetchState();

  }, []);
  
  // console.log(bankList);
  

  const renderError = (field) =>
    addBank.touched[field] && addBank.errors[field] ? (
      <ErrorMsg error={addBank.errors[field]} />
    ) : null;

    const verifyBank2 = async () => {

      const req={
        account_number: data?.account_number,
        account_ifsc: data?.ifsc_code,
        verification_type: "pennyless",
        lead_id: leadInfo.lead_id,
        user_id: leadInfo.user_id,
        type: 1
    }

    try {
      setIsLoading(true);
      const response = await VerifyBankDetails(req);
      if (response.success && response.data.is_valid) {
        setIsLoading(false);
        // setBankVerified(response?.data?.is_valid);
        toast.success("Bank verified successfully.");
        fetchData();
      } else {
        toast.error(response.data.failure_reason || response.data.npci_error_description || response.message || "Bank verification failed!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
    setIsLoading(false);
  };

    // const handleAddBank = () => {
      // if(!leadInfo.is_bank_verified){
      //   toast.info("Please verify primary bank first!")
      //   return
      // }
      
    // }

  return (
    <div className="">
      <div className="w-full bg-light text-black border border-light px-5 py-0.5 rounded-t-md">
        <h2 className="font-semibold">Add Bank Accounts</h2>
      </div>

      <div className="flex items-center md:justify-end max-md:flex-col mt-0 gap-2">
        {/* {permission && ( */}
        <Button
          btnName={isLoading ? "Verifying Primary Bank" : "Verify Primary Bank"}
          btnIcon={"MdOutlineVerified"}
          type={"IoCheckmarkCircleSharp"}
          onClick={verifyBank2}
          disabled={isLoading}
          style={`min-w-[150px] max-lg:w-full text-sm italic font-semibold md:w-auto max-lg:mt-4 lg:my-4 lg:py-1 border-primary px-4 text-white ${isLoading ? "bg-gray-500 text-white" : "bg-primary hover:bg-white text-primary hover:text-primary"} border hover:border-primary`}
        />

        <Button
          btnName={"Add Bank"}
          btnIcon={"IoAddCircleSharp"}
          type={"IoCheckmarkCircleSharp"}
          onClick={()=> setIsOpen(true)}
          // disabled={btnEnable}
          style="min-w-[150px] max-lg:w-full text-sm italic font-semibold md:w-auto lg:my-4 lg:py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success"
        />
        {/* )} */}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full px-0 md:px-5 py-4">
          <form onSubmit={addBank.handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="max-md:col-span-2 md:col-span-1">
                <SelectInput
                  label="Bank Name"
                  icon="PiBankDuotone"
                  name="bankName"
                  placeholder="Select"
                  options={bankList?.map((bank) => ({
                    value: bank?.bank_id,
                    label: bank.bank_name,
                  }))}
                  {...addBank.getFieldProps("bankName")}
                />
                {renderError("bankName")}
              </div>
              <div className="max-md:col-span-2 md:col-span-1">
                <TextInput
                  label="IFSC Code"
                  icon="PiBankDuotone"
                  placeholder="Enter Name"
                  name="ifsc"
                  maxLength={11}
                  type="text"
                  value={addBank.values.ifsc}
                  onChange={(e) => {
                    addBank.setFieldValue("ifsc", e.target.value.toUpperCase());
                  }}
                  onBlur={addBank.handleBlur}
                  // {...addBank.getFieldProps("ifsc")}
                />
                {renderError("ifsc")}
              </div>
              <div className="max-md:col-span-2 md:col-span-1">
                <TextInput
                  label="Account Holder Name"
                  icon="PiUser"
                  placeholder="Enter Name"
                  name="accountHolderName"
                  maxLength={30}
                  type="text"

                  {...addBank.getFieldProps("accountHolderName")}
                />
                {renderError("accountHolderName")}
              </div>
              <div className="max-md:col-span-2 md:col-span-1">
                <UploadInput
                  label="Bank Statement"
                  name="file"
                  icon="MdUploadFile"
                  acceptedFormats="application/pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    // console.log("Selected file:", file);
                    if (file) {
                      console.log("File size (MB):", file.size / (1024 * 1024));
                    }
                    addBank.setFieldValue("file", file);
                    // addBank.setFieldTouched("file", true, true);
                  }}
                  onBlur={addBank.handleBlur}
                  //   key={initialFile ? "file-input-with-value" : "file-input"}
                />
                {renderError("file")}
              </div>
              <div className="max-md:col-span-2 md:col-span-1">
                <TextInput
                  label="Account Number"
                  icon="PiBankDuotone"
                  placeholder="Enter Number"
                  name="accountNumber"
                  maxLength={18}
                  type="password"
                  hideEye
                  {...addBank.getFieldProps("accountNumber")}
                />
                {renderError("accountNumber")}
              </div>
              <div className="max-md:col-span-2 md:col-span-1">
                <TextInput
                  label="Confirm Account Number"
                  icon="PiBankDuotone"
                  placeholder="Enter Number"
                  name="confirmAccountNumber"
                  maxLength={18}
                  type="text"
                  {...addBank.getFieldProps("confirmAccountNumber")}
                />
                {renderError("confirmAccountNumber")}
              </div>

              <div className="max-md:col-span-2 md:col-span-1">
                <SelectInput
                  label="Account Type"
                  icon="RiBillLine"
                  name="accountType"
                  placeholder="Select"
                  options={accountType}
                  {...addBank.getFieldProps("accountType")}
                />
                {renderError("accountType")}
              </div>
              {/* <div className="col-span-2">
                <TextInput
                  label="Branch"
                  icon="RiMapPinLine"
                  placeholder="Enter Address"
                  name="branchName"
                  maxLength={20}
                  type="text"
                  {...addBank.getFieldProps("branchName")}
                />
                {renderError("branchName")}
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
                btnName={addBank.isSubmitting ? "Submitiing..." : "Submit"}
                btnIcon="IoAddCircleSharp"
                type="submit"
                style="mt-5 bg-primary text-white min-w-32"
                disabled={addBank.isSubmitting}
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddBank;

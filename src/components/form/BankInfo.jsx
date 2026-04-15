import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ErrorMsg from "../utils/ErrorMsg";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";
import UploadInput from "../fields/UploadInput";
import {
  UpdateUserApp,
  ResubmitApp,
  UpdateIncompleteUserApp,
  getInCompleteLeadDetails,
  VerifyBankDetails,
  VerifyIFSC,
} from "../../api/ApiFunction";
import Accordion from "../utils/Accordion";
import Modal from "../utils/Modal";
import { FileConverter } from "../utils/FileConverter";
import DownloadDoc from "../utils/DownloadDoc";
import { useAuth } from "../../context/AuthContext";
import { useGetData } from "../../context/GetDataContext";
import { useGetDocument } from "../../context/GetDocument";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import Loader from "../utils/Loader";
// import {bankListData} from "../content/Data";

const BankInfo = ({ btnEnable = false, incomplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [acceptReturn, setAcceptReturn] = useState(false);
  const [checkModal, setCheckModal] = useState("");
  const [initialFile, setInitialFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { adminUser } = useAuth();
  const { bankList } = useGetData();
  const { documents, setDocuments } = useGetDocument();
  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  const bankData = leadInfo?.bankInfo[0];
  const leadStatus = leadInfo.lead_status;
  const funder = adminUser.role === "Funder" ? true : false;
  // const docData = documents?.bank_statement?.[0];
  const docData = documents?.bank_statement;
  const [BankId, setBankId] = useState(null);

  const doc = docData?.find(item => item?.id === bankData?.id);

  // console.log(bankData.bank_name.toLowerCase().replaceAll(" ",""));

  // Convert base64 to File object
  const base64ToFile = (
    base64Data,
    fileName = "bank_statement.pdf",
    fileType = "application/pdf",
  ) => {
    try {
      if (!base64Data) return null;

      const base64Content = base64Data.includes("base64,")
        ? base64Data.split("base64,")[1]
        : base64Data;

      if (!/^[A-Za-z0-9+/=]+$/.test(base64Content)) return null;

      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });
      return new File([blob], fileName, { type: fileType });
    } catch (error) {
      console.error("Error converting base64 to File:", error);
      return null;
    }
  };

  // Get bank statement data from documents
  const bankStatementData =
    documents?.bank_statement?.length > 0
      ? documents.bank_statement[0]?.bank_statement_data
      : null;

  // Set initial file when component mounts or documents change
  useEffect(() => {
    if (bankStatementData) {
      const file = base64ToFile(bankStatementData);
      setInitialFile(file);
    }
  }, [bankStatementData]);

  // const VerifyIFSCCode = async () => {
  //   const req = {
  //     ifsc_code: formik.values.ifscCode,
  //   };

  //   try {
  //     const response = await VerifyIFSC(req);
  //     if (response.data.is_valid && response.success) {
  //       return true;
  //     } else {
  //       toast.error(response.data?.failure_reason || "Invalid IFSC Code!");
  //       return false;
  //     }
  //   } catch (error) {}
  // };

  // const verifyBank = async () => {
  //   const req = {
  //     account_number: formik.values.accountNumber,
  //     account_ifsc: formik.values.ifscCode,
  //     verification_type: "pennyless",
  //     lead_id: leadInfo.lead_id,
  //     user_id: leadInfo.user_id,
  //     type: 1,
  //   };

  //   try {
  //     const response = await VerifyBankDetails(req);

  //     if (response.data.is_valid && response.success) {
  //       // toast.success("Bank verified successfully.");
  //       return true;
  //     } else {
  //       toast.error(
  //         response.data?.failure_reason || "Bank verification failed.",
  //       );
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast.error("An error occurred while verifying bank.");
  //     return false;
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      bankName: bankData?.bank_name || "",
      accountHolder: bankData?.account_holder_name || "",
      accountNumber: bankData?.account_number || "",
      confirmAccNumber: bankData?.account_number || "",
      ifscCode: bankData?.ifsc_code || "",
      bankStatement: null || "", // Will be set after initialFile is ready
    },
    validationSchema: Yup.object({
      bankName: Yup.string().required("Bank name is required."),
      accountHolder: Yup.string()
        .min(3, "Must be at least 3 characters.")
        .max(50, "Must be 50 characters or less.")
        .required("Account holder name is required."),
      accountNumber: Yup.string()
        .matches(
          /^\d{8,18}$/,
          "Account number must be between 8 and 18 digits.",
        )
        .required("Account number is required."),
      ifscCode: Yup.string()
        .required("IFSC code is required.")
        .matches(/^[A-Za-z0-9]{11}$/, "Invalid IFSC"),
      bankStatement: Yup.mixed()
        .test("fileFormat", "Only PDF files are allowed", (value) => {
          if (!value) return true; // Allow empty value (not required)
          return value.type === "application/pdf";
        })
        .test("fileSize", "File must be less than 2 MB", (value) => {
          if (!value) return true; // Allow empty value (not required)
          return value.size <= 2 * 1024 * 1024;
        }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsEditing(false);
      setOpenApprove(false);
      setIsLoading(true);
      // console.log(BankId, " ",  values?.ifscCode.slice(0,4));

      try {
        // if (leadStatus === 2) {
        //   // Compare Bank and IFSC on leadStatus === 2 (Verify Leads)
        //   if (values?.ifscCode.slice(0, 4) != BankId) {
        //     toast.error("IFSC Code Does Not Match With Bank Name!");
        //     return;
        //   }

        //   // Verify IFSC on leadStatus === 2 (Verify Leads)
        //   const isIFSCVerified = await VerifyIFSCCode();
        //   if (!isIFSCVerified) {
        //     setIsLoading(false);
        //     return; // stop here
        //   }

        //   // Verify Bank on leadStatus === 2 (Verify Leads)
        //   const isVerified = await verifyBank();
        //   if (!isVerified) {
        //     setIsLoading(false);
        //     setTimeout(() => {
        //       window.location.reload();
        //     }, 1000);
        //     return; // stop here
        //   }
        // }

        let convertedBase64 = null;

        // If a new file was uploaded, use that
        if (values.bankStatement && values.bankStatement !== initialFile) {
          convertedBase64 = await FileConverter(values.bankStatement);
        }
        // Otherwise, use the existing base64 data if available
        else if (bankStatementData) {
          convertedBase64 = bankStatementData;
        }

        const userRequest = {
          user_id: leadInfo?.user_id,
          lead_id: leadInfo?.lead_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
          personalInfo: [],
          employmentInfo: [],
          addressInfo: [],
          kycInfo: [],
          bankInfo: [
            {
              id: bankData?.id,
              bank_name: values?.bankName?.trim(),
              account_holder_name: values?.accountHolder?.trim(),
              account_number: values?.accountNumber,
              ifsc_code: values?.ifscCode?.trim(),
              bank_statement_image_name:
                values.bankStatement?.name ||
                documents.bank_statement[0]?.bank_statement_image_name,
              bank_statement_image_extn:
                values.bankStatement?.name?.split(".").pop() ||
                documents.bank_statement[0]?.bank_statement_image_extn,
              bank_statement_data: convertedBase64
                ? convertedBase64.includes("base64,")
                  ? convertedBase64.split(",")[1]
                  : convertedBase64
                : "",
              bank_info_verified: leadStatus >= 2 ? true : false,
              updated_by: adminUser.emp_code,
            },
          ],
          guarantorInfo: [],
        };

        // const response = await UpdateUserApp(userRequest);
        let response;
        if (incomplete) {
          response = await UpdateIncompleteUserApp(userRequest);
        } else {
          response = await UpdateUserApp(userRequest);
        }

        if (response.status) {
          const documentsData = userRequest.bankInfo[0];

          const salarySlip = {
            id: bankData?.id,
            bank_statement_image_name: documentsData?.bank_statement_image_name,
            bank_statement_image_extn: documentsData?.bank_statement_image_extn,
            bank_statement_data: documentsData?.bank_statement_data,
          };
          setLeadInfo((prev) => ({
            ...prev,
            ...response,
          }));
          setDocuments((prev) => ({
            ...prev,
            bank_statement: [salarySlip],
          }));
          toast.success(response.message);
          setIsEditing(false);

          //To Fill Data Again
          if (incomplete) {
            const req = {
              user_id: leadInfo?.user_id,
              login_user: adminUser?.emp_code,
              permission: "",
            };

            try {
              const response = await getInCompleteLeadDetails(req);
              setLeadInfo(response);
            } catch (error) {
              console.error("Error in Fetching Leads Again:", error);
            }
          }
        } else {
          toast.error(response.message);
        }
        setIsLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error updating bank info:", error);
      } finally {
        setSubmitting(false);
        setOpenApprove(false);
        setIsLoading(false);
      }
    },
  });

  // useEffect(() => {
  //   console.log(BankId);
  // }, [formik.values.bankName]);

  // Set initial file value after component mounts
  useEffect(() => {
    if (initialFile) {
      formik.setFieldValue("bankStatement", initialFile);
    }
  }, [initialFile]);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF files only");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("File size should be less than 2MB");
        return;
      }
      formik.setFieldValue("bankStatement", file);
    }
  };

  const handleEdit = () => {
    if (isEditing && formik.dirty) {
      setIsEditing(false);
    } else {
      setIsEditing(!isEditing);
    }
    const bankIdData = bankList?.filter(
      (item) =>
        item.bank_name.toLowerCase().replaceAll(" ", "") ==
        formik.values.bankName.toLowerCase().replaceAll(" ", ""),
    );
    const updatedbankId = bankIdData[0]?.bankId;
    setBankId(updatedbankId);
  };

  const handleUpdate = () => {
    setCheckModal("Update");
    setOpenApprove(true);
  };

  const handleUpdateYes = () => {
    formik.submitForm();
  };

  const handleResubmit = () => {
    setOpenApprove(true);
    setCheckModal("Resubmit");
  };

  const handleResubmitYes = () => {
    setAcceptReturn(true);
  };

  const handleAcceptNo = () => {
    setOpenApprove(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Accordion
      title="Primary Bank Details"
      tooltipMsg={
        isEditing
          ? "Cancel"
          : leadStatus === 1
            ? "Edit Bank Info"
            : "Update & Verify"
      }
      verified={leadInfo?.bank_info_verified}
      reset={leadInfo?.bank_info_fill}
      //   actionButtons={
      //     btnEnable
      //       ? [
      //           {
      //             icon: isEditing
      //               ? "IoClose"
      //               : leadStatus === 1
      //               ? "RiEdit2Fill"
      //               : "MdOutlineCheckCircle",
      //             onClick: handleEdit,
      //             className: isEditing
      //               ? "border border-danger text-danger hover:bg-danger hover:border-danger hover:text-white"
      //               : "border border-primary text-primary hover:bg-success hover:border-success hover:text-white",
      //           },
      //         ]
      //       : null
      //   }

      actionButtons={
        btnEnable && !(incomplete && leadInfo?.bank_info_fill)
          ? [
              {
                icon: isEditing
                  ? "IoClose"
                  : leadStatus === 1
                    ? "RiEdit2Fill"
                    : "MdOutlineCheckCircle",
                onClick: handleEdit,
                className: isEditing
                  ? "border border-danger text-danger hover:bg-danger hover:border-danger hover:text-white"
                  : "border border-primary text-primary hover:bg-success hover:border-success hover:text-white",
              },
            ]
          : null
      }
    >
      <div className="lg:px-8 px-2 mb-5">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
              <SelectInput
                label="Bank Name"
                placeholder={formik.values.bankName || "Select Bank Name"}
                icon="MdOutlineAccountBalance"
                name="bankName"
                id="bankName"
                disabled={!isEditing}
                options={bankList?.map((bankName) => ({
                  label: bankName.bank_name,
                  value: bankName.bank_name,
                }))}
                // onChange={formik.handleChange}
                onChange={(e) => {
                  const selectedBankName = e.target.value;
                  formik.handleChange(e);
                  const selectedBank = bankList.find(
                    (bank) => bank.bank_name === selectedBankName,
                  );
                  setBankId(selectedBank?.bank_id || "");
                }}
                onBlur={formik.handleBlur}
                value={formik.values.bankName}
              />
              {formik.touched.bankName && formik.errors.bankName && (
                <ErrorMsg error={formik.errors.bankName} />
              )}
            </div>
            <div className="col-span-3">
              <TextInput
                label="Account Number"
                icon="RiFileTextLine"
                placeholder="Enter Account Number"
                name="accountNumber"
                id="accountNumber"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.accountNumber}
              />
              {formik.touched.accountNumber && formik.errors.accountNumber && (
                <ErrorMsg error={formik.errors.accountNumber} />
              )}
            </div>
            <div className="col-span-2 max-md:col-span-3">
              <TextInput
                label="IFSC Code"
                icon="RiSecurePaymentFill"
                placeholder="IFSC Code"
                name="ifscCode"
                id="ifscCode"
                disabled={!isEditing}
                // onChange={formik.handleChange}
                onChange={(e) => {
                  formik.setFieldValue("ifscCode", e.target.value.toUpperCase());
                }}
                onBlur={formik.handleBlur}
                value={formik.values.ifscCode}
              />
              {formik.touched.ifscCode && formik.errors.ifscCode && (
                <ErrorMsg error={formik.errors.ifscCode} />
              )}
            </div>

            <div className="col-span-2 max-md:col-span-3">
              <TextInput
                label="A/c Holder Name"
                icon="IoPersonOutline"
                placeholder="Enter Full Name"
                name="accountHolder"
                id="accountHolder"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.accountHolder}
              />
              {formik.touched.accountHolder && formik.errors.accountHolder && (
                <ErrorMsg error={formik.errors.accountHolder} />
              )}
            </div>
            {isEditing && (
              <div className="col-span-2 max-md:col-span-3">
                <UploadInput
                  label="Bank Statement"
                  name="bankStatement"
                  icon="MdUploadFile"
                  disabled={!isEditing}
                  acceptedFormats="application/pdf"
                  onChange={handleFileChange}
                  onBlur={formik.handleBlur}
                  key={initialFile ? "file-input-with-value" : "file-input"}
                />
                {formik.touched.bankStatement &&
                  formik.errors.bankStatement && (
                    <ErrorMsg error={formik.errors.bankStatement} />
                  )}
              </div>
            )}

            {/* {!isEditing && docData?.bank_statement_data_url && (
              <div className="col-span-2">
                {!funder && (
                  <DownloadDoc
                    fileUrl={docData?.bank_statement_data_url}
                    // fileUrl="https://devapi.earlywages.in/document/PU02531/JPU2397_Other_BankStatement625759.pdf"
                    fileType="application/pdf"
                    fileName={`Bank_Statement_${leadInfo?.lead_id}`}
                    btnName="View & Download"
                    label="Bank Statement"
                    disabled={funder}
                  />
                )}
              </div>
            )} */}

            {!isEditing && doc && (
              <div className="col-span-2 max-md:col-span-3">
                {!funder && (
                  <DownloadDoc
                    fileUrl={doc.bank_statement_data_url}
                    fileType="application/pdf"
                    fileName={`Bank_Statement_${leadInfo?.lead_id}`}
                    btnName="View & Download"
                    label="Bank Statement"
                    disabled={funder}
                  />
                )}
              </div>
            )}
          </div>
          {isEditing && (
            <div className="col-span-2 max-md:col-span-3">
              <div className="flex justify-center gap-5">
                <Button
                  btnName={
                    leadStatus === 1 ? "Save Changes" : "Save & Mark Verified"
                  }
                  btnIcon={
                    leadStatus === 1 ? "IoSaveSharp" : "IoCheckmarkCircleSharp"
                  }
                  type="button"
                  onClick={handleUpdate}
                  disabled={!formik.isValid}
                  style="min-w-[150px] md:w-auto text-xs my-4 py-0.5 px-4 border border-primary text-primary hover:border-success hover:text-success hover:font-semibold"
                />

                {/* <Button
                                    btnName="Resend to User"
                                    btnIcon="IoArrowRedoOutline"
                                    type="button"
                                    onClick={handleResubmit}
                                    style="min-w-[150px] md:w-auto text-xs my-4 py-0.5 px-4 border border-primary text-primary hover:border-success hover:text-success hover:font-semibold"
                                /> */}
              </div>
            </div>
          )}
        </form>
        {/* Approve Modal */}
        <Modal isOpen={openApprove} onClose={() => setOpenApprove(false)}>
          <div className="text-center font-semibold">
            <h1>
              {checkModal === "Update"
                ? "Are you sure want to update & verify?"
                : "Are you sure want to allow user resubmit this section?"}
            </h1>
          </div>
          <div className="flex justify-end gap-4 mt-2">
            {checkModal === "Update" && (
              <Button
                btnName="Yes"
                btnIcon="IoCheckmarkCircleSharp"
                type="button"
                onClick={handleUpdateYes}
                disabled={formik.isSubmitting}
                style="min-w-[80px] md:w-auto mt-4 py-1 px-4 border border-primary text-primary hover:border-success hover:bg-success hover:text-white hover:font-semibold"
              />
            )}

            {checkModal === "Resubmit" && (
              <Button
                btnName="Yes"
                btnIcon="IoCheckmarkCircleSharp"
                type="button"
                onClick={handleResubmitYes}
                style="min-w-[80px] md:w-auto mt-4 py-1 px-4 border border-primary text-primary hover:border-success hover:bg-success hover:text-white hover:font-semibold"
              />
            )}

            <Button
              btnName="No"
              btnIcon="IoCloseCircleOutline"
              type="button"
              onClick={handleAcceptNo}
              style="min-w-[80px] md:w-auto mt-4 py-0.5 px-4 border border-primary text-primary hover:border-dark hover:bg-dark hover:text-white hover:font-semibold"
            />
          </div>
        </Modal>
      </div>
    </Accordion>
  );
};

export default BankInfo;

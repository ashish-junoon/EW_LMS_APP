import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Accordion from "../utils/Accordion";
import DownloadDoc from "../utils/DownloadDoc";
import { useAuth } from "../../context/AuthContext";
import { useGetData } from "../../context/GetDataContext";
import { useGetDocument } from "../../context/GetDocument";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import Loader from "../utils/Loader";

const OtherBankInfo = ({ btnEnable = false, incomplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [initialFile, setInitialFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { adminUser } = useAuth();
  const { bankList } = useGetData();
  const { documents, setDocuments, getDocuments } = useGetDocument();
  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  // console.log("leadInfo :", leadInfo);
  const bankData = leadInfo?.secondarybankinfo; // array
  // console.log("bankData: ", bankData)
  // const leadStatus = leadInfo.lead_status;
  const funder = adminUser.role === "Funder" ? true : false;
  const docData = documents?.bank_statement; // array
//   console.log("docs : ", docData);
  // const docData = documents?.bank_statement?.[0]; // array


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

  useEffect(()=> {
    getDocuments()
  }, [])

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
    onSubmit: async (values, { setSubmitting }) => {},
  });

  // Set initial file value after component mounts
  useEffect(() => {
    if (initialFile) {
      formik.setFieldValue("bankStatement", initialFile);
    }
  }, [initialFile]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Accordion
      title="Secondary Bank Details"
      verified={leadInfo?.bank_info_verified}
      reset={leadInfo?.bank_info_fill}
      actionButtons={null}
    >
      {bankData.length === 0 ? (
        <div className="ps-4">N/A</div>
      ) : (
        bankData.map((bank, index) => (
          <div className="px-1 mb-0" key={index}>
            <form onSubmit={formik.handleSubmit}>
              <Accordion
                title={bank?.bank_name || "N/A"}
                verified={leadInfo?.bank_info_verified}
                reset={leadInfo?.bank_info_fill}
                actionButtons={null}
                bgColor={"bg-[#bfdbfe]"}
              >
                <div className="grid grid-cols-6 gap-4 mb-8 px-4">
                  <div className="col-span-3">
                    <SelectInput
                      label="Bank Name"
                      placeholder={bank?.bank_name || "N/A"}
                      icon="MdOutlineAccountBalance"
                      name="bankName"
                      id="bankName"
                      disabled={!isEditing}
                      options={bankList.map((bankName) => ({
                        label: bankName.bank_name,
                        value: bankName.bank_name,
                      }))}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.bankName}
                    />
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
                      value={bank?.account_number || "N/A"}
                    />
                  </div>
                  <div className="col-span-2 max-md:col-span-3">
                    <TextInput
                      label="IFSC Code"
                      icon="RiSecurePaymentFill"
                      placeholder="IFSC Code"
                      name="ifscCode"
                      id="ifscCode"
                      disabled={!isEditing}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={bank?.ifsc_code || "N/A"}
                    />
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
                      value={bank?.account_holder_name || "N/A"}
                    />
                  </div>

                  {/* {docData?.[index]?.bank_statement_data_url && (
                                    <div className="col-span-2">
                                        {!funder && (
                                            <DownloadDoc
                                                fileUrl={docData?.[index]?.bank_statement_data_url}
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

                  {docData?.map((item) => {
                    if (item.id === bank.id) {
                      return (
                        <div key={bank?.id} className="col-span-2 max-md:col-span-3">
                          {!funder && (
                            <DownloadDoc
                              fileUrl={
                                item.bank_statement_data_url
                              }
                              // fileUrl="https://devapi.earlywages.in/document/PU02531/JPU2397_Other_BankStatement625759.pdf"
                              fileType="application/pdf"
                              fileName={`Bank_Statement_${leadInfo?.lead_id}`}
                              btnName="View & Download"
                              label="Bank Statement"
                              disabled={funder}
                            />
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </Accordion>
            </form>
          </div>
        ))
      )}
    </Accordion>
  );
};

export default OtherBankInfo;

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
import {
  getLeadDocuments,
  SwitchBank,
  UpdateIncompleteUserApp,
  UpdateUserApp,
  VerifyBankDetails,
  VerifyIFSC,
} from "../../api/ApiFunction";
import { FileConverter } from "../utils/FileConverter";
import Modal from "../utils/Modal";
import Button from "../utils/Button";
import UploadInput from "../fields/UploadInput";
import { toast } from "react-toastify";

const OtherBankInfo = ({
  btnEnable = false,
  incomplete,
  switchBank,
  fetchData,
}) => {
  // const [isEditing, setIsEditing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isEditing, setIsEditing] = useState({});
  const [initialFile, setInitialFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [BankId, setBankId] = useState(null);
  const [openApprove, setOpenApprove] = useState(false);
  const [checkModal, setCheckModal] = useState("");
  const [bankSwitch, setbankSwitch] = useState({});
  const [isSwitchOpen, setisSwitchOpen] = useState(false);
  const [isSubmittingSwitch, setisSubmittingSwitch] = useState(false);

  const { adminUser } = useAuth();
  const { bankList } = useGetData();
  const { documents, setDocuments, getDocuments } = useGetDocument();
  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  // console.log("leadInfo :", leadInfo);
  const bankData = leadInfo?.secondarybankinfo; // array
  // console.log("bankData: ", bankData)
  const leadStatus = leadInfo.lead_status;
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

  const handleEdit = (idx) => {
    setActiveIndex(idx); // important hai

    setIsEditing((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));

    const bankNameValue =
      formik.values.secondarybankinfo?.[idx]?.bankName || "";

    const bankIdData = bankList?.filter(
      (item) =>
        item.bank_name.toLowerCase().replaceAll(" ", "") ===
        bankNameValue.toLowerCase().replaceAll(" ", ""),
    );

    setBankId(bankIdData?.[0]?.bankId);
  };

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

  useEffect(() => {
    getDocuments();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      secondarybankinfo: (bankData || []).map((b) => ({
        id: b?.id,
        bankName: b?.bank_name || "",
        accountHolder: b?.account_holder_name || "",
        accountNumber: b?.account_number || "",
        confirmAccNumber: b?.account_number || "",
        ifscCode: b?.ifsc_code || "",
        bankStatement: null || "",
      })),
    },
    validationSchema: Yup.object({
      secondarybankinfo: Yup.array().of(
        Yup.object({
          bankName: Yup.string().required("Bank name is required."),
          // accountHolder: Yup.string()
          //   .min(3, "Must be at least 3 characters.")
          //   .max(50, "Must be 50 characters or less.")
          //   .required("Account holder name is required."),
          accountHolder: Yup.string()
            .min(3, "Must be at least 3 characters.")
            .max(50, "Must be 50 characters or less.")
            .matches(/^[A-Za-z\s]+$/, "Invalid account holder name.")
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
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsEditing(false);
      setOpenApprove(false);
      setIsLoading(true);

      try {
        const entry = values.secondarybankinfo[activeIndex];

        const existingDoc = documents?.bank_statement?.find(
          (d) => d.id === entry.id,
        );
        const existingBankData = bankData?.find((b) => b.id === entry.id);

        let convertedBase64 = null;

        if (entry.bankStatement && entry.bankStatement instanceof File) {
          convertedBase64 = await FileConverter(entry.bankStatement);
        } else if (existingDoc?.bank_statement_data) {
          convertedBase64 = existingDoc.bank_statement_data;
        } else if (existingBankData?.bank_statement_data) {
          convertedBase64 = existingBankData.bank_statement_data;
        }

        const secondarybankinfo = [
          {
            id: entry.id,
            bank_name: entry.bankName?.trim(),
            account_holder_name: entry.accountHolder?.trim(),
            account_number: entry.accountNumber,
            ifsc_code: entry.ifscCode?.trim(),
            bank_statement_image_name:
              entry.bankStatement?.name ||
              existingDoc?.bank_statement_image_name ||
              existingBankData?.bank_statement_image_name ||
              "",
            bank_statement_image_extn:
              entry.bankStatement?.name?.split(".").pop() ||
              existingDoc?.bank_statement_image_extn ||
              existingBankData?.bank_statement_image_extn ||
              "",
            bank_statement_data: convertedBase64
              ? convertedBase64.includes("base64,")
                ? convertedBase64.split(",")[1]
                : convertedBase64
              : "",
            bank_info_verified: leadStatus >= 2 ? true : false,
            updated_by: adminUser.emp_code,
          },
        ];

        const userRequest = {
          user_id: leadInfo?.user_id,
          lead_id: leadInfo?.lead_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
          personalInfo: [],
          employmentInfo: [],
          addressInfo: [],
          kycInfo: [],
          bankInfo: [],
          guarantorInfo: [],
          secondarybankinfo,
        };

        let response;
        if (incomplete) {
          response = await UpdateIncompleteUserApp(userRequest);
        } else {
          response = await UpdateUserApp(userRequest);
        }

        if (response.status) {
          // setLeadInfo((prev) => ({
          //   ...prev,
          //   ...response,
          // }));
          fetchData({ UserId: leadInfo.user_id, leadId: leadInfo.lead_id });
          FetchDocData();
          toast.success(response.message);
          setIsEditing(false);
          setActiveIndex(null);

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

  console.log(formik.errors);
  console.log(formik.values);

  const handleUpdateYes = () => {
    formik.submitForm();
  };

  const handleUpdate = () => {
    setCheckModal("Update");
    setOpenApprove(true);
  };

  const FetchDocData = async () => {
    try {
      const response = await getLeadDocuments({
        user_id: leadInfo.user_id,
        lead_id: leadInfo.lead_id,
      });

      setDocuments(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event, index) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF files only");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }

      // ✅ FIX: set correct field using index
      formik.setFieldValue(`secondarybankinfo[${index}].bankStatement`, file);
    }
  };

  // Populate each bank's bankStatement field from documents (if available)
  useEffect(() => {
    if (!bankData || !Array.isArray(bankData)) return;

    bankData.forEach((b, i) => {
      const doc = documents?.bank_statement?.find((d) => d.id === b.id) || b;
      if (doc?.bank_statement_data) {
        const file = base64ToFile(
          doc.bank_statement_data,
          `Bank_Statement_${b.id}.pdf`,
        );
        if (file) {
          formik.setFieldValue(`secondarybankinfo[${i}].bankStatement`, file);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, bankData]);

  const VerifyIFSCCode = async () => {
    const req = {
      ifsc_code: bankSwitch?.ifsc_code,
    };

    try {
      const response = await VerifyIFSC(req);
      if (response.data.is_valid && response.success) {
        return true;
      } else {
        toast.error(response.data?.failure_reason || "Invalid IFSC Code!");
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const verifyBank = async () => {
    // Check if IFSC is of selected bank
    const bankName = bankSwitch?.bank_name?.toLowerCase()?.replaceAll(" ", "");
    const bankId = bankList?.find(
      (item) => bankName == item?.bank_name?.toLowerCase()?.replaceAll(" ", ""),
    )?.bank_id;

    if (bankSwitch?.ifsc_code.slice(0, 4) != bankId) {
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
      account_number: bankSwitch.account_number,
      account_ifsc: bankSwitch.ifsc_code,
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

  const handleSwitch = async () => {
    try {
      setisSubmittingSwitch(true);
      const isVerified = await verifyBank(bankSwitch);

      if (!isVerified) {
        return; // stop here
      }

      const req = {
        lead_id: leadInfo.lead_id,
        bank_id: String(bankSwitch?.id),
        flag: "2",
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
        updated_by: adminUser?.emp_code,
      };

      const response = await SwitchBank(req);
      if (response.status) {
        toast.success(response.message || "Banks Swithced successfully");
        fetchData({ UserId: leadInfo.user_id, leadId: leadInfo.lead_id });
        setisSwitchOpen(false);
        FetchDocData();
        setbankSwitch({});
      } else {
        toast.info(response.message || "Unable to switch banks!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error || "Something went wrong!");
    } finally {
      setisSubmittingSwitch(false);
    }
  };

  function ErrorMsg({ error }) {
    return <p className="text-red-500 text-xs mt-1">{error}</p>;
  }

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
                // actionButtons={null}
                // tooltipMsg={isEditing ? "Cancel" : "Edit Bank Info"}
                // tooltipMsg={isEditing[index] ? "Cancel" : "Edit Bank Info"}
                actionButtons={
                  btnEnable
                    ? [
                        {
                          icon: isEditing[index]
                            ? "IoClose"
                            : leadStatus === 1
                              ? "RiEdit2Fill"
                              : "MdOutlineCheckCircle",
                          onClick: () => handleEdit(index),
                          tooltipMsg: isEditing[index]
                            ? "Cancel"
                            : "Edit Bank Info",
                          className: isEditing
                            ? "border border-danger text-danger hover:bg-danger hover:border-danger hover:text-white"
                            : "border border-primary text-primary hover:bg-success hover:border-success hover:text-white",
                        },
                        switchBank
                          ? {
                              icon: "HiSwitchHorizontal",
                              onClick: () => {
                                {
                                  (setbankSwitch(bank), setisSwitchOpen(true));
                                }
                              },
                              tooltipMsg: "Switch Banks",
                              className:
                                isEditing &&
                                "border border-danger text-danger hover:bg-danger hover:border-danger hover:text-white",
                            }
                          : null,
                      ]
                    : null
                }
                bgColor={"bg-[#bfdbfe]"}
              >
                <div className="grid grid-cols-6 gap-4 mb-8 px-4">
                  <div className="col-span-3">
                    <SelectInput
                      label="Bank Name"
                      placeholder={bank?.bank_name || "N/A"}
                      icon="MdOutlineAccountBalance"
                      name={`secondarybankinfo[${index}].bankName`}
                      id={`secondarybankinfo[${index}].bankName`}
                      disabled={!isEditing[index]}
                      options={bankList.map((bankName) => ({
                        label: bankName.bank_name,
                        value: bankName.bank_name,
                      }))}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={
                        formik.values.secondarybankinfo?.[index]?.bankName || ""
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <TextInput
                      label="Account Number"
                      icon="RiFileTextLine"
                      placeholder="Enter Account Number"
                      name={`secondarybankinfo[${index}].accountNumber`}
                      id={`secondarybankinfo[${index}].accountNumber`}
                      disabled={!isEditing[index]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={
                        formik.values.secondarybankinfo?.[index]
                          ?.accountNumber || ""
                      }
                    />
                    {formik.touched.secondarybankinfo?.[index]?.accountNumber &&
                      formik.errors.secondarybankinfo?.[index]
                        ?.accountNumber && (
                        <ErrorMsg
                          error={
                            formik.errors.secondarybankinfo[index].accountNumber
                          }
                        />
                      )}
                  </div>
                  <div className="col-span-2 max-md:col-span-3">
                    <TextInput
                      label="IFSC Code"
                      icon="RiSecurePaymentFill"
                      placeholder="IFSC Code"
                      name={`secondarybankinfo[${index}].ifscCode`}
                      id={`secondarybankinfo[${index}].ifscCode`}
                      disabled={!isEditing[index]}
                      // onChange={formik.handleChange}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        formik.setFieldValue(
                          `secondarybankinfo[${index}].ifscCode`,
                          value,
                        );
                      }}
                      onBlur={formik.handleBlur}
                      value={
                        formik.values.secondarybankinfo?.[index]?.ifscCode || ""
                      }
                    />
                    {formik.touched.secondarybankinfo?.[index]?.ifscCode &&
                      formik.errors.secondarybankinfo?.[index]?.ifscCode && (
                        <ErrorMsg
                          error={
                            formik.errors.secondarybankinfo[index].ifscCode
                          }
                        />
                      )}
                  </div>

                  <div className="col-span-2 max-md:col-span-3">
                    <TextInput
                      label="A/c Holder Name"
                      icon="IoPersonOutline"
                      placeholder="Enter Full Name"
                      name={`secondarybankinfo[${index}].accountHolder`}
                      id={`secondarybankinfo[${index}].accountHolder`}
                      disabled={!isEditing[index]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={
                        formik.values.secondarybankinfo?.[index]
                          ?.accountHolder || ""
                      }
                    />

                    {formik.touched.secondarybankinfo?.[index]?.accountHolder &&
                      formik.errors.secondarybankinfo?.[index]
                        ?.accountHolder && (
                        <ErrorMsg
                          error={
                            formik.errors.secondarybankinfo[index].accountHolder
                          }
                        />
                      )}
                  </div>

                  {docData?.map((item) => {
                    if (item.id === bank.id) {
                      return (
                        <div key={bank?.id}>
                          {isEditing[index] && (
                            <div className="col-span-2 max-md:col-span-3">
                              <UploadInput
                                label="Bank Statement"
                                name={`secondarybankinfo[${index}].bankStatement`}
                                icon="MdUploadFile"
                                disabled={!isEditing[index]}
                                acceptedFormats="application/pdf"
                                onChange={(e) => handleFileChange(e, index)} // ✅ FIX
                                onBlur={formik.handleBlur}
                              />

                              {/* ✅ FIX: correct error path */}
                              {formik.touched.secondarybankinfo?.[index]
                                ?.bankStatement &&
                                formik.errors.secondarybankinfo?.[index]
                                  ?.bankStatement && (
                                  <ErrorMsg
                                    error={
                                      formik.errors.secondarybankinfo[index]
                                        .bankStatement
                                    }
                                  />
                                )}
                            </div>
                          )}

                          {!isEditing[index] && (
                            <div className="col-span-2 max-md:col-span-3">
                              {!funder && (
                                <DownloadDoc
                                  fileUrl={item.bank_statement_data_url}
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
                      );
                    }
                  })}

                  {/* {docData?.map((item) => {
                    if (item.id === bank.id) {
                      return (
                        <>
                          {isEditing && (
                            <div className="col-span-2 max-md:col-span-3">
                              <UploadInput
                                label="Bank Statement"
                                name="bankStatement"
                                icon="MdUploadFile"
                                disabled={!isEditing[index]}
                                acceptedFormats="application/pdf"
                                onChange={() => handleFileChange(item)}
                                onBlur={formik.handleBlur}
                                key={
                                  initialFile
                                    ? "file-input-with-value"
                                    : "file-input"
                                }
                              />
                              {formik.touched.bankStatement &&
                                formik.errors.bankStatement && (
                                  <ErrorMsg
                                    error={formik.errors.bankStatement}
                                  />
                                )}
                            </div>
                          )}

                          {!isEditing && (
                            <div
                              key={bank?.id}
                              className="col-span-2 max-md:col-span-3"
                            >
                              {!funder && (
                                <DownloadDoc
                                  fileUrl={item.bank_statement_data_url}
                                  // fileUrl="https://devapi.earlywages.in/document/PU02531/JPU2397_Other_BankStatement625759.pdf"
                                  fileType="application/pdf"
                                  fileName={`Bank_Statement_${leadInfo?.lead_id}`}
                                  btnName="View & Download"
                                  label="Bank Statement"
                                  disabled={funder}
                                />
                              )}
                            </div>
                          )}
                        </>
                      );
                    }
                  })} */}
                </div>
                {/* 
                {isEditing && (
                  <div className="col-span-2 max-md:col-span-3">
                    <div className="flex justify-center gap-5">
                      <Button
                        btnName={
                          leadStatus === 1
                            ? "Save Changes"
                            : "Save & Mark Verified"
                        }
                        btnIcon={
                          leadStatus === 1
                            ? "IoSaveSharp"
                            : "IoCheckmarkCircleSharp"
                        }
                        type="button"
                        onClick={handleUpdate}
                        disabled={!formik.isValid}
                        style="min-w-[150px] md:w-auto text-xs my-4 py-0.5 px-4 border border-primary text-primary hover:border-success hover:text-success hover:font-semibold"
                      />

                    </div>
                  </div>
                )} */}

                {isEditing[index] && (
                  <div className="flex justify-center gap-5">
                    <Button
                      btnName={
                        leadStatus === 1
                          ? "Save Changes"
                          : "Save & Mark Verified"
                      }
                      btnIcon={
                        leadStatus === 1
                          ? "IoSaveSharp"
                          : "IoCheckmarkCircleSharp"
                      }
                      type="button"
                      onClick={handleUpdate}
                      // disabled={!formik.isValid}
                      disabled={!formik.isValid || activeIndex !== index}
                      style="min-w-[150px] md:w-auto text-xs my-4 py-0.5 px-4 border border-primary text-primary hover:border-success hover:text-success hover:font-semibold"
                    />
                  </div>
                )}
              </Accordion>
            </form>
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

                {/* {checkModal === "Resubmit" && (
                  <Button
                    btnName="Yes"
                    btnIcon="IoCheckmarkCircleSharp"
                    type="button"
                    onClick={handleResubmitYes}
                    style="min-w-[80px] md:w-auto mt-4 py-1 px-4 border border-primary text-primary hover:border-success hover:bg-success hover:text-white hover:font-semibold"
                  />
                )} */}

                <Button
                  btnName="No"
                  btnIcon="IoCloseCircleOutline"
                  type="button"
                  onClick={() => setOpenApprove(false)}
                  style="min-w-[80px] md:w-auto mt-4 py-0.5 px-4 border border-primary text-primary hover:border-dark hover:bg-dark hover:text-white hover:font-semibold"
                />
              </div>
            </Modal>

            <Modal isOpen={isSwitchOpen} onClose={() => setisSwitchOpen(false)}>
              <div className="text-center font-semibold">
                <h1>Are you sure want to switch this bank to primary bank?</h1>
              </div>
              <div className="flex justify-end gap-4 mt-2">
                <Button
                  btnName={isSubmittingSwitch ? "Switching..." : "Yes"}
                  btnIcon="IoCheckmarkCircleSharp"
                  type="button"
                  onClick={handleSwitch}
                  disabled={isSubmittingSwitch}
                  style={`min-w-[80px] md:w-auto mt-4 py-1 px-4 border border-primary text-primary hover:border-success hover:bg-success hover:text-white hover:font-semibold ${isSubmittingSwitch && "bg-gray-500 text-white hover:bg-gray-500"}`}
                />

                <Button
                  btnName="No"
                  btnIcon="IoCloseCircleOutline"
                  type="button"
                  onClick={() => {
                    (setisSwitchOpen(false), setbankSwitch({}));
                  }}
                  style="min-w-[80px] md:w-auto mt-4 py-0.5 px-4 border border-primary text-primary hover:border-dark hover:bg-dark hover:text-white hover:font-semibold"
                />
              </div>
            </Modal>
          </div>
        ))
      )}
    </Accordion>
  );
};

export default OtherBankInfo;

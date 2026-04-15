import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ErrorMsg from "../utils/ErrorMsg";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import UploadInput from "../fields/UploadInput";
import Button from "../utils/Button";
import Accordion from "../utils/Accordion";
import {
  UpdateUserApp,
  ResubmitApp,
  UpdateIncompleteUserApp,
  getInCompleteLeadDetails,
} from "../../api/ApiFunction";
import { FileConverter } from "../utils/FileConverter";
import Modal from "../utils/Modal";
import DownloadDoc from "../utils/DownloadDoc";
import { useAuth } from "../../context/AuthContext";
import { useGetData } from "../../context/GetDataContext";
import { useGetDocument } from "../../context/GetDocument";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import Loader from "../utils/Loader";
import DateInput from "../fields/DateInput";

const Employment = ({ btnEnable = false, incomplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [acceptReturn, setAcceptReturn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkModal, setCheckModal] = useState("");
  const [initialFile, setInitialFile] = useState(null);

  const { adminUser } = useAuth();
  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  const { sector, employedSince } = useGetData();
  const { documents, setDocuments } = useGetDocument();
  const docData = documents?.salary_slip?.[0];
  const employeeData = leadInfo?.employmentInfo[0];
  const leadStatus = leadInfo.lead_status;
  const funder = adminUser.role === "Funder" ? true : false;

  const formik = useFormik({
    initialValues: {
      company: employeeData?.company_name || "",
      sector: employeeData?.sector_type || "",
      referral: employeeData?.referral_code || "",
      workingSince: employeeData?.employed_since || "",
      netSalary: employeeData?.net_monthly_salary || "",
      salaryDate: employeeData?.salary_date || "",
      file: null, // Initialize as null, we'll set it after component mounts
    },
    validationSchema: Yup.object({
      company: Yup.string().required("Company name is required"),
      sector: Yup.string().required("Sector type is required"),
      workingSince: Yup.string().required("Working since is required"),
      netSalary: Yup.string().required("Net salary is required"),
      salaryDate: Yup.string().required("Salary date is required"),
      file: Yup.mixed()
        .nullable()
        .notRequired()
        .test(
          "fileSize",
          "File size is too large. Maximum size is 5MB.",
          (value) => {
            // If no file is selected, pass validation (it's optional)
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
          }
        ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsEditing(false);
      setIsLoading(true);
      try {
        let convertedBase64 = null;

        // If a new file was uploaded, use that
        if (values.file && values.file !== initialFile) {
          convertedBase64 = await FileConverter(values.file);
        }
        // Otherwise, use the existing base64 data if available
        else if (
          documents?.salary_slip?.length > 0 &&
          documents.salary_slip[0]?.salary_slip_pdf_data
        ) {
          convertedBase64 = documents.salary_slip[0].salary_slip_pdf_data;
        }

        const userRequest = {
          user_id: leadInfo?.user_id,
          lead_id: leadInfo?.lead_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
          personalInfo: [],
          employmentInfo: [
            {
              id: employeeData?.id,
              company_name: values?.company?.trim(),
              sector_type: values?.sector?.trim(),
              referral_code: values?.referral?.trim(),
              employed_since: values?.workingSince,
              net_monthly_salary: values?.netSalary?.trim(),
              salary_date: values?.salaryDate,
              salary_slip_pdf_name:
                values.file?.name ||
                documents.salary_slip[0]?.salary_slip_pdf_name,
              salary_slip_pdf_extn:
                values.file?.name?.split(".").pop() ||
                documents.salary_slip[0]?.salary_slip_pdf_extn,
              salary_slip_pdf_data: convertedBase64
                ? convertedBase64.includes("base64,")
                  ? convertedBase64.split(",")[1]
                  : convertedBase64
                : null,
              employment_info_verified: leadStatus >= 2 ? true : false,
              updated_by: adminUser.emp_code,
            },
          ],
          addressInfo: [],
          kycInfo: [],
          bankInfo: [],
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
          const employmentData = userRequest.employmentInfo[0];

          const salaryPdf = {
            id: employmentData?.id,
            salary_slip_pdf_name: employmentData?.salary_slip_pdf_name,
            salary_slip_pdf_extn: employmentData?.salary_slip_pdf_extn,
            salary_slip_pdf_data: employmentData?.salary_slip_pdf_data,
          };

          setLeadInfo((prev) => ({
            ...prev,
            ...response,
          }));

          setDocuments((prev) => ({
            ...prev,
            salary_slip: [salaryPdf],
          }));
          toast.success(response.message);
          setIsEditing(false);
          // console.log([salaryPdf]);

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
          // window.location.reload();
        } else {
          toast.error(response.message);
        }

        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setIsLoading(false);
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error updating employment info:", error);
      } finally {
        setOpenApprove(false);
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Set initial file value after component mounts
  useEffect(() => {
    if (initialFile) {
      formik.setFieldValue("file", initialFile);
    }
  }, [initialFile]);

  const handleEdit = () => {
    if (isEditing && formik.dirty) {
      setIsEditing(false);
    } else {
      setIsEditing(!isEditing);
    }
  };

  const handleUpdate = () => {
    setOpenApprove(true);
    setCheckModal("Update");
  };

  // Handle Yes button click in the modal
  const handleUpdateYes = () => {
    formik.submitForm(); // This will trigger the onSubmit function
  };

  const handleResubmit = () => {
    setOpenApprove(true);
    setCheckModal("Resubmit");
  };

  const handleResubmitYes = () => {
    setAcceptReturn(true);
  };

  // Handle No button click in the modal
  const handleAcceptNo = () => {
    setOpenApprove(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Accordion
      title="Employment Details"
      tooltipMsg={
        isEditing
          ? "Cancel"
          : leadStatus === 1
          ? "Edit Employment Info"
          : "Update & Verify"
      }
      verified={leadInfo?.employment_info_verified}
      // reset={leadInfo?.gurantor_nominee_fill}
      reset={leadInfo?.employment_info_fill}
      open
      // actionButtons={
      //   btnEnable
      //     ? [
      //         {
      //           icon: isEditing
      //             ? "IoClose"
      //             : leadStatus === 1
      //             ? "RiEdit2Fill"
      //             : "MdOutlineCheckCircle",
      //           onClick: handleEdit,
      //           className: isEditing
      //             ? "border border-danger text-danger hover:bg-danger hover:border-danger hover:text-white"
      //             : "border border-primary text-primary hover:bg-success hover:border-success hover:text-white",
      //         },
      //       ]
      //     : null
      // }

      actionButtons={
        btnEnable && !(incomplete && leadInfo?.employment_info_fill)
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
              <TextInput
                label="Company Name"
                icon="IoBusinessOutline"
                placeholder="Enter Company Name"
                name="company"
                type="text"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.company}
              />
              {formik.touched.company && formik.errors.company && (
                <ErrorMsg error={formik.errors.company} />
              )}
            </div>
            <div className="col-span-3">
              <SelectInput
                label="Sector Type"
                icon="IoBriefcaseOutline"
                name="sector"
                placeholder="Select Sector"
                disabled={!isEditing}
                options={sector.map((sector) => ({
                  value: sector.sector_name,
                  label: sector.sector_name,
                }))}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sector}
              />

              {formik.touched.sector && formik.errors.sector && (
                <ErrorMsg error={formik.errors.sector} />
              )}
            </div>
            <div className="col-span-2 max-md:col-span-3">
              <TextInput
                label="Company Referral Code"
                icon="RiUserShared2Line"
                placeholder="Enter Referral Code"
                name="referral"
                type="text"
                maxLength={10}
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.referral}
              />
              {formik.touched.referral && formik.errors.referral && (
                <ErrorMsg error={formik.errors.referral} />
              )}
            </div>
            <div className="col-span-2 max-md:col-span-3">
              <SelectInput
                label="Employed Since"
                icon="IoTimeOutline"
                name="workingSince"
                placeholder="Select Period"
                disabled={!isEditing}
                // options={employedSince}
                options={employedSince.map((data) => ({
                  value: data.employed_since_name,
                  label: data.employed_since_name,
                }))}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.workingSince}
              />
              {formik.touched.workingSince && formik.errors.workingSince && (
                <ErrorMsg error={formik.errors.workingSince} />
              )}
            </div>
            <div className="col-span-2 max-md:col-span-3">
              <TextInput
                label="Net Monthly Salary"
                icon="RiMoneyRupeeCircleLine"
                placeholder="Net Salary"
                name="netSalary"
                type="text"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.netSalary}
              />

              {formik.touched.netSalary && formik.errors.netSalary && (
                <ErrorMsg error={formik.errors.netSalary} />
              )}
            </div>
            <div className="col-span-2">
              {/* <TextInput
                label="Salary Date"
                icon="IoCalendarOutline"
                placeholder="DD-MM-YYYY"
                name="salaryDate"
                type="text"
                disabled={!isEditing}
                id="salaryDate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.salaryDate}
              /> */}

              <DateInput
                label="Salary Date"
                icon="IoCalendarOutline"
                placeholder="DD-MM-YYYY"
                name="salaryDate"
                id="salaryDate"
                min={new Date().toISOString().split("T")[0]}
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.salaryDate}
              />

              {formik.touched.salaryDate && formik.errors.salaryDate && (
                <ErrorMsg error={formik.errors.salaryDate} />
              )}
            </div>

            {isEditing && (
              <div className="col-span-2 max-md:col-span-3">
                <UploadInput
                  label="Salary Slip (PDF only)"
                  name="file"
                  icon="MdUploadFile"
                  disabled={!isEditing}
                  acceptedFormats="application/pdf"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    // console.log("Selected file:", file);
                    if (file) {
                      console.log("File size (MB):", file.size / (1024 * 1024));
                    }
                    formik.setFieldValue("file", file);
                    formik.setFieldTouched("file", true, true);
                  }}
                  onBlur={formik.handleBlur}
                  key={initialFile ? "file-input-with-value" : "file-input"}
                />
                {formik.touched.file && formik.errors.file && (
                  <ErrorMsg error={formik.errors.file} />
                )}
              </div>
            )}

            {(!isEditing && docData?.salary_slip_pdf_data_url) && (
              <div className="col-span-2 max-md:col-span-3">
                {!funder && (
                  <DownloadDoc
                    fileUrl={documents.salary_slip[0].salary_slip_pdf_data_url}
                    fileType="application/pdf"
                    fileName={`Salary_slip_${leadInfo?.lead_id}`}
                    btnName="View & Download"
                    label="Salary Slip"
                  />
                )}
              </div>
            )}
          </div>
          {isEditing && (
            <div className="col-span-2">
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

export default Employment;

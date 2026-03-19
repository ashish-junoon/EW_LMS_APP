import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ErrorMsg from "../utils/ErrorMsg";
import TextInput from "../fields/TextInput";
import UploadInput from "../fields/UploadInput";
import Button from "../utils/Button";
import {
  UpdateUserApp,
  ResubmitApp,
  UpdateIncompleteUserApp,
  getInCompleteLeadDetails,
} from "../../api/ApiFunction";
import Accordion from "../utils/Accordion";
import { FileConverter } from "../utils/FileConverter";
import Modal from "../utils/Modal";
import DownloadDoc from "../utils/DownloadDoc";
import { useAuth } from "../../context/AuthContext";
import { useGetDocument } from "../../context/GetDocument";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { maskData } from "../utils/maskData";
import Loader from "../utils/Loader";

// Updated FileConverter utility
const convertFileToBase64 = async (file) => {
  if (!file || !(file instanceof File)) return null;
  try {
    const base64Data = await FileConverter(file);
    return base64Data?.split(",")[1] || null;
  } catch (error) {
    console.error("File conversion error:", error);
    return null;
  }
};

const KycInfo = ({ btnEnable = false, incomplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [acceptReturn, setAcceptReturn] = useState(false);
  const [checkModal, setCheckModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  const kycInfo = leadInfo?.kycInfo[0];
  const leadStatus = leadInfo.lead_status;

  const { adminUser } = useAuth();
  const { documents, setDocuments } = useGetDocument();
  const docData = documents?.aadhaar_pan?.[0];
  const funder = adminUser.role === "Funder" ? true : false;

  const formik = useFormik({
    initialValues: {
      panNumber: funder
        ? maskData(kycInfo?.pan_card_number, "pan")
        : kycInfo?.pan_card_number || "",
      panCard: null,
      adharNumber: funder
        ? maskData(kycInfo?.aadhaar_number, "aadhaar")
        : kycInfo?.aadhaar_number || "",
      adharFront: null,
      adharBack: null,
    },
    validationSchema: Yup.object({
      panNumber: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN Number.")
        .required("Required"),
      adharNumber: Yup.string()
        .matches(/^[0-9]{12}$/, "Invalid Aadhar Number.")
        .required("Required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        // Get existing data
        const existingPanData = docData?.pancard_data || "";
        const existingPanName = docData?.pan_card_img_name || "";
        const existingPanExt = docData?.pan_card_img_extn || "";

        const existingAdharFrontData = docData?.aadhar_front_data || "";
        const existingAdharFrontName = docData?.aadhaar_front_image_name || "";
        const existingAdharFrontExt = docData?.aadhaar_front_image_extn || "";

        const existingAdharBackData = docData?.aadhar_back_data || "";
        const existingAdharBackName = docData?.aadhaar_back_image_name || "";
        const existingAdharBackExt = docData?.aadhaar_back_image_extn || "";

        // Process new files if uploaded
        let panCardBase64 = existingPanData;
        let panCardName = existingPanName;
        let panCardExt = existingPanExt;

        let adharFrontBase64 = existingAdharFrontData;
        let adharFrontName = existingAdharFrontName;
        let adharFrontExt = existingAdharFrontExt;

        let adharBackBase64 = existingAdharBackData;
        let adharBackName = existingAdharBackName;
        let adharBackExt = existingAdharBackExt;

        // Only convert new files if uploaded
        if (values.panCard instanceof File) {
          panCardBase64 = await convertFileToBase64(values.panCard);
          panCardName = values.panCard.name;
          panCardExt = values.panCard.name.split(".").pop();
        }

        if (values.adharFront instanceof File) {
          adharFrontBase64 = await convertFileToBase64(values.adharFront);
          adharFrontName = values.adharFront.name;
          adharFrontExt = values.adharFront.name.split(".").pop();
        }

        if (values.adharBack instanceof File) {
          adharBackBase64 = await convertFileToBase64(values.adharBack);
          adharBackName = values.adharBack.name;
          adharBackExt = values.adharBack.name.split(".").pop();
        }

        // Prepare request with complete data
        const userRequest = {
          user_id: leadInfo?.user_id,
          lead_id: leadInfo?.lead_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
          personalInfo: [],
          employmentInfo: [],
          addressInfo: [],
          kycInfo: [
            {
              id: kycInfo?.id,
              aadhaar_number: values.adharNumber,
              aadhaar_front_image_name: adharFrontName,
              aadhaar_front_image_extn: adharFrontExt,
              aadhar_front_data: adharFrontBase64,
              aadhaar_back_image_name: adharBackName,
              aadhaar_back_image_extn: adharBackExt,
              aadhar_back_data: adharBackBase64,
              pan_card_number: values.panNumber,
              pan_card_img_name: panCardName,
              pan_card_img_extn: panCardExt,
              pancard_data: panCardBase64,
              kyc_info_verified: leadStatus === 2 ? true : false,
              updated_by: adminUser.emp_code,
            },
          ],
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

        setIsEditing(false);

        if (response.status) {
          const documentsData = userRequest.kycInfo[0];
          const aadhaar_pan = {
            aadhaar_front_image_name: documentsData?.aadhaar_front_image_name,
            aadhaar_front_image_extn: documentsData?.aadhaar_front_image_extn,
            aadhar_front_data: documentsData?.aadhar_front_data,
            aadhaar_back_image_name: documentsData?.aadhaar_back_image_name,
            aadhaar_back_image_extn: documentsData?.aadhaar_back_image_extn,
            aadhar_back_data: documentsData?.aadhar_back_data,
            pan_card_img_name: documentsData?.pan_card_img_name,
            pan_card_img_extn: documentsData?.pan_card_img_extn,
            pancard_data: documentsData?.pancard_data,
          };
          setLeadInfo((prev) => ({
            ...prev,
            ...response,
          }));
          setDocuments((prev) => ({
            ...prev,
            aadhaar_pan: [aadhaar_pan],
          }));

          toast.success(response.message);
          setIsEditing(false);
          setOpenApprove(false);

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
          setIsLoading(false);
        } else {
          toast.error(response.message || "Update failed");
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setIsLoading(false);
      } catch (error) {
        // toast.error('Something went wrong. Please try again.');
        console.error("Update KYC info error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (fieldName) => (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF, JPG, JPEG or PNG files only");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      formik.setFieldValue(fieldName, file);
    }
  };

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
    setIsEditing(false);
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

  useEffect(() => {
    if (acceptReturn) {
      const resubmitApplication = async () => {
        try {
          const userRequest = {
            user_id: leadInfo?.user_id,
            lead_id: leadInfo?.lead_id,
            is_personal_fill: true,
            is_employment_fill: true,
            is_address_fill: true,
            is_kyc_fill: false,
            is_bank_fill: true,
            is_gurantor_nominee_fill: true,
            updated_by: adminUser.emp_code,
          };

          const response = await ResubmitApp(userRequest);

          if (response.status === true) {
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("Something went wrong. Please try again.");
          console.error("Error ResubmitApp:", error);
        } finally {
          setOpenApprove(false);
          setIsEditing(false);
          setAcceptReturn(false);
        }
      };

      resubmitApplication();
    }
  }, [acceptReturn]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Accordion
      title="KYC Details"
      tooltipMsg={
        isEditing
          ? "Cancel"
          : leadStatus === 1
          ? "Edit KYC Info"
          : "Update & Verify"
      }
      verified={leadInfo?.kyc_info_verified}
      reset={leadInfo?.kyc_info_fill}
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
        btnEnable && !(incomplete && leadInfo?.kyc_info_fill)
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
                label="PAN Number"
                icon="IoBusinessOutline"
                placeholder="PAN Number"
                name="panNumber"
                type="text"
                disabled={!isEditing}
                // onChange={formik.handleChange}
                onChange={(e) => {
                  formik.setFieldValue("panNumber", e.target.value.toUpperCase());
                }}
                onBlur={formik.handleBlur}
                value={formik.values.panNumber}
              />
              {formik.touched.panNumber && formik.errors.panNumber && (
                <ErrorMsg error={formik.errors.panNumber} />
              )}
            </div>
            <div className="col-span-3">
              <TextInput
                label="Aadhar Number"
                icon="IoBusinessOutline"
                placeholder="Aadhar Number"
                name="adharNumber"
                type="text"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adharNumber}
              />
              {formik.touched.adharNumber && formik.errors.adharNumber && (
                <ErrorMsg error={formik.errors.adharNumber} />
              )}
            </div>
            {isEditing && (
              <div className="col-span-2 max-md:col-span-3">
                <UploadInput
                  label="PAN Card"
                  name="panCard"
                  icon="MdUploadFile"
                  required={false}
                  maxSize={"w-1/2"}
                  disabled={!isEditing}
                  acceptedFormats=".jpg,.jpeg,.png"
                  onChange={handleFileChange("panCard")}
                  onBlur={formik.handleBlur}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Leave empty to keep existing file
                </div>
                {formik.touched.panCard && formik.errors.panCard && (
                  <ErrorMsg error={formik.errors.panCard} />
                )}
              </div>
            )}

            {!isEditing && docData?.pancard_data_url && (
              <div className="col-span-2 max-md:col-span-3">
                {!funder && (
                  <DownloadDoc
                    fileUrl={docData.pancard_data_url}
                    fileType="image/jpeg"
                    fileName={`PAN_card ${leadInfo?.lead_id}`}
                    btnName="View & Download"
                    label="PAN Card"
                    disabled={funder}
                  />
                )}
              </div>
            )}

            {isEditing && (
              <div className="col-span-2 max-md:col-span-3">
                <UploadInput
                  label="Aadhar Front"
                  name="adharFront"
                  icon="MdUploadFile"
                  required={false}
                  maxSize={"w-1/2"}
                  disabled={!isEditing}
                  acceptedFormats=".jpg,.jpeg,.png"
                  onChange={handleFileChange("adharFront")}
                  onBlur={formik.handleBlur}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Leave empty to keep existing file
                </div>
                {formik.touched.adharFront && formik.errors.adharFront && (
                  <ErrorMsg error={formik.errors.adharFront} />
                )}
              </div>
            )}

            {!isEditing && docData?.aadhar_front_data_url && (
              <div className="col-span-2 max-md:col-span-3">
                {!funder && (
                  <DownloadDoc
                    fileUrl={docData.aadhar_front_data_url}
                    fileType="image/jpeg"
                    fileName={`Aadhar_Front ${leadInfo?.lead_id}`}
                    btnName="View & Download"
                    label="Aadhar Front"
                    disabled={funder}
                  />
                )}
              </div>
            )}

            {isEditing && (
              <div className="col-span-2 max-md:col-span-3">
                <UploadInput
                  label="Aadhar Back"
                  name="adharBack"
                  icon="MdUploadFile"
                  required={false}
                  maxSize={"w-1/2"}
                  disabled={!isEditing}
                  acceptedFormats=".jpg,.jpeg,.png"
                  onChange={handleFileChange("adharBack")}
                  onBlur={formik.handleBlur}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Leave empty to keep existing file
                </div>
                {formik.touched.adharBack && formik.errors.adharBack && (
                  <ErrorMsg error={formik.errors.adharBack} />
                )}
              </div>
            )}

            {!isEditing && docData?.aadhar_back_data_url && (
              <div className="col-span-2 max-md:col-span-3">
                {!funder && (
                  <DownloadDoc
                    fileUrl={docData.aadhar_back_data_url}
                    fileType="image/jpeg"
                    fileName={`Aadhar_Back ${leadInfo?.lead_id}`}
                    btnName="View & Download"
                    label="Aadhar Back"
                    disabled={funder}
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

export default KycInfo;

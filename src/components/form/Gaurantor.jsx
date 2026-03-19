import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ErrorMsg from "../utils/ErrorMsg";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";
import { relationOptions } from "../content/Data";
import {
  UpdateUserApp,
  ResubmitApp,
  UpdateIncompleteUserApp,
  getInCompleteLeadDetails,
} from "../../api/ApiFunction";
import Accordion from "../utils/Accordion";
import Modal from "../utils/Modal";
import { useAuth } from "../../context/AuthContext";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { maskData } from "../utils/maskData";

const Guarantor = ({ btnEnable = false, incomplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [acceptReturn, setAcceptReturn] = useState(false);
  const [checkModal, setCheckModal] = useState("");

  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  const gaurantor = leadInfo?.gurantorNomineeInfo;
  const leadStatus = leadInfo.lead_status;

  const { adminUser } = useAuth();
  const funder = adminUser.role === "Funder" ? true : false;

  // Find guarantors and nominee from data
  const guarantor1 = gaurantor?.find((item) => item.type === "Guarantor") || {};
  const guarantor2 =
    gaurantor?.filter((item) => item.type === "Guarantor")[1] || {};
  const nominee = gaurantor?.find((item) => item.type === "Nominee") || {};

  const formik = useFormik({
    initialValues: {
      guarantorName1: guarantor1.name || "",
      relation1: guarantor1.relation || "",
      mobile_number1: funder
        ? maskData(guarantor1.mobile_number, "mobile")
        : guarantor1.mobile_number || "",

      guarantorName2: guarantor2.name || "",
      relation2: guarantor2.relation || "",
      mobile_number2: funder
        ? maskData(guarantor2.mobile_number, "mobile")
        : guarantor2.mobile_number || "",

      nomineeName: nominee.name || "",
      nomineeRelation: nominee.relation || "",
      nomineeMobile: funder
        ? maskData(nominee.mobile_number, "mobile")
        : nominee.mobile_number || "",
    },
    validationSchema: Yup.object({
      guarantorName1: Yup.string()
        .required("Required")
        .min(3, "Invalid name")
        .max(60, "Invalid name"),
      relation1: Yup.string().required("Required"),
      mobile_number1: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Invalid mobile number.")
        .required("Required"),

      guarantorName2: Yup.string()
        .required("Required")
        .min(3, "Invalid name")
        .max(60, "Invalid name"),
      relation2: Yup.string().required("Required"),
      mobile_number2: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Invalid mobile number.")
        .required("Required"),

      nomineeName: Yup.string()
        .required("Required")
        .min(3, "Invalid name")
        .max(60, "Invalid name"),
      nomineeRelation: Yup.string().required("Required"),
      nomineeMobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Invalid mobile number.")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
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
          guarantorInfo: [
            {
              id: leadInfo?.gurantorNomineeInfo[0]?.id,
              type: "Guarantor",
              name:
                values?.guarantorName1 ||
                gaurantor?.gurantorNomineeInfo[0].name,
              mobile_number:
                values?.mobile_number1 ||
                gaurantor?.gurantorNomineeInfo[0].mobile_number,
              relation:
                values?.relation1 || gaurantor?.gurantorNomineeInfo[0].relation,
              gurantor_nominee_verified: leadStatus === 2 ? true : false,
              updated_by: adminUser.emp_code,
            },
            {
              id: leadInfo?.gurantorNomineeInfo[1]?.id,
              type: "Guarantor",
              name:
                values?.guarantorName2 ||
                gaurantor?.gurantorNomineeInfo[1].name,
              mobile_number:
                values?.mobile_number2 ||
                gaurantor?.gurantorNomineeInfo[1].mobile_number,
              relation:
                values?.relation2 || gaurantor?.gurantorNomineeInfo[1].relation,
              gurantor_nominee_verified: leadStatus === 2 ? true : false,
              updated_by: adminUser.emp_code,
            },
            {
              id: leadInfo?.gurantorNomineeInfo[2]?.id,
              type: "Nominee",
              name:
                values?.nomineeName ||
                gaurantor?.gurantorNomineeInfo[2].nominee_name,
              mobile_number:
                values?.nomineeMobile ||
                gaurantor?.gurantorNomineeInfo[2].nominee_mobile_number,
              relation:
                values?.nomineeRelation ||
                gaurantor?.gurantorNomineeInfo[2].relation,
              gurantor_nominee_verified: leadStatus >= 2 ? true : false,
              updated_by: adminUser.emp_code,
            },
          ],
        };

        // const response = await UpdateUserApp(userRequest);
        let response;
        if (incomplete) {
          response = await UpdateIncompleteUserApp(userRequest);
        } else {
          response = await UpdateUserApp(userRequest);
        }

        if (response.status === true) {
          setLeadInfo((prev) => ({
            ...prev,
            ...response,
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
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Error adding personal info:", error);
      } finally {
        setSubmitting(false);
        setOpenApprove(false);
      }
    },
  });

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
            is_kyc_fill: true,
            is_bank_fill: true,
            is_gurantor_nominee_fill: false,
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
          console.error("Error adding personal info:", error);
        } finally {
          setOpenApprove(false);
          setIsEditing(false);
          setAcceptReturn(false);
        }
      };

      resubmitApplication();
    }
  }, [acceptReturn]);

  return (
    <Accordion
      title="Guarantor Details"
      tooltipMsg={
        isEditing
          ? "Cancel"
          : leadStatus === 1
          ? "Edit Guarantor Info"
          : "Update & Verify"
      }
      verified={leadInfo?.gurantor_nominee_verified}
      reset={leadInfo?.gurantor_nominee_fill}
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
        btnEnable && !(incomplete && leadInfo?.gurantor_nominee_fill)
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
          <span className="bg-slate-500 text-white text-xs px-4">
            Guarantor 1
          </span>
          <div className="border-t border-gray-500 p-3 mb-1">
            <div className="grid grid-cols-2 md:grid-cols-3 md:gap-4 gap-1">
              <div className="col-span-1">
                <TextInput
                  label="Full Name"
                  icon="RiUser6Line"
                  placeholder="Guarantor Name"
                  name="guarantorName1"
                  type="text"
                  id="guarantorName1"
                  disabled={!isEditing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.guarantorName1}
                />
                <div className="mb-1">
                  {formik.touched.guarantorName1 &&
                  formik.errors.guarantorName1 ? (
                    <ErrorMsg error={formik.errors.guarantorName1} />
                  ) : null}
                </div>
              </div>

              <div className="col-span-1">
                <SelectInput
                  label="Relation"
                  icon="PiUsersLight"
                  name="relation1"
                  id="relation1"
                  disabled={!isEditing}
                  placeholder="Select Relation"
                  options={relationOptions}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.relation1}
                />
                <div className="mb-1">
                  {formik.touched.relation1 && formik.errors.relation1 ? (
                    <ErrorMsg error={formik.errors.relation1} />
                  ) : null}
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <TextInput
                  label="Mobile No."
                  icon="RiUser6Line"
                  placeholder="Mobile No."
                  name="mobile_number1"
                  type="text"
                  id="mobile_number1"
                  maxLength={10}  
                  disabled={!isEditing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile_number1}
                />
                <div className="mb-1">
                  {formik.touched.mobile_number1 &&
                  formik.errors.mobile_number1 ? (
                    <ErrorMsg error={formik.errors.mobile_number1} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <span className="bg-slate-500 text-white text-xs px-4 mt-5">
            Guarantor 2
          </span>
          <div className="border-t border-gray-500 p-3 mb-1">
            <div className="grid grid-cols-2 md:grid-cols-3 md:gap-4 gap-1">
              <div className="col-span-1">
                <TextInput
                  label="Full Name"
                  icon="RiUser6Line"
                  placeholder="Guarantor Name"
                  name="guarantorName2"
                  type="text"
                  id="guarantorName2"
                  disabled={!isEditing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.guarantorName2}
                />
                <div className="mb-1">
                  {formik.touched.guarantorName2 &&
                  formik.errors.guarantorName2 ? (
                    <ErrorMsg error={formik.errors.guarantorName2} />
                  ) : null}
                </div>
              </div>

              <div className="col-span-1">
                <SelectInput
                  label="Relation"
                  icon="PiUsersLight"
                  name="relation2"
                  id="relation2"
                  disabled={!isEditing}
                  placeholder="Select Relation"
                  options={relationOptions}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.relation2}
                />
                <div className="mb-1">
                  {formik.touched.relation2 && formik.errors.relation2 ? (
                    <ErrorMsg error={formik.errors.relation2} />
                  ) : null}
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <TextInput
                  label="Mobile No."
                  icon="RiUser6Line"
                  placeholder="Mobile No."
                  name="mobile_number2"
                  type="text"
                  id="mobile_number2"
                  maxLength={10}  
                  disabled={!isEditing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile_number2}
                />
                <div className="mb-1">
                  {formik.touched.mobile_number2 &&
                  formik.errors.mobile_number2 ? (
                    <ErrorMsg error={formik.errors.mobile_number2} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <span className="bg-slate-500 text-white text-xs px-6">Nominee </span>
          <div className="border-t border-gray-500 p-3">
            <div className="grid grid-cols-2 md:grid-cols-3 md:gap-4 gap-1">
              <div className="col-span-1">
                <TextInput
                  label="Full Name"
                  icon="RiUser6Line"
                  placeholder="Nominee Name"
                  name="nomineeName"
                  type="text"
                  id="nomineeName"
                  disabled={!isEditing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nomineeName}
                />
                <div className="mb-1">
                  {formik.touched.nomineeName && formik.errors.nomineeName ? (
                    <ErrorMsg error={formik.errors.nomineeName} />
                  ) : null}
                </div>
              </div>

              <div className="col-span-1">
                <SelectInput
                  label="Relation"
                  icon="PiUsersLight"
                  name="nomineeRelation"
                  id="nomineeRelation"
                  disabled={!isEditing}
                  placeholder="Select Relation"
                  options={relationOptions}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nomineeRelation}
                />
                <div className="mb-1">
                  {formik.touched.nomineeRelation &&
                  formik.errors.nomineeRelation ? (
                    <ErrorMsg error={formik.errors.nomineeRelation} />
                  ) : null}
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <TextInput
                  label="Mobile No."
                  icon="RiUser6Line"
                  placeholder="Mobile No."
                  name="nomineeMobile"
                  type="text"
                  id="nomineeMobile"
                  maxLength={10}  
                  disabled={!isEditing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nomineeMobile}
                />
                <div className="mb-1">
                  {formik.touched.nomineeMobile &&
                  formik.errors.nomineeMobile ? (
                    <ErrorMsg error={formik.errors.nomineeMobile} />
                  ) : null}
                </div>
              </div>
            </div>
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

export default Guarantor;

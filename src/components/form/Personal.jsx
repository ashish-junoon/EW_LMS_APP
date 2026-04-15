import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import ErrorMsg from "../utils/ErrorMsg";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Accordion from "../utils/Accordion";
import {
  genderOptions,
  maritalStatusOptions,
} from "../../components/content/Data";
import {
  UpdateUserApp,
  ResubmitApp,
  UpdateIncompleteUserApp,
  getInCompleteLeadDetails,
} from "../../api/ApiFunction";
import { toast } from "react-toastify";
import Modal from "../utils/Modal";
import Button from "../utils/Button";
import { useAuth } from "../../context/AuthContext";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import Loader from "../utils/Loader";
import { maskData } from "../utils/maskData";
import DateInput from "../fields/DateInput";

const PersonalInfo = ({ btnEnable = false, incomplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [acceptReturn, setAcceptReturn] = useState(false);
  const [checkModal, setCheckModal] = useState("Update");
  const [isLoading, setIsLoading] = useState(false);
  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  const leadStatus = leadInfo?.lead_status;

  const { adminUser } = useAuth();
  const personaData = leadInfo?.personalInfo[0];
  const funder = adminUser.role === "Funder" ? true : false;

  //Block Dae for 18 Year
  const getMaxDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split("T")[0];
};

const getMinDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 60);
    return today.toISOString().split("T")[0];
  };


  const formik = useFormik({
    initialValues: {
      fullName: personaData?.full_name || "",
      userGender: personaData?.gender || "",
      maritalStatus: personaData?.marital_status || "",
      dob: personaData?.dob || "",
      email: funder
        ? maskData(personaData?.email_id, "email") || ""
        : personaData?.email_id || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      userGender: Yup.string().required("Required"),
      maritalStatus: Yup.string().required("Required"),
      dob: Yup.string()
        .required("Required")
        .test("age", "Age must be between 18 and 55 years", function (value) {
          if (!value) return false;
          // const birthDate = moment(value, "YYYY-MM-DD");
          const birthDate = moment(value, "DD-MM-YYYY");
          if (!birthDate.isValid()) return false;
          const today = moment();
          const ageInYears = today.diff(birthDate, "years");
          return ageInYears >= 18 && ageInYears <= 55;
        }),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setIsLoading(true);
        const userRequest = {
          user_id: leadInfo?.user_id,
          lead_id: leadInfo?.lead_id,
          company_id: import.meta.env.VITE_COMPANY_ID,
          product_name: import.meta.env.VITE_PRODUCT_NAME,
          personalInfo: [
            {
              id: personaData?.id,
              full_name: values?.fullName?.trim(),
              gender: values?.userGender,
              marital_status: values?.maritalStatus,
              birth_date: values?.dob,
              email: values?.email?.trim(),
              personal_info_verified: leadStatus === 2 ? true : false,
              updated_by: adminUser.emp_code,
            },
          ],
          employmentInfo: [],
          addressInfo: [],
          kycInfo: [],
          bankInfo: [],
          guarantorInfo: [],
        };

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
          setIsLoading(false);
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

  // alert(JSON.stringify(leadInfo?.personalInfo));

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

  // const handleResubmit = () => {
  //     setOpenApprove(true);
  //     setCheckModal('Resubmit');
  // };

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
            is_personal_fill: false,
            is_employment_fill: true,
            is_address_fill: true,
            is_kyc_fill: true,
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Accordion
      title="Personal Details"
      tooltipMsg={
        isEditing
          ? "Cancel"
          : leadStatus === 1
          ? "Edit Personal Info"
          : "Update & Verify"
      }
      verified={leadInfo?.personal_info_verified}
      reset={leadInfo?.personal_info_fill}
      open
      // actionButtons={
      //     (btnEnable)
      //         ? [
      //             {
      //                 icon: isEditing ? "IoClose" : leadStatus === 1 ? "RiEdit2Fill" : "MdOutlineCheckCircle",
      //                 onClick: handleEdit,
      //                 className: isEditing
      //                     ? "border border-danger text-danger hover:bg-danger hover:border-danger hover:text-white"
      //                     : "border border-primary text-primary hover:bg-success hover:border-success hover:text-white",
      //             },
      //         ]
      //         : null
      // }

      actionButtons={
        btnEnable && !(incomplete && leadInfo?.personal_info_fill)
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
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-3">
              <TextInput
                label="Full Name"
                icon="IoPersonOutline"
                placeholder="Enter Your Full Name"
                name="fullName"
                type="text"
                id="fullName"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <ErrorMsg error={formik.errors.fullName} />
              )}
            </div>
            <div className="col-span-3">
              <TextInput
                label="Email"
                icon="IoMailOutline"
                placeholder="Enter Your Email"
                name="email"
                type="email"
                id="email"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <ErrorMsg error={formik.errors.email} />
              )}
            </div>
            <div className="col-span-2 max-md:col-span-3">
              <SelectInput
                label="Gender"
                icon="IoMaleFemaleOutline"
                name="userGender"
                id="userGender"
                disabled={!isEditing}
                options={genderOptions}
                placeholder="Select Gender"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userGender}
              />
              {formik.touched.userGender && formik.errors.userGender && (
                <ErrorMsg error={formik.errors.userGender} />
              )}
            </div>
            <div className="col-span-2 max-md:col-span-3">
              <SelectInput
                label="Marital Status"
                icon="GiDiamondRing"
                name="maritalStatus"
                id="maritalStatus"
                disabled={!isEditing}
                options={maritalStatusOptions}
                placeholder="Select Marital Status"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.maritalStatus}
              />
              {formik.touched.maritalStatus && formik.errors.maritalStatus && (
                <ErrorMsg error={formik.errors.maritalStatus} />
              )}
            </div>
            <div className="col-span-2 max-md:col-span-3">
              {/* <TextInput
                label="Date of Birth"
                icon="IoCalendarOutline"
                placeholder="DD-MM-YYYY"
                name="dob"
                type="text"
                id="dob"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dob}
                /> */}
              <DateInput
                label="Date of Birth"
                icon="IoCalendarOutline"
                placeholder="DD-MM-YYYY"
                name="dob"
                id="dob"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dob}
                min={getMinDate()}
                max={getMaxDate()}
              />
              {formik.touched.dob && formik.errors.dob && (
                <ErrorMsg error={formik.errors.dob} />
              )}
            </div>
          </div>

          {isEditing && (
            <div className="col-span-6">
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
              </div>
            </div>
          )}
        </form>

        <Modal isOpen={openApprove} onClose={() => setOpenApprove(false)}>
          <div className="text-center font-semibold">
            <h1>
              {checkModal === "Update"
                ? "Are you sure you want to update?"
                : "Are you sure you want to allow user to resubmit?"}
            </h1>
          </div>
          <div className="flex justify-end gap-4 mt-2">
            <Button
              btnName="Yes"
              btnIcon="IoCheckmarkCircleSharp"
              type="button"
              onClick={
                checkModal === "Update" ? handleUpdateYes : handleResubmitYes
              }
              disabled={formik.isSubmitting}
              style="min-w-[80px] md:w-auto mt-4 py-1 px-4 border border-primary text-primary hover:border-success hover:bg-success hover:text-white hover:font-semibold"
            />
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

export default PersonalInfo;

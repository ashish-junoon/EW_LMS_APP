import React, { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ErrorMsg from "../utils/ErrorMsg";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import Button from "../utils/Button";
import { houseTypeOptions } from "../content/Data";
import {
  UpdateUserApp,
  ResubmitApp,
  getStateCity,
  UpdateIncompleteUserApp,
  getInCompleteLeadDetails,
} from "../../api/ApiFunction";
import Accordion from "../utils/Accordion";
import Modal from "../utils/Modal";
import { useAuth } from "../../context/AuthContext";
import { useOpenLeadContext } from "../../context/OpenLeadContext";

const Address = ({ btnEnable = false, incomplete }) => {
  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  const addressInfo = leadInfo?.addressInfo[0];

  const [isEditing, setIsEditing] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [acceptReturn, setAcceptReturn] = useState(false);
  const [checkModal, setCheckModal] = useState("");
  const [selectedState, setSelectedState] = useState(addressInfo?.state || "");
  const [selectedCity, setSelectedCity] = useState(addressInfo?.district || "");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateCode, setStateCode] = useState(addressInfo?.state_code_iso || "");
  const [cityCode, setCityCode] = useState(addressInfo?.district_code || "");

  const { adminUser } = useAuth();
  const leadStatus = leadInfo.lead_status;

  const formik = useFormik({
    initialValues: {
      houseType: addressInfo?.house_type || "",
      address: addressInfo?.address || "",
      district: addressInfo?.district || "",
      districtCode: addressInfo?.district_code || "",
      state: addressInfo?.state || "",
      stateCode: addressInfo?.state_code_iso || "",
      zipCode: addressInfo?.zip_code || "",
    },
    validationSchema: Yup.object({
      houseType: Yup.string().required("Required"),
      address: Yup.string()
        .required("Required")
        .min(3, "Must be 3 characters or more")
        .max(60, "Must be 60 characters or less"),
      district: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      zipCode: Yup.string()
        .required("Required")
        .matches(/^[0-9]{6}$/, "Invalid zip code."),
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
          addressInfo: [
            {
              id: addressInfo?.id,
              house_type: values?.houseType,
              address: values?.address,
              district: values?.district,
              district_code: values?.districtCode,
              state: values?.state,
              state_code_iso: values?.stateCode,
              zip_code: values?.zipCode,
              address_info_verified: leadInfo?.lead_status === 2 ? true : false,
              updated_by: adminUser.emp_code,
            },
          ],
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
          toast.success(response.message);
          setSelectedState(values.state);
          setLeadInfo((prev) => ({
            ...prev,
            ...response,
          }));
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
        console.error("Error updating address info:", error);
      } finally {
        setSubmitting(false);
        setOpenApprove(false);
      }
    },
  });

  // Fetch all states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await getStateCity({ stateCode: "" });
        if (response.status && response.states) {
          setStates(response.states);

          // If we have a state, find and set its code
          if (addressInfo?.state) {
            const stateObj = response.states.find(
              (state) =>
                state.name.toLowerCase() === addressInfo.state.toLowerCase()
            );
            if (stateObj) {
              setStateCode(stateObj.code);
              formik.setFieldValue("stateCode", stateObj.code);
            }
          }
        } else {
          toast.error("Failed to load states.");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Error fetching states.");
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when selectedState changes
  useEffect(() => {
    const fetchCities = async () => {
      if (stateCode) {
        try {
          const response = await getStateCity({ stateCode });
          if (response.status && response.cities) {
            setCities(response.cities);

            // If we have a district, find and set its code
            if (addressInfo?.district) {
              const cityObj = response.cities.find(
                (city) =>
                  city.name.toLowerCase() === addressInfo.district.toLowerCase()
              );
              if (cityObj) {
                setCityCode(cityObj.code);
                formik.setFieldValue("districtCode", cityObj.code);
              }
            }
          } else {
            setCities([]);
            toast.error("Failed to load cities.");
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
          toast.error("Error fetching cities.");
        }
      }
    };
    fetchCities();
  }, [stateCode]);

  const handleStateChange = useCallback(
    (e) => {
      const selectedStateObj = states.find(
        (state) => state.code === e.target.value
      );
      if (selectedStateObj) {
        formik.setFieldValue("state", selectedStateObj.name);
        formik.setFieldValue("stateCode", selectedStateObj.code);
        setSelectedState(selectedStateObj.name);
        setStateCode(selectedStateObj.code);

        // Reset district when state changes
        formik.setFieldValue("district", "");
        formik.setFieldValue("districtCode", "");
        setSelectedCity("");
        setCityCode("");
      }
    },
    [states, formik]
  );

  const handleCityChange = useCallback(
    (e) => {
      const selectedCityObj = cities.find(
        (city) => city.code === e.target.value
      );
      if (selectedCityObj) {
        formik.setFieldValue("district", selectedCityObj.name);
        formik.setFieldValue("districtCode", selectedCityObj.code);
        setSelectedCity(selectedCityObj.name);
        setCityCode(selectedCityObj.code);
      }
    },
    [cities, formik]
  );

  // Rest of the component remains the same as in the previous implementation
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
            is_address_fill: false,
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

  return (
    <Accordion
      title="Address"
      tooltipMsg={
        isEditing
          ? "Cancel"
          : leadInfo?.lead_status === 1
          ? "Edit Address"
          : "Update & Verify"
      }
      verified={leadInfo?.address_info_verified}
      reset={leadInfo?.address_info_fill}
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
        btnEnable && !(incomplete && leadInfo?.address_info_fill)
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
                label="House Type"
                icon="IoHomeOutline"
                name="houseType"
                placeholder="Select House Type"
                options={houseTypeOptions}
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.houseType}
              />
              {formik.touched.houseType && formik.errors.houseType && (
                <ErrorMsg error={formik.errors.houseType} />
              )}
            </div>
            <div className="col-span-3">
              <TextInput
                label="Address"
                icon="RiHome7Line"
                placeholder="Enter Complete Address"
                name="address"
                disabled={!isEditing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              {formik.touched.address && formik.errors.address && (
                <ErrorMsg error={formik.errors.address} />
              )}
            </div>

            <div className="col-span-2 max-md:col-span-3">
              <SelectInput
                label="State"
                icon="MdLocationCity"
                name="stateCode"
                placeholder="Select State"
                disabled={!isEditing}
                options={states.map((state) => ({
                  value: state.code,
                  label: state.name,
                }))}
                onChange={handleStateChange}
                onBlur={formik.handleBlur}
                value={stateCode}
              />
              {formik.touched.state && formik.errors.state && (
                <ErrorMsg error={formik.errors.state} />
              )}
            </div>
            <div className="col-span-2 max-md:col-span-3">
              <SelectInput
                label="City"
                icon="IoLocationOutline"
                name="districtCode"
                placeholder="Select City"
                disabled={!isEditing || !stateCode}
                options={cities.map((city) => ({
                  value: city.code,
                  label: city.name,
                }))}
                onChange={handleCityChange}
                onBlur={formik.handleBlur}
                value={cityCode}
              />
              {formik.touched.district && formik.errors.district && (
                <ErrorMsg error={formik.errors.district} />
              )}
            </div>

            <div className="col-span-2 max-md:col-span-3">
              <TextInput
                label="Pin Code"
                icon="GiPin"
                placeholder="Enter Zip Code"
                name="zipCode"
                disabled={!isEditing}
                maxLength={7}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.zipCode}
              />
              {formik.touched.zipCode && formik.errors.zipCode && (
                <ErrorMsg error={formik.errors.zipCode} />
              )}
            </div>
          </div>
          {isEditing && (
            <div className="col-span-2">
              <div className="flex justify-center gap-5">
                <Button
                  btnName={
                    leadInfo?.lead_status === 1
                      ? "Save Changes"
                      : "Save & Mark Verified"
                  }
                  btnIcon={
                    leadInfo?.lead_status === 1
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

export default Address;

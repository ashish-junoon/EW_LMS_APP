import { useLocation, useNavigate } from "react-router-dom";
import { GetEmployeeDetail } from "../../api/ApiFunction";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Loader from "../../components/utils/Loader";
import SelectInput from "../../components/fields/SelectInput";
import TextInput from "../../components/fields/TextInput";
import { useGetData } from "../../context/GetDataContext";
import { UpsertUser } from "../../api/ApiFunction";
import ErrorMsg from "../../components/utils/ErrorMsg";
import LoginPageFinder from "../../components/utils/LoginPageFinder";

function UpdateUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const { emp_code } = location.state;
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const { departments, designations } = useGetData();
  const [empData, setEmpData] = useState({});
  const [formInitialized, setFormInitialized] = useState(false);

  const pageAccess = LoginPageFinder("page_display_name", "manage users");
  const permission = pageAccess?.[0].read_write_permission;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const payload = {
        emp_code: emp_code,
      };
      try {
        const response = await GetEmployeeDetail(payload);
        if (response.status) {
          setEmpData(response.employeeDetails[0]);
          // toast.success(response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [emp_code]);

  // Initialize formik after data is loaded
  useEffect(() => {
    if (empData && Object.keys(empData).length > 0) {
      formik.setValues({
        firstName: empData.firstname || "",
        lastName: empData.lastname || "",
        gender: empData.gender || "",
        maritalStatus: empData.marital_status || "",
        mobileNumber: empData.primary_mobile || "",
        email: empData.personal_email || "",
        adharNumber: empData.aadhar_number || "",
        panNumber: empData.pan_number || "",
        department: empData.dept_id || "",
        designation: empData.desi_id || "",
        role: empData.role || "",
        userAction: empData.is_active ? "True" : "False",
        reportView: empData.is_report_status ? "True" : "False",
      });
      setFormInitialized(true);
    }
  }, [empData]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      gender: "",
      maritalStatus: "",
      mobileNumber: "",
      email: "",
      adharNumber: "",
      panNumber: "",
      department: "",
      designation: "",
      role: "",
      reportView: "",
      userAction: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First name is required")
        .max(50, "First name must be 50 characters or less"),
      lastName: Yup.string()
        .required("Last name is required")
        .max(50, "Last name must be 50 characters or less"),
      gender: Yup.string().required("Gender is required"),
      maritalStatus: Yup.string().required("Marital status is required"),
      mobileNumber: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      adharNumber: Yup.string()
        .matches(/^[0-9]{12}$/, "Aadhar number must be 12 digits")
        .nullable(),
      panNumber: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
        .nullable(),
      department: Yup.string().required("Department is required"),
      designation: Yup.string().required("Designation is required"),
      role: Yup.string().required("Role is required"),
      reportView: Yup.string().required("Report view is required"),
      userAction: Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const payload = {
        emp_code: empData.emp_code,
        firstname: values.firstName,
        lastname: values.lastName,
        gender: values.gender,
        marital_status: values.maritalStatus,
        primary_mobile: values.mobileNumber,
        personal_email: values.email,
        aadhar_number: values.adharNumber,
        pan_number: values.panNumber,
        dept_id: values.department,
        desi_id: values.designation,
        role: values.role,
        is_report_status: values.reportView === "True" ? true : false,
        is_active: values.userAction === "True" ? true : false,
        // company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME,
      };

      try {
        const response = await UpsertUser(payload);
        if (response.status) {
          toast.success(response.message);
          setIsLoading(false);
          navigate("/admin/manage-users");
        } else {
          setIsLoading(false);
          toast.error(response.message);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error:", error);
      }
    },
  });

  const renderError = (field) => {
    const isTouched = touchedFields[field] || formik.touched[field];
    return isTouched && formik.errors[field] ? (
      <ErrorMsg error={formik.errors[field]} />
    ) : null;
  };

  if (isLoading || !formInitialized) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-full lg:w-7/12 mx-auto shadow-md rounded">
        <div className="bg-primary text-white rounded-t-lg px-8 py-1.5">
          <h2 className="text-base font-bold">Update User</h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="px-2 md:px-8 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TextInput
                label="First Name"
                icon="RiUserLine"
                placeholder="Enter First Name"
                name="firstName"
                maxLength={50}
                type="text"
                disabled={!isEditing}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {renderError("firstName")}
            </div>

            <div>
              <TextInput
                label="Last Name"
                icon="RiUserLine"
                placeholder="Enter Last Name"
                name="lastName"
                maxLength={50}
                type="text"
                disabled={!isEditing}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {renderError("lastName")}
            </div>

            <div>
              <SelectInput
                label="Gender"
                icon="IoMaleFemale"
                name="gender"
                placeholder="Select"
                disabled={!isEditing}
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
              {renderError("gender")}
            </div>

            <div>
              <SelectInput
                label="Marital Status"
                icon="PiUsersBold"
                name="maritalStatus"
                placeholder="Select"
                disabled={!isEditing}
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={[
                  { value: "married", label: "Married" },
                  { value: "unmarried", label: "UnMarried" },
                ]}
              />
              {renderError("maritalStatus")}
            </div>

            <div>
              <TextInput
                label="Email"
                icon="RiMailLine"
                placeholder="Enter Email"
                name="email"
                type="email"
                disabled={!isEditing}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {renderError("email")}
            </div>

            <div>
              <TextInput
                label="Mobile Number"
                icon="RiPhoneLine"
                placeholder="Enter Mobile Number"
                name="mobileNumber"
                maxLength={10}
                type="text"
                disabled={!isEditing}
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {renderError("mobileNumber")}
            </div>

            <div>
              <TextInput
                label="Aadhar Number"
                icon="RiIdCardLine"
                placeholder="Enter Aadhar Number"
                name="adharNumber"
                maxLength={12}
                type="text"
                disabled={!isEditing}
                value={formik.values.adharNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {renderError("adharNumber")}
            </div>

            <div>
              <TextInput
                label="PAN Number"
                icon="RiIdCardLine"
                placeholder="Enter PAN Number"
                name="panNumber"
                maxLength={10}
                type="text"
                disabled={!isEditing}
                value={formik.values.panNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {renderError("panNumber")}
            </div>

            <div>
              <SelectInput
                label="Department"
                icon="RiBuildingLine"
                name="department"
                placeholder="Select"
                disabled={!isEditing}
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={departments.map(({ dept_id, department_name }) => ({
                  value: dept_id,
                  label: department_name,
                }))}
              />
              {renderError("department")}
            </div>

            <div>
              <SelectInput
                label="Designation"
                icon="RiBriefcaseLine"
                name="designation"
                placeholder="Select"
                disabled={!isEditing}
                value={formik.values.designation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={designations.map(({ desi_id, designation_name }) => ({
                  value: desi_id,
                  label: designation_name,
                }))}
              />
              {renderError("designation")}
            </div>

            <div>
              <SelectInput
                label="Role"
                icon="RiUserSettingsLine"
                name="role"
                placeholder="Select"
                disabled={!isEditing}
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "Others", label: "Others" },
                  { value: "Funder", label: "Funder" },
                ]}
              />
              {renderError("role")}
            </div>
            <div>
              <SelectInput
                label="User Active & Inactive"
                icon="RiUserSettingsLine"
                name="userAction"
                placeholder="Select"
                disabled={!isEditing}
                value={formik.values.userAction}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={[
                  { value: "True", label: "Active" },
                  { value: "False", label: "Inactive" },
                ]}
              />
              {renderError("userAction")}
            </div>
            <div>
              <SelectInput
                label="Report View"
                icon="RiEyeLine"
                name="reportView"
                placeholder="Select"
                disabled={!isEditing}
                value={formik.values.reportView}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={[
                  { value: "False", label: "Masked" },
                  { value: "True", label: "Unmasked" }, //Updated switched value
                ]}
                // options={[
                //     { value: "True", label: "Masked" },
                //     { value: "False", label: "Unmasked" },
                // ]}
              />
              {renderError("reportView")}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            {permission && (
              <>
                {isEditing && (
                  <button
                    type="submit"
                    className="bg-primary hover:bg-blue-700 text-white font-bold py-1.5 px-8 rounded focus:outline-none focus:shadow-outline"
                  >
                    Update
                  </button>
                )}

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-primary hover:bg-primary/50 text-white font-bold py-1.5 px-8 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit User
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-1.5 px-8 rounded focus:outline-none focus:shadow-outline ml-2"
              onClick={() => navigate("/admin/manage-users")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default UpdateUser;

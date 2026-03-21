import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectInput from "../../components/fields/SelectInput";
import ErrorMsg from "../../components/utils/ErrorMsg";
import TextInput from "../../components/fields/TextInput";
import { UpsertUser } from "../../api/ApiFunction";
import { useGetData } from "../../context/GetDataContext";
import { toast } from "react-toastify";
import Loader from "../../components/utils/Loader";

function AddUser() {

    const [touchedFields, setTouchedFields] = useState({});
    const { departments, designations } = useGetData();
    const [isLoading, setIsLoading] = useState(false);
    const nevigate = useNavigate();

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
        },
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
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            const payload = {
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
                is_active: true
            }

            try {
                const response = await UpsertUser(payload);
                if (response.status) {
                    toast.success(response.message);
                    setIsLoading(false);
                    nevigate("/admin/manage-users");
                } else {
                    setIsLoading(false);
                    toast.error(response.message);
                }
            } catch (error) {
                setIsLoading(false);
                console.error("Error:", error);
            }

        }
    });

    const renderError = (field) => {
        const isTouched = touchedFields[field] || formik.touched[field];
        return isTouched && formik.errors[field] ? (
            <ErrorMsg error={formik.errors[field]} />
        ) : null;
    };


    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <div className="w-7/12 mx-auto shadow-md rounded">
                <div className="bg-primary text-white rounded-t-lg px-8 py-1.5">
                    <h2 className="text-base font-bold">Onboard User</h2>
                </div>
                <form onSubmit={formik.handleSubmit} className="px-8 py-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <TextInput
                                label="First Name"
                                icon="RiUserLine"
                                placeholder="Enter First Name"
                                name="firstName"
                                maxLength={50}
                                type="text"
                                {...formik.getFieldProps("firstName")}
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
                                {...formik.getFieldProps("lastName")}
                            />
                            {renderError("lastName")}
                        </div>

                        <div>
                            <SelectInput
                                label="Gender"
                                icon="IoMaleFemale"
                                name="gender"
                                placeholder="Select"
                                options={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                ]}
                                {...formik.getFieldProps("gender")}
                            />
                            {renderError("gender")}
                        </div>

                        <div>
                            <SelectInput
                                label="Marital Status"
                                icon="PiUsersBold"
                                name="maritalStatus"
                                placeholder="Select"
                                options={[
                                    { value: "married", label: "Married" },
                                    { value: "unmarried", label: "Unmarried" },
                                ]}
                                {...formik.getFieldProps("maritalStatus")}
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
                                {...formik.getFieldProps("email")}
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
                                {...formik.getFieldProps("mobileNumber")}
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
                                {...formik.getFieldProps("adharNumber")}
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
                                {...formik.getFieldProps("panNumber")}
                            />
                            {renderError("panNumber")}
                        </div>

                        <div>
                            <SelectInput
                                label="Department"
                                icon="RiBuildingLine"
                                name="department"
                                placeholder="Select"
                                options={departments.map(({ dept_id, department_name }) => ({
                                    value: dept_id,
                                    label: department_name,
                                }))}
                                {...formik.getFieldProps("department")}
                            />
                            {renderError("department")}
                        </div>

                        <div>
                            <SelectInput
                                label="Designation"
                                icon="RiBriefcaseLine"
                                name="designation"
                                placeholder="Select"
                                options={designations.map(({ desi_id, designation_name }) => ({
                                    value: desi_id,
                                    label: designation_name,
                                }))}
                                {...formik.getFieldProps("designation")}
                            />
                            {renderError("designation")}
                        </div>

                        <div>
                            <SelectInput
                                label="Role"
                                icon="RiUserSettingsLine"
                                name="role"
                                placeholder="Select"
                                options={[
                                    { value: "Admin", label: "Admin" },
                                    { value: "Funder", label: "Funder" },
                                    { value: "Others", label: "Others" },
                                ]}
                                {...formik.getFieldProps("role")}
                            />
                            {renderError("role")}
                        </div>

                        <div>
                            <SelectInput
                                label="Report View"
                                icon="RiEyeLine"
                                name="reportView"
                                placeholder="Select"
                                options={[
                                    { value: false, label: "Masked" },
                                    { value: true, label: "Unmasked" }, //Updated switched value
                                ]}
                                {...formik.getFieldProps("reportView")}
                            />
                            {renderError("reportView")}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/50 text-white font-bold py-1.5 px-8 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>

                        <button
                            type="button"
                            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-1.5 px-8 rounded focus:outline-none focus:shadow-outline ml-2"
                            onClick={() => nevigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddUser;
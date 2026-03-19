import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../components/utils/Card";
import ErrorMsg from "../../components/utils/ErrorMsg";
import SelectInput from "../../components/fields/SelectInput";
import { userStatus } from "../../components/content/Data";
import TextInput from "../../components/fields/TextInput";
import { GetBranchList, getStateCity, UpdateBranchDetails } from "../../api/ApiFunction";
import Button from "../../components/utils/Button";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from "react-helmet";
import LoginPageFinder from "../../components/utils/LoginPageFinder";

function UpdateBranch() {
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [cities, setCities] = useState([]);
    const [branchData, setBranchData] = useState(null);
    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();

    const { adminUser } = useAuth();

    const pageAccess = LoginPageFinder('page_display_name', 'manage branch');
    const permission = pageAccess?.[0].read_write_permission;

    useEffect(() => {
        const allGroups = adminUser?.loginGroupNames || [];

        // Flatten all login pages across groups
        const allLoginPages = allGroups.flatMap(group => group.loginpageNames || []);

        const hasAccessToPageId3 = allLoginPages.some(page => page.page_id === 15);

        if (!hasAccessToPageId3) {
            navigate("/");
        }
    }, [adminUser]);

    // Fetch Branch Details
    useEffect(() => {
        const fetchBranch = async () => {
            if (!id) return;

            try {
                const response = await GetBranchList({ id, branch_name: "" });
                if (response.getBranches?.length) {
                    setBranchData(response.getBranches[0]);
                }
            } catch (error) {
                console.error("Error fetching branch details:", error);
            }
        };
        fetchBranch();
    }, [id]);

    // Fetch States on component mount
    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await getStateCity({ stateCode: "" });
                setStates(response.states || []);
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };
        fetchState();
    }, []);

    // Fetch Cities when state is selected
    useEffect(() => {
        const fetchCity = async () => {
            if (!selectedState) return;

            try {
                const response = await getStateCity({ stateCode: selectedState });
                setCities(response.cities || []);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };
        fetchCity();
    }, [selectedState]);

    // Initialize Formik
    const formik = useFormik({
        initialValues: {
            state: "",
            district: "",
            branchName: "",
            branchId: "",
            address: "",
            contact: "",
            status: "",
            email: "",
        },
        validationSchema: Yup.object({
            state: Yup.string().required("Required"),
            district: Yup.string().required("Required"),
            status: Yup.string().required("Required"),
            branchName: Yup.string()
                .required("Required")
                .min(2, "Must be 3 characters or more")
                .max(50, "Must be 50 characters or less"),
            address: Yup.string()
                .required("Required")
                .min(2, "Must be 3 characters or more")
                .max(50, "Must be 50 characters or less"),
            email: Yup.string().email("Invalid email format").required("Email is required"),
            contact: Yup.string()
                .matches(/^[6-9]\d{9}$/, 'Invalid mobile number.')
                .required('Required'),

        }),
        onSubmit: async (values) => {
            try {
                const request = {
                    id: id,
                    branch_id: values.branchId,
                    branch_name: values.branchName,
                    branch_address: values.address,
                    contact_number: values.contact,
                    email_id: values.email,
                    state: values.state,
                    District: values.district,
                    is_active: values.status == 1 ? true : false,
                    updated_by: adminUser.emp_code,
                };
                const response = await UpdateBranchDetails(request);
                if (response.status) {
                    toast.success(response.message);
                    navigate("/admin/manage-branch");
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("Error updating branch details:", error);
            }
        },
    });

    // Update Formik values when `branchData` is available
    useEffect(() => {
        if (branchData) {
            formik.setValues({
                state: branchData.state || "",
                district: branchData.District || "",
                branchName: branchData.branch_name || "",
                branchId: branchData.branch_id || "",
                address: branchData.branch_address || "",
                contact: branchData.contact_number || "",
                email: branchData.email_id || "",
                status: branchData.is_active
            });

            // Set selected state for fetching cities
            const stateCode = states.find(state => state.name === branchData.state)?.code;
            setSelectedState(stateCode || "");
        }
    }, [branchData, states]); // Added states as dependency

    const renderError = (field) =>
        formik.touched[field] && formik.errors[field] ? (
            <ErrorMsg error={formik.errors[field]} />
        ) : null;

    return (
        <>
            <Helmet>
                <title>Update Branch</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="container m-auto">
                <div className="flex justify-center items-center mt-10">
                    <div className="w-full lg:w-6/12">
                        <Card heading="Branch Details" style={"px-2 md:px-8 py-6"}>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <SelectInput
                                            label="State"
                                            icon="MdOutlineMapsHomeWork"
                                            name="state"
                                            disabled={!permission}
                                            placeholder="Select"
                                            options={states.map((state) => ({
                                                value: state.name,
                                                label: state.name,
                                            }))}
                                            onChange={(e) => {
                                                const stateName = e.target.value;
                                                const stateCode = states.find(
                                                    (state) => state.name === stateName
                                                )?.code;
                                                setSelectedState(stateCode || "");
                                                formik.setFieldValue("state", stateName);
                                                formik.setFieldValue("district", "");
                                            }}
                                            value={formik.values.state}
                                        />
                                        {renderError("state")}
                                    </div>
                                    <div>
                                        <SelectInput
                                            label="City"
                                            icon="RiMapPinUserLine"
                                            name="district"
                                            placeholder="Select"
                                            disabled={!permission}
                                            options={cities.map((city) => ({
                                                value: city.name,
                                                label: city.name,
                                            }))}
                                            value={formik.values.district}
                                            onChange={(e) => {
                                                formik.setFieldValue("district", e.target.value);
                                            }}
                                        />
                                        {renderError("district")}
                                    </div>
                                    <div className="col-span-1">
                                        <TextInput
                                            label="Branch Name"
                                            icon="PiBankDuotone"
                                            disabled={!permission}
                                            placeholder="Enter Name"
                                            maxLength={40}
                                            name="branchName"
                                            type="text"
                                            {...formik.getFieldProps("branchName")}
                                        />
                                        {renderError("branchName")}
                                    </div>
                                    <div className="col-span-1">
                                        <SelectInput
                                            label="Status"
                                            icon="IoCheckmarkCircleOutline"
                                            name="status"
                                            placeholder="Select"
                                            disabled={!permission}
                                            options={userStatus}
                                            value={formik.values.status}
                                            onChange={(e) => {
                                                formik.setFieldValue("status", e.target.value);
                                            }}
                                        />
                                        {renderError("status")}
                                    </div>
                                    <div className="col-span-2">
                                        <TextInput
                                            label="Branch Address"
                                            icon="RiMapPinLine"
                                            disabled={!permission}
                                            placeholder="Enter Address"
                                            maxLength={70}
                                            name="address"
                                            type="text"
                                            {...formik.getFieldProps("address")}
                                        />
                                        {renderError("address")}
                                    </div>
                                    <div>
                                        <TextInput
                                            label="Contact Number"
                                            icon="IoPhonePortraitOutline"
                                            placeholder="Enter Contact"
                                            disabled={!permission}
                                            name="contact"
                                            maxLength={10}
                                            type="text"
                                            {...formik.getFieldProps("contact")}
                                        />
                                        {renderError("contact")}
                                    </div>
                                    <div>
                                        <TextInput
                                            label="Email Id"
                                            icon="MdOutlineMail"
                                            placeholder="Enter Email"
                                            disabled={!permission}
                                            name="email"
                                            maxLength={50}
                                            type="text"
                                            {...formik.getFieldProps("email")}
                                        />
                                        {renderError("email")}
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    {permission && (
                                        <Button
                                            btnName="Update Branch"
                                            btnIcon="IoCheckmarkCircleSharp"
                                            type="submit"
                                            style="mt-10 bg-primary text-white min-w-44"
                                        />
                                    )}

                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UpdateBranch;
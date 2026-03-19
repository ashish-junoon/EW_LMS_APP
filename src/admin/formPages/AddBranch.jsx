import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../components/utils/Card";
import ErrorMsg from "../../components/utils/ErrorMsg";
import SelectInput from "../../components/fields/SelectInput";
import TextInput from "../../components/fields/TextInput";
import { AddBranchName, getStateCity } from "../../api/ApiFunction";
import Button from "../../components/utils/Button";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from "react-helmet";


function AddBranch() {

    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [cities, setCities] = useState([]);

    const navigate = useNavigate();
    const { adminUser } = useAuth();

    useEffect(() => {
        const allGroups = adminUser?.loginGroupNames || [];

        // Flatten all login pages across groups
        const allLoginPages = allGroups.flatMap(group => group.loginpageNames || []);

        const hasAccessToPageId3 = allLoginPages.some(page => page.page_id === 15);

        if (!hasAccessToPageId3) {
            navigate("/");
        }
    }, [adminUser]);


    // Fetch States on component mount
    useEffect(() => {
        const fetchState = async () => {
            const req = {
                stateCode: ""
            };

            try {
                const response = await getStateCity(req);
                setStates(response.states);
            } catch (error) {
                console.error('Error fetching States:', error);
            }
        };
        fetchState();
    }, []);

    // Fetch Cities when state is selected
    useEffect(() => {
        const fetchCity = async () => {
            if (!selectedState) return; // Don't fetch if no state is selected

            const req = {
                stateCode: selectedState
            };

            try {
                const response = await getStateCity(req);
                setCities(response.cities);
            } catch (error) {
                console.error('Error fetching Cities:', error);
            }
        };
        fetchCity();
    }, [selectedState]); // Add selectedState as dependency

    const formik = useFormik({
        initialValues: {
            state: "",
            district: "",
            branchName: "",
            address: "",
            contact: "",
            email: "",
        },
        validationSchema: Yup.object({
            state: Yup.string().required("Required"),
            district: Yup.string().required("Required"),
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
                    state: values.state,
                    District: values.district,
                    branch_name: values.branchName,
                    branch_address: values.address,
                    contact_number: values.contact,
                    email_id: values.email,
                    created_by: adminUser.emp_code
                }
                const response = await AddBranchName(request);
                if (response.status) {
                    toast.success(response.message);
                    navigate("/admin/manage-branch")
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
                console.error('Error updating employment info:', error);
            }
        },
    });

    const renderError = (field) =>
        formik.touched[field] && formik.errors[field] ? (
            <ErrorMsg error={formik.errors[field]} />
        ) : null;

    return (
        <>
            <Helmet>
                <title>Add Branch</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="container m-auto">
                <div className="flex justify-center items-center mt-10">
                    <div className="w-full lg:w-6/12">
                        <Card heading="Add Branch" style={"px-2 md:px-8 py-6"}>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="">
                                        <SelectInput
                                            label="State"
                                            icon="MdOutlineMapsHomeWork"
                                            name="state"
                                            placeholder="Select"
                                            options={states.map((state) => ({
                                                value: state.name,
                                                label: state.name,
                                                code: state.code  // keeping code as additional property to use in onChange
                                            }))}
                                            onChange={(e) => {
                                                const stateName = e.target.value;
                                                const selectedState = states.find(state => state.name === stateName)?.code;
                                                setSelectedState(selectedState); // Set code for API call
                                                formik.setFieldValue('state', stateName); // Set name in form
                                                formik.setFieldValue('district', ''); // Reset district when state changes
                                                setCities([]); // Reset cities when state changes
                                            }}
                                            value={formik.values.state}
                                        />
                                        {renderError("state")}
                                    </div>
                                    <div className="">
                                        <SelectInput
                                            label="City"
                                            icon="RiMapPinUserLine"
                                            name="district"
                                            placeholder="Select"
                                            options={cities.map((city) => ({
                                                value: city.name,
                                                label: city.name
                                            }))}
                                            {...formik.getFieldProps('district')}
                                        />
                                        {renderError("district")}
                                    </div>
                                    <div className="col-span-2">
                                        <TextInput
                                            label="Branch Name"
                                            icon="PiBankDuotone"
                                            placeholder="Enter Name"
                                            name="branchName"
                                            maxLength={50}
                                            type="text"
                                            {...formik.getFieldProps("branchName")}
                                        />
                                        {renderError("branchName")}
                                    </div>
                                    <div className="col-span-2">
                                        <TextInput
                                            label="Branch Address"
                                            icon="RiMapPinLine"
                                            placeholder="Enter Address"
                                            name="address"
                                            maxLength={60}
                                            type="text"
                                            {...formik.getFieldProps("address")}
                                        />
                                        {renderError("address")}
                                    </div>
                                    <div className="">
                                        <TextInput
                                            label="Contact Number"
                                            icon="IoPhonePortraitOutline"
                                            placeholder="Enter Contact"
                                            name="contact"
                                            maxLength={10}
                                            type="text"
                                            {...formik.getFieldProps("contact")}
                                        />
                                        {renderError("contact")}
                                    </div>
                                    <div className="">
                                        <TextInput
                                            label="Email Id"
                                            icon="MdOutlineMail"
                                            placeholder="Enter Email"
                                            maxLength={60}
                                            name="email"
                                            type="email"
                                            {...formik.getFieldProps("email")}
                                        />
                                        {renderError("email")}
                                    </div>
                                </div>


                                <div className="flex justify-center">
                                    <Button
                                        btnName="Add Branch"
                                        btnIcon="IoAddCircleSharp"
                                        type="submit"
                                        style="mt-10 bg-primary text-white min-w-44"
                                    />
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddBranch
import { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Card from "../../components/utils/Card";
import ErrorMsg from "../../components/utils/ErrorMsg";
import TextInput from "../../components/fields/TextInput";
import Button from "../../components/utils/Button";
import { AddPageGroupName } from "../../api/ApiFunction";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from "react-helmet";





function AddGroup() {

    const navigate = useNavigate();
    const { adminUser } = useAuth();

    useEffect(() => {
        const allGroups = adminUser?.loginGroupNames || [];

        // Flatten all login pages across groups
        const allLoginPages = allGroups.flatMap(group => group.loginpageNames || []);

        const hasAccessToPageId3 = allLoginPages.some(page => page.page_id === 16);

        if (!hasAccessToPageId3) {
            navigate("/");
        }
    }, [adminUser]);

    const formik = useFormik({
        initialValues: {
            displayName: "",
            displayIndex: "",
            groupIcon: "",
            description: "",
        },
        validationSchema: Yup.object({
            displayName: Yup.string()
                .required("Required")
                .min(2, 'Must be 3 characters or more')
                .max(20, 'Must be 20 characters or less'),
            displayIndex: Yup.string()
                .required("Required")
                .min(1, 'Must be 1 characters or more')
                .max(2, 'Must be 2 characters or less'),
            groupIcon: Yup.string().required("Required"),
            description: Yup.string()
                .required("Required")
                .min(2, 'Must be 3 characters or more')
                .max(60, 'Must be 60 characters or less'),
        }),
        onSubmit: async (values) => {
            try {
                const request = {
                    group_display_name: values.displayName,
                    group_icon: values.groupIcon,
                    group_display_index: values.displayIndex,
                    group_small_discription: values.description,
                    created_by: adminUser.emp_code
                }
                const response = await AddPageGroupName(request);
                if (response.status) {
                    toast.success(response.message);
                    navigate("/administrator/manage-page")
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
                console.error('Error updating employment info:', error);
            }
        }

    });

    const renderError = (field) =>
        formik.touched[field] && formik.errors[field] ? (
            <ErrorMsg error={formik.errors[field]} />
        ) : null;

    return (
        <>
            <Helmet>
                <title>Add Page Group</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="container m-auto">
                <div className="container m-auto mt-10">
                    <div className="flex justify-center items-center">
                        <div className="w-full lg:w-6/12">
                            <Card heading="Add Page Group" style={"px-2 md:px-8 py-6"}>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="flex justify-center items-center">
                                        <div className="grid grid-cols-2 gap-3">

                                            <div className="col-span-2">
                                                <TextInput
                                                    label="Group Name"
                                                    icon="MdOutlineGroupWork"
                                                    placeholder="Icon Name"
                                                    name="displayName"
                                                    type="text"
                                                    {...formik.getFieldProps("displayName")}
                                                />
                                                {renderError("displayName")}
                                            </div>
                                            <div>
                                                <TextInput
                                                    label="Display Index"
                                                    icon="RiBarChartHorizontalFill"
                                                    placeholder="Enter Designation"
                                                    name="displayIndex"
                                                    type="text"
                                                    required
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.displayIndex}
                                                />
                                                {formik.touched.displayIndex && formik.errors.displayIndex && (
                                                    <ErrorMsg error={formik.errors.displayIndex} />
                                                )}
                                            </div>
                                            <div>
                                                <TextInput
                                                    label="Group Icon"
                                                    icon="MdOutlineViewSidebar"
                                                    placeholder="Enter Designation"
                                                    name="groupIcon"
                                                    type="text"
                                                    required
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.groupIcon}
                                                />
                                                {formik.touched.groupIcon && formik.errors.groupIcon && (
                                                    <ErrorMsg error={formik.errors.groupIcon} />
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <TextInput
                                                    label="Group Description"
                                                    icon="MdOutlineInsertComment"
                                                    placeholder="Enter Designation"
                                                    name="description"
                                                    type="text"
                                                    required
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.description}
                                                />
                                                {formik.touched.description && formik.errors.description && (
                                                    <ErrorMsg error={formik.errors.description} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-5 max-md:col-span-2">
                                        <Button
                                            btnName="Add Group"
                                            btnIcon="IoAddCircleSharp"
                                            type="submit"
                                            style="my-3 bg-primary text-white min-w-44 max-md:w-full"
                                        />
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddGroup;

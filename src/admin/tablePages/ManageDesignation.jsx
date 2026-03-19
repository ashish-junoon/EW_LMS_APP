import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AddDesignationName, GetDesignationName, UpdateDesignation } from '../../api/ApiFunction';
import Button from '../../components/utils/Button';
import Card from '../../components/utils/Card';
import TextInput from '../../components/fields/TextInput';
import SelectInput from '../../components/fields/SelectInput';
import ErrorMsg from '../../components/utils/ErrorMsg';
import { userStatus } from '../../components/content/Data';
import Icon from '../../components/utils/Icon';
import { Helmet } from 'react-helmet';
import LoginPageFinder from '../../components/utils/LoginPageFinder';

const ManageDesignation = () => {
    const [addDesignation, setAddDesignation] = useState(false);
    const [editDesignation, setEditDesignation] = useState(false);
    const [designation, setDesignation] = useState([]);
    const [updateDesignation, setUpdateDesignation] = useState({});
    const navigate = useNavigate();

    const pageAccess = LoginPageFinder('page_display_name', 'manage designation');
    const permission = pageAccess?.[0].read_write_permission;


    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const response = await GetDesignationName({ signal: controller.signal });
                if (response?.status) {
                    setDesignation(response);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching data:", error);
                    toast.error("An error occurred while fetching data.");
                }
            }
        };

        fetchData();

        return () => controller.abort(); // Cleanup on unmount
    }, []);


    // console.log('designation', designation)


    const formik = useFormik({
        initialValues: {
            designation: "",
            status: "",
        },
        validationSchema: Yup.object({
            designation: Yup.string()
                .required("Required")
                .min(2, "Must be 3 characters or more")
                .max(50, "Must be 50 characters or less"),
            status: Yup.string().required("Required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const userRequest = {
                    designation_name: values.designation, // Changed to direct access
                    is_active: values.status == 1 ? true : false
                };

                const response = await AddDesignationName(userRequest);

                if (response.status) {
                    toast.success(response.message);
                    setAddDesignation(false);
                    window.location.reload();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("Error updating employment info:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const updateDept = useFormik({
        enableReinitialize: true, // Allows Formik to update initialValues when props change
        initialValues: {
            designation_id: updateDesignation?.desi_id || "",
            designation_name: updateDesignation?.designation_name || "",
            is_active: updateDesignation?.is_active ? "1" : "0", // Convert boolean to string for SelectInput
            updated_by: "user", // Assuming this is the logged-in user
        },
        validationSchema: Yup.object({
            designation_name: Yup.string()
                .required("Required")
                .min(2, "Must be 3 characters or more")
                .max(50, "Must be 50 characters or less"),
            is_active: Yup.string().required("Required"),
        }),
        onSubmit: async (values) => {
            setEditDesignation(false);
            try {
                const userRequest = {
                    desi_id: values.designation_id, // Send ID for update
                    designation_name: values.designation_name,
                    is_active: values.is_active === "1" ? true : false, // Convert back to boolean
                    updated_by: values.updated_by
                };

                const response = await UpdateDesignation(userRequest); // Assuming API call function

                if (response.status) {
                    toast.success(response.message);
                    setEditDesignation(false); // Close modal
                    window.location.reload();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("Error updating designation:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const addDeptName = () => {
        setAddDesignation(true);
        setEditDesignation(false);
    }
    const closeDesignation = () => {
        setAddDesignation(false);
    }

    return (
        <>
            <Helmet>
                <title>Manage Designation</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="border border-gray-200 shadow px-5 py-2 mb-5 bg-blue-50 rounded">
                <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col justify-start">
                        <h1 className="text-lg font-bold text-black">Manage Designation</h1>
                        <p className="text-xs font-light text-secondary">Add Modify Designation</p>
                    </div>
                    <div className="flex justify-end py-2">

                        {permission && !addDesignation && (
                            <Button
                                btnName={"Add Designation"}
                                btnIcon={"MdOutlineAdd"}
                                style={"bg-primary text-white"}
                                onClick={addDeptName}
                            />
                        )}
                        {addDesignation && (
                            <Button
                                btnName={"Close"}
                                btnIcon={"IoCloseCircleOutline"}
                                style={"bg-danger text-white"}
                                onClick={closeDesignation}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className=''>
                {addDesignation && (
                    <div className='flex justify-center items-center mt-8'>
                        <div className='w-full lg:w-1/2'>
                            <Card heading="Add Designation" style={"px-2 md:px-8 py-6"}>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="flex justify-center items-center">
                                        <div className="grid grid-cols-2 md:gap-5 gap-2">
                                            <div>
                                                <TextInput
                                                    label="Designation Name"
                                                    icon="MdOutlineInsertComment"
                                                    placeholder="Enter Designation"
                                                    name="designation"
                                                    type="text"
                                                    required
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.designation}
                                                />
                                                {formik.touched.designation && formik.errors.designation && (
                                                    <ErrorMsg error={formik.errors.designation} />
                                                )}
                                            </div>

                                            <div>
                                                <SelectInput
                                                    label="Select Status"
                                                    icon="RiBillLine"
                                                    name="status"
                                                    placeholder="Select Status"
                                                    options={userStatus}
                                                    required
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.status}
                                                />
                                                {formik.touched.status && formik.errors.status && (
                                                    <ErrorMsg error={formik.errors.status} />
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <Button
                                            btnName="Add Designation"
                                            btnIcon="IoAddCircleSharp"
                                            type="submit"
                                            style="my-3 bg-primary text-white min-w-44 max-md:w-full"
                                        />
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                )}

                {editDesignation && !addDesignation && (
                    <div className='flex justify-center items-center mt-8'>
                        <div className='w-full lg:w-1/2'>
                            <Card heading="Update Designation" style={"px-2 md:px-8 py-6"}>
                                <form onSubmit={updateDept.handleSubmit}>
                                    <div className="flex justify-center items-center">
                                        <div className="grid grid-cols-2 gap-2 md:gap-5">
                                            {/* Designation Name */}
                                            <div>
                                                <TextInput
                                                    label="Designation Name"
                                                    icon="MdOutlineInsertComment"
                                                    placeholder="Enter Designation"
                                                    name="designation_name"
                                                    type="text"
                                                    required
                                                    onChange={updateDept.handleChange}
                                                    onBlur={updateDept.handleBlur}
                                                    value={updateDept.values.designation_name} // Updated binding
                                                />
                                                {updateDept.touched.designation_name && updateDept.errors.designation_name && (
                                                    <ErrorMsg error={updateDept.errors.designation_name} />
                                                )}
                                            </div>

                                            {/* Status Dropdown */}
                                            <div>
                                                <SelectInput
                                                    label="Select Status"
                                                    icon="RiBillLine"
                                                    name="is_active"
                                                    placeholder="Select Status"
                                                    options={[
                                                        { label: "Active", value: "1" },
                                                        { label: "Inactive", value: "0" },
                                                    ]}
                                                    required
                                                    onChange={updateDept.handleChange}
                                                    onBlur={updateDept.handleBlur}
                                                    value={updateDept.values.is_active} // Updated binding
                                                />
                                                {updateDept.touched.is_active && updateDept.errors.is_active && (
                                                    <ErrorMsg error={updateDept.errors.is_active} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-center">
                                        <Button
                                            btnName="Update"
                                            btnIcon="IoCheckmarkCircleOutline"
                                            type="submit"
                                            style="my-3 bg-primary text-white px-5 mt-5 max-md:w-full"
                                        />
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                )}


                <div className="mt-8">
                    <div className="container m-auto w-full lg:w-3/4 md:px-0 max-md:p-4 rounded">
                        {/* Display Loading Message */}
                        {designation === null ? (
                            <div className="flex justify-center items-center h-64">
                                <p>Loading...</p>
                            </div>
                        ) : designation.designations && designation.designations.length > 0 ? (
                            <div className="relative overflow-x-auto sm:rounded-lg mt-10 shadow">
                                <table className="w-full text-sm text-center text-slate-800">
                                    <thead className="text-xs text-white font-bold bg-primary">
                                        <tr>
                                            <th className="px-6 py-2">#</th>
                                            <th className="px-6 py-2">Designation</th>
                                            <th className="px-6 py-2">Status</th>
                                            <th className="px-6 py-2">Created Date</th>
                                            <th className="px-6 py-2">Action</th> {/* Added Action Column */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {designation.designations.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`border-b border-slate-200 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                    } ${item.is_active ? "bg-green-50" : "bg-red-50"}`}
                                            >

                                                <td className="px-6 py-2">{index + 1}</td>
                                                <td className="px-6 py-2">{item.designation_name}</td>
                                                <td className="px-6 py-2">
                                                    {item.is_active ? (
                                                        <span className="bg-green-100 px-4 text-green-500 text-xs font-semibold rounded py-0.5 shadow-md border border-green-500">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-100 px-4 text-red-500 text-xs font-semibold rounded py-0.5 shadow-md border border-red-500">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-2">{item.created_date}</td>
                                                <td className="px-6 py-2">
                                                    {permission ? (
                                                        <button
                                                            className="bg-white border border-primary p-1 rounded-full hover:bg-dark  transition shadow-md"
                                                            onClick={() => {
                                                                setUpdateDesignation(item);
                                                                setEditDesignation(true);
                                                                setAddDesignation(false);
                                                            }}
                                                        >
                                                            <Icon name="MdModeEditOutline" size={14} color='#003397' />
                                                        </button>
                                                    ) : (
                                                        <p className="bg-white border text-xs border-primary p-1 rounded-full transition shadow-md">
                                                            Read Only
                                                        </p>
                                                    )}

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <p>No data available</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
};

export default ManageDesignation;
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AddDepartmentName, getDepartmentName, UpdateDepartment } from '../../api/ApiFunction';
import Button from '../../components/utils/Button';
import Card from '../../components/utils/Card';
import TextInput from '../../components/fields/TextInput';
import SelectInput from '../../components/fields/SelectInput';
import ErrorMsg from '../../components/utils/ErrorMsg';
import { userStatus } from '../../components/content/Data';
import Icon from '../../components/utils/Icon';
import { Helmet } from 'react-helmet';
import LoginPageFinder from '../../components/utils/LoginPageFinder';

const ManageDepartment = () => {
    const [addDepartment, setAddDepartment] = useState(false);
    const [editDepartment, setEditDepartment] = useState(false);
    const [department, setDepartment] = useState([]);
    const [updateDepartment, setUpdateDepartment] = useState({});
    const navigate = useNavigate();

    const pageAccess = LoginPageFinder('page_display_name', 'manage department');
    const permission = pageAccess?.[0].read_write_permission;

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const response = await getDepartmentName({ signal: controller.signal });
                if (response?.status) {
                    setDepartment(response);
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


    // console.log('department', department)


    const formik = useFormik({
        initialValues: {
            department: "",
            status: "",
        },
        validationSchema: Yup.object({
            department: Yup.string()
                .required("Required")
                .min(2, "Must be 3 characters or more")
                .max(50, "Must be 50 characters or less"),
            status: Yup.string().required("Required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const userRequest = {
                    department_name: values.department, // Changed to direct access
                    is_active: values.status == 1 ? true : false
                };

                const response = await AddDepartmentName(userRequest);

                if (response.status) {
                    toast.success(response.message);
                    setAddDepartment(false);
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
            department_id: updateDepartment?.dept_id || "",
            department_name: updateDepartment?.department_name || "",
            is_active: updateDepartment?.is_active ? "1" : "0", // Convert boolean to string for SelectInput
            updated_by: "user", // Assuming this is the logged-in user
        },
        validationSchema: Yup.object({
            department_name: Yup.string()
                .required("Required")
                .min(2, "Must be 3 characters or more")
                .max(50, "Must be 50 characters or less"),
            is_active: Yup.string().required("Required"),
        }),
        onSubmit: async (values) => {
            setEditDepartment(false);
            try {
                const userRequest = {
                    department_id: values.department_id, // Send ID for update
                    department_name: values.department_name,
                    is_active: values.is_active === "1" ? true : false, // Convert back to boolean
                    updated_by: values.updated_by,
                };

                const response = await UpdateDepartment(userRequest); // Assuming API call function

                if (response.status) {
                    toast.success(response.message);
                    setEditDepartment(false); // Close modal
                    window.location.reload();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("Error updating department:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const addDeptName = () => {
        setAddDepartment(true);
        setEditDepartment(false);
    }
    const closeDepartment = () => {
        setAddDepartment(false);
    }

    return (
        <>
            <Helmet>
                <title>Manage Department</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            <div className="border border-gray-200 shadow px-5 py-2 bg-blue-50 rounded">
                <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col justify-start">
                        <h1 className="text-lg font-bold text-black">Manage Department</h1>
                        <p className="text-xs font-light text-secondary">Add Modify Department</p>
                    </div>
                    <div className="flex justify-end py-2">

                        {permission && !addDepartment && (
                            <Button
                                btnName={"Add Department"}
                                btnIcon={"MdOutlineAdd"}
                                style={"bg-primary text-white"}
                                onClick={addDeptName}
                            />
                        )}
                        {addDepartment && (
                            <Button
                                btnName={"Close"}
                                btnIcon={"IoCloseCircleOutline"}
                                style={"bg-danger text-white"}
                                onClick={closeDepartment}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className=''>
                {addDepartment && (
                    <div className='flex justify-center items-center mt-8'>
                        <div className='w-full lg:w-1/2'>
                            <Card heading="Add Department" style={"max-md:px-2 md:px-8 py-6"}>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="flex justify-center items-center">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <TextInput
                                                    label="Department Name"
                                                    icon="MdOutlineInsertComment"
                                                    placeholder="Enter Department"
                                                    name="department"
                                                    type="text"
                                                    required
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.department}
                                                />
                                                {formik.touched.department && formik.errors.department && (
                                                    <ErrorMsg error={formik.errors.department} />
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
                                            btnName="Add Department"
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

                {editDepartment && !addDepartment && (
                    <div className='flex justify-center items-center mt-8'>
                        <div className='w-full md:w-1/2'>
                            <Card heading="Update Department" style={"px-8 py-6"}>
                                <form onSubmit={updateDept.handleSubmit}>
                                    <div className="flex justify-center items-center">
                                        <div className="grid grid-cols-2 gap-5">
                                            {/* Department Name */}
                                            <div>
                                                <TextInput
                                                    label="Department Name"
                                                    icon="MdOutlineInsertComment"
                                                    placeholder="Enter Department"
                                                    name="department_name"
                                                    type="text"
                                                    required
                                                    onChange={updateDept.handleChange}
                                                    onBlur={updateDept.handleBlur}
                                                    value={updateDept.values.department_name} // Updated binding
                                                />
                                                {updateDept.touched.department_name && updateDept.errors.department_name && (
                                                    <ErrorMsg error={updateDept.errors.department_name} />
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


                <div className="">
                    <div className="container m-auto w-full lg:w-3/4 p-4 rounded">
                        {/* Display Loading Message */}
                        {department === null ? (
                            <div className="flex justify-center items-center h-64">
                                <p>Loading...</p>
                            </div>
                        ) : department.departments && department.departments.length > 0 ? (
                            <div className="relative overflow-x-auto sm:rounded-lg mt-10 shadow">
                                <table className="w-full text-sm text-center text-slate-800">
                                    <thead className="text-xs text-white font-bold bg-primary">
                                        <tr>
                                            <th className="px-6 py-2">Dept. Id</th>
                                            <th className="px-6 py-2">Department Name</th>
                                            <th className="px-6 py-2">Status</th>
                                            <th className="px-6 py-2">Created By</th>
                                            <th className="px-6 py-2">Created Date</th>
                                            <th className="px-6 py-2">Action</th> {/* Added Action Column */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {department.departments.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`border-b border-slate-200 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                    } ${item.is_active ? "bg-green-50" : "bg-red-50"}`}
                                            >

                                                <td className="px-6 py-2">{item.dept_id}</td>
                                                <td className="px-6 py-2">{item.department_name}</td>
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
                                                <td className="px-6 py-2">{item.created_by}</td>
                                                <td className="px-6 py-2">{item.created_date}</td>
                                                <td className="px-6 py-2">
                                                    {permission ? (
                                                        <button
                                                            className="bg-white border border-primary p-1 rounded-full hover:bg-dark  transition shadow-md"
                                                            onClick={() => {
                                                                setUpdateDepartment(item);
                                                                setEditDepartment(true);
                                                                setAddDepartment(false);
                                                            }}
                                                        >
                                                            <Icon name="MdModeEditOutline" size={14} color='#003397' />
                                                        </button>
                                                    ) : (
                                                        <p className="bg-white border text-xs border-primary p-1 rounded-full transition shadow-md">
                                                            Read Only
                                                        </p>
                                                    )
                                                    }

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

export default ManageDepartment;
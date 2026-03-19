import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FundUpsert, GetFunderDetails, FunderUpsert } from "../api/ApiFunction";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";
import ErrorMsg from "../components/utils/ErrorMsg";
import Modal from "../components/utils/Modal";
import SelectInput from "../components/fields/SelectInput";
import TextInput from "../components/fields/TextInput";
import Button from "../components/utils/Button";
import { parse, format } from 'date-fns';
import Icon from "../components/utils/Icon";
import Loader from "../components/utils/Loader";
import NumberFormatter from "../components/utils/NumberFormatter";
import Accordion from "../components/utils/Accordion";
import {
    osName,
    osVersion,
    browserName,
    browserVersion,
    engineName,
    engineVersion
} from 'react-device-detect';
import LoginPageFinder from "../components/utils/LoginPageFinder";

function ManageFunders() {
    const [loading, setLoading] = useState(false);
    const [funderDetails, setFunderDetails] = useState({});
    const [selectedRow, setSelectedRow] = useState(null);
    const location = useLocation();
    const funderId = location.state?.funderId;
    const funderData = funderDetails?.funderDetails?.[0];
    const fundData = funderDetails?.fundDetails || [];
    const [open, setOpen] = useState(false);
    const [isFund, setIsFund] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const { adminUser } = useAuth();
    const [ipAddress, setIPAddress] = useState("");
    const device = `Browser: ${browserName} ${browserVersion}, OS: ${osName} ${osVersion}, Engine: ${engineName} ${engineVersion}`;

    const [editing, setEditing] = useState(false);

    const pageAccess = LoginPageFinder('page_display_name', 'fund tracker');
    const permission = pageAccess?.[0].read_write_permission;
    const funder = adminUser.role === 'Funder' ? true : false

    useEffect(() => {
        fetch(import.meta.env.VITE_GET_IP_URL)
            .then(response => response.json())
            .then(data => setIPAddress(data.ip))
            .catch(error => console.log(error));
    }, []);

    const fetchFunderDetails = async (payload) => {
        if (!funderId) return;

        setLoading(true);
        try {
            const res = await GetFunderDetails(payload);

            if (res.status) {
                setFunderDetails(res);
            } else {
                setFunderDetails({});
                toast.error(res.message || "Failed to fetch funder details");
            }
        } catch (error) {
            console.error("Error fetching funder details:", error);
            toast.error("Something went wrong while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(today.getFullYear() - 2);

        const payload = {
            funder_id: funderId,
            from_date: "",
            to_date: "",
        };
        fetchFunderDetails(payload);
    }, [funderId]);

    const fundStatus = [
        {
            label: "Total Funds",
            value: funderDetails?.total_funds || 0,
            icon: "GiTakeMyMoney",
        },
        {
            label: "Funds Used",
            value: funderDetails?.funds_used || 0,
            icon: "PiMinusFill",
        },
        {
            label: "Funds Left",
            value: funderDetails?.funds_left || 0,
            icon: "PiPlusFill",
        },
    ];


    const filterFunds = useFormik({
        initialValues: {
            funder: funderId,      // renamed to match field
            fromDate: '',
            toDate: '',
        },
        validationSchema: Yup.object({
            funder: Yup.string().required('Funder ID is required'),
            fromDate: Yup.date().required('From date is required'),
            toDate: Yup.date().required('To date is required'),
        }),
        onSubmit: async (values) => {
            const payload = {
                funder_id: values.funder,
                from_date: values.fromDate,
                to_date: values.toDate,
            };

            try {
                const res = await fetchFunderDetails(payload);
                if (res.status) {
                    toast.success(res.message || 'Data fetched successfully');
                    setEditing(false);
                } else {
                    toast.error(res.message || 'Something went wrong');
                }
            } catch (error) {
                console.error("Error fetching funder details:", error);
            }
        },
    });


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            type: funderData?.funder_type || '',
            funder: funderData?.funder_name || '',
            person: funderData?.contact_person || '',
            contact: funderData?.phone_number || '',
            address: funderData?.address || '',
            pan: funderData?.pan_number || '',
            date: funderData?.onboarding_date
                ? format(parse(funderData.onboarding_date, 'dd-MMM-yyyy', new Date()), 'yyyy-MM-dd')
                : '',
            status: funderData?.status === true || funderData?.status === 1 ? 'Active' : 'Inactive', // ✅ fix here
        },
        validationSchema: Yup.object({
            type: Yup.string().required('Required'),
            funder: Yup.string()
                .required('Required')
                .min(5, 'Must be 5 characters or more')
                .max(35, 'Must be 35 characters or less'),
            person: Yup.string()
                .required('Required')
                .min(5, 'Must be 5 characters or more')
                .max(50, 'Must be 50 characters or less'),
            pan: Yup.string().required('Required')
                .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN number is not valid'),
            contact: Yup.string()
                .required('Required')
                .matches(/^[0-9]{10}$/, 'Phone number is not valid'),
            address: Yup.string()
                .required('Required')
                .min(5, 'Must be 5 characters or more')
                .max(100, 'Must be 100 characters or less'),
            date: Yup.date().required('Required'),
            status: Yup.string().oneOf(['Active', 'Inactive']).required('Required'),
        }),
        onSubmit: async (values) => {
            const payload = {
                funder_id: funderDetails?.funder_id,
                funder_type: values?.type,
                funder_name: values?.funder,
                contact_person: values?.person,
                phone_number: values?.contact,
                address: values?.address,
                Status: values?.status === 'Active' ? true : false,
                onboarding_date: values?.date,
                updated_by: adminUser.emp_code,
                ip_address: ipAddress,
                device_info: device,
                pan_number: values?.pan
            }
            try {
                const res = await FunderUpsert(payload);
                if (res.status) {
                    toast.success(res.message);
                    setEditing(false);
                    window.location.reload();
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                console.error("Error updating funder details:", error);
                toast.error("Something went wrong while updating data.");
            }
        },
    });

    // Add Funder
    const AddFund = useFormik({
        initialValues: {
            fundAmount: '',
            interestRate: '',
            interestType: '',
            fundReceivedOn: '',
            utilizationDate: '',
            interestStartOn: '',
            interestEndOn: '',
        },
        validationSchema: Yup.object({
            fundAmount: Yup.number()
                .typeError('Must be a number')
                .required('Required')
                .positive('Must be a positive number'),

            interestRate: Yup.number()
                .typeError('Must be a number')
                .required('Required'),

            interestType: Yup.string()
                .required('Required'),

            fundReceivedOn: Yup.date()
                .required('Required'),

            utilizationDate: Yup.date()
                .required('Required'),

            interestStartOn: Yup.date()
                .required('Required'),

            interestEndOn: Yup.date()
                .required('Required')
                .min(
                    Yup.ref('interestStartOn'),
                    'End date must be after start date'
                ),
        }),
        onSubmit: async (values) => {
            const req = {

                funder_id: funderId,
                amount: values.fundAmount,
                interest: parseFloat(values.interestRate),
                interest_type: values.interestType,
                ReceivedDate: values.fundReceivedOn,
                UtilizationDate: values.utilizationDate,
                InterestStartOn: values.interestStartOn,
                InterestEndOn: values.interestEndOn,
                fund_status: values.fundStatus === 'Active' ? true : false,
                updated_by: adminUser.emp_code
            }

            try {
                const response = await FundUpsert(req);
                if (response.status === true) {
                    toast.success(response.message);
                    formik.resetForm();
                    setOpen(false);
                    window.location.reload();
                } else {
                    toast.error(response.message);
                    formik.resetForm();
                    setOpen(false);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("Error updating employment info:", error);
                setOpen(false);
            }
        },
    });

    //Update Fund
    const UpdateFund = useFormik({
        enableReinitialize: true,
        initialValues: {
            fundAmount: selectedRow?.amount,
            interestRate: selectedRow?.interest,
            interestType: selectedRow?.interest_type === 'FIXED' ? 'Fixed' : 'Reducing',
            fundReceivedOn: selectedRow?.received_date
                ? format(parse(funderData.onboarding_date, 'dd-MMM-yyyy', new Date()), 'yyyy-MM-dd')
                : '',
            utilizationDate: selectedRow?.utilization_date
                ? format(parse(funderData.onboarding_date, 'dd-MMM-yyyy', new Date()), 'yyyy-MM-dd')
                : '',
            interestStartOn: selectedRow?.interest_start_on
                ? format(parse(funderData.onboarding_date, 'dd-MMM-yyyy', new Date()), 'yyyy-MM-dd')
                : '',
            interestEndOn: selectedRow?.interest_end_on
                ? format(parse(funderData.onboarding_date, 'dd-MMM-yyyy', new Date()), 'yyyy-MM-dd')
                : '',
            fundStatus: selectedRow?.status === true ? 'Active' : 'Inactive',
        },
        validationSchema: Yup.object({
            fundAmount: Yup.number()
                .typeError('Must be a number')
                .required('Required')
                .positive('Must be a positive number'),

            interestRate: Yup.number()
                .typeError('Must be a number')
                .required('Required'),

            interestType: Yup.string().required('Required'),

            fundReceivedOn: Yup.date().required('Required'),

            utilizationDate: Yup.date().required('Required'),

            interestStartOn: Yup.date().required('Required'),

            interestEndOn: Yup.date()
                .required('Required')
                .min(Yup.ref('interestStartOn'), 'End date must be after start date'),

            fundStatus: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const req = {
                funder_id: funderId,
                fund_id: selectedRow?.fund_id,
                amount: values.fundAmount,
                interest: parseFloat(values.interestRate),
                interest_type: values.interestType,
                ReceivedDate: values.fundReceivedOn,
                UtilizationDate: values.utilizationDate,
                InterestStartOn: values.interestStartOn,
                InterestEndOn: values.interestEndOn,
                fund_status: values.fundStatus === 'Active' ? true : false,
                updated_by: adminUser.emp_code,
                ip_address: ipAddress,
                device_info: device,
            };

            try {
                const response = await FundUpsert(req); // renamed function here
                if (response.status) {
                    toast.success(response.message);
                    resetForm();
                    setIsFund(false);
                    window.location.reload();
                } else {
                    toast.error(response.message);
                    resetForm();
                    setIsFund(false);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
                console.error("Error updating fund info:", error);
                setIsFund(false);
            }
        },
    });

    const handleViewClick = (item) => {
        setIsFund(true);
        setSelectedRow(item);
    };


    const type = [
        { value: 'Business', label: 'Business' },
        { value: 'Individual', label: 'Individual' }
    ];

    const status = [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
    ];



    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="border border-gray-300 rounded shadow px-5 py-4">
                <div className='flex justify-between mb-5'>
                    <div>
                        <h1 className="text-xl font-bold text-primary">Manage Funder</h1>
                        <p className="text-sm italic text-gray-600 font-semibold">
                            {`Funder ID: ${funderDetails?.funder_id}`}
                            <span className={`ml-2 px-2 py-1 rounded-full shadow ${funderData?.status === true || funderData?.status === 1
                                ? "text-green-600 bg-green-100"
                                : "text-red-600 bg-red-100"
                                }`}>
                                {funderData?.status === true || funderData?.status === 1 ? "Active" : "Inactive"}
                            </span>
                        </p>
                    </div>
                    {permission && !funder && (
                        <div>
                            <button
                                onClick={() => setEditing(!editing)}
                                className="p-2 bg-gray-100 rounded-full shadow hover:bg-primary hover:text-white"
                            >
                                <Icon name={editing ? "IoLockOpenSharp" : "IoLockClosedSharp"} size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Funder Details Information */}
                <Accordion
                    title={funderData?.funder_name + " - " + funderData?.funder_type + " : " + "Information"}
                    tooltipMsg={editing ? "Cancel" : "Update & Verify"}
                    verified={funderData?.status}
                    reset={funderData?.status}
                    open={true}
                >
                    <div className="px-8 my-5">
                        <form onSubmit={formik.handleSubmit} className="my-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <SelectInput
                                        label={"Funder Type"}
                                        placeholder="Select"
                                        icon={formik.values.type === "0" ? "PiBuildingOffice" : "IoPersonOutline"}
                                        name="type"
                                        id="type"
                                        options={type}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.type}
                                        disabled={!editing}
                                    />
                                    {formik.touched.type && formik.errors.type && (
                                        <ErrorMsg error={formik.errors.type} />
                                    )}
                                </div>

                                <div>
                                    <TextInput
                                        label={formik.values.type === "0" ? "Company Name" : "Person Name"}
                                        icon={formik.values.type === "0" ? "PiBuildingOffice" : "IoPersonOutline"}
                                        placeholder="Enter Funder Name"
                                        name="funder"
                                        id="funder"
                                        maxLength={36}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.funder}
                                        disabled={!editing}
                                    />
                                    {formik.touched.funder && formik.errors.funder && (
                                        <ErrorMsg error={formik.errors.funder} />
                                    )}
                                </div>

                                <div>
                                    <TextInput
                                        label="Contact Person"
                                        icon="IoPersonCircleOutline"
                                        placeholder="Enter Contact Person"
                                        name="person"
                                        id="person"
                                        maxLength={51}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.person}
                                        disabled={!editing}
                                    />
                                    {formik.touched.person && formik.errors.person && (
                                        <ErrorMsg error={formik.errors.person} />
                                    )}
                                </div>

                                <div>
                                    <TextInput
                                        label="Contact Number"
                                        icon="IoPhonePortraitOutline"
                                        placeholder="Enter Contact Number"
                                        name="contact"
                                        id="contact"
                                        maxLength={10}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.contact}
                                        disabled={!editing}
                                    />
                                    {formik.touched.contact && formik.errors.contact && (
                                        <ErrorMsg error={formik.errors.contact} />
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <TextInput
                                        label="Address"
                                        icon="RiMapPinRangeLine"
                                        placeholder="Enter Complete Address"
                                        name="address"
                                        id="address"
                                        maxLength={101}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.address}
                                        disabled={!editing}
                                    />
                                    {formik.touched.address && formik.errors.address && (
                                        <ErrorMsg error={formik.errors.address} />
                                    )}
                                </div>
                                <div>
                                    <TextInput
                                        label={"Onboarding Date"}
                                        icon={"IoCalendarOutline"}
                                        type={"date"}
                                        name="date"
                                        id="date"
                                        maxLength={36}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.date}
                                        disabled={!editing}
                                    />
                                    {formik.touched.date && formik.errors.date && (
                                        <ErrorMsg error={formik.errors.date} />
                                    )}
                                </div>

                                <div>
                                    <TextInput
                                        label="PAN Number"
                                        icon="IoPhonePortraitOutline"
                                        placeholder="Enter pan Number"
                                        name="pan"
                                        id="pan"
                                        maxLength={10}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.pan}
                                        disabled={!editing}
                                    />
                                    {formik.touched.pan && formik.errors.pan && (
                                        <ErrorMsg error={formik.errors.pan} />
                                    )}
                                </div>

                                <div>
                                    <SelectInput
                                        label={"Status"}
                                        placeholder="Select"
                                        icon={"PiSelectionInverse"}
                                        name="status"
                                        id="status"
                                        options={status}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.status} // ✅ fixed
                                        disabled={!editing}
                                    />
                                    {formik.touched.status && formik.errors.status && (
                                        <ErrorMsg error={formik.errors.status} />
                                    )}
                                </div>

                            </div>

                            <div className="flex justify-end gap-4 mt-4">
                                {editing && (
                                    <Button
                                        btnName="Save Changes"
                                        btnIcon="IoCheckmarkCircleSharp"
                                        type="submit"
                                        style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                                    />
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="border rounded p-4 border-border-gray-100 mx-8">
                        <div className="flex justify-between items-center">

                            <p className="text-sm italic font-semibold">Updated By: {funderData?.updated_by}</p>
                            <p className="text-sm italic font-semibold">IP Address: {funderData?.ip_address}</p>
                        </div>
                        <p className="text-sm italic font-semibold text-center text-gray-700 mt-2">Device Info: {funderData?.device_info}</p>
                    </div>
                </Accordion>

                {/* Fund Details Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl my-10">
                    {fundStatus.map((item, index) => (
                        <div className="w-full" key={index}>
                            <div className="border rounded shadow p-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 hover:shadow-lg h-full">
                                <div className="flex flex-col sm:flex-row items-center sm:justify-center">
                                    <div className="flex justify-center border border-primary text-primary p-4 rounded shadow-lg mb-4 sm:mb-0 sm:mr-4">
                                        <Icon name={item.icon} size={40} />
                                    </div>
                                    <div className="text-center sm:text-left text-lg font-semibold text-primary italic">
                                        <div className="font-bold text-2xl text-black">
                                            ₹{<NumberFormatter number={item?.value || 0} />}
                                        </div>
                                        <div>{item.label}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Funds by Date */}
                {filterOpen && (
                    <>
                        <span className=" font-semibold bg-primary text-white px-4 py-1 rounded-t">Filter Funds</span>
                        <div className="border rounded shadow p-4 mb-8">
                            <form onSubmit={filterFunds.handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-5 px-10">
                                    <div>
                                        <TextInput
                                            label="Funder Id"
                                            icon="MdOutlinePercent"
                                            placeholder="Enter Funder ID"
                                            name="funder"
                                            id="funder"
                                            onChange={filterFunds.handleChange}
                                            onBlur={filterFunds.handleBlur}
                                            disabled={true}
                                            value={filterFunds.values.funder}
                                        />
                                        {filterFunds.touched.funder && filterFunds.errors.funder && (
                                            <ErrorMsg error={filterFunds.errors.funder} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="From Date"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="fromDate"
                                            id="fromDate"
                                            onChange={filterFunds.handleChange}
                                            onBlur={filterFunds.handleBlur}
                                            value={filterFunds.values.fromDate}
                                        />
                                        {filterFunds.touched.fromDate && filterFunds.errors.fromDate && (
                                            <ErrorMsg error={filterFunds.errors.fromDate} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="To Date"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="toDate"
                                            id="toDate"
                                            onChange={filterFunds.handleChange}
                                            onBlur={filterFunds.handleBlur}
                                            value={filterFunds.values.toDate}
                                        />
                                        {filterFunds.touched.toDate && filterFunds.errors.toDate && (
                                            <ErrorMsg error={filterFunds.errors.toDate} />
                                        )}
                                    </div>

                                    <div className="flex justify-center items-center">
                                        <Button
                                            btnName="Filter Funds"
                                            btnIcon="IoCheckmarkCircleSharp"
                                            type="submit"
                                            style="w-full text-sm italic font-semibold mt-6 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )}




                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-primary">Given Fund Details</h3>
                    </div>
                    <div className="flex gap-4">
                        {permission && !funder && (
                            <Button
                                btnName="Add Fund"
                                btnIcon="IoAddCircleSharp"
                                type="button"
                                onClick={() => setOpen(true)}
                                style={"min-w-[80px] text-sm italic font-semibold md:w-auto py-1 border-primary px-4 text-primary bg-white border hover:border-primary text-primary hover:bg-white hover:text-primary hover:font-bold"}
                            />
                        )}

                        <Button
                            btnName={filterOpen ? "Close Filter" : "Filter Funds"}
                            btnIcon="MdOutlineFilterAlt"
                            type="button"
                            onClick={() => setFilterOpen(!filterOpen)}
                            style={`min-w-[80px] text-sm italic font-semibold md:w-auto py-1 px-4 ${filterOpen ? "bg-red-600 hover:bg-red-700 text-white" : "border-primary text-primary bg-white border hover:border-primary text-primary hover:bg-white hover:text-primary hover:font-bold"}`}
                        />
                    </div>
                </div>

                {/* Given Fund Details Table */}
                <div className="overflow-x-auto mt-8">
                    {fundData.length > 0 ? (
                        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm">#</th>
                                    <th className="px-4 py-2 text-left text-sm">Fund ID</th>
                                    <th className="px-4 py-2 text-left text-sm">Amount</th>
                                    <th className="px-4 py-2 text-left text-sm">Interest Type</th>
                                    <th className="px-4 py-2 text-left text-sm">Received Date</th>
                                    <th className="px-4 py-2 text-left text-sm">Utilization Date</th>
                                    <th className="px-4 py-2 text-left text-sm">Interest Start On</th>
                                    <th className="px-4 py-2 text-left text-sm">Status</th>
                                    <th className="px-4 py-2 text-left text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fundData.map((item, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{item.fund_id}</td>
                                        <td className="px-4 py-2">{item.amount}</td>
                                        <td className="px-4 py-2">{item.interest_type}</td>
                                        <td className="px-4 py-2">{item.received_date}</td>
                                        <td className="px-4 py-2">{item.utilization_date}</td>
                                        <td className="px-4 py-2">{item.interest_start_on}</td>
                                        <td className="px-4 py-2">{item.status === true ? "Active" : "Inactive"}</td>
                                        <td className="px-4 py-2"><button className="text-primary" onClick={() => handleViewClick(item)}>View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-4">No Fund Found</div>
                    )}

                </div>

                {/* Modal for Fund */}
                <Modal isOpen={open} onClose={() => setOpen(false)}>
                    <div className="p-2">
                        <div className='flex justify-between'>
                            <div>
                                <h1 className="text-xl font-bold text-primary">Add Fund</h1>
                                <p className="text-sm italic text-gray-600 font-semibold">Fund Information</p>
                            </div>

                        </div>

                        <div className="px-8 my-5">
                            <form onSubmit={AddFund.handleSubmit} className="my-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <TextInput
                                            label="Fund Amount"
                                            icon="MdOutlineCurrencyRupee"
                                            placeholder="Enter Fund Amount"
                                            name="fundAmount"
                                            id="fundAmount"
                                            maxLength={11}
                                            onChange={AddFund.handleChange}
                                            onBlur={AddFund.handleBlur}
                                            value={AddFund.values.fundAmount}
                                        />
                                        {AddFund.touched.fundAmount && AddFund.errors.fundAmount && (
                                            <ErrorMsg error={AddFund.errors.fundAmount} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Interest Rate (%)"
                                            icon="MdOutlinePercent"
                                            placeholder="Enter Interest Rate"
                                            name="interestRate"
                                            id="interestRate"
                                            maxLength={3}
                                            onChange={AddFund.handleChange}
                                            onBlur={AddFund.handleBlur}
                                            value={AddFund.values.interestRate}
                                        />
                                        {AddFund.touched.interestRate && AddFund.errors.interestRate && (
                                            <ErrorMsg error={AddFund.errors.interestRate} />
                                        )}
                                    </div>

                                    <div>
                                        <SelectInput
                                            label="Interest Type"
                                            placeholder="Select"
                                            icon="RiMoneyRupeeCircleFill"
                                            name="interestType"
                                            id="interestType"
                                            options={[
                                                { value: 'Fixed', label: 'Fixed' },
                                                { value: 'Reducing', label: 'Reducing' },
                                            ]}
                                            onChange={AddFund.handleChange}
                                            onBlur={AddFund.handleBlur}
                                            value={AddFund.values.interestType}
                                        />
                                        {AddFund.touched.interestType && AddFund.errors.interestType && (
                                            <ErrorMsg error={AddFund.errors.interestType} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Fund Received On"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="fundReceivedOn"
                                            id="fundReceivedOn"
                                            onChange={AddFund.handleChange}
                                            onBlur={AddFund.handleBlur}
                                            value={AddFund.values.fundReceivedOn}
                                        />
                                        {AddFund.touched.fundReceivedOn && AddFund.errors.fundReceivedOn && (
                                            <ErrorMsg error={AddFund.errors.fundReceivedOn} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Utilization Date"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="utilizationDate"
                                            id="utilizationDate"
                                            onChange={AddFund.handleChange}
                                            onBlur={AddFund.handleBlur}
                                            value={AddFund.values.utilizationDate}
                                        />
                                        {AddFund.touched.utilizationDate && AddFund.errors.utilizationDate && (
                                            <ErrorMsg error={AddFund.errors.utilizationDate} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Interest Start On"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="interestStartOn"
                                            id="interestStartOn"
                                            onChange={AddFund.handleChange}
                                            onBlur={AddFund.handleBlur}
                                            value={AddFund.values.interestStartOn}
                                        />
                                        {AddFund.touched.interestStartOn && AddFund.errors.interestStartOn && (
                                            <ErrorMsg error={AddFund.errors.interestStartOn} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Interest End On"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="interestEndOn"
                                            id="interestEndOn"
                                            onChange={AddFund.handleChange}
                                            onBlur={AddFund.handleBlur}
                                            value={AddFund.values.interestEndOn}
                                        />
                                        {AddFund.touched.interestEndOn && AddFund.errors.interestEndOn && (
                                            <ErrorMsg error={AddFund.errors.interestEndOn} />
                                        )}
                                    </div>

                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                    <Button
                                        btnName="Add Fund"
                                        btnIcon="IoCheckmarkCircleSharp"
                                        type="submit"
                                        style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                                    />
                                    <Button
                                        btnName="Cancel"
                                        btnIcon="IoCloseCircleOutline"
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        style="min-w-[120px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>

                {/* Modal for Fund */}
                <Modal isOpen={isFund} onClose={() => setIsFund(false)}>
                    <div className="p-2">
                        <div className="flex justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-primary">{selectedRow?.Status === true ? "View Fund" : "Update Fund"}</h1>
                                <p className="text-sm italic text-gray-600 font-semibold">Fund Information</p>
                            </div>
                        </div>

                        <div className="px-8 my-5">
                            <form onSubmit={UpdateFund.handleSubmit} className="my-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <TextInput
                                            label="Fund Amount"
                                            icon="MdOutlineCurrencyRupee"
                                            placeholder="Enter Fund Amount"
                                            name="fundAmount"
                                            id="fundAmount"
                                            maxLength={11}
                                            disabled={selectedRow?.status}
                                            onChange={UpdateFund.handleChange}
                                            onBlur={UpdateFund.handleBlur}
                                            value={UpdateFund.values.fundAmount}
                                        />
                                        {UpdateFund.touched.fundAmount && UpdateFund.errors.fundAmount && (
                                            <ErrorMsg error={UpdateFund.errors.fundAmount} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Interest Rate (%)"
                                            icon="MdOutlinePercent"
                                            placeholder="Enter Interest Rate"
                                            name="interestRate"
                                            id="interestRate"
                                            maxLength={3}
                                            disabled={selectedRow?.status}
                                            onChange={UpdateFund.handleChange}
                                            onBlur={UpdateFund.handleBlur}
                                            value={UpdateFund.values.interestRate}
                                        />
                                        {UpdateFund.touched.interestRate && UpdateFund.errors.interestRate && (
                                            <ErrorMsg error={UpdateFund.errors.interestRate} />
                                        )}
                                    </div>

                                    <div>
                                        <SelectInput
                                            label="Interest Type"
                                            placeholder="Select"
                                            icon="RiMoneyRupeeCircleFill"
                                            name="interestType"
                                            id="interestType"
                                            disabled={selectedRow?.status}
                                            options={[
                                                { value: 'Fixed', label: 'Fixed' },
                                                { value: 'Reducing', label: 'Reducing' },
                                            ]}
                                            onChange={UpdateFund.handleChange}
                                            onBlur={UpdateFund.handleBlur}
                                            value={UpdateFund.values.interestType}
                                        />
                                        {UpdateFund.touched.interestType && UpdateFund.errors.interestType && (
                                            <ErrorMsg error={UpdateFund.errors.interestType} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Fund Received On"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="fundReceivedOn"
                                            id="fundReceivedOn"
                                            disabled={selectedRow?.status}
                                            onChange={UpdateFund.handleChange}
                                            onBlur={UpdateFund.handleBlur}
                                            value={UpdateFund.values.fundReceivedOn}
                                        />
                                        {UpdateFund.touched.fundReceivedOn && UpdateFund.errors.fundReceivedOn && (
                                            <ErrorMsg error={UpdateFund.errors.fundReceivedOn} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Utilization Date"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="utilizationDate"
                                            id="utilizationDate"
                                            disabled={selectedRow?.status}
                                            onChange={UpdateFund.handleChange}
                                            onBlur={UpdateFund.handleBlur}
                                            value={UpdateFund.values.utilizationDate}
                                        />
                                        {UpdateFund.touched.utilizationDate && UpdateFund.errors.utilizationDate && (
                                            <ErrorMsg error={UpdateFund.errors.utilizationDate} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Interest Start On"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="interestStartOn"
                                            id="interestStartOn"
                                            disabled={selectedRow?.status}
                                            onChange={UpdateFund.handleChange}
                                            onBlur={UpdateFund.handleBlur}
                                            value={UpdateFund.values.interestStartOn}
                                        />
                                        {UpdateFund.touched.interestStartOn && UpdateFund.errors.interestStartOn && (
                                            <ErrorMsg error={UpdateFund.errors.interestStartOn} />
                                        )}
                                    </div>

                                    <div>
                                        <TextInput
                                            label="Interest End On"
                                            icon="PiCalendarDotsDuotone"
                                            type="date"
                                            name="interestEndOn"
                                            id="interestEndOn"
                                            disabled={selectedRow?.status}
                                            onChange={UpdateFund.handleChange}
                                            onBlur={UpdateFund.handleBlur}
                                            value={UpdateFund.values.interestEndOn}
                                        />
                                        {UpdateFund.touched.interestEndOn && UpdateFund.errors.interestEndOn && (
                                            <ErrorMsg error={UpdateFund.errors.interestEndOn} />
                                        )}
                                    </div>

                                    <div>
                                        <SelectInput
                                            label="Status"
                                            placeholder="Select"
                                            icon="RiMoneyRupeeCircleFill"
                                            name="fundStatus"
                                            id="fundStatus"
                                            options={status}
                                            disabled={selectedRow?.status}
                                            onChange={UpdateFund.handleChange}
                                            onBlur={UpdateFund.handleBlur}
                                            value={UpdateFund.values.fundStatus}
                                        />
                                        {UpdateFund.touched.fundStatus && UpdateFund.errors.fundStatus && (
                                            <ErrorMsg error={UpdateFund.errors.fundStatus} />
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                    {selectedRow?.status === false && (
                                        <Button
                                            btnName="Update Fund"
                                            btnIcon="IoCheckmarkCircleSharp"
                                            type="submit"
                                            style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                                        />
                                    )}
                                    <Button
                                        btnName="Cancel"
                                        btnIcon="IoCloseCircleOutline"
                                        type="button"
                                        onClick={() => setIsFund(false)}
                                        style="min-w-[120px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default ManageFunders;

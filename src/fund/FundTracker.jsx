import { useState, useEffect } from "react"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icon from "../components/utils/Icon"
import Modal from "../components/utils/Modal"
import SelectInput from "../components/fields/SelectInput";
import TextInput from "../components/fields/TextInput";
import ErrorMsg from "../components/utils/ErrorMsg";
import Button from "../components/utils/Button";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FunderUpsert, GetFundStatus } from "../api/ApiFunction"
import { useAuth } from "../context/AuthContext";
import NumberFormatter from "../components/utils/NumberFormatter";
import Loader from "../components/utils/Loader";
import LoginPageFinder from "../components/utils/LoginPageFinder";
import { Helmet } from "react-helmet";
import {
    osName,
    osVersion,
    browserName,
    browserVersion,
    engineName,
    engineVersion
} from 'react-device-detect';


function FundTracker() {

    const [isOpen, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fundStatus, setFundStatus] = useState({});
    const { adminUser } = useAuth();
    const funds = fundStatus?.funds?.[0] || []

    const pageAccess = LoginPageFinder('page_display_name', 'fund tracker');
    const permission = pageAccess?.[0].read_write_permission;
    const funder = adminUser.role === 'Funder' ? true : false

    const [ipAddress, setIPAddress] = useState("");
    const device = `Browser: ${browserName} ${browserVersion}, OS: ${osName} ${osVersion}, Engine: ${engineName} ${engineVersion}`;


    useEffect(() => {
        const fetchFunderDetails = async () => {
            const payload = { funder_id: "" }
            try {
                const res = await GetFundStatus(payload);

                if (res.status) {
                    setFundStatus(res);
                    setLoading(false);
                } else {
                    setFundStatus({});
                    setLoading(false);
                    toast.error(res.message || "Failed to fetch funder details");
                }
            } catch (error) {
                console.error("Error fetching funder details:", error);
                toast.error("Something went wrong while fetching data.");
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchFunderDetails();
    }, []);


    useEffect(() => {
        fetch(import.meta.env.VITE_GET_IP_URL)
            .then(response => response.json())
            .then(data => setIPAddress(data.ip))
            .catch(error => console.log(error));
    }, []);



    const type = [
        { value: 'Business', label: 'Entity' },
        { value: 'Individual', label: 'Individual' }
    ]

    const formik = useFormik({
        initialValues: {
            type: "",
            funder: "",
            person: "",
            panCard: "",
            date: "",
            contact: "",
            address: "",
        },
        validationSchema: Yup.object({
            type: Yup.string().required('Required'),
            funder: Yup.string().required('Required')
                .min(5, 'Must be 3 characters or more')
                .max(35, 'Must be 35 characters or less'),
            person: Yup.string().required('Required')
                .min(3, 'Must be 3 characters or more')
                .max(50, 'Must be 50 characters or less'),
            contact: Yup.string().required('Required')
                .matches(/^[0-9]{10}$/, 'Phone number is not valid'),
            panCard: Yup.string().required('Required')
                .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Pan Card is not valid'),
            address: Yup.string().required('Required')
                .min(5, 'Must be 3 characters or more')
                .max(100, 'Must be 20 characters or less'),
            date: Yup.date().required('Required'),
        }),
        onSubmit: async (values) => {
            const req = {
                funder_type: values.type,
                funder_name: values.funder,
                contact_person: values.person,
                phone_number: values.contact,
                address: values.address,
                pan_number: values.panCard,
                Status: false,
                onboarding_date: values.date,
                updated_by: adminUser.emp_code,
                ip_address: ipAddress,
                device_info: device,
            }

            try {
                const response = await FunderUpsert(req);
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
        }

    });

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <Helmet>
                <title>Fund Tracker</title>
                <meta name="New Leads" content="Fund Tracker" />
            </Helmet>
            <div className="bg-gray-100 shadow p-4 rounded">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg shadow">
                            <Icon name="MdOutlineCurrencyRupee" size={35} color="white" />
                        </div>
                        <div className="">
                            <h1 className="text-xl font-bold text-primary">Fund Tracker</h1>
                            <p className="text-sm italic text-gray-600 font-semibold">Manage & track funds</p>
                        </div>
                    </div>
                    {permission && !funder && (
                        <div>
                            <button className="bg-primary text-white py-1.5 px-4 rounded shadow"
                                onClick={() => setOpen(true)}>
                                Add Funder
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Menu Items */}
            <div className="mt-8">
                <span className=" bg-gray-400 px-6 py-1 rounded-t font-semibold italic text-primary">Dashboard</span>
                <div className="border border-light mt-0.5 p-4 flex justify-center items-center py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <div>
                            <div className="border rounded shadow p-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 hover:shadow-lg">
                                <div className="flex justify-center">
                                    <div className="flex justify-center border border-primary text-primary p-4 rounded mr-4 shadow-lg">
                                        <Icon name="GiTakeMyMoney" size={40} />
                                    </div>
                                    <div className="text-lg text-center mt-2 font-semibold text-primary italic">
                                        <div className="font-bold text-2xl text-black">₹{<NumberFormatter number={funds?.total_funds || 0} />}</div>
                                        <div>Total Funds</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="border rounded shadow p-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 hover:shadow-lg">
                                <div className="flex justify-center">
                                    <div className="flex justify-center border border-primary text-primary p-4 rounded mr-4 shadow-lg">
                                        <Icon name="PiMinusFill" size={40} />
                                    </div>
                                    <div className="text-lg text-center mt-2 font-semibold text-primary italic">
                                        <div className="font-bold text-2xl text-black">₹{<NumberFormatter number={funds?.used_funds || 0} />}</div>
                                        <div>Funds Used</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="border rounded shadow p-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 hover:shadow-lg">
                                <div className="flex justify-center">
                                    <div className="flex justify-center border border-primary text-primary p-4 rounded mr-4 shadow-lg">
                                        <Icon name="PiPlusFill" size={40} />
                                    </div>
                                    <div className="text-lg text-center mt-2 font-semibold text-primary italic">
                                        <div className="font-bold text-2xl text-black">₹{<NumberFormatter number={funds?.funds_left || 0} />}</div>
                                        <div>Funds Left</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="border rounded shadow p-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 hover:shadow-lg">
                                <div className="flex justify-center">
                                    <div className="flex justify-center border border-primary text-primary p-4 rounded mr-4 shadow-lg">
                                        <Icon name="PiUsersBold" size={40} />
                                    </div>
                                    <div className="text-lg text-center mt-2 font-semibold text-primary italic">
                                        <div className="font-bold text-2xl text-black">{fundStatus?.total_funders || 0}</div>
                                        <Link to="/admin/funders">Manage Funders</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Funder */}
            <Modal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
            >
                <div className="p-2">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Add Funder</h1>
                        <p className="text-sm italic text-gray-600 font-semibold">New Funder Onboarding</p>
                    </div>
                    <div className="px-0 md:px-8 my-5">
                        <form onSubmit={formik.handleSubmit} className='my-4'>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <SelectInput
                                        label={"Funder Type"}
                                        placeholder="Select"
                                        icon={formik.values.type === "Business" ? "PiBuildingOffice" : "IoPersonOutline"}
                                        name="type"
                                        id="type"
                                        options={type}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.type}
                                    />
                                    {formik.touched.type && formik.errors.type && (
                                        <ErrorMsg error={formik.errors.type} />
                                    )}
                                </div>

                                <div>
                                    <TextInput
                                        label={formik.values.type === "Business" ? "Company Name" : "Person Name"}
                                        icon={formik.values.type === "Business" ? "PiBuildingOffice" : "IoPersonOutline"}
                                        placeholder="Enter Funder Name"
                                        name="funder"
                                        id="funder"
                                        maxLength={36}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.funder}
                                    />
                                    {formik.touched.funder && formik.errors.funder && (
                                        <ErrorMsg error={formik.errors.funder} />
                                    )}
                                </div>
                                <div>
                                    <TextInput
                                        label={"Contact Person"}
                                        icon="IoPersonCircleOutline"
                                        placeholder="Enter Funder Name"
                                        name="person"
                                        id="person"
                                        maxLength={51}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.person}
                                    />
                                    {formik.touched.person && formik.errors.person && (
                                        <ErrorMsg error={formik.errors.person} />
                                    )}
                                </div>


                                <div>
                                    <TextInput
                                        label={"Contact Number"}
                                        icon="IoPhonePortraitOutline"
                                        placeholder="Enter Funder Name"
                                        name="contact"
                                        id="contact"
                                        maxLength={10}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.contact}
                                    />
                                    {formik.touched.contact && formik.errors.contact && (
                                        <ErrorMsg error={formik.errors.contact} />
                                    )}
                                </div>

                                <div>
                                    <TextInput
                                        label="PAN Number"
                                        icon="IoPhonePortraitOutline"
                                        placeholder="Enter pan Number"
                                        name="panCard"
                                        id="panCard"
                                        maxLength={10}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.panCard}
                                    />
                                    {formik.touched.panCard && formik.errors.panCard && (
                                        <ErrorMsg error={formik.errors.panCard} />
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
                                    />
                                    {formik.touched.date && formik.errors.date && (
                                        <ErrorMsg error={formik.errors.date} />
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <TextInput
                                        label={"Address"}
                                        icon="RiMapPinRangeLine"
                                        placeholder="Enter Complete Address"
                                        name="address"
                                        id="address"
                                        maxLength={101}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.address}
                                    />
                                    {formik.touched.address && formik.errors.address && (
                                        <ErrorMsg error={formik.errors.address} />
                                    )}
                                </div>

                            </div>
                            <div className="flex justify-end gap-4 mt-2">
                                <Button
                                    btnName="Add Funder"
                                    btnIcon="IoCheckmarkCircleSharp"
                                    type="submit"
                                    style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                                />
                                <Button
                                    btnName={"Cancel"}
                                    btnIcon={"IoCloseCircleOutline"}
                                    type={"button"}
                                    onClick={() => setOpen(false)}
                                    style="min-w-[135px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                                />
                            </div>
                        </form>
                    </div>
                </div>

            </Modal>
        </div>
    )
}
export default FundTracker
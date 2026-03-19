import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from "../components/utils/Modal";
import SelectInput from "../components/fields/SelectInput";
import TextInput from "../components/fields/TextInput";
import ErrorMsg from "../components/utils/ErrorMsg";
import Button from "../components/utils/Button";
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import { toast } from 'react-toastify';
import Icon from '../components/utils/Icon';
import Loader from '../components/utils/Loader';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { GetFunderList } from '../api/ApiFunction';

const FunderTable = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [funderList, setFunderList] = useState([]);
    useEffect(() => {
        getFunderList();
    }, []);

    const navigate = useNavigate();

    const type = [
        { value: '0', label: 'Business' },
        { value: '1', label: 'Individual' }
    ];

    const getFunderList = async () => {

        const payload = {
            funder_id: "",
            status: true,
            from_date: "",
            to_date: ""
        }

        const response = await GetFunderList(payload);
        try {
            if (response.status) {
                const data = response.funderLists;
                setFunderList(data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/');
            }
        }
    }


    const handleOpenModal = (row) => {
        setSelectedRow(row);
        setOpen(true);
    };

    const handleFilterBtn = () => {
        toast.info("No filter available for this page.");
    };

    const formik = useFormik({
        initialValues: {
            type: '',
            funder: '',
            person: '',
            contact: '',
            address: '',
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
            contact: Yup.string()
                .required('Required')
                .matches(/^[0-9]{10}$/, 'Phone number is not valid'),
            address: Yup.string()
                .required('Required')
                .min(5, 'Must be 5 characters or more')
                .max(100, 'Must be 100 characters or less'),
        }),
        onSubmit: async (values) => {
            alert(JSON.stringify(values, null, 2));
            toast.success("Funder saved successfully!");
            formik.resetForm();
            setOpen(false);
        },
    });

    // Set form values when selectedRow changes
    useEffect(() => {
        if (selectedRow) {
            formik.setValues({
                type: selectedRow.funder_type === "Business" ? "0" : "1",
                funder: selectedRow.funder_name || "",
                person: selectedRow.contact_person || "",
                contact: selectedRow.phone_number?.replace(/\D/g, "") || "",
                address: selectedRow.address_line || "",
            });
        }
    }, [selectedRow]);

    const columnsData = [
        {
            name: '#',
            selector: row => row.funder_id,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Funder Name',
            selector: row => row.funder_name,
            sortable: true,
            width: '250px'
        },
        {
            name: 'Type',
            selector: row => row.funder_type === "Business" ? "Business" : "Individual",
            sortable: true,
            width: '115px'
        },
        {
            name: 'Contact Person',
            selector: row => row.contact_person,
            sortable: true,
            width: '200px'
        },
        {
            name: 'Phone No',
            selector: row => row.phone_number,
            sortable: true,
            width: '140px'
        },
        {
            name: 'Status',
            selector: row => row.status
                ? <span className='text-success bg-green-100 px-2 py-1 rounded'>Active</span>
                : <span className='text-danger bg-red-100 px-2 py-1 rounded'>Inactive</span>,
            width: '100px'
        },
        {
            name: 'Actions',
            width: '120px',
            cell: row => (
                <div className='flex gap-2'>
                    <button
                        onClick={() => navigate('/admin/manage-funder', {
                            state: { funderId: row.funder_id }
                        })}
                        className="px-4 py-0.5 border border-secondary rounded hover:text-secondary"
                    >
                        View
                    </button>
                    {/* <button
                        onClick={() => handleOpenModal(row)}
                        className="px-4 py-0.5 border border-secondary rounded hover:text-secondary"
                    >
                        Fund
                    </button> */}
                </div>
            ),
            ignoreRowClick: true,
            allowoverflow: true,
            button: 'true',
        },
        {
            name: 'Created On',
            selector: row => row.onboarding_date,
            sortable: true,
            width: '180px'
        }
    ];

    if (isLoading) return <Loader />;

    return (
        <>
            <Helmet>
                <title>Manage Funders</title>
                <meta name="New Leads" content="New Leads" />
            </Helmet>

            <div className='mt-8'>
                <Table
                    columns={columnsData}
                    data={funderList}
                    title="Manage Funders"
                    handleFilter={handleFilterBtn}
                />
            </div>

            {/* Modal for Funder */}
            <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
                <div className="p-2">
                    <div className='flex justify-between'>
                        <div>
                            <h1 className="text-xl font-bold text-primary">View / Edit Funder</h1>
                            <p className="text-sm italic text-gray-600 font-semibold">Funder Details</p>
                        </div>
                        <div>
                            <button
                                onClick={() => setEditing(!editing)}
                                className="p-2 bg-gray-100 rounded-full shadow hover:bg-primary hover:text-white"
                            >
                                <Icon name={editing ? "IoLockOpenSharp" : "IoLockClosedSharp"} size={18} />
                            </button>
                        </div>

                    </div>

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
                                <Button
                                    btnName="Cancel"
                                    btnIcon="IoCloseCircleOutline"
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    style="min-w-[135px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default FunderTable;

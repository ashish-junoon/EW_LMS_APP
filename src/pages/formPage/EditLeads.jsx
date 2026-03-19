import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Personal from '../../components/form/Personal';
import Employment from '../../components/form/Employment';
import Address from '../../components/form/Address';
import KycInfo from '../../components/form/KycInfo';
import Gaurantor from '../../components/form/Gaurantor';
import BankInfo from '../../components/form/BankInfo';
import OthersDocs from '../../components/form/OthersDocs';
import AppCard from '../../components/form/AppCard';
import FormSidebar from '../../components/form/FormSidebar';
import TextInput from '../../components/fields/TextInput';
import { getLeadDetails } from '../../api/ApiFunction';
import ErrorMsg from '../../components/utils/ErrorMsg';
import Loader from '../../components/utils/Loader';
import { useAuth } from '../../context/AuthContext';
import { useOpenLeadContext } from '../../context/OpenLeadContext';
import { Helmet } from 'react-helmet';

const EditLeads = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setLeadInfo } = useOpenLeadContext();
    const { adminUser } = useAuth();


    const fetchData = async ({ UserId, leadId }) => {
        setIsLoading(true);
        const req = {
            lead_id: leadId,
            user_id: UserId,
            login_user: adminUser.emp_code,
            permission: "w"
        };
        try {
            const response = await getLeadDetails(req);
            if (response.status) {
                setUserData(response);
                setLeadInfo(response);

                // toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        } finally {
            setIsLoading(false);
        }
    };


    const formik = useFormik({
        initialValues: {
            UserId: '',
            leadId: '',
        },
        validationSchema: Yup.object({
            UserId: Yup.string().required('UserId is required'),
            leadId: Yup.string().required('LeadId is required'),
        }),
        onSubmit: async (values) => {
            fetchData({ UserId: values.UserId, leadId: values.leadId });
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <Helmet>
                <title>Modify Lead </title>
                <meta name="New Leads" content="New Leads" />
            </Helmet>
            <div className="bg-white p-4 shadow rounded mb-10">
                <h1 className="text-xl font-bold">Search Lead</h1>

                <div className="mt-5 px-0 md:px-8 mb-5">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            <div>
                                <TextInput
                                    label="User ID"
                                    icon="IoPersonOutline"
                                    placeholder="Enter UserId"
                                    name="UserId"
                                    type="text"
                                    maxLength={8}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.UserId}
                                />
                                {formik.touched.UserId && formik.errors.UserId && (
                                    <ErrorMsg error={formik.errors.UserId} />
                                )}
                            </div>
                            <div>
                                <TextInput
                                    label="Lead ID"
                                    icon="IoPersonOutline"
                                    placeholder="Enter LeadId"
                                    name="leadId"
                                    type="text"
                                    maxLength={8}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.leadId}
                                />
                                {formik.touched.leadId && formik.errors.leadId && (
                                    <ErrorMsg error={formik.errors.leadId} />
                                )}
                            </div>
                            <div className='max-md:col-span-2'>
                                <button
                                    className="bg-primary text-white py-1.5 px-4 rounded mt-6 w-full cursor-pointer hover:bg-blue-600"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Loading..." : "Search"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>


            {userData !== null && (
                <>
                    <div>
                        <AppCard />
                    </div>
                    <div className='mt-4'>
                        <div className='grid lg:grid-cols-7 gap-4 mt-5'>
                            <div className='lg:col-span-2 py-5'>
                                <div>

                                    <FormSidebar data={userData} />
                                </div>
                            </div>
                            <div className='lg:col-span-5 py-5'>
                                <div className='md:px-5'>
                                    <Personal btnEnable={true} />
                                    <Employment btnEnable={true} />
                                    <Address btnEnable={true} />
                                    <KycInfo btnEnable={true} />
                                    <BankInfo btnEnable={true} />
                                    <Gaurantor btnEnable={true} />
                                    <OthersDocs btnEnable={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    );
};

export default EditLeads;
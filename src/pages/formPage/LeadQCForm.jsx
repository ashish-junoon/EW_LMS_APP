import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Personal from '../../components/form/Personal';
import Employment from '../../components/form/Employment';
import Address from '../../components/form/Address';
import KycInfo from '../../components/form/KycInfo';
import Gaurantor from '../../components/form/Gaurantor';
import AppStatus from '../../components/utils/AppStatus';
import AppCard from '../../components/form/AppCard';
import BankInfo from '../../components/form/BankInfo';
import FormSidebar from '../../components/form/FormSidebar';
import SelectInput from '../../components/fields/SelectInput';
import TabWrap from '../../components/utils/TabWrap';
import { rejectLead } from '../../components/content/Data';
import TextInput from '../../components/fields/TextInput';
import { getLeadDetails, UpdateUserLead } from '../../api/ApiFunction';
import Modal from '../../components/utils/Modal';
import Button from '../../components/utils/Button';
import ErrorMsg from '../../components/utils/ErrorMsg';
import Loader from '../../components/utils/Loader';
import LeadHistory from '../../components/utils/LeadHistory';
import { useAuth } from '../../context/AuthContext';
import { useOpenLeadContext } from '../../context/OpenLeadContext';
import { Helmet } from 'react-helmet';
import OthersDocs from '../../components/form/OthersDocs';
import LoginPageFinder from '../../components/utils/LoginPageFinder';

const LeadQCForm = () => {
    const [openApporve, setOpenApporve] = useState(false);
    const [openReject, setOpenRejcet] = useState(false);
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const lead_id = location.state?.lead_id;
    const user_id = location.state?.user_id;
    const isOnHold = location.state?.isOnHold

    const { adminUser } = useAuth();
    const { leadInfo, setLeadInfo } = useOpenLeadContext();
    const navigate = useNavigate();

    const pageAccess = LoginPageFinder('page_display_name', 'leads verification');
    const permission = pageAccess?.[0].read_write_permission;
    const funder = adminUser.role === 'Funder' ? true : false

    //Get Open Lead Info

    const fetchData = async () => {
        setIsLoading(true);
        const req = {
            lead_id: lead_id,
            user_id: user_id,
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

    useEffect(() => {
        if (lead_id && user_id) {
            fetchData();
        } else {
            navigate("/");
        }
    }, [lead_id, user_id]);



    const confirmLead = async (req) => {
        try {
            const response = await UpdateUserLead(req);
            console.log("API Response:", response); // Debug log

            if (response.status) {
                toast.success(response.message);
                navigate("/manage-leads/leads-verification");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        }
    };



    const formik = useFormik({
        initialValues: {
            reason: '',
            remarks: ''
        },
        validationSchema: Yup.object({
            reason: Yup.string().required('Required'),
            remarks: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            const req = {
                lead_id: lead_id,
                step_status: 7, //Rejected status
                is_prove: false,
                updated_by: adminUser.emp_code,
                reason: formik.values.reason,
                remarks: formik.values.remarks
            };

            confirmLead(req);
            console.log("values:", req);
            setOpenRejcet(!openReject);
            // toast.success('Application Rejected');
        },
    });


    // handle Approve confirm Yes button
    const handleApproveYes = () => {
        const req = {
            lead_id: lead_id,
            step_status: 3,
            is_prove: true,
            updated_by: adminUser.emp_code,
            reason: "Lead Verified",
            remarks: "Documents & information have been verified and sent for Credit."
        };

        confirmLead(req);
        setOpenApporve(false);  // Close modal after approval
        navigate("/manage-leads/leads-verification");
    };

    //handle Approve confirm No button
    const handleApproveNo = () => {
        setOpenApporve(!openApporve);
    }


    // handle Reject lead No button
    const handleRejectNo = () => {
        setOpenRejcet(!openReject);
    };


    if (isLoading) {
        return <Loader />;
    }

    if (!userData) {
        return <div>No data available</div>;
    }

    const tabData = [
        {
            label: 'Borrower Application',
            content: <div className='grid lg:grid-cols-7 gap-4 mt-5'>
                <div className='lg:col-span-2 py-5'>
                    <div>
                        {!funder && <FormSidebar data={userData} />} 
                    </div>
                </div>
                <div className={`${!funder ? 'lg:col-span-5' : 'lg:col-span-7'} py-5`}>
                    <Personal btnEnable={!isOnHold && permission} />
                    <Employment btnEnable={!isOnHold && permission} />
                    <Address btnEnable={!isOnHold && permission} />
                    <KycInfo btnEnable={!isOnHold && permission} />
                    <BankInfo btnEnable={!isOnHold && permission} />
                    <Gaurantor btnEnable={!isOnHold && permission} />
                    <OthersDocs btnEnable={!isOnHold && permission} />

                    {userData?.lead_status === 2 && permission && (
                        <div className='col-span-2'>
                            <div className='flex justify-end gap-5'>
                                {leadInfo?.personal_info_verified && leadInfo?.employment_info_verified && leadInfo?.address_info_verified && leadInfo?.kyc_info_verified && leadInfo?.bank_info_verified && leadInfo?.gurantor_nominee_verified && (
                                    <Button
                                        btnName={"Mark as Verified"}
                                        btnIcon={"IoCheckmarkCircleSharp"}
                                        type={""}
                                        onClick={() => setOpenApporve(!openApporve)}
                                        style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                                    />
                                )}


                                <Button
                                    btnName={"Mark as Rejected"}
                                    btnIcon={"IoCloseCircleOutline"}
                                    type={""}
                                    onClick={() => setOpenRejcet(!openReject)}
                                    style="min-w-[150px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Approve Modal */}
                <Modal
                    isOpen={openApporve}
                    onClose={() => setOpenApporve(false)}
                >
                    <div className='text-center font-semibold my-3'>
                        <h1>Are you sure you want to approve?</h1>
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button
                            btnName="Yes"
                            btnIcon="IoCheckmarkCircleSharp"
                            type="submit"
                            onClick={handleApproveYes}
                            style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                        />
                        <Button
                            btnName={"No"}
                            btnIcon={"IoCloseCircleOutline"}
                            type={"button"}
                            onClick={handleApproveNo}
                            style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                        />
                    </div>

                </Modal>
                {/* Reject Modal */}
                <Modal
                    isOpen={openReject}
                    onClose={() => setOpenRejcet(false)}
                    heading={"Reject Lead"}
                >
                    <div className='px-5'>
                        <form onSubmit={formik.handleSubmit} className='my-4'>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <SelectInput
                                        label="Rejection Reason"
                                        placeholder="Select"
                                        icon="MdOutlineSpeakerNotes"
                                        name="reason"
                                        id="reason"
                                        options={rejectLead}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.reason}
                                    />
                                    {formik.touched.reason && formik.errors.reason && (
                                        <ErrorMsg error={formik.errors.reason} />
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <TextInput
                                        label="Remarks"
                                        icon="GoPencil"
                                        placeholder="Write Remarks"
                                        name="remarks"
                                        id="remarks"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.remarks}
                                    />
                                    {formik.touched.remarks && formik.errors.remarks && (
                                        <ErrorMsg error={formik.errors.remarks} />
                                    )}
                                </div>


                            </div>
                            <div className="flex justify-end gap-4 mt-2">
                                <Button
                                    btnName="Reject"
                                    btnIcon="IoCheckmarkCircleSharp"
                                    type="submit"
                                    style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
                                />
                                <Button
                                    btnName={"Cancel"}
                                    btnIcon={"IoCloseCircleOutline"}
                                    type={"button"}
                                    onClick={handleRejectNo}
                                    style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
                                />
                            </div>

                        </form>
                    </div>

                </Modal>
            </div>
        },
        {
            label: 'Lead History',
            content: <div className='mb-5'>
                <LeadHistory data={userData} btnEnable={permission} />
            </div>
        },
    ];

    return (
        <>
            <Helmet>
                <title>Verify Leads</title>
                <meta name="New Leads" content="New Leads" />
            </Helmet>
            <div>
                <AppStatus
                    appStatus={userData?.lead_status}
                    rejectedStatus={false}
                />
                <AppCard
                    data={userData}
                />
            </div>
            <TabWrap tabData={tabData} />

        </>
    );
};

export default LeadQCForm;
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Personal from '../../components/form/Personal';
import Employment from '../../components/form/Employment';
import Address from '../../components/form/Address';
import KycInfo from '../../components/form/KycInfo';
import Card from '../../components/utils/Card';
import Gaurantor from '../../components/form/Gaurantor';
import AppCard from '../../components/form/AppCard';
import BankInfo from '../../components/form/BankInfo';
import Button from '../../components/utils/Button';
import FormSidebar from '../../components/form/FormSidebar';
import Modal from '../../components/utils/Modal';
import TabWrap from '../../components/utils/TabWrap';
import { getLeadDetails } from '../../api/ApiFunction';
import Loader from '../../components/utils/Loader';
import { LeadReopen } from '../../api/ApiFunction';
import LeadHistory from '../../components/utils/LeadHistory';
import { useAuth } from '../../context/AuthContext';
import { useOpenLeadContext } from '../../context/OpenLeadContext';
import { Helmet } from 'react-helmet';
import OthersDocs from '../../components/form/OthersDocs';
import LoginPageFinder from '../../components/utils/LoginPageFinder';
import OtherBankInfo from '../../components/form/OtherBankInfo';

const ManageAppForm = () => {
    const [openApporve, setOpenApporve] = useState(false);
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const lead_id = location.state?.lead_id;
    const user_id = location.state?.user_id;

    const { adminUser } = useAuth();
    const { setLeadInfo } = useOpenLeadContext();
    const navigate = useNavigate();

    const pageAccess = LoginPageFinder('page_display_name', 'rejected leads');
    const permission = pageAccess?.[0].read_write_permission;
    const funder = adminUser.role === 'Funder' ? true : false

    useEffect(() => {
        if (lead_id && user_id) {
            fetchData();
        } else {
            navigate("/")
        }
    }, [lead_id, user_id]);

    const fetchData = async () => {
        setIsLoading(true);
        const req = {
            lead_id: lead_id,
            user_id: user_id,
            login_user: adminUser?.emp_code,
            permission: "w"
        };
        try {
            const response = await getLeadDetails(req);
            if (response.status) {
                setUserData(response);
                setLeadInfo(response);
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

    const reopenLead = async (req) => {

    };

    // handle Approve confirm Yes button
    const handleApproveYes = async () => {
        const req = {
            user_id: user_id,
            lead_id: lead_id,
            updated_by: adminUser.emp_code,
        }

        try {
            const response = await LeadReopen(req);

            if (response.status) {
                toast.success(response.message);
                setOpenApporve(false);
                navigate("/manage-leads/rejected-leads");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        }
    };

    //handle Approve confirm No button
    const handleApproveNo = () => {
        setOpenApporve(!openApporve);
    }

    if (isLoading) {
        return <Loader />;
    }

    if (!userData) {
        return <div>No data available</div>;
    }

    const tabData = [
        {
            label: 'Lead Application',
            content: <div className='grid lg:grid-cols-7 gap-4 mt-5'>
                <div className='lg:col-span-2 py-5'>
                    <div>
                        {!funder && <FormSidebar data={userData} />}
                    </div>
                </div>
                <div className={`${!funder ? 'lg:col-span-5' : 'lg:col-span-7'} py-5`}>
                    <Card heading={"Applicant Details"} style={'p-5'}>
                        <Personal />
                        <Employment />
                        <Address />
                        <KycInfo />
                        <BankInfo />
                        <OtherBankInfo />
                        <Gaurantor />
                        <OthersDocs />

                        {permission && (
                            <div className='border border-gray-200 px-5'>
                                <div className='col-span-2'>
                                    <div className='flex justify-end gap-5'>
                                        <Button
                                            btnName={"Reopen"}
                                            btnIcon={"RiFileList3Line"}
                                            type={""}
                                            onClick={() => setOpenApporve(!openApporve)}
                                            style="min-w-[150px] md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-success hover:text-success hover:font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
                {/* Approve Modal */}
                <Modal
                    isOpen={openApporve}
                    onClose={() => setOpenApporve(false)}
                >
                    <div className='text-center font-semibold'>
                        <h1>Are you sure? You want to reopen this lead.</h1>
                    </div>
                    <div className="flex justify-end gap-4 mt-2">
                        <Button
                            btnName="Yes"
                            btnIcon="IoCheckmarkCircleSharp"
                            type="submit"
                            onClick={handleApproveYes}
                            style="min-w-[80px] md:w-auto mt-4 py-1 px-4 border border-primary text-primary hover:border-success hover:bg-success hover:text-white hover:font-semiboldd"
                        />
                        <Button
                            btnName={"No"}
                            btnIcon={"IoCloseCircleOutline"}
                            type={"button"}
                            onClick={handleApproveNo}
                            style="min-w-[80px] md:w-auto mt-4 py-0.5 px-4 border border-primary text-primary hover:border-dark hover:bg-dark hover:text-white hover:font-semibold"
                        />
                    </div>

                </Modal>
            </div>
        },
        {
            label: 'History',
            content: <LeadHistory data={userData} btnEnable={permission} />
        },
    ];

    return (
        <>
            <Helmet>
                <title>Rejected Leads</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>
            <AppCard
                data={userData}
            />
            <TabWrap tabData={tabData} />
        </>
    );
};

export default ManageAppForm;
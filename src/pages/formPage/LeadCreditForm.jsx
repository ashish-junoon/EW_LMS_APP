import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import TabWrap from '../../components/utils/TabWrap';
import { getLeadDetails } from '../../api/ApiFunction';
import GetScore from '../../components/utils/GetScore';
import OffereLoan from '../../components/form/OfferLoan';
import Loader from '../../components/utils/Loader';
import LeadHistory from '../../components/utils/LeadHistory';
import { useAuth } from '../../context/AuthContext';
import { useOpenLeadContext } from '../../context/OpenLeadContext';
import { Helmet } from 'react-helmet';
import OthersDocs from '../../components/form/OthersDocs';
import LoginPageFinder from '../../components/utils/LoginPageFinder';
import LoanHistory from '../../components/utils/LoanHistory';
import Button from '../../components/utils/Button';
import AddBank from '../../components/form/AddBank';
import OtherBankInfo from '../../components/form/OtherBankInfo';


const LeadCreditForm = () => {
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const lead_id = location.state?.lead_id;
    const user_id = location.state?.user_id;
    const isOnHold = location.state?.isOnHold

    const { adminUser } = useAuth();
    const { setLeadInfo } = useOpenLeadContext();
    const navigate = useNavigate();

    const pageAccess = LoginPageFinder('page_display_name', 'credit assessment');
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
            login_user: adminUser.emp_code,
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

    


    if (isLoading) {
        return <Loader />
    }

    if (!userData) {
        return <div>No data available</div>;
    }

    const tabData = [
        {
            label: 'Credit Assessment',
            content:
                <div className=''>
                    <div className='border-b border-gray-900 py-5'>
                        <GetScore btnEnable={isOnHold} />
                    </div>

                    <div className='py-5'>
                        <AddBank fetchData={fetchData} />
                    </div>

                    <div className='py-5'>
                        <OffereLoan btnEnable={isOnHold} data={userData} />
                    </div>
                </div>
        },
        {
            label: 'Lead Application',
            content: <div className='grid lg:grid-cols-7 gap-4 mt-5'>
                <div className='lg:col-span-2 py-5'>
                    <div>
                        {!funder && <FormSidebar data={userData} />}
                    </div>
                </div>
                <div className={`${!funder ? 'lg:col-span-5' : 'lg:col-span-7'} py-5`}>
                    <Personal />
                    <Employment />
                    <Address />
                    <KycInfo />
                    <BankInfo btnEnable={true} />
                    <OtherBankInfo />
                    <Gaurantor btnEnable={true} />
                    <OthersDocs btnEnable={true} />
                </div>
            </div>
        },
        {
            label: 'History',
            content: <div className='p-8'>
                <LeadHistory data={userData} btnEnable={!isOnHold && permission} />
            </div>
        },
        {
            label: 'Loan History',
            content: <div className='mb-5'>
                <LoanHistory btnEnable={isOnHold} data={userData} pan={userData?.kycInfo[0]?.pan_card_number} />
            </div>
        },
    ];

    return (
        <>
            <Helmet>
                <title>Credit Assessment </title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>
            <AppStatus
                appStatus={userData?.lead_status}
                rejectedStatus={false}
            />
            <AppCard
                data={userData}
            />
            <div className='my-5'>
                <TabWrap tabData={tabData} />
            </div>
        </>
    );
};

export default LeadCreditForm;
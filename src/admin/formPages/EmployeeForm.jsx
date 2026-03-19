import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/utils/Loader";
import { GetEmployeeDetail } from "../../api/ApiFunction";
import Card from "../../components/utils/Card";
import Images from "../../components/content/Images";
import UpdateUser from "./UpdateUser";
import UserSidebar from "./UserSidebar";
import { Helmet } from "react-helmet";
import { useAuth } from "../../context/AuthContext";


const EmployeeForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [employee, setEmployee] = useState({});
    const { adminUser } = useAuth();

    const location = useLocation();
    const empCode = location.state?.emp_code || "No Emp Code Provided";

    const navigate = useNavigate();

    useEffect(() => {
        const allGroups = adminUser?.loginGroupNames || [];

        // Flatten all login pages across groups
        const allLoginPages = allGroups.flatMap(group => group.loginpageNames || []);

        const hasAccessToPageId3 = allLoginPages.some(page => page.page_id === 10);

        if (!hasAccessToPageId3) {
            navigate("/");
        }
    }, [adminUser]);


    useEffect(() => {
        const fetchLeadDetails = async () => {
            setIsLoading(true);
            const req = { emp_code: empCode };

            try {
                const response = await GetEmployeeDetail(req);
                if (response.status) {
                    setEmployee(response.employeeDetails[0]);
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

        fetchLeadDetails();
    }, [empCode]); // Add dependencies to avoid unnecessary re-renders

    if (isLoading) {
        return <Loader />;
    }

    const applicantData = {
        employeeName: employee?.firstname + " " + employee?.lastname,
        mobileNumber: employee?.primary_mobile,
        maritalStatus: employee?.marital_status,
        gender: employee?.gender,
        dateOfBirth: employee?.dob,
        email: employee?.personal_email,
        department: employee?.department_name,
        designation: employee?.designation_name,
        employmentType: employee?.employment_type,
        deployedBranch: employee?.branch_name,
        bankAccountNo: employee?.account_number,
        employeeStatus: employee?.is_active ? 'Active' : 'Inactive',
    };

    const capitalizeWords = (str) =>
        str.replace(/([A-Z])/g, ' $1').trim().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <>
            <Helmet>
                <title>Employee Information</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>
            <Card heading={"Employee Information"} style={'py-5'}>
                <div className="grid grid-cols-4 gap-6 border-b border-light">
                    <div className="col-span-1">
                        <div className='flex justify-center shadow-md h-32 w-28 m-auto'>
                            <img
                                src={
                                    employee?.employee_img_data
                                        ? `data:image/jpeg;base64,${employee.employee_img_data}`
                                        : Images.avatar
                                }
                                alt="Profile"
                                className="w-full h-full rounded shadow-lg"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center py-2">
                            <div className="font-semibold text-[10px]">Employee Code</div>
                            <div className="font-bold text-xs">{employee?.emp_code}</div>
                        </div>


                    </div>
                    <div className="col-span-3 gap-5">
                        <div className="grid grid-cols-4 mb-5 gap-1">
                            {Object.entries(applicantData).map(([key, value]) => (
                                <div key={key} className="mt-2">
                                    <h5 className="text-xs">{capitalizeWords(key)}</h5>
                                    <span className="font-semibold italic ">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </Card>

            <div className="grid grid-cols-4 gap-5 mt-8">
                <div className="col-span-1">
                    <UserSidebar data={employee} />
                </div>
                <div className="col-span-3">
                    <UpdateUser data={employee} />
                </div>
            </div>
        </>
    )
};

export default EmployeeForm;
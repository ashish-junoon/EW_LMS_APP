import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { toast } from 'react-toastify';
import { GetEmployee } from '../../api/ApiFunction';
import LinkBtn from '../../components/utils/LinkBtn';
import { getDepartmentName, GetDesignationName, GetBranchList } from "../../api/ApiFunction";
import SelectInput from '../../components/fields/SelectInput';
import Button from '../../components/utils/Button';
import FilterCard from '../../components/utils/FilterCard';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/utils/Icon';
import { Helmet } from 'react-helmet';
import Loader from '../../components/utils/Loader';
import LoginPageFinder from '../../components/utils/LoginPageFinder';
import { useAuth } from '../../context/AuthContext';

const ManageUser = () => {

    const [department, setDepartment] = useState([])
    const [designation, setDesignation] = useState([])
    const [branch, setBranch] = useState([])
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //Get Filter Value from Input
    const [deptValue, setDeptValue] = useState("")
    const [desigValue, setDesigValue] = useState("")
    const [branchValue, setBranchValue] = useState("")
    const [statusValue, setStatusValue] = useState(true)
    const [filterBtn, setFilterBtn] = useState(false)
    const navigate = useNavigate()
    const { adminUser } = useAuth();

    // alert(JSON.stringify(adminUser?.role));


    const pageAccess = LoginPageFinder('page_display_name', 'manage users');
    const permission = pageAccess?.[0].read_write_permission;



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const req = {
                department: "",
                designation: "",
                branch: "",
                status: true,
                login_employee_role: adminUser?.role
            };

            try {
                const response = await GetEmployee(req);
                // console.log("API Response:", response); // Debug log

                if (response.status) {
                    const data = response.getEmployees
                    setTableData(data);
                    setIsLoading(false)
                } else {
                    setIsLoading(false)
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data.");
            }
        };

        fetchData();
    }, []);



    useEffect(() => {
        const fetchData = async () => {
            const req = {
                id: 0,
                branch_name: ""
            }

            try {
                const department = await getDepartmentName();
                const designation = await GetDesignationName();
                const branchList = await GetBranchList(req);

                if (department?.status || designation?.status || branchList?.status) {
                    setDepartment(department.departments);
                    setDesignation(designation.designations);
                    setBranch(branchList.getBranches);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data.");
            }
        };

        fetchData();
    }, []);


    // alert(JSON.stringify(designation, null, 2));

    const handleFilter = async () => {
        setIsLoading(true)
        const req = {
            department: deptValue,
            designation: desigValue,
            branch: branchValue,
            status: Boolean(statusValue === "active" ? true : false)
        };

        try {
            const response = await GetEmployee(req);
            // console.log("API Response:", response); // Debug log
            if (response.status) {

                const data = response.getEmployees
                setTableData(data);
                setIsLoading(false)
            } else {
                setTableData([]);
                console.log(response.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("An error occurred while fetching data.");
        }
        setIsLoading(false)
    };


    const EmpCodeLink = ({ empCode }) => {
        const navigate = useNavigate();

        const handleClick = () => {
            navigate('/admin/employee', { state: { emp_code: empCode } });
        };

        return <button onClick={handleClick} className="text-blue-600 underline font-semibold">{empCode}</button>;
    };

    const handleFilterBtn = () => {
        setFilterBtn(!filterBtn)
    }

    const columnsData = [
        {
            name: 'Emp_Code',
            selector: row => <EmpCodeLink empCode={row.emp_code} />,
            sortable: true,
            width: '110px'
        },
        {
            name: 'Full Name',
            selector: row => row.full_name,
            sortable: true,
            // width: '180px'
        },
        {
            name: 'Mobile No',
            selector: row => row.mobile_number,
            // width: '120px'
        },
        {
            name: 'Email',
            selector: row => row.personal_email,
            // width: '200px'

        },
        {
            name: 'Department',
            // width: '170px',
            selector: row => row.department,
            sortable: true
        },
        {
            name: 'Desination',
            selector: row => row.designation,
            sortable: true,
            // width: '170px'
        }, {
            name: 'Permission',
            // width: '60px',
            cell: row => (
                <button
                    onClick={() => navigate('/admin/permission', {
                        state: { emp_id: row.emp_code, emp_role: row.designation }
                    })}
                    className="p-2 hover:text-secondary"
                >
                    <Icon name="MdOutlineRemoveRedEye" size={21} />
                </button>
            ),
            ignoreRowClick: true,
            allowoverflow: true,
            button: 'true',
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            width: '95px',
            cell: row => {
                if (row.status) {
                    return (
                        <span className="text-green-500 font-bold text-[9px] border border-green-500 px-4 py-0.5 rounded-full shadow italic">
                            Active
                        </span>
                    );
                } else {
                    return (
                        <span className="text-danger font-bold text-[9px] border border-danger px-3 py-0.5 rounded-full shadow italic">
                            Inactive
                        </span>
                    );
                }

            }
        }
    ];

    if (isLoading) return <Loader />;

    return (
        <>
            <Helmet>
                <title>Manage User</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>
            <div className="border border-gray-200 shadow px-5 py-2 mb-5 bg-blue-50 rounded">
                <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col justify-start">
                        <h1 className="text-lg font-bold text-black">User Management</h1>
                        <p className="text-xs font-light text-secondary">Manage & Control Users</p>
                    </div>
                    <div className="flex justify-end py-2">
                        {permission && (
                            <LinkBtn
                                linkName={"Add User"}
                                linkUrl={'/admin/add-user'}
                                icon={"MdOutlineAdd"}
                                className={"bg-primary text-white"}
                            />
                        )}
                    </div>
                </div>
            </div>

            {filterBtn && (
                <FilterCard onClick={handleFilterBtn}>
                    <div className='pb-5 px-4'>
                        <div className='p-4 grid grid-cols-5 gap-5'>
                            <div>
                                <SelectInput
                                    label="Department"
                                    icon="IoLocationOutline"
                                    name="department"
                                    placeholder="Select"
                                    options={department.map((item) => ({
                                        value: item.dept_id,
                                        label: item.department_name
                                    }))

                                    }
                                    onChange={(event) => setDeptValue(event.target.value)}
                                />
                            </div>
                            <div>
                                <SelectInput
                                    label="Designation"
                                    icon="IoLocationOutline"
                                    name="designation"
                                    placeholder="Select"
                                    options={designation.map((item) => ({
                                        value: item.desi_id,
                                        label: item.designation_name
                                    }))}
                                    onChange={(event) => setDesigValue(event.target.value)}
                                />
                            </div>
                            <div>
                                <SelectInput
                                    label="Branch"
                                    icon="IoLocationOutline"
                                    name="branch"
                                    placeholder="Select"
                                    options={branch.map((item) => ({
                                        value: item.branch_name,
                                        label: item.branch_name
                                    }))}
                                    onChange={(event) => setBranchValue(event.target.value)}
                                />
                            </div>
                            <div>
                                <SelectInput
                                    label="Status"
                                    icon="IoLocationOutline"
                                    name="status"
                                    placeholder="Select"
                                    options={
                                        [
                                            { value: "active", label: "Active" },
                                            { value: "inactive", label: "Inactive" },
                                        ]
                                    }
                                    onChange={(event) => setStatusValue(event.target.value)}
                                />
                            </div>
                            <div className='flex justify-center items-center'>
                                <Button
                                    btnName={"Apply Filter"}
                                    btnIcon={"MdFilterAlt"}
                                    type="button"
                                    onClick={handleFilter}
                                    title="Search"
                                    style="bg-primary text-white min-w-48 mt-6"
                                />
                            </div>
                        </div>
                    </div>
                </FilterCard>
            )}


            {Array.isArray(tableData) && tableData.length > 0 ? (
                <div className='mt-8'>
                    <Table
                        columns={columnsData}
                        data={tableData}
                        title="User List"
                        handleFilter={permission ? handleFilterBtn : null}
                        exportable={permission}
                    />
                </div>
            ) : (
                <div className="flex justify-center items-center border border-light py-5 mt-4">
                    <p className='text-md font-semibold'>No Data Found </p>
                </div>
            )}
        </>
    );
};

export default ManageUser;
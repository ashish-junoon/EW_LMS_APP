import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { toast } from 'react-toastify';
import { GetPagePermission, SetPagePermission } from '../../api/ApiFunction';
import Button from '../../components/utils/Button';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet';
import LoginPageFinder from '../../components/utils/LoginPageFinder';

const PagePermission = () => {
    const [tableData, setTableData] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const { state } = useLocation();
    const { emp_id, emp_role } = state;
    const { adminUser } = useAuth();

    const pageAccess = LoginPageFinder('page_display_name', 'manage users');
    const permission = pageAccess?.[0].read_write_permission;

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
        const fetchData = async () => {
            const req = {
                emp_code: emp_id,
                login_user: adminUser.emp_code
            };
            try {
                const response = await GetPagePermission(req);

                if (response.status) {
                    setTableData(response.getPermissions);

                    // Initialize permissions array based on fetched data
                    const initialPermissions = response.getPermissions.map(item => ({
                        page_id: item.page_id,
                        group_id: item.group_id,
                        set_permission_access: item.set_permission_access || false,
                        read_write_permission: item.read_write_permission || false
                    }));
                    setPermissions(initialPermissions);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data.");
            }
        };

        fetchData();
    }, [emp_id, adminUser.emp_code]);

    const handlePermissionChange = (index, field, value) => {
        setPermissions(prevPermissions => {
            const updatedPermissions = [...prevPermissions];
            updatedPermissions[index] = {
                ...updatedPermissions[index],
                [field]: value
            };

            // If read permission is turned off, turn off write permission too
            if (field === 'set_permission_access' && !value) {
                updatedPermissions[index].read_write_permission = false;
            }

            // Can't have write permission without read permission
            if (field === 'read_write_permission' && value) {
                updatedPermissions[index].set_permission_access = true;
            }

            return updatedPermissions;
        });
    };

    const handleSave = async () => {
        const req = {
            emp_code: emp_id,
            emp_role: emp_role,
            updated_emp_role: adminUser.role,
            updated_by: adminUser.emp_code,
            permission: permissions
        };


        try {
            const response = await SetPagePermission(req);
            if (response?.status) {
                navigate(-1);
                toast.success(response.message);
            } else {
                toast.error(response?.message || "Failed to save permissions.");
            }
        } catch (error) {
            console.error("Error saving permissions:", error);
            toast.error("An error occurred while saving permissions.");
        }
    };

    const columnsData = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            sortable: true,
            width: '60px'
        },
        {
            name: 'Group Name',
            selector: row => row.group_name,
            sortable: true,
            width: '180px'
        },
        {
            name: 'Page Name',
            selector: row => row.page_name,
            width: '150px'
        },
        {
            name: 'Page URL',
            selector: row => row.page_url,
            width: '200px'
        },
        {
            name: 'Page Description',
            selector: row => row.page_small_discription,
            width: '250px'
        },
        {
            name: 'Permission',
            width: '165px',
            cell: (row, index) => {
                // Use the permissions state for the checkbox values
                const perm = permissions[index] || {};
                return (
                    <div className='flex flex-row gap-4'>
                        <div>
                            <input
                                type="checkbox"
                                id={`set_permission-${index}`}
                                checked={perm.set_permission_access || false}
                                disabled={!permission}
                                onChange={(e) => handlePermissionChange(index, "set_permission_access", e.target.checked)}
                            />
                            <label htmlFor={`set_permission-${index}`} className="ml-1">Read</label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id={`read_write-${index}`}
                                checked={(perm.set_permission_access && perm.read_write_permission) || false}
                                onChange={(e) => handlePermissionChange(index, "read_write_permission", e.target.checked)}
                                disabled={!perm.set_permission_access}
                            />
                            <label htmlFor={`read_write-${index}`} className="ml-1">Write</label>
                        </div>
                    </div>
                );
            },
            sortable: false
        }
    ];

    return (
        <>
            <Helmet>
                <title>Page Permission</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>

            {Array.isArray(tableData) && tableData.length > 0 ? (
                <div className='flex justify-center items-center'>
                    <div className='w-full xl:w-10/12 mt-8'>
                        <Table columns={columnsData} data={tableData} title="Page Permission" />

                        <div className='flex justify-center items-center py-5'>
                            {permission && (
                                <Button
                                    btnName={"Save Permission"}
                                    btnIcon="RiUserSettingsLine"
                                    style={"bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"}
                                    type={"button"}
                                    onClick={handleSave}
                                />
                            )}

                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <p>No data available</p>
                </div>
            )}
        </>
    );
};

export default PagePermission;
import { useState } from "react";
import { toast } from "react-toastify";
import LinkBtn from "../../components/utils/LinkBtn";
import Table from "../../components/Table";
import { GetPagePermission } from "../../api/ApiFunction";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Helmet } from "react-helmet";
import LoginPageFinder from "../../components/utils/LoginPageFinder";

function ManageURL() {


    const [urlData, setUrlData] = useState([]);
    const { adminUser } = useAuth();

    const pageAccess = LoginPageFinder('page_display_name', 'manage page');
    const permission = pageAccess?.[0].read_write_permission;

    useEffect(() => {
        const fetchData = async () => {
            const req = {
                emp_code: adminUser.emp_code,
                login_user: adminUser.emp_code
            }
            try {
                const response = await GetPagePermission(req);
                // console.log("API Response:", response);
                if (response.status) {
                    const data = response.getPermissions;
                    setUrlData(data);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data.");
            }
        };

        fetchData();
    }, []);


    const columnsData = [

        {
            name: 'Id',
            selector: row => row.page_id,
            sortable: true,
            width: '70px'
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
            sortable: true,
            width: '180px'
        },
        {
            name: 'Page URL',
            selector: row => row.page_url,
        },
        {
            name: 'Description',
            selector: row => row.page_small_discription,
            sortable: true,
            width: '350px'
        }
    ];

    return (
        <>
            <Helmet>
                <title>Manage Page URL</title>
                <meta name="Leads Verification" content="Leads Verification" />
            </Helmet>
            <div className="border border-gray-200 shadow px-5 py-2 mb-5 bg-blue-50 rounded">
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="flex flex-col justify-start">
                        <h1 className="text-lg font-bold text-black">Manage Page URL</h1>
                        <p className="text-xs font-light text-secondary">Manage Add & Modify URLs</p>
                    </div>
                    <div className="flex justify-end py-2 gap-5">
                        {permission && (
                            <>
                                <LinkBtn
                                    linkUrl={"/admin/add-group"}
                                    icon={"MdOutlineAdd"}
                                    linkName={"Add Group"}
                                    linkIcon={"MdOutlineAdd"}
                                    className={"bg-primary text-white"}
                                />
                                <LinkBtn
                                    linkUrl={"/admin/add-page-url"}
                                    icon={"MdOutlineAdd"}
                                    linkName={"Add Page URL"}
                                    linkIcon={"MdOutlineAdd"}
                                    className={"bg-primary text-white"}
                                />
                            </>
                        )}

                    </div>
                </div>
            </div>

            {Array.isArray(urlData) && urlData.length > 0 ? (
                <div className='mt-8 w-full'>
                    <div className=''>
                        <Table columns={columnsData} data={urlData} title="Page URLs" />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p>No data available</p>
                </div>
            )}
        </>
    )
}
export default ManageURL
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from "../utils/Icon";
import Images from "../content/Images";
import { Dropdown } from '../utils/DropdownItem';
import { notifyItems } from "../content/Data";
import { useAuth } from '../../context/AuthContext';
import Modal from '../utils/Modal';
import Button from '../utils/Button';





function Navbar({ isOpen, toggleSidebar }) {


    const [isProfileOpen, setProfileOpen] = useState(false);
    const { adminUser, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');



    const loggedInUser = [
        { label: "Full Name", value: `${adminUser?.firstname} ${adminUser?.lastname}`, className: "text-gray-500" },
        { label: "Employee Code", value: `${adminUser?.emp_code}`, className: "text-gray-500" },
        { label: "Department", value: `${adminUser?.dept_name}`, className: "text-gray-500" },
        { label: "Designation", value: `${adminUser?.desi_name}`, className: "text-gray-500" },
        { label: "Role", value: `${adminUser?.role}`, className: "text-gray-500" },

    ];

    return (
        <>
            {/* Navbar Header */}
            <div className="mx-auto h-[58px] w-full bg-white flex items-center z-50 sticky top-0 shadow-lg">
                <div className="flex justify-between items-center mx-10 max-md:mx-0 w-full">
                    {/* Left Column */}
                    <div className="px-4">
                        <div className="flex items-center">
                            <button className='text-primary' onClick={toggleSidebar}>
                                <Icon name="IoMenu" size={26} />
                            </button>
                            <Link to="/" className='lg:flex hidden ml-5'>
                                {/* <img src={Images.logo} alt="Logo" className="h-8 w-8 ml-10" /> */}
                                <span className="text-lg font-bold text-white border bg-primary border-primary rounded-full w-10 h-10 flex items-center justify-center shadow-md">EW</span>
                                <span className="text-lg font-bold ml-2 my-1.5 text-primary">CRM: EarlyWages</span>
                            </Link>
                        </div>
                    </div>

                    {/* Middle Column */}
                    {/* <div className="w-full md:w-6/12 px-4"> */}
                        {/* <div className="w-8/12">
                            <SearchBox
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search Here..."
                                onSearch={handleSearch}
                                style={'bg-primary p-[8px] px-4 hover:bg-secondary'}
                            />
                        </div> */}
                    {/* </div> */}

                    {/* Right Column */}
                    <div className="px-4">
                        <div className="flex items-center justify-end">
                            {/* Notifications Dropdown */}
                            <Dropdown items={notifyItems} size="w-72" heading="Notifications">
                                <div className="text-primary">
                                    <Icon name="IoNotifications" size={22} />
                                </div>
                            </Dropdown>

                            {/* Profile Dropdown */}
                            <Dropdown
                                items={[
                                    {
                                        onClick: () => setProfileOpen(!isProfileOpen),
                                        label: 'Profile',
                                        icon: <Icon name="MdPermIdentity" size={18} />,
                                    },
                                    {
                                        onClick: () => logout("USER"),
                                        label: 'Logout',
                                        icon: <Icon name="MdOutlinePowerSettingsNew" size={18} />,
                                    }
                                ]}
                                size="w-48"
                                heading={adminUser?.firstname + " " + adminUser?.lastname}
                            >
                                <div className="h-10 w-10 rounded-full bg-white shadow-sm overflow-hidden">
                                    {adminUser?.firstname?.[0] ? (
                                        <span className="bg-primary/10 text-primary h-10 w-10 flex items-center justify-center rounded-full text-xl font-bold">
                                            {adminUser.firstname[0].toUpperCase() + adminUser.lastname[0].toUpperCase()}
                                        </span>
                                    ) : (
                                        <span className="bg-gray-200 text-gray-500 h-10 w-10 flex items-center justify-center rounded-full text-xl font-bold">
                                            ?
                                        </span>
                                    )}
                                </div>

                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>


            {/* Approve Modal */}
            <Modal
                isOpen={isProfileOpen}
                onClose={() => setProfileOpen(false)}
                heading="User's Profile"
            >
                {/* <div className="border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">User's Profile</h2>
                </div> */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 md:px-5">
                    {loggedInUser.map((item, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 ${index < 8 ? '' : ''} ${(index + 1) % 4 !== 0 ? '' : ''}`}
                        >
                            <p className={`text-sm text-gray-800 font-bold ${item.className} mb-1`}>{item.label}</p>
                            <p className=" text-primary py-1 px-4">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200" />

                <div className="flex justify-end gap-5">
                    <Button
                        btnName="Close"
                        btnIcon="IoCloseCircleOutline"
                        onClick={() => setProfileOpen(false)}
                        style="mt-5 border border-red-500 text-red-500 min-w-32"
                    />
                </div>

            </Modal >
        </>
    );
}

export default Navbar;

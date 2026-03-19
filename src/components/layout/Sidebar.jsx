import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Navbar from "../layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import Icon from "../utils/Icon";
import { Button } from "@headlessui/react";
import BackButton from "../utils/BackButton";

const dropdownVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { opacity: { duration: 0.2 }, height: { duration: 0.3 } },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { opacity: { duration: 0.3 }, height: { duration: 0.3 } },
  },
};

// Helper function to convert loginGroupNames to menuItem structure
const generateMenuFromGroups = (loginGroupNames = []) => {
  return loginGroupNames.map((group, idx) => ({
    name: group.group_display_name,
    icon: <Icon name={group.group_icon || "RiFolderLine"} size={20} />,
    index: idx,
    menuItems: group.loginpageNames.map((page) => ({
      name: page.page_display_name,
      path: page.page_url,
      icon: <Icon name="RiAlbumLine" size={10} />,
    })),
  }));
};

function Dropdown({
  route,
  isOpen,
  activePath,
  setActivePath,
  openDropdowns,
  toggleDropdown,
  setIsOpen
}) {
  const navigate = useNavigate();

  const handleClick = (path) => {
    setActivePath(path);
    navigate(path);

     if (window.innerWidth <= 767) {
      setIsOpen(false);
    }else{
      setIsOpen(true)
    }
  };

  const isDropdownOpen = (index) => openDropdowns.includes(index);

  const toggleDropdownIndex = (index) => {
    if (isDropdownOpen(index)) {
      toggleDropdown(openDropdowns.filter((i) => i !== index));
    } else {
      toggleDropdown([...openDropdowns, index]);
    }
  };

  return (
    <div>
      <div
        className={`group flex capitalize items-center px-2 py-[5px] my-2 rounded-lg cursor-pointer hover:bg-primary ${
          isDropdownOpen(route.index) ? "bg-primary text-white" : ""
        }`}
        onClick={() => toggleDropdownIndex(route.index)}
      >
        <div
          className={`mr-4 ${
            isDropdownOpen(route.index) ? "text-white" : "text-primary"
          } group-hover:text-white`}
        >
          {route.icon}
        </div>
        <div
          className={`text-sm flex-1 ${!isOpen && "hidden"} ${
            isDropdownOpen(route.index) ? "text-white" : "text-black"
          } group-hover:text-white`}
        >
          {route.name}
        </div>
        {isOpen && (
          <div className="ml-auto group-hover:text-white">
            {isDropdownOpen(route.index) ? (
              <FaChevronUp size={12} />
            ) : (
              <FaChevronDown size={12} />
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isDropdownOpen(route.index) && isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="ml-8"
          >
            {route.menuItems.map((subRoute, index) => (
              <div
                key={index}
                className={`flex items-center capitalize px-2 my-[3px] py-[6px] rounded-sm cursor-pointer text-xs hover:bg-black hover:text-white ${
                  activePath === subRoute.path ? "bg-black text-white" : ""
                }`}
                onClick={() => handleClick(subRoute.path)}
              >
                <div
                  className={`mr-1 ${
                    activePath === subRoute.path ? "text-white" : "text-primary"
                  } hover:text-white`}
                >
                  {subRoute.icon}
                </div>
                <div
                  className={`text-sm ${
                    activePath === subRoute.path ? "text-white" : ""
                  }`}
                >
                  {subRoute.name}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({ children }) {
  const { adminUser } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activePath, setActivePath] = useState("/");
  const [openDropdowns, setOpenDropdowns] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = (path) => {
    setActivePath(path);
    navigate(path);    
  };
  const toggleDropdown = (newOpenDropdowns) =>
    setOpenDropdowns(newOpenDropdowns);

  const menuItems = generateMenuFromGroups(adminUser?.loginGroupNames || []);
  // const menuItems = menuItem;

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize(); // first render par run

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Navbar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="flex">
        <motion.div
          initial={{ width: isOpen || isHovered ? "250px" : "0px" }}
          animate={{ width: isHovered || isOpen ? "250px" : "0px" }}
          transition={{ ease: "easeIn", duration: 0.2 }}
          className={`min-h-[calc(100vh-40px)] overflow-y-auto bg-white p-4 mt-4 shadow-lg fixed left-0 top-[40px] bottom-0 ${isOpen ? "" : "hidden"}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.section>
            <div
              className={`group flex items-center px-2 py-[5px] my-2 whitespace-nowrap rounded-md cursor-pointer hover:bg-primary`}
              onClick={() => {navigate("/"), setIsOpen(!(window.innerWidth <= 767))}}
            >
              <div className="group flex items-center">
                <div className="mr-4 text-primary group-hover:text-white">
                  <Icon
                    name="RiDashboardLine"
                    size={20}
                    className="text-inherit"
                  />
                </div>
                <div
                  className={`${
                    !isOpen && "hidden"
                  } text-sm text-black group-hover:text-white`}
                >
                  Dashboard
                </div>
              </div>
            </div>

            {menuItems.map((route, index) =>
              route.menuItems ? (
                <Dropdown
                  key={index}
                  route={{ ...route, index }}
                  isOpen={isHovered || isOpen}
                  activePath={activePath}
                  setActivePath={setActivePath}
                  openDropdowns={openDropdowns}
                  toggleDropdown={toggleDropdown}
                  setIsOpen={setIsOpen}
                />
              ) : (
                <div
                  key={index}
                  className={`group flex items-center px-2 py-[5px] my-2 whitespace-nowrap rounded-md cursor-pointer hover:bg-primary ${
                    activePath === route.path
                      ? "text-white bg-primary"
                      : "text-primary"
                  }`}
                  onClick={() => handleClick(route.path)}
                >
                  <div
                    className={`mr-4 ${
                      activePath === route.path ? "text-white" : "text-primary"
                    } group-hover:text-white`}
                  >
                    {route.icon}
                  </div>
                  <div
                    className={`text-sm ${!(isHovered || isOpen) && "hidden"} ${
                      activePath === route.path ? "text-white" : "text-black"
                    } group-hover:text-white`}
                  >
                    {route.name}
                  </div>
                </div>
              ),
            )}
          </motion.section>
        </motion.div>
        <motion.main
          className={`overflow-hidden py-8 px-10 max-md:px-2 ${
            isHovered || isOpen ? "ml-[250px]" : "ml-[0px]"
          } w-full transition-all duration-300`}
        >
          <BackButton />
          {children}
        </motion.main>
      </div>
    </>
  );
}

export default Sidebar;

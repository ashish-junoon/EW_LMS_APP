import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const PrivateLayout = () => {
    return (
        <Sidebar>
            <Outlet />
        </Sidebar>
    );
};

export default PrivateLayout;
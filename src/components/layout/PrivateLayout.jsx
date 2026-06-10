import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const PrivateLayout = () => {
    return (
        <Sidebar>
            <Outlet />
            <div className="fixed bottom-0 right-0 text-center bg-gray-300 py-1.5 px-2 rounded-tl-md z-10">
                <p className="text-xs font-semibold text-gray-700">© 2026 Powered by LogicAI Tech.</p>
            </div>
        </Sidebar>
    );
};

export default PrivateLayout;
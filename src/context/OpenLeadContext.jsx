import React, { createContext, useContext, useState } from "react";
// import Loader from "../utils/Loader";

export const OpenLeadContext = createContext();

export const OpenLeadProvider = ({ children }) => {

    const [leadInfo, setLeadInfo] = useState({});


    // if (isLoading) {
    //     return <Loader msg="Please Wait..." />;
    // }

    return (
        <OpenLeadContext.Provider value={{ leadInfo, setLeadInfo }}>
            {children}
        </OpenLeadContext.Provider>
    );
};

export const useOpenLeadContext = () => useContext(OpenLeadContext);

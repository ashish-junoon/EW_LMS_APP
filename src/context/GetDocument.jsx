import { createContext, useContext, useEffect, useState } from "react";
import { getLeadDocuments } from "../api/ApiFunction";
import { useOpenLeadContext } from "./OpenLeadContext";

const GetDocContext = createContext();

export const GetDocProvider = ({ children }) => {
    const [documents, setDocuments] = useState({});
    const { leadInfo } = useOpenLeadContext();

    const getDocuments = async () => {
        if (!leadInfo?.user_id || !leadInfo?.lead_id) return;
        setDocuments({});
        try {
            const response = await getLeadDocuments({
                user_id: leadInfo.user_id,
                lead_id: leadInfo.lead_id
            });

            setDocuments(response || {});


        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    useEffect(() => {
        getDocuments();
    }, [leadInfo?.user_id, leadInfo?.lead_id]);

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <GetDocContext.Provider value={{ documents, setDocuments, getDocuments }}>
            {children}
        </GetDocContext.Provider>
    );
};

export const useGetDocument = () => useContext(GetDocContext);

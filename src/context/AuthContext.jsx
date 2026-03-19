import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

// Expiry times in milliseconds
const EXPIRY_TIME = 5 * 60 * 60 * 1000; // 5 hours if inactive
const EXTEND_TIME = 2 * 60 * 60 * 1000; // 2 hour if active


const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            const loginData = {
                user: { ...action.payload, isAuthenticated: true },
                expiry: Date.now() + EXPIRY_TIME,
            };
            localStorage.setItem("adminUser", JSON.stringify(loginData));
            return {
                ...state,
                adminUser: loginData.user,
                isAuthenticated: true,
            };
        case "LOGOUT":
            localStorage.removeItem("adminUser");
            return {
                ...state,
                adminUser: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const storedData = JSON.parse(localStorage.getItem("adminUser"));
    const isExpired = storedData && Date.now() > storedData.expiry;

    const [state, dispatch] = useReducer(authReducer, {
        adminUser: !isExpired ? storedData?.user : null,
        isAuthenticated: !isExpired && !!storedData?.user,
    });

    const login = (loginResponse) => {
        dispatch({ type: "LOGIN", payload: loginResponse });
    };

    const logout = useCallback(() => {
        dispatch({ type: "LOGOUT" });
    }, []);

    useEffect(() => {
        if (!state.isAuthenticated) return;

        const updateExpiry = () => {
            const stored = JSON.parse(localStorage.getItem("adminUser"));
            if (!stored) return;

            // Extend expiry
            stored.expiry = Date.now() + EXTEND_TIME;
            localStorage.setItem("adminUser", JSON.stringify(stored));
        };

        const checkExpiry = () => {
            const stored = JSON.parse(localStorage.getItem("adminUser"));
            if (!stored || Date.now() > stored.expiry) {
                logout();
                toast.warn("Session expired. Please login again.");
            }
        };

        const events = ["mousemove", "click", "keydown"];
        events.forEach((event) =>
            window.addEventListener(event, updateExpiry)
        );

        const interval = setInterval(checkExpiry, 30000); // Check every 30 seconds

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, updateExpiry)
            );
            clearInterval(interval);
        };
    }, [state.isAuthenticated, logout]);

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

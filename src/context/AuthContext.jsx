import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useState,
} from "react";
import { toast } from "react-toastify";
import { GetIPAdress, HandleLogoutEmployee } from "../api/ApiFunction";
import {
  osName,
  osVersion,
  browserName,
  browserVersion,
} from "react-device-detect";

const AuthContext = createContext();

// Expiry times in milliseconds
const EXPIRY_TIME = 5 * 60 * 60 * 1000; // 5 hours if inactive
const EXTEND_TIME = 2 * 60 * 60 * 1000; // 2 hour if active

let LogedInuser;
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const loginData = {
        user: { ...action.payload, isAuthenticated: true },
        expiry: Date.now() + EXPIRY_TIME,
      };
      LogedInuser = loginData;
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

  const logout = useCallback((logout_type) => {
    handleLogout(logout_type);
    dispatch({ type: "LOGOUT" });
  }, []);
  
  //--------------------------------a
  //   Logout Via API for Tracking
  //--------------------------------
  const handleLogout = async (type) => {
    const ipAddress = await GetIPAdress();
    
    let req = {
      emp_code: LogedInuser?.user?.emp_code || storedData?.user?.emp_code,
      logout_type: type,
      system_ip: ipAddress?.ip,
      device_info: browserName + " " + browserVersion,
      operating_system: osName + " " + osVersion,
      product_name: import.meta.env.VITE_PRODUCT_NAME,
      company_id: import.meta.env.VITE_COMPANY_ID,
    };
    
    try {
      const response = await HandleLogoutEmployee(req);
    //   if (response.status) {
    //     toast.success(response.message || "Logout Successfull");
    //   } else {
    //     toast.error("Something went wrong!");
    //   }
    } catch (error) {
      console.log("Error in Logout: ", error);
    }
  };

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
        logout("IDLE");
        toast.warn("Session expired. Please login again.");
      }
    };

    const events = ["mousemove", "click", "keydown"];
    events.forEach((event) => window.addEventListener(event, updateExpiry));

    const interval = setInterval(checkExpiry, 30000); // Check every 30 seconds

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateExpiry),
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

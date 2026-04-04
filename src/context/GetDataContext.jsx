import { createContext, useContext, useEffect, useState } from "react";
import {
  getDepartmentName,
  GetSectorType,
  GetSalaryDate,
  GetEmployedSince,
  GetDesignationName,
  GetBankList,
  GetCompanyBankAcount,
} from "../api/ApiFunction";

const GetDataContext = createContext();

export const GetDataProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [sector, setSector] = useState([]);
  const [salaryDate, setSalaryDate] = useState([]);
  const [employedSince, setEmployedSince] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [compayBankAcount, setCompayBankAcount] = useState([]);

  const getDepartments = async () => {
    try {
      const response = await getDepartmentName();
      setDepartments(response?.departments || []); // Ensure data is properly set
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const getSectorType = async () => {
    try {
      const response = await GetSectorType();
      setSector(response?.sector || []); // Ensure data is properly set
    } catch (error) {
      console.error("Error fetching SectorType:", error);
    }
  };

  const getSalaryDate = async () => {
    try {
      const response = await GetSalaryDate();
      setSalaryDate(response?.salary_Models || []); // Ensure data is properly set
    } catch (error) {
      console.error("Error fetching SalaryDate:", error);
    }
  };

  const getEmployedSince = async () => {
    try {
      const response = await GetEmployedSince();
      setEmployedSince(response?.employedSinces || []); // Ensure data is properly set
    } catch (error) {
      console.error("Error fetching EmployedSince:", error);
    }
  };

  const getDesignation = async () => {
    try {
      const response = await GetDesignationName();
      setDesignations(response?.designations || []); // Ensure data is properly set
    } catch (error) {
      console.error("Error fetching designation :", error);
    }
  };

  const getBankList = async () => {
    try {
      const response = await GetBankList();
      setBankList(response?.data || []); // Ensure data is properly set
    } catch (error) {
      console.error("Error fetching banklist:", error);
    }
  };

  const getCompanyBankAcount = async () => {
    try {
      const response = await GetCompanyBankAcount();
      setCompayBankAcount(response?.companyBankNames || []); // Ensure data is properly set
    } catch (error) {
      console.error("Error fetching company bank account:", error);
    }
  };

  useEffect(() => {
    getDepartments();
    getSectorType();
    getSalaryDate();
    getEmployedSince();
    getDesignation();
    getBankList();
    getCompanyBankAcount();
  }, []);

  return (
    <GetDataContext.Provider
      value={{
        departments,
        sector,
        salaryDate,
        employedSince,
        designations,
        bankList,
        compayBankAcount,
      }}
    >
      {children}
    </GetDataContext.Provider>
  );
};

export const useGetData = () => {
  return useContext(GetDataContext);
};

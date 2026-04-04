import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json", // Ensure JSON data is sent
    },
});

export const GetIPAdress = async () => {
    try {
        const response = await api.get(import.meta.env.VITE_GET_IP_URL);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//CRM Login
export const UserLogin = async (req) => {
    try {
        const response = await api.post("/Admin/LoginEmployee", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

export const HandleLogoutEmployee = async (req) => {
    try {
        const response = await api.post("/Admin/LogoutEmployee", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Logout error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};


// CRM get all leads
export const getAllLeads = async (req) => {
    try {
        const response = await api.post("/User/GetAllLeads", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get all leads error:", error.response?.data || error.message);
        throw error;
    }
};


// get all Ready For Disburse leads
export const getDisbursalReadyLeads = async (req) => {
    try {
        const response = await api.post("/Admin/GetReadyForDisburse", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get all leads error:", error.response?.data || error.message);
        throw error;
    }
};


// Approve Leads for Disburse
export const ApprovedReadyForDisburse = async (req) => {
    try {
        const response = await api.post("/Admin/ApprovedReadyForDisburse", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get all leads error:", error.response?.data || error.message);
        throw error;
    }
};

// CRM get all leads on Basis of Hold and UnHold
export const getAllLeadsHold = async (req) => {
    try {
        const response = await api.post("/User/GetAllLeads_Hold", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get all leads error:", error.response?.data || error.message);
        throw error;
    }
};

export const UpdateLeadHoldStatus = async (req) => {
    try {
        const response = await api.post("/User/UpdateLeadHoldStatus", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get all leads error:", error.response?.data || error.message);
        throw error;
    }
};


export const GetActiveLeads = async (req) => {
    try {
        const response = await api.post("/Admin/GetAllActiveloans_V1", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get active loan error:", error.response?.data || error.message);
        throw error;
    }
};

export const getLeadDetails = async (req) => {
    try {
        const response = await api.post("/User/GetleadDetails_V1", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get lead details error:", error.response?.data || error.message);
        throw error;
    }
};

//Incomplete Lead Form Details
export const getInCompleteLeadDetails = async (req) => {
    try {
        const response = await api.post("/User/GetIncompleteLeadDetails_V1", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get lead details error:", error.response?.data || error.message);
        throw error;
    }
};

// Admin API
export const ResubmitApp = async (req) => {
    try {
        const response = await api.post("/User/SendForReSubmission", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Resubmit app error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

export const UpdateUserApp = async (req) => {
    try {
        const response = await api.post("/User/UpdateUserDetail", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

export const UpdateIncompleteUserApp = async (req) => {
    try {
        const response = await api.post("/Admin/UpdateIncompleteUserDetail", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};


export const UpdateUserLead = async (req) => {
    try {
        const response = await api.post("/User/VerifiedLeadStep", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Lead error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};


//Assign Loan Products
export const AssignLoanProducts = async (req) => {
    try {
        const response = await api.post("/Product/InsertAssignProduct", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Assign loan products error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Update lead Disbursement
export const UpdateLeadDisbursement = async (req) => {
    try {
        const response = await api.post("/Product/UpdateDisburesement_V1", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update lead disbursement error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Add Department
export const AddDepartmentName = async (req) => {
    try {
        const response = await api.post("/Master/AddDepartment", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Add Department error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Get Department List
export const getDepartmentName = async () => {
    try {
        const response = await api.get("/Master/GetDepartment");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Department error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};


//Add Product
export const AddLoanProduct = async (req) => {
    try {
        const response = await api.post("/Product/AddProduct", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Add Product error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Get Product List
export const GetLoanProductList = async (req) => {
    try {
        const response = await api.get("/Product/GetProductList", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Product error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};


//Get Credit Score
export const ScoreFromExperian = async (req) => {
    try {
        const response = await api.post("/Experian/GetIndivisualCreditReport", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Credit Score error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Get Crdit Score from Transunion
export const ScoreFromTransunion = async (req) => {
    try {
        const response = await api.post("/Cibil/GetCibilReport", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Credit Score error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Credit Score
export const ScoreFromEquiFax = async (req) => {
    try {
        const response = await api.post("/EquiFax/GetEquiFaxIndivisualCreditReport", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Credit Score error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//get EMI schedule
export const GetEMISchedule = async (req) => {
    try {
        const response = await api.post("/Product/GetEmiSchedule_v1", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get EMI Schedule error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Add Page Group Name
export const AddPageGroupName = async (req) => {
    try {
        const response = await api.post("/Admin/AddPageGroup", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Add Page Group error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Update Department
export const UpdateDepartment = async (req) => {
    try {
        const response = await api.put("/Master/UpdateDepartment", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Department error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Add Designation
export const AddDesignationName = async (req) => {
    try {
        const response = await api.post("/Master/AddDesignation", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Add Designation error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Get Designation List
export const GetDesignationName = async () => {
    try {
        const response = await api.get("/Master/GetDesignation");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Designation error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Update Designation
export const UpdateDesignation = async (req) => {
    try {
        const response = await api.put("/Master/UpdateDesignation", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Designation error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Add Page Name
export const AddPageName = async (req) => {
    try {
        const response = await api.post("/Admin/AddPageName", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Add Page error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};


//Get Menu Group
export const GetPageGroup = async () => {
    try {
        const response = await api.get("/Admin/GetPageGroup");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Menu Group error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Get State & City
export const getStateCity = async (req) => {
    try {
        const response = await api.post("/Master/GetStatesCity", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get State & City error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Bank List
export const GetBankList = async () => {
    try {
        const response = await api.get("/EasebuzzIntegration/BankcodeList");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Bank List error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const AddUserBankInfo = async (req) => {
    try {
        const response = await api.post("/User/AddUserBankInfo", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Empolyee List error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const getbankCodeListByCode = async (req) => {
    try {
        const response = await api.get(`/EasebuzzIntegration/BankcodeListByCode?BankCode=${req}`);
        return response.data;
    } catch (error) {
        console.error("Bank Code List By Code:", error.response?.data || error.message);
        throw error;
    }
}

//Register eMandate Easebuzz
export const registerEMandateEaseBuze = async (req) => {
    try {
        const response = await api.post("/EasebuzzIntegration/CreateEMandateLink", req);
        return response.data;
    } catch (error) {
        console.error("Register eMandate:", error.response?.data || error.message);
        throw error;
    }
}

export const getEasebuzzBankName = async (req) => {
    try {
        const response = await api.get("/EasebuzzIntegration/BankcodeList", req);
        return response.data;
    } catch (error) {
        console.error("Get Bank Name error:", error.response?.data || error.message);
        throw error;
    }
};

//Get Employee List
export const GetEmployee = async (req) => {
    try {
        const response = await api.post("/Admin/GetEmployeeList", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Empolyee List error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Employee Detail
export const GetEmployeeDetail = async (req) => {
    try {
        const response = await api.post("/Admin/GetEmployeeDetails", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Empolyee Detail error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Sector List
export const GetSectorType = async () => {
    try {
        const response = await api.get("/Master/GetSectorType");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Sector error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Salary Date
export const GetSalaryDate = async () => {
    try {
        const response = await api.get("/Master/GetSalaryDate");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Salary Date error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Get Employed Since
export const GetEmployedSince = async () => {
    try {
        const response = await api.get("/Master/GetEmployedSince");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get EmployedSince error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Branch List
export const GetBranchList = async (req) => {
    try {
        const response = await api.post("/Admin/GetBranchList", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Branch List error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Add Branch
export const AddBranchName = async (req) => {
    try {
        const response = await api.post("/Admin/AddBranch", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Add Branch error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Update Branch
export const UpdateBranchDetails = async (req) => {
    try {
        const response = await api.post("/Admin/UpdateBranch", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Branch error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Page Permission
export const GetPagePermission = async (req) => {
    try {
        const response = await api.post("/Admin/GetPermission", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Page Permission error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Set Page Permission
export const SetPagePermission = async (req) => {
    try {
        const response = await api.post("/Admin/SetPermission", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Set Page Permission error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Update Loan Status method
export const UpdateLoanStatus = async (req) => {
    try {
        const response = await api.post("/Admin/ManualLoanCollection", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Loan Status error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Product status change
export const ProductStatusChange = async (req) => {
    try {
        const response = await api.post("/Product/ChangeProductStatus", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Product Status Change error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


//Pull NACH Payment
export const PullNACHPaymentEaseBuzz = async (req) => {
    try {
        const response = await api.post("/EasebuzzIntegration/PullPaymentUsingEMandate", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Pull NACH Payment error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Pull NACH Payment using one of multiple banks
export const PullPaymentUsingEaseBuzz = async (req) => {
    try {
        const response = await api.post("/Admin/ApplicantEmiCollectionRequest", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Pull NACH Payment error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Pull NACH Payment
export const PullNACHPayment = async (req) => {
    try {
        const response = await api.post("/PayProvider/PullPaymentUsingEMandate", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Pull NACH Payment error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const GetDashboardData = async (req) => {
    try {
        const response = await api.post("/Admin/Dashboard_V1", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Dashboard Data error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


//Get Applicant Documents
export const getLeadDocuments = async (req) => {
    try {
        const response = await api.post(`/User/GetUserDocuments?v=${Date.now()}`, req);
        return response.data;
    } catch (error) {
        console.error("Get Documents:", error.response?.data || error.message);
        throw error;
    }
}

//Add Lead Remarks
export const addRemark = async (req) => {
    try {
        const response = await api.post("/Admin/AddLeadHistory", req);
        return response.data;
    } catch (error) {
        console.error("Add Remark:", error.response?.data || error.message);
        throw error;
    }
}


//Add Payday Loan Products
export const AddPaydayLoanProducts = async (req) => {
    try {
        const response = await api.post("/Product/AddPayDayProduct", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Assign payday loan products error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
};

//Get Company Bank Account
export const GetCompanyBankAcount = async () => {
    try {
        const response = await api.get("/Master/GetCompanyBankName");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get CompanyBankAcount error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Register eMandate Easebuzz
export const GetMandateDetailsById = async (req) => {
    try {
        const response = await api.post("/EasebuzzIntegration/GetMandateDetailsById ", req);
        return response.data;
    } catch (error) {
        console.error("Register eMandate:", error.response?.data || error.message);
        throw error;
    }
}

//Add Company Bank Account
export const AddCompanyBankAcount = async (req) => {
    try {
        const response = await api.post("/Master/AddBankName", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Add CompanyBankAcount error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


//Verify Bank Details
export const VerifyBankDetails = async (req) => {
    try {
        const response = await api.post("/EasebuzzIntegration/VerifyBankAccountNumber", req); 
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Verify Bank Details error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Verify IFSC Details
export const VerifyIFSC = async (req) => {
    try {
        const response = await api.post("/EasebuzzIntegration/VerifyIFSCCode", req); 
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Verify IFSC Details error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Get Loan Documents
export const GetLoanDocuments = async (req) => {
    try {
        const response = await api.post("/Admin/ViewLoanDocuments", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Loan Documents error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


//Get Agreement Letter
export const GetAgreementLetter = async (req) => {
    try {
        const response = await api.post("/User/GetAgreementLetter", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Agreement Letter error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const GetUpdateLoanEMI = async (req) => {
    try {
        const response = await api.post("/Product/GetEmiScheduleByDate_V1", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Loan Documents error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


//Get Agreement Letter
export const GenerateAndSendNoc = async (req) => {
    try {
        const response = await api.post("/Admin/Send_NOC", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Generate and Send NOC Letter error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Upload Others Documents 
export const UploadOtherDocuments = async (req) => {
    try {
        const response = await api.post("/Admin/AddOtherDocuments", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Upload Other Documents error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const UploadOtherDocumentsVideo = async (formData) => {
  try {
    const response = await api.post("/Admin/AddOtherVideoKycDocuments", formData, {
      headers: {"Content-Type": "multipart/form-data",},
      maxContentLength: Infinity, maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    console.error("Upload Other Documents error:", error.response?.data || error.message);
    throw error;
  }
};

//Upload Credit Report
export const UploadCreditReport = async (req) => {
    try {
        const response = await api.post("/Admin/CibilManualUpdate", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Upload Credit Report error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Update Menual NACH
export const UpdateMenualNACH = async (req) => {
    try {
        const response = await api.post("/Admin/ENachManualUpdate", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Menual NACH Payment error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

//Update Menual EMI Payment
export const UpdateMenualEMIPayment = async (req) => {
    try {
        const response = await api.post("/Admin/ManualCollectionUpdate_V1", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Menual EMI Payment error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const BulkCollectionUpdate = async (req) => {
    try {
        const response = await api.post("/Admin/ManualBulkCollectionUpdate", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Menual EMI Payment error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }a
}

//Reloan Lead
export const ReloanLead = async (req) => {
    try {
        const response = await api.post("/ReLoan/ReLoanAddPayDayProduct", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Reloan Lead error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


//Wave Off Amount
export const WavedOffAmount = async (req) => {
    try {
        const response = await api.post("/Admin/WaiveOffCollection", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Waved Off amount error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const GetDisbursementReport = async (req) => {
    try {
        const response = await api.post("/Report/DisbursementReportData", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reports error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const GetRejectedReport = async (req) => {
    try {
        const response = await api.post("/Report/RejectionReportData", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reports error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const GetMasterReport = async (req) => {
    try {
        const response = await api.post("/Report/MasterReportData", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reports error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const GetRecoveryReport = async (req) => {
    try {
        const response = await api.post("/Report/RecoveryReportData", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reports error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


export const DynamicData = async (req) => {
    try {
        const response = await api.post("/Report/ReportDetail", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reports error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const CicReportingData = async (req) => {
    try {
        const response = await api.post("/Report/CICReport", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reports error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const DisbursmentCollectionReport = async (req) => {
    try {
        const response = await api.post("/Report/DisbursementCollectionCompeleteReport", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reports error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const ManualVerifyOTP = async (req) => {
    try {
        const response = await api.post("/Admin/ManualVerifyOTP", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Update Branch error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

/***********************************************
 * Funder APIs Call
 * ********************************************/
export const FunderUpsert = async (req) => {
    try {
        const response = await api.post("/Fund/FunderUpsert", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Funder error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


export const GetFunderList = async (req) => {
    try {
        const response = await api.post("/Fund/GetFunderList", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Funder error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


export const FundUpsert = async (req) => {
    try {
        const response = await api.post("/Fund/FundUpsert", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Funder error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const GetFunderDetails = async (req) => {
    try {
        const response = await api.post("/Fund/GetFunderDetails", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Funder error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const GetFundStatus = async (req) => {
    try {
        const response = await api.post("/Fund/FundStatus_Onfunderchanges", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Funder error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}


export const funderOption = async () => {
    try {
        const response = await api.post("/Fund/SelectFunders");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Funder error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const disbursalExport = async (req) => {
    try {
        const response = await api.post("/Report/PreDisbursementReportData", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reports error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const UpsertUser = async (req) => {
    try {
        const response = await api.post("/Admin/ManageEmployee", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Funder error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const LeadReloan = async (req) => {
    try {
        const response = await api.post("/ReLoan/ReLoan", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reloan error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const LeadReopen = async (req) => {
    try {
        const response = await api.post("/Admin/LeadReopen", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get Reloan error:", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const getIncomplete = async () => {
    try {
        const response = await api.post("Admin/IncompleteAndReopen");
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get incomplete error :", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const reuploadPic = async (req) => {
    try {
        const response = await api.post("Admin/RejectCustomerProfile", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get incomplete error :", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const reuploadVideoKyc = async (req) => {
    try {
        const response = await api.post("/Admin/RejectCustomerVideoKyc", req);
        return response.data; // Return the API response data
    } catch (error) {
        console.error("Get incomplete error :", error.response?.data || error.message);
        throw error; // Rethrow error to handle it in the calling function
    }
}

export const getLoanHistory = async (req) => {
    try {
        const response = await api.post("/Admin/LoanHistory", req);
        return response.data;
    } catch (error) {
        console.error("Loan History:", error.response?.data || error.message);
        throw error;
    }
}

export const getMandateHistory = async (req) => {
    try {
        const response = await api.post("/User/GetMandateHistory", req);
        return response.data;
    } catch (error) {
        console.error("Loan History:", error.response?.data || error.message);
        throw error;
    }
}
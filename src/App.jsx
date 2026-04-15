import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from './context/AuthContext';
import ProtectedRoutes from './routes/ProtectedRoute';

import Login from './Login';
import Dashboard from './admin/Dashboard';
import Leads from './pages/loan/Leads';
import LeadsQC from './pages/loan/LeadsVerify';
import CreditAssmnt from './pages/loan/CreditAssmt';
import LeadsKYC from './pages/loan/LeadsKYC';
import LeadForm from './pages/formPage/LeadForm';
import LeadQCForm from './pages/formPage/LeadQCForm';
import LeadCreditForm from './pages/formPage/LeadCreditForm';
import LeadKYCForm from './pages/formPage/LeadKYCForm';
import ManageDisbursal from './pages/loan/ManageDisbursal';
import ManageDisbursalForm from './pages/formPage/ManageDisbursalForm';
import ManageApp from './pages/loan/ManageApp';
import ManageAppForm from './pages/formPage/ManageAppForm';
import ManageLoan from './pages/loan/ManageLoan';
import ManageLoanForm from './pages/formPage/ManageLoanForm'
import ManageUser from './admin/tablePages/ManageUser';
import ManageDepartment from './admin/tablePages/ManageDepartment';
import ManageDesignation from './admin/tablePages/ManageDesignation';
import ManageURL from './admin/tablePages/ManageURL';
import ManageBranch from './admin/tablePages/ManageBranch';
import AddUrls from './admin/formPages/AddUrls';
import AddBranch from './admin/formPages/AddBranch';
import ManageProducts from './admin/tablePages/ManageProducts';
import AddProduct from './admin/formPages/AddProduct';
import AddGroup from './admin/formPages/AddGroup';
import ManageOverdue from './pages/loan/ManageOverdue';
import ManageDue from './pages/loan/ManageDue';
import EmployeeForm from './admin/formPages/EmployeeForm';
import UpdateBranch from './admin/formPages/UpdateBranch';
import PagePermission from './admin/permission/pagePermission';
import PrivateLayout from './components/layout/PrivateLayout';
import Reports from "./pages/loan/Reports";
import ManageAccount from "./admin/tablePages/ManageAccount";
import AddBankAccount from "./admin/formPages/AddBankAccount";
import EditLeads from "./pages/formPage/EditLeads";
import FundTracker from "./fund/FundTracker";
import ManageFunders from "./fund/ManageFunders";
import FunderTable from "./fund/FunderTable";
import DynamicReporting from "./pages/loan/DynamicReporting";
import AddUser from "./admin/formPages/AddUser";
import UpdateUser from "./admin/formPages/UpdateUser";
import IncompleteLead from "./pages/loan/IncompleteLead";
import CicReporting from "./pages/loan/CicReporting";
import DisbursementCollectionReport from "./pages/loan/DisbursementCollectionReport";
import IncompleteLeadForm from "./pages/formPage/IncompleteLeadForm";
import VerifyOtp from "./pages/formPage/VerifyOtp";
import FailurePage from "./pages/Response/FailurePage";
import DisbursalReady from "./pages/loan/DisbursalReady";
import LoanHistoryPage from "./pages/loan/LoanHistoryPage";
import EditCollection from "./pages/formPage/EditCollection";

function App() {
  const { adminUser } = useAuth();
  const isLoggedIn = adminUser?.status;
  const urlAccess = adminUser?.loginGroupNames || [];

  // Create a map of all possible routes and their components
  const routeComponents = {

    //  Menu URL Components
    "/": Dashboard,

    //Manage Leads
    "/manage-leads/incomplete-leads": IncompleteLead,
    "/manage-leads/new-leads": Leads,
    "/manage-leads/leads-verification": LeadsQC,
    "/manage-leads/credit-assessment": CreditAssmnt,
    "/manage-leads/leads-in-kyc": LeadsKYC,
    "/manage-leads/manage-disbursal": ManageDisbursal,
    // "/manage-leads/disbursal-leads": DisbursalReady,
    "/manage-leads/rejected-leads": ManageApp,
    "/reports/generate-report": Reports,
    // "/reports/dynamic-report": DynamicReporting,

    //Manage Loans
    "/manage-loans/accounts": ManageLoan,

    //Collection
    "/collection/dues": ManageDue,
    "/collection/overdues": ManageOverdue,

    //Admin
    "/admin/manage-users": ManageUser,
    "/admin/manage-accounts": ManageAccount,
    "/admin/manage-products": ManageProducts,
    "/admin/manage-department": ManageDepartment,
    "/admin/manage-designation": ManageDesignation,
    "/admin/manage-branch": ManageBranch,
    "/admin/verify-otp": VerifyOtp,
    


    //Administrator
    "/administrator/manage-page": ManageURL,
  };

  // Extract all allowed paths from urlAccess
  const getAllowedPaths = () => {
    const allowedPaths = new Set(['/']); // Always allow dashboard

    urlAccess.forEach(group => {
      group.loginpageNames.forEach(page => {
        if (page.read_permission_access) {
          allowedPaths.add(page.page_url);
        }
      });
    });

    return Array.from(allowedPaths);
  };

  const allowedPaths = getAllowedPaths();

  return (
    <Router>
      <Routes>
        {/* unauthorized guest routes */}
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {/* Protected routes */}
        {isLoggedIn && (
          <Route element={<ProtectedRoutes />}>
            <Route element={<PrivateLayout />}>
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/incomplete-leads" element={<IncompleteLead />} />

              <Route path="/new-lead/lead-details" element={<LeadForm />} />
              {/* <Route path="/manage-leads/disbursal-leads" element={<LeadForm />} /> */}
              <Route path="/lead/leads-incomplete" element={<IncompleteLeadForm />} />
              <Route path="/lead/lead-verify" element={<LeadQCForm />} />
              <Route path="/lead/assessment-details" element={<LeadCreditForm />} />
              <Route path="/lead/kyc-status" element={<LeadKYCForm />} />
              <Route path="/lead/disbursal-details" element={<ManageDisbursalForm />} />
              <Route path="/lead/rejected-application" element={<ManageAppForm />} />
              <Route path="/loan/loan-details" element={<ManageLoanForm />} />
              <Route path="/loan/loan-history" element={<LoanHistoryPage />} />

              {/* Admin Page Routes */}
              {/* <Route path="/admin/add-user" element={<AddUser />} /> */}
              {/* <Route path="/admin/employee" element={<EmployeeForm />} /> */}
              <Route path="/admin/add-user" element={<AddUser />} />
              <Route path="/admin/employee" element={<UpdateUser />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/add-group" element={<AddGroup />} />
              <Route path="/admin/add-page-url" element={<AddUrls />} />
              <Route path="/admin/add-branch" element={<AddBranch />} />
              <Route path="/admin/branch-details" element={<UpdateBranch />} />
              <Route path="/admin/add-bank-account" element={<AddBankAccount />} />
              <Route path="/admin/permission" element={<PagePermission />} />
              <Route path="admin/edit-applicant" element={<EditLeads />} />
              <Route path="admin/edit-collection" element={<EditCollection />} />
              {/* <Route path="admin/verify-otp" element={<VerifyOtp />} /> */}
              <Route path="/admin/fund-tracker" element={<FundTracker />} />
              <Route path="/admin/funders" element={<FunderTable />} />
              <Route path="/admin/manage-funder" element={<ManageFunders />} />

              {/* Temp Route */}
              <Route path="/reports/dynamic-report" element={<DynamicReporting />} />
              <Route path="/reports/cic-reporting" element={<CicReporting />} />
              <Route path="/reports/disbursement-report" element={<DisbursementCollectionReport />} />

              {/* <Route path="/lead/kyc-status/success" element={<FailurePage />} /> */}
              {/* <Route path="/lead/kyc-status/failure" element={<FailurePage />} /> */}
              {/* <Route path="/users/user-view" element={<Users />} /> */}

              {/* Will Remove it After Imolementation */}
              <Route path="/manage-leads/disbursal-leads" element={<DisbursalReady />} />


              {/* Dynamically generated routes based on permissions */}
              {allowedPaths.map(path => (
                <Route
                  key={path}
                  path={path}
                  element={React.createElement(routeComponents[path] || Dashboard)}
                />
              ))}

              {/* Catch-all for unauthorized paths */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
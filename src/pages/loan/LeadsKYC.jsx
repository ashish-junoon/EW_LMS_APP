import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { toast } from "react-toastify";
import DateInput from "../../components/fields/DateInput";
import SelectInput from "../../components/fields/SelectInput";
import Icon from "../../components/utils/Icon";
import { branchList } from "../../components/content/Data";
import Button from "../../components/utils/Button";
import FilterCard from "../../components/utils/FilterCard";
import { useNavigate } from "react-router-dom";
import { getAllLeads, getAllLeadsHold, UpdateLeadHoldStatus } from "../../api/ApiFunction";
import { Helmet } from "react-helmet";
import Loader from "../../components/utils/Loader";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import { maskData } from "../../components/utils/maskData";
import { useAuth } from "../../context/AuthContext";
import HoldAction from "../../components/utils/HoldAction";

const LeadsKYC = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnHold, setisOnHold] = useState(false);
  const navigate = useNavigate();

  const { adminUser } = useAuth();

  const pageAccess = LoginPageFinder("page_display_name", "leads in kyc");
  const permission = pageAccess?.[0].read_write_permission;
  const funder = adminUser.role === "Funder" ? true : false;

  // alert(JSON.stringify(pageAccess));

  const dateToday = new Date(new Date().setDate(new Date().getDate() - 0))
    .toISOString()
    .split("T")[0];
  const preTenDay = new Date(new Date().setDate(new Date().getDate() - 60))
    .toISOString()
    .split("T")[0];

  const fetchData = async () => {
    setIsLoading(true);
    const req = {
      status: "4",
      from_date: preTenDay,
      to_date: dateToday,
      branch: "",
      source: "",
      is_hold: isOnHold,
    };
    try {
      const response = await getAllLeadsHold(req);
      // console.log("API Response:", response); // Debug log

      if (response.status) {
        const transformedData = response.userleadlist.map((user, index) => ({
          ...user, // Keep all original fields
          serialNumber: index + 1, // Add a serial number if needed
        }));

        // console.log("Transformed Data:", transformedData); // Debug log
        setTableData(transformedData);
        setIsLoading(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [isOnHold]);

  const handleHoldStatus = async (leadid, userid) => {
    setIsLoading(true);
    console.log(leadid, userid);
    const req = {
      lead_id: leadid,
      user_id: userid,
      is_hold: !isOnHold,
      created_by: adminUser.emp_code,
    };

    try {
      const response = await UpdateLeadHoldStatus(req);
      if (response.status) {
        // toast.success("Hold Status Changed");
        toast.success(`Lead Status Changed to ${isOnHold ? "Unhold" : "Hold"}`);
      } else {
        toast.error(response.message);
      }
      setIsLoading(false);
      fetchData();
    } catch (error) {
      console.error("Error Updating Hold Status:", error);
      toast.error("An error occurred while Updating Hold Status.");
      setIsLoading(false);
    }
  };

  const handleFilterBtn = () => {
    toast.info("No filter available for this page.");
  };

  const columnsData = [
    {
      name: "Hold Lead",
      width: "100px",
      cell: (row) => (
        <button
          onClick={() => handleHoldStatus(row.lead_id, row.user_id)}
          className="font-bold text-[10px] border bg-blue-900 text-white border-primary px-2 py-0.5 rounded shadow-md italic"
        >
          {/* <Icon name="MdOutlineRemoveRedEye" size={21} /> */}
          {isOnHold ? "UnHold" : "Hold"}    
        </button>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
      button: "true",
    },
    {
      name: "Actions",
      // omit : isOnHold,
      cell: (row) => (
        <button
          onClick={() =>
            navigate("/lead/kyc-status", {
              state: { lead_id: row.lead_id, user_id: row.user_id, isOnHold:isOnHold },
            })
          }
          className="p-2 hover:text-secondary"
        >
          <Icon name="MdOutlineRemoveRedEye" size={21} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "User ID",
      selector: (row) => row.user_id,
      sortable: true,
      width: "95px",
    },
    {
      name: "Lead ID",
      selector: (row) => row.lead_id,
      sortable: true,
      width: "95px",
    },
    {
      name: "Lead Date",
      selector: (row) => row.created_date,
      sortable: true,
      width: "110px",
    },
    {
      name: "Full Name",
      selector: (row) => row.full_name,
      sortable: true,
      // width: '250px'
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
      width: "95px",
    },
    {
      name: "Mobile No",
      selector: (row) =>
        funder ? maskData(row.mobile_number, "mobile") : row.mobile_number,
      width: "110px",
    },
    {
      name: "Salary",
      selector: (row) => row.net_monthly_salary,
      width: "100px",
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
      width: "120px",
    },
    {
      name: "Category",
      selector: (row) => row.Category,
      sortable: true,
      width: "120px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "120px",
      cell: (row) => {
        if (row.is_e_kyc_done) {
          return (
            <span className="text-green-500 bg-green-100 font-bold text-[10px] border border-green-500 px-2 py-0.5 rounded-full shadow-md italic">
              Verified eKYC
            </span>
          );
        } else {
          return (
            <span className="text-orange-500 bg-yellow-100 font-bold text-[10px] border border-yellow-500 px-2 py-0.5 rounded-full shadow-md italicl">
              Pending eKYC
            </span>
          );
        }
      },
    },
    
  ];

  if (isLoading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Leads in eKYC</title>
        <meta name="Leads Verification" content="Leads Verification" />
      </Helmet>

      <HoldAction setisOnHold={setisOnHold} isOnHold={isOnHold} />

      <div className="mt-8">
        <Table
          columns={columnsData}
          data={tableData}
          title="Leads in eKYC"
          handleFilter={handleFilterBtn}
          exportable={permission}
          filename={`Leads_Kyc_${isOnHold ? "Hold" : "UnHold"}`}
        />
      </div>
    </>
  );
};

export default LeadsKYC;

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

const CreditAssmnt = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnHold, setisOnHold] = useState(false);
  const navigate = useNavigate();

  const { adminUser } = useAuth();

  const pageAccess = LoginPageFinder("page_display_name", "credit assessment");
  const permission = pageAccess?.[0].read_write_permission;
  const funder = adminUser.role === "Funder" ? true : false;

  const dateToday = new Date(new Date().setDate(new Date().getDate() - 0))
    .toISOString()
    .split("T")[0];
  const preTenDay = new Date(new Date().setDate(new Date().getDate() - 60))
    .toISOString()
    .split("T")[0];

  const fetchData = async () => {
    setIsLoading(true);
    const req = {
      status: "3",
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

  const columnsData = [
    {
      name: "Hold Lead",
      width: "100px",
      cell: (row) => (
        <button
          onClick={() => handleHoldStatus(row.lead_id, row.user_id)}
          className="font-bold text-[10px] border bg-primary text-white border-primary px-2 py-0.5 rounded shadow-md italic"
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
      width: "80px",
      // omit : isOnHold,
      cell: (row) => (
        <button
          onClick={() =>
            navigate("/lead/assessment-details", {
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
      name: "Lead ID",
      selector: (row) => row.lead_id,
      sortable: true,
      width: "95px",
    },
    {
      name: "Lead Date",
      selector: (row) => row.created_date,
      sortable: true,
      width: "120px",
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
      width: "100px",
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
      width: "100px",
      cell: (row) => {
        if (row.status.toString() === "3") {
          return (
            <span className="text-success font-bold text-[10px] border border-success px-2 py-0.5 rounded-full shadow-md italic">
              Verified
            </span>
          );
        } else {
          return (
            <span className="text-danger font-bold text-[10px] border border-danger px-2 py-0.5 rounded-full shadow-md italicl">
              N/A
            </span>
          );
        }
      },
    },
    
    {
      name: "Last Action",
      selector: (row) => row.last_action_date || "N/A",
      width: "150px",
    },
  ];

  const handleFilterBtn = () => {
    toast.info("No filter available for this page.");
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Credit Assessment </title>
        <meta name="New Leads" content="New Leads" />
      </Helmet>

      {/* Newly Added For Hold */}
      <HoldAction setisOnHold={setisOnHold} isOnHold={isOnHold} />

      <div className="mt-8">
        <Table
          columns={columnsData}
          data={tableData}
          title="Credit Assessment"
          handleFilter={handleFilterBtn}
          exportable={permission}
          filename={`Credit_Ass_${isOnHold ? "Hold" : "UnHold"}`}
        />
      </div>
    </>
  );
};

export default CreditAssmnt;

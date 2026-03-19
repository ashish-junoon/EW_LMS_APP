import { useState, useEffect } from "react";
import Table from "../../components/Table";
import { toast } from "react-toastify";
import Icon from "../../components/utils/Icon";
import { useNavigate } from "react-router-dom";
import { getAllLeads, getAllLeadsHold, UpdateLeadHoldStatus } from "../../api/ApiFunction";
import Loader from "../../components/utils/Loader";
import { Helmet } from "react-helmet";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import { maskData } from "../../components/utils/maskData";
import { useAuth } from "../../context/AuthContext";
import HoldAction from "../../components/utils/HoldAction";

const Leads = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterBtn, setFilterBtn] = useState();
  const [isOnHold, setisOnHold] = useState(false);
  const navigate = useNavigate();

  const { adminUser } = useAuth();

  const pageAccess = LoginPageFinder("page_display_name", "new leads");
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
      status: "1",
      from_date: preTenDay,
      to_date: dateToday,
      branch: "",
      source: "",
      is_hold: isOnHold,
    };
    try {
      const response = await getAllLeadsHold(req);

      if (response.status) {
        const transformedData = response.userleadlist.map((user, index) => ({
          ...user, // Keep all original fields
          serialNumber: index + 1, // Add a serial number if needed
        }));
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
      width: "100px",
      // omit : isOnHold,
      cell: (row) => (
        <button
          onClick={() =>
            navigate("/new-lead/lead-details", {
              state: { lead_id: row.lead_id, user_id: row.user_id, isOnHold:isOnHold },
            })
          }
          className="p-2 hover:text-secondary"
        >
          <Icon name="MdOutlineRemoveRedEye" size={21} />
        </button>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
      button: "true",
    },
    {
      name: "Lead ID",
      selector: (row) => row.lead_id,
      sortable: true,
      width: "100px",
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
      width: "120px",
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
      selector: (row) => row.Category, //Newly Added
      sortable: true,
      width: "120px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "100px",
      cell: (row) => {
        if (row.status.toString() === "1") {
          return (
            <span className="text-primary font-bold text-[10px] border border-primary px-2 py-0.5 rounded-full shadow-md italic">
              New Lead
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
        <title>New Leads</title>
        <meta name="New Leads" content="New Leads" />
      </Helmet>

      <HoldAction setisOnHold={setisOnHold} isOnHold={isOnHold} />

      <div className="mt-8">
        <Table
          columns={columnsData}
          data={tableData}
          title="New Leads"
          handleFilter={handleFilterBtn}
          exportable={permission}
          filename={`All_Leads_${isOnHold ? "Hold" : "UnHold"}`}
        />
      </div>
    </>
  );
};

export default Leads;

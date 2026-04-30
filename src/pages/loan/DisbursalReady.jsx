import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { toast } from "react-toastify";
import Icon from "../../components/utils/Icon";
import Button from "../../components/utils/Button";
import { useNavigate } from "react-router-dom";
import {
  getDisbursalReadyLeads,
  UpdateUserLead,
  ApprovedReadyForDisburse,
} from "../../api/ApiFunction";
import { Helmet } from "react-helmet";
import Loader from "../../components/utils/Loader";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/utils/Modal";

const DisbursalReady = () => {
  const [tableData, setTableData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isReadyOpen, setIsReadyOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [DisbursePage, setDisbursePage] = useState(24);
  const [userLocation, setUserLocation] = useState();
  const [leaddata, setleaddata] = useState(null);
  const [leadID, setleadID] = useState(null);

  const { adminUser } = useAuth();

  // Need to look at this this is not manage disbursal Page
  const pageAccess = LoginPageFinder("page_display_name", "manage disbursal");
  const permission = pageAccess?.[0].read_write_permission;
  const funder = adminUser.role === "Funder" ? true : false;
  const TotalDisbursingAmt = selectedRows.reduce(
    (sum, num) => sum + num?.disburesement_amount,
    0,
  );

  let TotalAmt = tableData.reduce((acc, item )=> item.disburesement_amount + acc, 0)

  // alert(JSON.stringify(adminUser));

  const dateToday = new Date(new Date().setDate(new Date().getDate() - 0))
    .toISOString()
    .split("T")[0];
  const preTenDay = new Date(new Date().setDate(new Date().getDate() - 60))
    .toISOString()
    .split("T")[0];

  const getUserLocation = () => {
    try {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;

          try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== "OK") {
              throw new Error("Geocoding failed");
            }

            const result = data.results[0];

            const getComponent = (type) =>
              result.address_components.find((c) => c.types.includes(type))
                ?.long_name || "";

            const userRequest = {
              latitude: String(result.geometry.location.lat),
              longitude: String(result.geometry.location.lng),
              geo_address: result.formatted_address || "",
              geo_state: getComponent("administrative_area_level_1"),
              geo_city:
                getComponent("locality") ||
                getComponent("administrative_area_level_2"),
              geo_pincode: getComponent("postal_code"),
            };

            // console.log("User Location:", userRequest);
            // 👉 setState(userRequest) or API call here
            setUserLocation(userRequest);
          } catch (error) {
            console.error(error);
            toast.error("Failed to fetch address details.");
          }
        },
        (error) => {
          console.error(error);
          toast.error("Location permission denied.");
        },
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching location.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleApproveYes = async () => {
    setIsReadyOpen(false);

    try {
      const response = await ApprovedReadyForDisburse(selectedRows);

      if (response.status) {
        toast.success(response.message || "Lead Approved for Disbursement.");
        fetchData();
        setDisbursePage(24);
        setSelectedRows([]);
      } else {
        toast.error(
          response.message || "Failed to Approve Lead for Disbursement!",
        );
      }
    } catch (error) {
      console.error("Failed to Approve Disbursal Leads");
      toast.error(error.message);
    }
  };

  const handleApproveNo = () => {
    setIsReadyOpen(false);
    setIsMoveOpen(false);
    // setSelectedRows([]);
    setleadID(false);
  };

  //Select Single lead
  const handleSelectRow = (e, row) => {
    if (e.target.checked) {
      const data = {
        ...userLocation,
        lead_id: row.lead_id,
        user_id: row.user_id,
        approved_by: adminUser?.emp_code,
        status: 25,
        disburesement_amount: row.disburesement_amount,
      };
      setSelectedRows((prev) => [...prev, data]);
    } else {
      setSelectedRows((prev) =>
        prev.filter((item) => item.lead_id !== row.lead_id),
      );
    }
    // console.log(selectedRows);
  };

  //Select All leads from checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const selected = tableData.map((row) => ({
        ...userLocation,
        lead_id: row.lead_id,
        user_id: row.user_id,
        approved_by: adminUser?.emp_code,
        status: 25,
        disburesement_amount: row.disburesement_amount,
      }));

      setSelectedRows(selected);
    } else {
      setSelectedRows([]);
    }

    // console.log(selectedRows);
  };

  const handleSigleSelect = (row) => {
    const data = {
      ...userLocation,
      lead_id: row.lead_id,
      user_id: row.user_id,
      approved_by: adminUser?.emp_code,
      status: 25,
      disburesement_amount: row.disburesement_amount,
    };
    setSelectedRows((prev) => [...prev, data]);
    // console.log(selectedRows);
  };

  const handleMoveYes = async () => {
    const payload = {
      lead_id: leadID,
      step_status: 24,
      is_prove: true,
      updated_by: adminUser?.emp_code,
      reason: "Moved for Disbursed From Failed Disbursal Leads",
      remarks:
        "Lead is moved for Ready for Disbursed from Failed Disbursing Leads.",
    };
    try {
      const response = await UpdateUserLead(payload);
      if (response.status) {
        toast.success(response.message);
        // navigate("/manage-leads/manage-disbursalready");
        setDisbursePage("24");
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);

    const req = {
      status: String(DisbursePage),
    };
    try {
      const response = await getDisbursalReadyLeads(req);

      if (response.status) {
        const transformedData = response.readyForDisburseDetails.map(
          (user, index) => ({
            ...user, // Keep all original fields
            serialNumber: index + 1, // Add a serial number if needed
          }),
        );

        // console.log("Transformed Data:", transformedData); // Debug log
        setTableData(transformedData);
        setleaddata(response);
        setIsLoading(false);
      } else {
        console.log(response.message);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // console.log(tableData);

    fetchData();
  }, [DisbursePage]);

  const handleFilterBtn = () => {
    toast.info("No filter available for this page.");
  };

  const handleFailedMessage = (data) => {
    setIsOpen(true)
    setErrorMsg(data?.failedmessage || "Bank Server Down")
  }

  if (isLoading) return <Loader />;

  const columnsData = [
    // {
    //   name: "Actions",
    //   omit : DisbursePage === 24,
    //   width: "100px",
    //   // omit : isOnHold,
    //   cell: (row) => (
    //     <button
    //       onClick={() =>
    //         navigate("/manage-leads/disbursal-leads", {
    //           state: {
    //             lead_id: row.lead_id,
    //             user_id: row.user_id,
    //             isOnHold: selectedRows,
    //           },
    //         })
    //       }
    //       className="p-2 hover:text-secondary"
    //     >
    //       <Icon name="MdOutlineRemoveRedEye" size={21} />
    //     </button>
    //   ),
    //   ignoreRowClick: true,
    //   allowoverflow: true,
    //   button: "true",
    // },
    {
      name: "Move for Disburse",
      omit: DisbursePage == 24 || DisbursePage == 27,
      width: "150px",
      cell: (row) => (
        <button
          disabled={selectedRows.length}
          onClick={() => {
            (setIsMoveOpen(true), setleadID(row?.lead_id));
          }}
          className="bg-primary font-bold border border-primary text-white text-[10px] px-2 py-0.5 rounded-md shadow-md italic flex items-center gap-1"
        >
          <Icon name="TiArrowBack" size={18} />
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
      width: "100px",
    },
    {
      name: "Lead ID",
      selector: (row) => row.lead_id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Repayment Date",
      selector: (row) => row.repayment_date,
      sortable: true,
      width: "150px",
    },
    {
      name: "Full Name",
      selector: (row) => row.full_name,
      sortable: true,
      // width: '250px'
    },
    {
      name: "Disbursment Amount",
      selector: (row) => <>₹{row.disburesement_amount.toFixed(2)}</>,
      sortable: true,
      width: "200px",
    },
    {
      name: "Bank Name",
      selector: (row) => row.bank_name,
      width: "200px",
    },
    {
      name: "Account No.",
      selector: (row) => row.account_number,
      sortable: true,
      width: "200px",
    },
    {
      name: "IFCS Code",
      selector: (row) => row.ifsc_code,
      sortable: true,
      width: "120px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "120px",
      cell: (row) => {
        if (row.status.toString() === "24") {
          return (
            <span className="text-yellow-500 font-bold text-[10px] border border-yellow-500 px-2 py-0.5 rounded-full shadow-md italic">
              Pending
            </span>
          );
        } else if (row.status.toString() === "26") {
          return (
            <span onClick={()=> handleFailedMessage(row)} className="text-red-500 font-bold text-[10px] border border-red-500 px-2 py-0.5 rounded-full shadow-md italicl">
              Refunded
            </span>
          );
        } else if (row.status.toString() === "25") {
          return (
            <span className="text-success font-bold text-[10px] border border-success px-2 py-0.5 rounded-full shadow-md italicl">
              Approved
            </span>
          );
        }
      },
    },
    {
      name: (
        <>
          <label className="cursor-pointer" htmlFor="all">
            SelectAll
          </label>
          <input
            type="checkbox"
            id="all"
            className="w-4 h-4 accent-green-600 cursor-pointer rounded ml-1"
            checked={
              tableData.length > 0 && selectedRows.length === tableData.length
            }
            onChange={(e) => handleSelectAll(e)}
          />
        </>
      ),
      omit: DisbursePage !== 24,
      cell: (row) => (
        <input
          type="checkbox"
          className="w-4 h-4 accent-green-600 cursor-pointer rounded"
          checked={selectedRows.some((item) => item.lead_id === row.lead_id)}
          onChange={(e) => handleSelectRow(e, row)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Action",
      omit: DisbursePage !== 24,
      cell: (row) => (
        <button
          disabled={selectedRows.length}
          onClick={() => {
            (setIsReadyOpen(true), handleSigleSelect(row));
          }}
          className={` ${selectedRows.length ? "bg-gray-200 text-gray-800 font-bold border border-gray-200" : "bg-success font-bold border border-success text-white"} text-[10px] px-2 py-0.5 rounded-md shadow-md italic flex items-center gap-1`}
        >
          <Icon name="RiSecurePaymentLine" size={18} />
          <span>Dirburse</span>
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  let Pages = [
    {
      id: 24,
      name: "Ready Leads",
      count: leaddata?.total_ready_lead,
    },
    {
      id: 25,
      name: "Approved Leads",
      count: leaddata?.total_approved_lead,
    },
    {
      id: 26,
      name: "Failed Leads",
      count: leaddata?.total_failed_lead,
    },
    {
      id: 27,
      name: "In Process",
      count: leaddata?.total_failed_lead,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Manage Disbursal Ready Leads</title>
        <meta name="Leads Verification" content="Leads Verification" />
      </Helmet>

      {/* Page Tab and Amount Section  */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {Pages?.map((page, index) => {
            return (
              <div key={index} className="relative">
                <button
                  onClick={() => setDisbursePage(page?.id)}
                  className={`text-base font-bold h-fit
                ${DisbursePage === page?.id ? "bg-primary" : "bg-primary/60"} 
              text-white px-3 py-0.5 rounded shadow-lg flex items-center gap-1`}
                >
                  {page?.name}
                </button>

                {DisbursePage !== page.id && (
                  <span className="absolute right-0 top-[-10px] bg-red-500 text-white font-bold text-xs w-[18px] h-[18px] flex justify-center align-center rounded-full">
                    {page?.count || 0}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        

        {/* Amount Card  */}
        {DisbursePage === 24 && (
          <div className="bg-white shadow-xl px-5 py-3 border border-gray-200 rounded-md border-l-2-blue-500">
            <p className="text-gray-500 font-semibold">
              Total Disbursing Amount :{" "}
              <span className="text-primary">
                ₹{TotalDisbursingAmt.toFixed(2) || 0.0}
              </span>
            </p>
            <hr className="bg-gray-500 my-2" />
            <p className="text-gray-500 font-semibold">
              Total Selected Leads :{" "}
              <span className="text-primary">{selectedRows.length}</span>
            </p>
          </div>
        )}

        {DisbursePage === 25 && (
          <div className="bg-white shadow-xl px-5 py-3 border border-gray-200 rounded-md border-l-2-blue-500">
            <p className="text-gray-500 font-semibold">
              Total Amount :{" "}
              <span className="text-primary">
                ₹{TotalAmt?.toFixed(2) || 0.0}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Table
          columns={columnsData}
          data={tableData}
          // csvData={disbursalData}
          // filename={"Pre-disbursal"}
          filename={`Disbursal-Ready-Leads`}
          title={
            (DisbursePage === 24 && `Disbursal Ready Leads`) ||
            (DisbursePage === 25 && `Disbursal Approved Leads`) ||
            (DisbursePage === 26 && `Disbursal Failed Leads`)
          }
          handleFilter={handleFilterBtn}
          exportable={permission}
        />
      </div>

      {DisbursePage === 24 && (
        <div className="mt-8 float-right">
          <button
            onClick={() => selectedRows.length > 0 && setIsReadyOpen(true)}
            className="text-white bg-primary font-bold text-[15px] border border-primary px-2 py-0.5 rounded-md shadow-md italic flex items-center gap-1"
          >
            Disburse Selected Profile {selectedRows.length}
          </button>
        </div>
      )}

      {/* Ready for disbursed Confirmation model  */}
      <Modal
        isOpen={isReadyOpen}
        onClose={() => {
          (setIsReadyOpen(false), handleApproveNo());
        }}
      >
        <div className="text-center font-semibold my-3">
          <h1>Are you sure you want to Disbursed ?</h1>
        </div>
        <div>
          {selectedRows?.map((item, index) => {
            return (
              <div
                key={index}
                className="border rounded-lg px-3 py-1 bg-slate-50 grid grid-cols-3 gap-4 text-xs mb-1"
              >
                <div>
                  <p className="text-gray-500">Lead Id</p>
                  <p className="font-semibold">{item.lead_id}</p>
                </div>

                <div>
                  <p className="text-gray-500">User Id</p>
                  <p className="font-semibold">{item.user_id}</p>
                </div>

                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-semibold">₹ {item.disburesement_amount}</p>
                </div>
              </div>
            );
          })}

          <div className="flex justify-self-end mt-2 font-semibold bg-slate-50 p-2 border w-fit rounded-md">
            Total Amount : {TotalDisbursingAmt.toFixed(2)}
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <Button
            btnName="Yes"
            btnIcon="IoCheckmarkCircleSharp"
            type="submit"
            onClick={handleApproveYes}
            style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
          />
          <Button
            btnName={"No"}
            btnIcon={"IoCloseCircleOutline"}
            type={"button"}
            onClick={handleApproveNo}
            style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
          />
        </div>
      </Modal>

      {/* Ready for disbursed Confirmation model  */}
      <Modal
        isOpen={isMoveOpen}
        onClose={() => {
          setIsMoveOpen(false);
        }}
      >
        <div className="text-center font-semibold my-3">
          <h1>Are you sure, you want to Move Lead?</h1>
        </div>

        <div className="flex justify-end gap-4 mt-2">
          <Button
            btnName="Yes"
            btnIcon="IoCheckmarkCircleSharp"
            type="submit"
            onClick={handleMoveYes}
            style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
          />
          <Button
            btnName={"No"}
            btnIcon={"IoCloseCircleOutline"}
            type={"button"}
            onClick={handleApproveNo}
            style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
          />
        </div>
      </Modal>


      {/* Failure Card Modal  */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setErrorMsg(null)
        }}
      >
        <div className="text-center font-semibold my-3">
          <h1>Hello, Disbursement Process has been failed due to <span className="text-red-500 font-bold">{errorMsg}</span>!</h1>
        </div>

        <div className="flex justify-end gap-4 mt-2">
          <Button
            btnName="Ok"
            btnIcon="IoCheckmarkCircleSharp"
            type="submit"
            onClick={()=> {setIsOpen(false), setErrorMsg(null)}}
            style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
          />
        </div>
      </Modal>
    </>
  );
};

export default DisbursalReady;

import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { toast } from "react-toastify";
import DateInput from "../../components/fields/DateInput";
import SelectInput from "../../components/fields/SelectInput";
import Icon from "../../components/utils/Icon";
import { addRemarkOptions, addRemarkOptionsNew, branchList } from "../../components/content/Data";
import Button from "../../components/utils/Button";
import FilterCard from "../../components/utils/FilterCard";
import { useNavigate } from "react-router-dom";
import {
  addRemark,
  getAllLeads,
  getAllLeadsHold,
  UpdateLeadHoldStatus,
} from "../../api/ApiFunction";
import { Helmet } from "react-helmet";
import Loader from "../../components/utils/Loader";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import { maskData } from "../../components/utils/maskData";
import { useAuth } from "../../context/AuthContext";
import HoldAction from "../../components/utils/HoldAction";
import Modal from "../../components/utils/Modal";
import { useFormik } from "formik";
import * as Yup from "yup"
import TextInput from "../../components/fields/TextInput";

const CreditAssmnt = () => {
  const [open, setOpen] = useState(false);
  const [data, setdata] = useState({ lead_id: "", user_id: "" });
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

  // const handleHoldStatus = async (leadid, userid) => {
  //   setIsLoading(true);
  //   console.log(leadid, userid);
  //   const req = {
  //     lead_id: leadid,
  //     user_id: userid,
  //     is_hold: !isOnHold,
  //     created_by: adminUser.emp_code,
  //   };

  //   try {
  //     const response = await UpdateLeadHoldStatus(req);
  //     if (response.status) {
  //       // toast.success("Hold Status Changed");
  //       toast.success(`Lead Status Changed to ${isOnHold ? "Unhold" : "Hold"}`);
  //     } else {
  //       toast.error(response.message);
  //     }
  //     setIsLoading(false);
  //     fetchData();
  //   } catch (error) {
  //     console.error("Error Updating Hold Status:", error);
  //     toast.error("An error occurred while Updating Hold Status.");
  //     setIsLoading(false);
  //   }
  // };

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

  const formik = useFormik({
    initialValues: {
      reason: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Select reason."),
      remarks: Yup.string().when("reason", {
        is: (reason) => reason !== "Interested",
        then: () =>
          Yup.string()
            .required("Remarks are required.")
            .min(10, "Remarks must be at least 10 characters."),
        otherwise: () => Yup.string().notRequired(),
      }),
    }),

    onSubmit: async (values) => {
      const req = {
        lead_id: data?.lead_id,
        reason: `Lead ${isOnHold ? "UnHolded" : "Holded"} : ${values.reason}`,
        remarks: values.remarks,
        process_by: adminUser.emp_code,
      };

      try {
        const response = await addRemark(req);
        if (response.status) {
          formik.resetForm();
          handleHoldStatus(data.lead_id, data.user_id);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error adding remark:", error);
        toast.error("An error occurred while adding remark.");
      } finally {
        setOpen(false);
      }
    },
  });

  const handleHoldStatusWithRemarks = (lead_id, user_id) => {
    setOpen(true);
    setdata({ lead_id: lead_id, user_id: user_id });
  };

  const columnsData = [
    {
      name: "Hold Lead",
      width: "100px",
      cell: (row) => (
        <button
          onClick={() => handleHoldStatusWithRemarks(row.lead_id, row.user_id)}
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
              state: {
                lead_id: row.lead_id,
                user_id: row.user_id,
                isOnHold: isOnHold,
              },
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

  function ErrorMsg({ error }) {
    return <p className="text-red-500 text-xs mt-1">{error}</p>;
  }

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

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        heading={"Add Remark"}
      >
        <div className="px-5">
          <form onSubmit={formik.handleSubmit} className="my-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <SelectInput
                  label="Select Reason"
                  placeholder="Select"
                  icon="RiDraftLine"
                  name="reason"
                  id="reason"
                  options={addRemarkOptionsNew}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.reason}
                />
                {formik.touched.reason && formik.errors.reason && (
                  <ErrorMsg error={formik.errors.reason} />
                )}
              </div>
              {formik.values.reason !== "Interested" && (
                <div className="col-span-2">
                  <TextInput
                    label="Remarks"
                    icon="IoPersonOutline"
                    placeholder="Write Remarks"
                    name="remarks"
                    maxLength={200}
                    id="remarks"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.remarks}
                  />
                  {formik.touched.remarks && formik.errors.remarks && (
                    <ErrorMsg error={formik.errors.remarks} />
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-2">
              <Button
                btnName="ADD REMARKS"
                btnIcon="IoCheckmarkCircleSharp"
                type="submit"
                style="min-w-[100px] md:w-auto text-xs font-semibold mt-4 py-1 px-4 border border-primary text-primary border hover:border-success hover:bg-success hover:text-white hover:font-bold italic"
              />

              <Button
                btnName={"CLOSE"}
                btnIcon={"IoCloseCircleOutline"}
                type={"button"}
                onClick={() => setOpen(false)}
                style="min-w-[100px] md:w-auto text-xs font-semibold mt-4 py-1 px-4 border border-primary text-primary border hover:border-amber-500 hover:bg-amber-500 hover:text-black hover:font-bold italic"
              />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreditAssmnt;

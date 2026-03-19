import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Table from "../../components/Table";
import { toast } from "react-toastify";
import Icon from "../../components/utils/Icon";
import { useNavigate } from "react-router-dom";
import { getIncomplete } from "../../api/ApiFunction";
import Loader from "../../components/utils/Loader";
import { Helmet } from "react-helmet";
import LoginPageFinder from "../../components/utils/LoginPageFinder";
import Modal from "../../components/utils/Modal";
import { useAuth } from "../../context/AuthContext";
import TextInput from "../../components/fields/TextInput";
import SelectInput from "../../components/fields/SelectInput";
import { rejectLead } from "../../components/content/Data";
import Button from "../../components/utils/Button";
import { UpdateUserLead } from "../../api/ApiFunction";

const IncompleteLead = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  const { adminUser } = useAuth();

  const pageAccess = LoginPageFinder("page_display_name", "new leads");
  const permission = pageAccess?.[0].read_write_permission;
  const funder = adminUser.role === "Funder" ? true : false;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getIncomplete();

        if (response.status) {
          setTableData(response.incompleteleads);
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

    fetchData();
  }, []);

  const columnsData = [
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleReject(row.user_id, row.lead_id)}
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
      name: "Manage Lead",
      width: "100px",
      cell: (row) => (
        <button
          onClick={() =>
            navigate("/lead/leads-incomplete", {
              state: { user_id: row.user_id },
            })
          }
          className="p-2 hover:text-secondary"
        >
          <Icon name="GrDocumentUpdate" size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
      button: "true",
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
      name: "Full Name",
      selector: (row) => row.full_name,
      sortable: true,
    },
    {
      name: "Mobile No",
      selector: (row) => row.mobile_number,
      width: "120px",
    },
    {
      name: "Email",
      selector: (row) => row.email_id,
      width: "200px",
    },
    {
      name: "Personal Info",
      selector: (row) => (row.lead_id ? "Yes" : "No"),
      width: "130px",
    },
    {
      name: "Employment Info",
      selector: (row) => (row.is_employment_info_fill ? "Yes" : "No"),
      width: "130px",
    },
    {
      name: "Address Info",
      selector: (row) => (row.is_address_info ? "Yes" : "No"),
      width: "120px",
    },
    {
      name: "KYC Info",
      selector: (row) => (row.is_kyc_info_fill ? "Yes" : "No"),
      width: "100px",
    },

    {
      name: "Guarantor/Nominee Verified",
      selector: (row) => (row.is_gurantor_nominee_verified ? "Yes" : "No"),
      width: "200px",
    },
    {
      name: "Bank Info",
      selector: (row) => (row.is_bank_info_fill ? "Yes" : "No"),
      width: "100px",
    },
    {
      name: "Lead Date",
      selector: (row) => row.created_date,
      width: "150px",
    },
  ];

  const formik = useFormik({
    initialValues: {
      reason: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Required"),
      remarks: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      const req = {
        lead_id: userInfo.leadId,
        step_status: 7, //Rejected status
        is_prove: false,
        updated_by: adminUser.emp_code,
        reason: formik.values.reason,
        remarks: formik.values.remarks,
      };

      try {
        const response = await UpdateUserLead(req);

        if (response.status) {
          toast.success(response.message);
          // window.location.reload();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      }
      setOpenRejcet(!openReject);
      // toast.success('Application Rejected');
    },
  });

  const handleReject = (userId, leadId) => {
    setUserInfo({ userId: userId, leadId: leadId });
    setIsRejected(true);
  };

  // handle Reject lead No button
  const handleRejectNo = () => {
    setIsRejected(false);
  };

  const handleFilterBtn = () => {
    toast.info("No filter available for this page.");
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Incomplete Leads </title>
        <meta name="New Leads" content="New Leads" />
      </Helmet>

      <div className="mt-8">
        <Table
          columns={columnsData}
          data={tableData}
          title="Incomplete Leads"
          handleFilter={handleFilterBtn}
          exportable={permission}
        />
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejected}
        onClose={() => setIsRejected(false)}
        heading={"Reject Lead"}
      >
        <div className="px-5">
          <form onSubmit={formik.handleSubmit} className="my-4">
            <div className="grid grid-cols-2 gap-4">
              {/* {JSON.stringify(userInfo)} */}
              <div className="col-span-2">
                <SelectInput
                  label="Rejection Reason"
                  placeholder="Select"
                  icon="MdOutlineSpeakerNotes"
                  name="reason"
                  id="reason"
                  options={rejectLead}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.reason}
                />
                {formik.touched.reason && formik.errors.reason && (
                  <ErrorMsg error={formik.errors.reason} />
                )}
              </div>
              <div className="col-span-2">
                <TextInput
                  label="Remarks"
                  icon="GoPencil"
                  placeholder="Write Remarks"
                  name="remarks"
                  id="remarks"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.remarks}
                />
                {formik.touched.remarks && formik.errors.remarks && (
                  <ErrorMsg error={formik.errors.remarks} />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <Button
                btnName="Reject"
                btnIcon="IoCheckmarkCircleSharp"
                type="submit"
                style="min-w-[80px] text-sm italic my-4 font-semibold md:w-auto py-1 border-success px-4 text-white bg-success border hover:border-success text-primary hover:bg-white hover:text-success hover:font-bold"
              />
              <Button
                btnName={"Cancel"}
                btnIcon={"IoCloseCircleOutline"}
                type={"button"}
                onClick={handleRejectNo}
                style="min-w-[80px] text-sm italic font-semibold md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-danger hover:text-danger hover:font-bold"
              />
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default IncompleteLead;

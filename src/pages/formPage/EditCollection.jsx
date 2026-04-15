import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AppCard from "../../components/form/AppCard";
import TextInput from "../../components/fields/TextInput";
import { getLeadDetails } from "../../api/ApiFunction";
import ErrorMsg from "../../components/utils/ErrorMsg";
import Loader from "../../components/utils/Loader";
import { useAuth } from "../../context/AuthContext";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import EditCollectionForm from "../../components/form/EditCollectionForm";
import EMISchedule from "../../components/utils/EMISchedule";
import ClosedCard from "../../components/utils/ClosedCard";

const EditCollection = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setLeadInfo } = useOpenLeadContext();
  const { adminUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userid = location?.state?.user_id;
  const leadid = location?.state?.lead_id;

  // ✅ safe access
  const loanid = userData?.selectedproduct?.[0]?.loan_id;

  const fetchData = async ({ UserId, leadId, clicked }) => {
    setIsLoading(true);

    const req = {
      lead_id: leadId,
      user_id: UserId,
      login_user: adminUser?.emp_code,
      permission: "w",
    };

    try {
      const response = await getLeadDetails(req);

      if (response?.status) {
        setUserData(response);
        setLeadInfo(response);

        if (clicked) {
          navigate("/admin/edit-collection", {
            state: { user_id: UserId, lead_id: leadId },
          });
        }
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const HandleRemoveState = () => {
    navigate(location.pathname, { replace: true, state: {} });

    // ✅ FIXED
    setUserData(null);
    setLeadInfo({});
  };

  const formik = useFormik({
    initialValues: {
      UserId: "",
      leadId: "",
    },
    validationSchema: Yup.object({
      UserId: Yup.string().required("UserId is required"),
      leadId: Yup.string().required("LeadId is required"),
    }),
    onSubmit: (values) => {
      fetchData({
        UserId: values.UserId,
        leadId: values.leadId,
        clicked: true,
      });
    },
  });

  // ✅ optimized dependency
  useEffect(() => {
    if (leadid && userid) {
      fetchData({ UserId: userid, leadId: leadid });
    }
  }, [leadid, userid]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>Edit Collection</title>
        <meta name="New Leads" content="New Leads" />
      </Helmet>

      {!userData && (
        <div className="bg-white p-4 shadow rounded mb-10">
          <h1 className="text-xl font-bold">Edit Collection</h1>

          <div className="mt-5 px-0 md:px-8 mb-5">
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                
                <div>
                  <TextInput
                    label="User ID"
                    icon="IoPersonOutline"
                    placeholder="Enter UserId"
                    name="UserId"
                    type="text"
                    maxLength={8}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.UserId}
                  />
                  {formik.touched.UserId && formik.errors.UserId && (
                    <ErrorMsg error={formik.errors.UserId} />
                  )}
                </div>

                <div>
                  <TextInput
                    label="Lead ID"
                    icon="IoPersonOutline"
                    placeholder="Enter LeadId"
                    name="leadId"
                    type="text"
                    maxLength={8}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.leadId}
                  />
                  {formik.touched.leadId && formik.errors.leadId && (
                    <ErrorMsg error={formik.errors.leadId} />
                  )}
                </div>

                <div className="max-md:col-span-2">
                  <button
                    className="bg-primary text-white py-1.5 px-4 rounded mt-6 w-full cursor-pointer hover:bg-primary/80"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Search"}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {userData !== null && (
        <>
          <button
            onClick={HandleRemoveState}
            className="bg-primary text-white font-semibold px-4 py-1 rounded-md flex w-fit items-center gap-1 block mb-2"
          >
            Back
          </button>

          <div>
            <AppCard />
          </div>

          <div className="mt-4"></div>

          <div>
            <EditCollectionForm fetchUserData={fetchData} data={userData} />
          </div>

          {userData?.lead_status === 6 ? (
            <EMISchedule
              hideincollection={true}
              data={userData}
              loan_Id={loanid}
            />
          ) : (
            <ClosedCard hideincollection={true} data={userData} />
          )}
        </>
      )}
    </>
  );
};

export default EditCollection;
import { useEffect, useState } from "react";
import { getMandateHistory } from "../../api/ApiFunction";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const MandateHistory = () => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setIsLoading] = useState(null);

  const location = useLocation();
  const lead_id = location?.state?.lead_id;
  // const user_id = location?.state?.user_id

  const fetchMandateHistory = async () => {
    const req = { lead_id: lead_id };
    // const req = {lead_id : "JRE6453"} // To test Only

    try {
      setIsLoading(true);
      const response = await getMandateHistory(req);

      if (response.status) {
        setHistoryData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMandateHistory();
  }, []);

  const LowerCaseConvert = (value) => {
    return value?.toLowerCase().trim().replaceAll(" ", "");
  };

  if (loading) {
    return <Loader />;
  }

  //   if (!historyData) {
  //     return <div className="text-center py-10">No data available</div>;
  //   }

  return (
    <>
      <div>
        <div>
          {historyData?.length > 0 ? (
            <div className="w-full mt-5 overflow-x-auto">
              <table className="min-w-max w-full border border-gray-300 bg-white shadow-md">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="border px-2 py-2 text-xs text-left">#</th>
                    <th className="border px-2 py-2 text-xs text-left">
                      Lead Id
                    </th>
                    <th className="border px-2 py-2 text-xs text-left">
                      Customer Name
                    </th>
                    <th className="border px-2 py-2 text-xs text-left">
                      Account Type
                    </th>
                    <th className="border px-2 py-2 text-xs text-left">
                      Bank Name
                    </th>
                    <th className="border px-2 py-2 text-xs text-left">
                      Account No.
                    </th>
                    <th className="border px-2 py-2 text-xs text-left">
                      IFSC Code
                    </th>
                    <th className="border px-2 py-2 text-xs text-left">
                      Mandate Id
                    </th>
                    <th className="border px-2 py-2 text-xs text-left">
                      Transaction Id
                    </th>
                    {/* <th className="border px-2 py-2 text-xs text-left">
                      Mandate Status
                    </th> */}
                    <th className="border px-2 py-2 text-xs text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyData?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="border px-2 py-1 text-xs">{index + 1}</td>
                      <td className="border px-2 py-1 text-xs">
                        {item?.lead_id}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {item?.customer_name}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {item?.account_type === 1 ? "Primary" : "Secondary"}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {item?.bank_name}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {item?.customer_account_number}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {item?.customer_ifsc}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {item?.mandate_id}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {item?.transaction_id}
                      </td>
                      {/* <td className="border px-2 py-1 text-xs">
                        <p
                          className={`${item?.is_e_nach_created ? "bg-success/40" : "bg-amber-200"} py-1 px-5 w-fit uppercase rounded-3xl font-semibold text-black m-auto`}
                        >
                          {item?.is_e_nach_created ? "True" : "False"}
                        </p>
                      </td> */}
                      <td className="border px-2 py-1 text-[10px]">
                        {/* <p className={`bg-green-300 py-1 px-5 w-fit uppercase rounded-3xl font-semibold text-black m-auto${
                            (LowerCaseConvert(item?.status) === "pending" && "bg-amber-100 text-amber-500") ||
                            (LowerCaseConvert(item?.status) === "initiate" && "bg-blue-100 text-blue-500") ||
                            (LowerCaseConvert(item?.status) === "pending" && "bg-success/20 text-success") ||
                            (LowerCaseConvert(item?.status) === "bounced" && "bg-success/20 text-success")
                            }`}> */}
                        <p
                          className={`bg-gray-300 py-1 px-5 w-fit uppercase rounded-3xl font-semibold text-black m-auto`}
                        >
                          {item?.status}
                        </p>
                      </td>
                      {/* <td className="border px-2 py-1 text-xs">
                        <button
                          onClick={() => handleShowCloseLead(item.loan_id)}
                          className="text-primary font-bold w-full"
                        >
                          View
                        </button>
                    </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full mt-5 overflow-x-auto">
              <h1 className="text-center">No History Found</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MandateHistory;

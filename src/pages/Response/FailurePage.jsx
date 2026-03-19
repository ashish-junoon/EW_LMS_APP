import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { GetMandateDetailsById } from "../../api/ApiFunction";
import Icon from "../../components/utils/Icon";

const EnachFailure = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(10);
  const [mandateDetails, setmandateDetails] = useState({});
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("id");
  const transactinType = searchParams.get("type");

  const formattedDateTime = mandateDetails?.created_at
    ? new Date(mandateDetails.created_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--";

  useEffect(() => {
    if (!transactionId || !transactinType) {
      navigate("/manage-leads/leads-in-kyc");
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
        navigate("/manage-leads/leads-in-kyc");
    }, 10000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, [navigate]);

  const GetMandateDetails = async () => {
    const req = {
      TransactionId: transactionId,
    };
    if (transactionId) {
      try {
        const response = await GetMandateDetailsById(req);
        if (response.status) {
          setmandateDetails(response?.data);
        } else {
          toast.error(response.message || "Something went wrong!");
        }
        // console.log(mandateDetails);
      } catch (error) {
        console.error("Error in GetMandateDetailsById", error);
      }
    }
  };

  const GetPaymentDetaisBy = async () => {
    const req = {
      TransactionId: transactionId,
    };
    if (transactionId) {
      try {
        const response = await GetMandateDetailsById(req);
        if (response.status) {
          setmandateDetails(response?.msg[0]);
        } else {
          toast.error(response.message || "Something went wrong!");
        }
        // console.log(mandateDetails);
      } catch (error) {
        console.error("Error in GetMandateDetailsById", error);
      }
    }
  };

  useEffect(() => {
      GetMandateDetails();
  }, []);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-red-50/10 via-white to-red-50/10 px-4">
      <div className="relative w-full max-w-[80%]">
        {/* glow */}
        {/* <div className="absolute -inset-1 border-2 border-red-500 blur-2xl rounded-3xl" /> */}

        <div className="relative bg-white/80 backdrop-blur-xl border-2 border-red-500 rounded-3xl shadow-xl p-5 text-center">
          {/* icon */}
          <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl shadow">
            ❌
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
              E-NACH Registration Failed
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            We couldn't complete your request. Please review the details below.
          </p>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
            <p className="text-red-600 font-medium text-sm flex items-center justify-center gap-2">
              <Icon name="FaStar" size="20" /> <span>Failure Reason: { mandateDetails?.response_meta?.description || "Unknown error" }</span>
            </p>
          </div>

          <div className="text-sm text-gray-600 space-y-1 mb-2">
            <p>
              <span className="font-semibold">Transaction ID:</span>{" "}
              {transactionId || "--"}
            </p>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            Unfortunately, Mandate registration could not be completed. Please try again.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Go Home
            </Link>

            <Link
              to="/manage-leads/leads-in-kyc"
              className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow hover:scale-[1.02] transition"
            >
              Retry E-Nach
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Redirecting in <b>{timer}</b> seconds…
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnachFailure;

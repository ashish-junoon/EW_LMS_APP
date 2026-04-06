// import { HiBadgeCheck, HiCurrencyRupee, HiIdentification, HiClock } from "react-icons/hi";
import dayjs from "dayjs";
import Icon from "./Icon";
import { useEffect, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  GenerateAndSendNoc,
  GetLoanDocuments,
  LeadReloan,
} from "../../api/ApiFunction";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

function ClosedCard({ data, hideincollection }) {
  const product = data?.selectedproduct?.[0];
  const isClosed = data?.lead_status === 10;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isReloan, setIsReloan] = useState(false);
  const [openApporve, setOpenApporve] = useState(false);
  const { adminUser } = useAuth();
  const [isNocsend, setIsNocSend] = useState(data?.is_noc_send)

  const GetAgreement = async () => {
    const req = {
      lead_id: data?.lead_id,
      user_id: data?.user_id,
      doc_type: "aggrement_letter",
      loan_id: product?.loan_id,
      lead_status: "C",
    };
    try {
      setIsLoading(true);
      const response = await GetLoanDocuments(req);

      if (response.status) {
        // Open in new tab
        const blob = new Blob([response.document], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const GetSanction = async () => {
    const req = {
      lead_id: data?.lead_id,
      user_id: data?.user_id,
      doc_type: "sanction_letter",
      loan_id: product?.loan_id,
      lead_status: "C",
    };

    try {
      setIsLoading(true);
      const response = await GetLoanDocuments(req);

      if (response.status) {
        // Open in new tab
        const blob = new Blob([response.document], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const GetCertificate = async () => {
    const req = {
      lead_id: data?.lead_id,
      user_id: data?.user_id,
      doc_type: "NOC_letter",
      loan_id: product?.loan_id,
      lead_status: "C",
    };

    try {
      setIsLoading(true);
      const response = await GetLoanDocuments(req);

      if (response.status) {
        // Open in new tab
        const blob = new Blob([response.document], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const GetDisbursal = async () => {
    const req = {
      lead_id: data?.lead_id,
      user_id: data?.user_id,
      doc_type: "disbursal_letter",
      loan_id: product?.loan_id,
      lead_status: "C",
    };

    try {
      setIsLoading(true);
      const response = await GetLoanDocuments(req);

      if (response.status) {
        // Open in new tab
        const blob = new Blob([response.document], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveYes = async () => {
    const req = {
      user_id: data.user_id,
      lead_id: data.lead_id,
      loan_id: product?.loan_id,
      created_by: adminUser.emp_code,
      company_id: import.meta.env.VITE_COMPANY_ID,
      product_name: import.meta.env.VITE_PRODUCT_NAME,
      reloan_type: "LMS",
    };

    const response = await LeadReloan(req);

    if (response.status) {
      setIsReloan(!isReloan);
      toast.success(response.message);
      navigate("/manage-loans/accounts");
    } else {
      setIsReloan(!isReloan);
      toast.error(response.message);
    }
  };

  // Logic for Sending NOC
  const HandleSendNOC = async () => {
    const req = {
      loan_id: product?.loan_id
    };
    try {
        setIsLoading(true)
        const response = await GenerateAndSendNoc(req);
        if (response.status) {
            toast.success(response.message);
            setIsNocSend(true)
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error Sending NOC data:", error);
      toast.error("An error occurred while Sending NOC.");
    } finally{
        setIsLoading(false)
    }
  };

  //handle Approve confirm No button
  const handleApproveNo = () => {
    setIsReloan(!isReloan);
  };

  return (
    <div className="w-full mx-auto font-sans mt-3">
      <div
        className={`relative rounded-2xl p-2 lg:p-6 transition-all duration-300 overflow-hidden
          ${
            isClosed
              ? "bg-gradient-to-br from-green-50 to-emerald-100/80 shadow-lg hover:shadow-green-200/60"
              : "bg-gradient-to-br from-gray-50 to-blue-50/70 shadow-lg hover:shadow-gray-200/60"
          }`}
      >
        {/* Decorative elements */}
        <div
          className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 
          ${isClosed ? "bg-green-400" : "bg-blue-400"}`}
        ></div>
        <div
          className={`absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-15 
          ${isClosed ? "bg-green-400" : "bg-blue-400"}`}
        ></div>

        <div className="relative z-10">
          <div className="flex lg:items-center max-lg:flex-col lg:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Icon
                name="HiBadgeCheck"
                size={20}
                color={isClosed ? "green" : "#3b82f6"}
              />
              Closed Credit Line Details
            </h2>
            {isClosed && !hideincollection && (
              <div className="flex gap-2">
                <button
                  disabled={isNocsend}
                  onClick={HandleSendNOC}
                  className={`text-base font-semibold ${ !isNocsend ? "bg-gradient-to-r from-blue-900 to-blue-600 text-white cursor-pointer" : "bg-gray-50 text-gray-500 cursor-not-allowed"} px-5 py-1 rounded-full shadow-lg flex items-center gap-1`}
                >
                  {isLoading ? "Sending NOC" : "Generate & Send NOC"}
                </button>
                <span className="text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  Closed
                </span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm">
              <span className="font-medium text-gray-600 flex items-center gap-1.5">
                <Icon name="HiIdentification" size={18} color="#8b5cf6" />
                Loan ID:
              </span>
              <span className="font-semibold text-gray-800">
                {product?.loan_id || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm">
              <span className="font-medium text-gray-600">Product Name:</span>
              <span className="font-semibold text-gray-800">
                {product?.product_name || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm">
              <span className="font-medium text-gray-600 flex items-center gap-1.5">
                <Icon name="HiCurrencyRupee" size={18} color="#16a34a" />
                Loan Amount:
              </span>
              <span className="font-semibold text-gray-800">
                ₹{" "}
                {product?.loan_amount
                  ? product.loan_amount.toLocaleString("en-IN")
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm">
              <span className="font-medium text-gray-600 flex items-center gap-1.5">
                <Icon name="HiClock" size={18} color="#3b82f6" />
                Tenure:
              </span>
              <span className="font-semibold text-gray-800">
                {product?.tenure || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm">
              <span className="font-medium text-gray-600">Loan Status:</span>
              <span>
                {isClosed ? (
                  <span className="text-green-600 font-semibold">Closed</span>
                ) : (
                  data?.lead_status || "N/A"
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm">
              <span className="font-medium text-gray-600 flex items-center gap-1.5">
                <Icon name="HiIdentification" size={18} color="#8b5cf6" />
                Repayment Date:
              </span>
              <span className="font-semibold text-gray-800">
                {product?.repayment_date}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm underline">
              <button
                className="flex items-center gap-1.5 font-medium text-blue-600"
                onClick={GetAgreement}
              >
                View Agreement
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm underline">
              <button
                className="flex items-center gap-1.5 font-medium text-blue-600"
                onClick={GetSanction}
              >
                View Sanction Letter
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm underline">
              <button
                className="flex items-center gap-1.5 font-medium text-blue-600"
                onClick={GetDisbursal}
              >
                View Disbursal Letter
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/70 shadow-sm underline">
              <button
                className="flex items-center gap-1.5 font-medium text-blue-600"
                onClick={GetCertificate}
              >
                No Objection Certificate
              </button>
            </div>
          </div>

          {!hideincollection && <div className="flex justify-end gap-5">
            <Button
              btnName={"Reloan"}
              btnIcon={"RiFileList3Line"}
              type={""}
              onClick={() => setIsReloan(!isReloan)}
              style="min-w-[150px] md:w-auto my-4 py-1 px-4 border border-primary text-primary hover:border-success hover:text-success hover:font-semibold"
            />
          </div>}
        </div>
      </div>

      {/* Reopen Model */}
      <Modal isOpen={isReloan} onClose={() => setIsReloan(false)}>
        <div className="text-center font-semibold">
          <h1>Are you sure? You want to reloan this lead.</h1>
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <Button
            btnName="Yes"
            btnIcon="IoCheckmarkCircleSharp"
            type="button"
            onClick={handleApproveYes}
            style="min-w-[80px] md:w-auto mt-4 py-1 px-4 border border-primary text-primary hover:border-success hover:bg-success hover:text-white hover:font-semibold"
          />
          <Button
            btnName={"No"}
            btnIcon={"IoCloseCircleOutline"}
            type={"button"}
            onClick={handleApproveNo}
            style="min-w-[80px] md:w-auto mt-4 py-0.5 px-4 border border-primary text-primary hover:border-dark hover:bg-dark hover:text-white hover:font-semibold"
          />
        </div>
      </Modal>
    </div>
  );
}

export default ClosedCard;

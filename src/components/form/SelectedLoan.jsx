import { useOpenLeadContext } from "../../context/OpenLeadContext";

function SelectedLoan() {
  const { leadInfo } = useOpenLeadContext();
  const data = leadInfo?.selectedproduct[0];

  const displayKeys = [
    "product_name",
    "product_code",
    "product_type",
    "loan_amount",
    "insurance_premium",
    "processing_fee_amount",
    "processing_fee",
    "interest_rate",
    "interest_type",
    "emi_amount",
    "total_gst_amount",
    "disburesement_amount",
    "tenure",
    "repayment_frequency",
    "otp_consent_verified",
  ];

  const formatKey = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  if (!data) return null;

  return (
    <div className="w-full mx-auto">
      <div className="w-full px-5 rounded-t font-semibold py-0.5 bg-primary text-white italic">
        Selected Loan Details
      </div>
      <div className="w-full border px-2 md:px-5 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {displayKeys.map((key) => (
            <div key={key} className="">
              <div className="text-xs text-gray-500 font-medium">
                {formatKey(key)}
              </div>
              <div className="text-sm font-semibold text-gray-800">
                {/* {typeof data[key] === "boolean"
                    ? data[key] ? "Yes" : "No"
                    :  data[key]?.toString()
                    } */}

                {typeof data[key] === "boolean"
                  ? data[key]
                    ? "Yes"
                    : "No"
                  : (key === "total_gst_amount" || key === "disburesement_amount")
                  ? Number(data[key]).toFixed(2)
                  : data[key]?.toString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectedLoan;

import { useOpenLeadContext } from "../../context/OpenLeadContext"
import Images from "../../components/content/Images"

function KYCStatusCard() {
    const { leadInfo } = useOpenLeadContext()

    const isDone =
        leadInfo?.selectedproduct?.[0]?.otp_consent_verified &&
        leadInfo?.is_e_kyc_done &&
        leadInfo?.is_e_nach_activate &&
        leadInfo?.is_loan_consent &&
        leadInfo?.video_kyc_verified

    const statusItems = [
        {
            label: "Lead Completed",
            status: !!leadInfo?.selfie_uploaded_verified && !!leadInfo?.email_otp_verified,
            doneText: "Yes",
        },
        {
            label: "Loan Applied",
            status: !!leadInfo?.selectedproduct?.[0]?.otp_consent_verified,
            doneText: "Done",
        },
        {
            label: "Video KYC Completed",
            status: !!leadInfo?.video_kyc_verified,
            doneText: "Yes",
        },
        {
            label: "Adhaar Verified",
            status: !!leadInfo?.aadhaar_verified,
            doneText: "Verified",
        },
        {
            label: "PAN Verified",
            status: !!leadInfo?.pan_verified,
            doneText: "Verified",
        },
        {
            label: "NACH Activated",
            status: !!leadInfo?.is_e_nach_activate,
            doneText: "Active",
        },
        {
            label: "Consent Verified",
            status: !!leadInfo?.is_loan_consent,
            doneText: "Agreed",
        },
    ]

    const StatusItem = ({ label, status, doneText }) => (
        <div className="flex flex-col justify-center items-center">
            <img src={status ? Images.verified : Images.inprocess} alt="kycStatus" className="max-md:w-[30px]"/>
            <div className="text-xs font-bold text-gray-500 my-2 text-center">{label}</div>
            <div
                className={`text-xs font-bold shadow py-0.5 px-4 md:mt-2 rounded ${status
                    ? "bg-green-200 text-green-500"
                    : "bg-yellow-50 text-yellow-400"
                    }`}
            >
                {/* {status ? doneText : "Pending"} */}
                {status ? "Yes" : "Pending"}
            </div>
        </div>
    )

    return (
        <div className="w-full mx-auto">
            <div
                className={`w-full px-5 rounded-t text-center font-semibold py-0.5 ${isDone ? "bg-green-200 text-green-500" : "bg-gray-300 text-black"
                    }`}
            >
                Applicant Action Status
            </div>
            <div
                className={`w-full lg:px-5 px-2 py-5 ${isDone ? "border-green-200" : "border-gray-300"
                    }`}
            >
                <div className="grid grid-cols-7 max-lg:grid-cols-5 max-lg:grid-cols-4 gap-4">
                    {statusItems.map((item, index) => (
                        <StatusItem
                            key={index}
                            label={item.label}
                            status={item.status}
                            doneText={item.doneText}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default KYCStatusCard

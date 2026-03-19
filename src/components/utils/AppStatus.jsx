import Icon from "../utils/Icon";

function AppStatus({ appStatus, rejectedStatus }) {
    const statusLabels = [
        appStatus > 0 ? "Lead Open" : "",
        appStatus > 1 ? "Reviewed" : "Review Pending",
        appStatus > 2 ? "Verified" : "Pending Verification",
        appStatus > 3 ? "Approved" : "Pending Assessment",
        appStatus > 4 ? "eKYC Approved" : "eKYC Pending",
        appStatus > 5 ? "Disbursed" : "Pending Disbursement",
    ];

    return (
        <div className="pe-10 border border-primary mb-5 shadow-md">
            <div className="flex justify-between items-center flex-wrap max-lg:space-y-2">
                <div className="bg-primary text-white font-bold text-xs px-4 py-1">Lead Status</div>
                {statusLabels.map((status, index) => (
                    <div key={index} className="flex items-center mx-2">
                        {appStatus >= index && <Icon name="MdVerified" size={18} color="green" />}
                        {appStatus < index && <Icon name="RiIndeterminateCircleLine" size={18} color="gray" />}
                        <span className={`ps-1 ${appStatus >= index ? "text-primary italic text-sm font-bold text-nowrap" : "text-dark"}`}>{status}</span>
                    </div>
                ))}
                {rejectedStatus && (
                    <div className="flex items-center">
                        <Icon name="MdError" size={20} color="red" />
                        <span className="ps-1 text-danger font-semibold">Rejected</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppStatus;
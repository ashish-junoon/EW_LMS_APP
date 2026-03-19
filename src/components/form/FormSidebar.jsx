import { useEffect, useState } from "react";
import { useGetDocument } from "../../context/GetDocument";
import Loader from "../utils/Loader";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { reuploadVideoKyc } from "../../api/ApiFunction";
import Modal from "../utils/Modal";
import Button from "../utils/Button";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function FormSidebar() {
  const [loading, setLoading] = useState(true);
  const [isApprove, setIsApprove] = useState(false);

  const { documents } = useGetDocument();
  const { leadInfo } = useOpenLeadContext();
  const { adminUser } = useAuth();
  

  const handleApproveYes = async () => {
    setIsApprove(false);
    const payload = {
        user_id: leadInfo?.user_id,
        rejected_by: adminUser?.emp_code,
        company_id: import.meta.env.VITE_COMPANY_ID,
        product_name: import.meta.env.VITE_PRODUCT_NAME
    };
    const res = await reuploadVideoKyc(payload);
    if (res.status) {
      toast.success(res.message);
      // reload page
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      toast.error(res.message);
    }
  };

  const handleApproveNo = () => {
    setIsApprove(false)
  }

  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const VideoKyc = documents?.others?.filter((item) =>
    Boolean(item?.other_document_type == "VideoKyc" && item?.status == "True"),
  );

  return (
    <>
    <div>
      {documents?.aadhaar_pan?.[0]?.pancard_data_url && !loading && (
        <div className="mb-5">
          <span className="font-semibold bg-slate-200 px-5 py-1">PAN Card</span>
          <div className="max-h-90">
            <img
              src={documents.aadhaar_pan[0].pancard_data_url}
              alt="PAN Card"
            />
          </div>
        </div>
      )}

      {documents?.aadhaar_pan?.[0]?.pancard_data_url && !loading && (
        <div className="mb-5">
          <span className="font-semibold bg-slate-200 px-5 py-1">
            Aadhar Card
          </span>
          <div className=" max-h-95 mb-5">
            <img
              src={documents.aadhaar_pan[0].aadhar_front_data_url}
              alt="Aadhaar Card Front"
            />
          </div>
          <div className="max-h-95">
            <img
              src={documents.aadhaar_pan[0].aadhar_back_data_url}
              alt="Aadhaar Card Back"
            />
          </div>
        </div>
      )}

      {leadInfo?.video_kyc_verified && !loading && (
        <>
          <div className="mb-1">
            <span className="font-semibold bg-slate-200 px-5 py-1">
              Video KYC
            </span>
            <div className="max-h-90">
              <video
                src={VideoKyc?.[0]?.other_document_code_url}
                controls
                alt="Video Kyc"
              />
            </div>
          </div>

          <div>
            {leadInfo?.lead_status === 4 && (
              <div className="">
                <button
                    onClick={() => setIsApprove(true)}
                //   onClick={handleApproveYes}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded text-xs font-semibold shadow"
                >
                  Reject Video Kyc
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Modal isOpen={isApprove} onClose={() => setIsApprove(false)}>
        <div className="text-center font-semibold my-3">
          <h1>Are you sure you want to reject this Video KYC?</h1>
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
    </div>
    </>
  );
}
export default FormSidebar;

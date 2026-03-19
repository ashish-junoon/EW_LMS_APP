import Card from "../utils/Card";
import Images from "../content/Images";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import Button from "../utils/Button";
import { useGetDocument } from "../../context/GetDocument";
import { maskData } from "../utils/maskData";
import { useAuth } from "../../context/AuthContext";
import Modal from "../utils/Modal";
import { reuploadPic } from "../../api/ApiFunction";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useRoutes } from "react-router-dom";

const AppCard = ({ data }) => {
  const { leadInfo } = useOpenLeadContext();
  const { documents } = useGetDocument();
  // console.log("document ", documents) 
  const location = useLocation();
  const gender = leadInfo?.personalInfo[0].gender === "Male" ? true : false;
  const creditScore = leadInfo?.cibilCreditScores?.[0]?.credit_score ?? null;
  const { adminUser } = useAuth();
  const [isApprove, setIsApprove] = useState(false);
  const [isMapOpen, setisMapOpen] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const funder = adminUser.role === "Funder" ? true : false;

  const applicantData = {
    applicantName: leadInfo?.personalInfo?.[0]?.full_name ?? "N/A",

    aadharNumber: funder
      ? maskData(leadInfo?.kycInfo?.[0]?.aadhaar_number ?? "", "aadhaar")
      : leadInfo?.kycInfo?.[0]?.aadhaar_number ?? "N/A",

    panNumber: funder
      ? maskData(leadInfo?.kycInfo?.[0]?.pan_card_number ?? "", "pan")
      : leadInfo?.kycInfo?.[0]?.pan_card_number ?? "N/A",

    userId: leadInfo?.user_id ?? "N/A",

    mobileNumber: funder
      ? maskData(leadInfo?.mobile_number ?? "", "mobile")
      : leadInfo?.mobile_number ?? "N/A",

    registeredOn: leadInfo?.created_date ?? "N/A",

    leadId: leadInfo?.lead_id ?? "N/A",

    referralCode: leadInfo?.employmentInfo?.[0]?.referral_code ?? "N/A",

    aadharVerified:
      leadInfo?.aadhaar_verified === true ? "Verified" : "Pending",

    panVerified: leadInfo?.pan_verified === true ? "Verified" : "Pending",

    creditScore: creditScore ?? "-",

    userStatus:
      leadInfo?.lead_status <= 5
        ? "In-Progress"
        : leadInfo?.lead_status === 6
          ? "Active"
          : "Closed",

    repaymentDate: leadInfo?.selectedproduct?.[0]?.repayment_date ?? "--",
    category: leadInfo?.is_reloan_fresh ?? "--",
  };

  const geodata = [
    // { key: "Adresss", value: leadInfo?.addressInfo?.[0]?.geo_address },
    { key: "City", value: data?.addressInfo?.[0]?.geo_city ? data?.addressInfo?.[0]?.geo_city : "N/A" },
    { key: "State", value: data?.addressInfo?.[0]?.geo_state ? data?.addressInfo?.[0]?.geo_state : "N/A" },
    { key: "Pin Code", value: data?.addressInfo?.[0]?.geo_pin_code ? data?.addressInfo?.[0]?.geo_pin_code : "N/A" },
    { key: "Latitude", value: data?.addressInfo?.[0]?.latitude ? data?.addressInfo?.[0]?.latitude : "N/A" },
    { key: "Longitude", value: data?.addressInfo?.[0]?.longitude ? data?.addressInfo?.[0]?.longitude : "N/A" },
  ];

  // alert(JSON.stringify(leadInfo?.lead_status));

  const handleApproveYes = async () => {
    setIsApprove(false);
    const payload = {
      user_id: leadInfo?.user_id,
    };
    const res = await reuploadPic(payload);
    if (res.status) {
      toast.success(res.message);
      // reload page
      window.location.reload();
    } else {
      toast.error(res.message);
    }
  };

  const handleApproveNo = () => {
    setIsApprove(false);
  };

  const handleShowMap = (geo) => {
    const { latitude, longitude } = geo[0];
    // {28.601454},${77.0294002}
    // const latitude = 28.601454;
    // const longitude = 77.0294002;
    setLatitude(latitude)
    setLongitude(longitude)
    setisMapOpen(true);
  };

  const capitalizeWords = (str) =>
    str
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <Card heading={"Lead Information"} style={"py-4"}>
      <div className="grid grid-cols-4 max-lg:grid-cols-1 max-lg:gap-10 border-b border-primary">
        <div className="col-span-1">
          <div className="h-48 w-48 max-md:w-full max-md:h-full m-auto">
            <img
              src={
                documents.profileImages?.[0]?.profile_image_code_url
                  ? `${documents.profileImages?.[0]?.profile_image_code_url}`
                  : gender
                    ? Images.maleAvatar
                    : Images.femaleAvatar
              }
              alt="Profile"
              className="w-full h-full rounded"
            />

            {leadInfo?.lead_status <= 3 && (
              <div className="">
                <button
                  onClick={() => setIsApprove(true)}
                  className="w-full bg-red-500 text-white py-1 max-md:py-2 px-4 rounded mt-2 md:text-xs text-sm font-semibold shadow"
                >
                  Reject Profile Image
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3 max-lg:col-span-1 gap-5">
          <div className="grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2a max-md:px-2 mb-5 gap-1">
            {Object.entries(applicantData).map(([key, value]) => (
              <div key={key} className="mt-2">
                <h5 className="text-base font-semibold">
                  {capitalizeWords(key)}
                </h5>
                <span className="text-sm capitalize text-primary italic font-semibold">
                  {value}
                </span>
              </div>
            ))}
            <div className="mt-2">
              <h5 className="text-sm font-semibold">Selfie Upload</h5>
              <p
                className={`text-sm font-semibold ${leadInfo?.selfie_uploaded_verified
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                {leadInfo?.selfie_uploaded_verified ? "Yes" : "Pending"}
              </p>
            </div>
            <div className="mt-2">
              <h5 className="text-sm font-semibold">Email Id</h5>
              <p
                className={`text-sm font-semibold ${leadInfo?.email_otp_verified
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                {leadInfo?.email_otp_verified ? "Verified" : "Pending"}
              </p>
            </div>
          </div>
          {/* Show Only in Lead kyc  */}
          {location.pathname == "/lead/kyc-status" && (
            <>
              <p className="font-bold border-t-2 w-[98%] pt-3 text-primary">
                Geo Location Info
              </p>
              <div className="mt-2">
                <h5 className="text-base font-semibold">Address</h5>
                <span className="text-sm capitalize text-primary italic font-semibold">
                  {data?.addressInfo[0]?.geo_address || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-3 mb-5 gap-1">
                {geodata &&
                  geodata.map((geo) => (
                    <div key={geo.key} className="mt-2">
                      <h5 className="text-base font-semibold">
                        {capitalizeWords(geo?.key)}
                      </h5>
                      <span className="text-sm capitalize text-primary italic font-semibold">
                        {geo?.value}
                      </span>
                    </div>
                  ))}
                <div className="mt-1">
                  <h5 className="text-sm font-semibold">Map Loaction</h5>
                  <button
                    onClick={() => handleShowMap(leadInfo?.addressInfo)}
                    className="text-sm capitalize text-primary italic font-semibold cursor-pointer"
                  >
                    View in Map
                  </button>
                </div>
              </div>

              {/* {
                leadInfo?.addressInfo[0]?.zip_code != leadInfo?.addressInfo[0]?.geo_pin_code 
                ?
                <div className="bg-red-100 w-[90%] my-5 px-2 py-1 border-l-[5px] border-l-red-500 text-red-500 font-semibold">
                  <p>Provided Pin Code {leadInfo?.addressInfo[0]?.zip_code} and Geo Pin Code {leadInfo?.addressInfo[0]?.geo_pin_code} does not match!</p>
                </div>
                :
                <div className="bg-green-100 w-[90%] my-5 px-2 py-1 border-l-[5px] border-l-green-500 text-green-500 font-semibold">
                  <p>Provided Pin Code {leadInfo?.addressInfo[0]?.zip_code} and Geo Pin Code {leadInfo?.addressInfo[0]?.geo_pin_code} Matched</p>
                </div>
              } */}
            </>
          )}
        </div>
      </div>
      <Modal isOpen={isApprove} onClose={() => setIsApprove(false)}>
        <div className="text-center font-semibold my-3">
          <h1>Are you sure you want to reject this profile?</h1>
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

      <Modal isOpen={isMapOpen} onClose={() => setisMapOpen(false)}>
        {(latitude && longitude) ?
          <iframe
            src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            title="Google Map"
          ></iframe>
          :
          <p className="py-5 text-center">Map Location is not Available for this Lead!</p>
        }
      </Modal>
    </Card>
  );
};

export default AppCard;

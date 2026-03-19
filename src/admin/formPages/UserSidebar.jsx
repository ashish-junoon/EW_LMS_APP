import Base64Viewer from "../../components/utils/Base64Viewer"
import Card from "../../components/utils/Card";
function UserSidebar({ data }) {


    return (
        <Card heading="Identity Proofs" style={" py-5"}>
            {data?.driving_liceance_img_data &&
                <div className="shadow-md mb-5">
                    <span className="font-semibold bg-slate-200 px-5 py-1">Driving Liceance</span>
                    <div className="border border-gray-200 max-h-90">
                        <Base64Viewer
                            fileName={data?.driving_liceance_img_name}
                            fileExtension={data?.driving_liceance_img_extn}
                            base64Data={data?.driving_liceance_img_data}
                            download={true}
                        />
                    </div>
                </div>
            }
            <div className="shadow-md mb-5">
                <span className="font-semibold bg-slate-200 px-5 py-1">Aadhar Card</span>
                <div className="border border-gray-200 max-h-95 mb-5">
                    <Base64Viewer
                        fileName={data?.aadhaar_front_image_name}
                        fileExtension={data?.aadhaar_front_image_extn}
                        base64Data={data?.aadhar_front_data}
                    />
                </div>
                <div className="border border-gray-200 max-h-95">
                    <Base64Viewer
                        fileName={data?.aadhaar_back_image_name}
                        fileExtension={data?.aadhaar_back_image_extn}
                        base64Data={data?.aadhar_back_data}
                        download={true}
                    />
                </div>
            </div>

            <div className="shadow-md mb-5">
                <span className="font-semibold bg-slate-200 px-5 py-1">PAN Card</span>
                <div className="border border-gray-200 max-h-90">
                    <Base64Viewer
                        fileName={data?.pan_card_img_name}
                        fileExtension={data?.pan_card_img_extn}
                        base64Data={data?.pancard_data}
                    />
                </div>
            </div>

        </Card>
    )
}
export default UserSidebar
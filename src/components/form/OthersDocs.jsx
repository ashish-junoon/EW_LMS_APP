import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropUtils";
import ErrorMsg from "../utils/ErrorMsg";
import Button from "../utils/Button";
import {
  getLeadDocuments,
  UploadOtherDocuments,
  UploadOtherDocumentsVideo,
} from "../../api/ApiFunction";
import Accordion from "../utils/Accordion";
import Modal from "../utils/Modal";
import { documentType } from "../content/Data";
import { useOpenLeadContext } from "../../context/OpenLeadContext";
import { useGetDocument } from "../../context/GetDocument";
import { useAuth } from "../../context/AuthContext";
import SelectInput from "../fields/SelectInput";
import DownloadDoc from "../utils/DownloadDoc";
import Loader from "../utils/Loader";

const OthersDocs = ({ btnEnable = false }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { leadInfo, setLeadInfo } = useOpenLeadContext();
  const { adminUser } = useAuth();
  const { documents, setDocuments } = useGetDocument();

  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalFileName, setOriginalFileName] = useState("");
  const [croppedImagePreview, setCroppedImagePreview] = useState(null);
  const [isDocVideo, setisDocVideo] = useState(false);

  const fileInputRef = useRef(null);
  const funder = adminUser.role === "Funder" ? true : false;

  const otherDocs = documents.others || [];

  const uploadDocs = useFormik({
    initialValues: {
      document: null,
      documentType: "",
    },
    validationSchema: Yup.object({
      document: Yup.mixed().required("Please upload a document."),
      documentType: Yup.string().required("Select document type."),
    }),
    onSubmit: async (values) => {
      setOpen(open);

      if (!values.document) {
        toast.error("Please upload a document");
        return;
      }

      try {
        // For Image & PDF Upload throgh FormData
        const base64 = await fileToBase64(values.document);
        const req = {
          user_id: leadInfo?.user_id,
          lead_id: leadInfo?.lead_id,
          document_type: values.documentType,
          document_name: values.document.name,
          document_extn: values.document.name.split(".").pop(),
          document_data: base64,
          created_by: adminUser?.emp_code,
        };

        // For Videos Upload throgh FormData
        const formData = new FormData();
        formData.append("user_id", leadInfo?.user_id);
        formData.append("lead_id", leadInfo?.lead_id);
        formData.append("document_type", values.documentType);
        formData.append("document_name", values.document.name);
        formData.append("document_extn", values.document.name.split(".").pop());
        formData.append("document_data", values.document); // <-- FILE here
        formData.append("created_by", adminUser?.emp_code);

        // calling Api on the Basis of file Type
        let docext = values.document.name.split(".").pop().toLowerCase();
        const isVideoType = ["mp4", "mov", "avi", "mkv", "webm"].includes(
          docext
        );
        const isDocType = ["png", "jpg", "jpeg", "pdf", "webp"].includes(
          docext
        );

        let response;
        if (values.documentType == "VideoKyc" && isVideoType) {
          setLoading(true);
          response = await UploadOtherDocumentsVideo(formData);
          setLoading(false);
          setOpen(false);
        } else if (values.documentType != "VideoKyc" && isDocType) {
          setLoading(true);
          response = await UploadOtherDocuments(req);
          setLoading(false);
          setOpen(false);
        } else {
          toast.warning("Document and Document Type Mismatch!");

          // handleModalClose();

          return;
        }

        if (response.status) {
          // setDocuments((prev) => ({
          //   ...prev,
          //   others: [
          //     ...prev.others,
          //     {
          //       document_type: values.documentType,
          //       document_name: values.document.name,
          //       document_extn: values.document.name.split(".").pop(),
          //       document_data: base64,
          //     },
          //   ],
          // }));
          FetchDocData();
          toast.success("Document uploaded successfully!");
          setOpen(false);
          uploadDocs.resetForm();
          resetCropperState();
          handleModalClose();
          // window.location.reload();
        } else {
          toast.error(response.message);
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to upload document");
        console.error(error);
        setLoading(false);
      }
    },
  });

  const FetchDocData = async () => {
    try {
      const response = await getLeadDocuments({
        user_id: leadInfo.user_id,
        lead_id: leadInfo.lead_id,
      });

      setDocuments(response);
    } catch (error) {}
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const resetCropperState = () => {
    setImageSrc(null);
    setShowCropper(false);
    setCroppedImagePreview(null);
    setOriginalFileName("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (event) => {
    setisDocVideo(uploadDocs.values.documentType == "VideoKyc");
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "video/mp4",
      "video/quicktime",
    ];

    const { documentType } = uploadDocs.values;
    const fileType = file.type;
    const fileSize = file.size;

    const isVideo = documentType === "VideoKyc";
    console.log(file.type);
    // Allowed types check
    if (!allowedTypes.includes(fileType)) {
      return toast.error(
        isVideo
          ? "Only MP4 or MOV files are allowed for Video KYC"
          : "Only PDF, JPG, JPEG or PNG files are allowed"
      );
    }

    const maxSize = isVideo ? 100 : 10; // MB limit based on type
    if (fileSize > maxSize * 1024 * 1024) {
      return toast.error(
        `File size should be less than ${maxSize}MB${
          isVideo ? " for Video KYC" : ""
        }`
      );
    }

    // Final set
    uploadDocs.setFieldValue("document", file);
    // const allowedVideoTypes = ["video/mp4", "video/quicktime"];
    const allowedVideoTypes = [
      "video/mp4", // .mp4 ✅ (most recommended)
      "video/quicktime", // .mov ✅
      "video/x-msvideo", // .avi
      "video/x-matroska", // .mkv
      "video/webm", // .webm
      "video/3gpp", // .3gp
      "video/ogg", // .ogv
    ];

    // If VideoKyc → allow video files
    if (
      allowedVideoTypes.includes(file.type) ||
      file.type === "application/pdf"
    ) {
      return;
    }

    // =================================

    // if (!allowedTypes.includes(file.type)) {
    //     toast.error('Only PDF, JPG, JPEG or PNG files are allowed');
    //     return;
    // }
    // if (file.size > 20 * 1024 * 1024) {
    //     toast.error('File size should be less than 20MB');
    //     return;
    // }
    // Commented above block by Rohit
    // Reset previous states

    resetCropperState();
    // If PDF, handle directly without cropping
    // if (file.type === "application/pdf") {
    //   uploadDocs.setFieldValue("document", file);
    //   return;
    // }

    // For images, show cropper
    setOriginalFileName(file.name);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    });
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels) {
        toast.error("Please select a crop area");
        return;
      }

      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Create a new file from the blob
      const fileName = `cropped_${originalFileName}`;
      const file = new File([croppedImageBlob], fileName, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      // Create preview URL for display
      const previewUrl = URL.createObjectURL(croppedImageBlob);
      setCroppedImagePreview(previewUrl);

      // Update formik value
      uploadDocs.setFieldValue("document", file);

      // Close only the cropper, keep the upload modal open
      setShowCropper(false);
      setImageSrc(null);
      setOpen(true);
    } catch (error) {
      toast.error("Error cropping image");
      console.error(error);
    }
  };

  const handleCropCancel = () => {
    resetCropperState();
    uploadDocs.setFieldValue("document", null);
  };

  const handleRemoveFile = () => {
    resetCropperState();
    uploadDocs.setFieldValue("document", null);
  };

  const handleModalClose = () => {
    setOpen(false);
    uploadDocs.resetForm();
    resetCropperState();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Accordion title="Other Documents" verified={false} reset={true}>
      <div className="lg:px-8 px-2 mb-5">
        <div className="flex justify-end items-end border-b border-gray-200 py-3">
          {btnEnable && (
            <Button
              btnName="Upload Documents"
              btnIcon="MdCloudUpload"
              type="button"
              onClick={() => setOpen(true)}
              style="min-w-[150px] md:w-auto text-sm font-medium py-0.5 px-4 border border-primary text-primary"
            />
          )}
        </div>
        {!funder && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-3 mt-2">
            {otherDocs.map((doc, index) => (
              <div className="col-span-2" key={index}>
                <DownloadDoc
                  fileUrl={doc.other_document_code_url}
                  fileType={
                    doc.other_document_extn === "pdf"
                      ? "application/pdf"
                      : "image/png"
                  }
                  fileName={`${doc.other_document_name || "Document"}`}
                  btnName="View & Download"
                  disabled={funder}
                  label={(doc.other_document_type || doc.document_type)
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/^./, (str) => str.toUpperCase())}
                />
              </div>
            ))}
          </div>
        )}

        {/* Cropper Modal - Only for images */}
        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Crop your image</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Adjust the crop area and zoom level to select the desired
                  portion of your image
                </p>
              </div>
              <div className="relative w-full h-[400px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="rect"
                  showGrid={false}
                />
              </div>
              <div className="p-4 flex justify-between items-center border-t">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-sm">
                    <span className="mr-2">Zoom:</span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-32"
                    />
                    <span className="ml-2 text-xs text-gray-500">
                      {zoom.toFixed(1)}x
                    </span>
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCropCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                  >
                    Save Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Documents Modal */}
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          heading="Upload Documents"
        >
          <form onSubmit={uploadDocs.handleSubmit}>
            <div className="grid grid-cols-4 gap-5 mb-8 px-5">
              <div className="col-span-2">
                <SelectInput
                  label="Document Type"
                  icon="IoDocumentTextOutline"
                  name="documentType"
                  placeholder="Select Type"
                  options={documentType}
                  onChange={(e) => {
                    uploadDocs.handleChange(e),
                      uploadDocs.setFieldValue("document", null);
                  }}
                  onBlur={uploadDocs.handleBlur}
                  value={uploadDocs.values.documentType}
                />
                {uploadDocs.touched.documentType &&
                  uploadDocs.errors.documentType && (
                    <ErrorMsg error={uploadDocs.errors.documentType} />
                  )}
              </div>

              <div className="col-span-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Document (PDF or Image)
                  </label>

                  {/* File input - only show if no file is selected */}
                  {!uploadDocs.values.document && (
                    <div className="relative">
                      <input
                        disabled={!uploadDocs.values.documentType}
                        type="file"
                        name="document"
                        accept={
                          uploadDocs.values.documentType == "VideoKyc"
                            ? ".mp4,.mov,"
                            : ".pdf,.jpg,.jpeg,.png,"
                        }
                        //newly added .mp4, .mov Rohit
                        // accept=".pdf,.jpg,.jpeg,.png, .mp4,.mov,"
                        //Commented by Rohit
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Supported formats: PDF, JPG, JPEG, PNG (Max 5MB)
                      </div>
                    </div>
                  )}

                  {/* Show selected file info */}
                  {uploadDocs.values.document && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              {uploadDocs.values.document.type ===
                              "application/pdf" ? (
                                <span className="text-red-600 text-xs font-bold">
                                  PDF
                                </span>
                              ) : (
                                <span className="text-blue-600 text-xs font-bold">
                                  IMG
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {uploadDocs.values.document.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(
                                  uploadDocs.values.document.size /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>

                          {/* Show cropped image preview */}
                          {croppedImagePreview && (
                            <div className="mt-2">
                              <p className="text-xs text-green-600 font-medium mb-1">
                                ✓ Image cropped successfully
                              </p>
                              <img
                                src={croppedImagePreview}
                                alt="Cropped preview"
                                className="w-20 h-15 object-cover rounded border"
                              />
                            </div>
                          )}

                          {uploadDocs.values.document.type ===
                            "application/pdf" && (
                            <p className="text-xs text-blue-600 font-medium">
                              ✓ PDF ready for upload
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Remove file"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {uploadDocs.touched.document &&
                    uploadDocs.errors.document && (
                      <ErrorMsg error={uploadDocs.errors.document} />
                    )}
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-5">
              <Button
                btnName="Upload"
                btnIcon="MdUpload"
                type="submit"
                disabled={
                  !uploadDocs.values.document || !uploadDocs.values.documentType
                }
                style={`min-w-[100px] md:w-auto text-sm font-medium py-0.5 px-4 ${
                  uploadDocs.values.document && uploadDocs.values.documentType
                    ? "bg-success text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              />
              <Button
                btnName="Cancel"
                btnIcon="IoCloseCircle"
                type="button"
                onClick={handleModalClose}
                style="min-w-[100px] md:w-auto text-sm font-medium py-0.5 px-4 bg-danger text-white"
              />
            </div>
          </form>
        </Modal>
      </div>
    </Accordion>
  );
};

export default OthersDocs;

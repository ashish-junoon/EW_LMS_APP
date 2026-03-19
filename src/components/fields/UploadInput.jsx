import { useState, useRef, useCallback } from "react";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropUtils';
import Icon from "../utils/Icon";

function UploadInput({
    label,
    icon,
    name,
    id,
    onChange,
    onBlur,
    value,
    required,
    acceptedFormats,
    disabled,
    aspect,
    maxSize
}) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

    const [fileName, setFileName] = useState(value ? value.name : "");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        // Reset errors and image state
        setError('');
        setImageSrc(null);

        if (!file) {
            setFileName("");
            return;
        }

        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Only PDF, JPG, or PNG files are allowed.");
            event.target.value = ''; // reset input
            return;
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
            setError("File size is too large. Maximum allowed size is 5MB.");
            event.target.value = ''; // reset input
            return;
        }

        setFileName(file.name);

        if (file.type.startsWith('image/')) {
            // Show cropper for image
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            // PDF: pass file directly
            onChange(event);
        }
    };

    const handleCropAndSave = useCallback(async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            // Create a new file from the blob
            const file = new File([croppedImageBlob], fileName, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });

            // Inject into Formik's file input using DataTransfer
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;

                const event = {
                    ...new Event('change', { bubbles: true }),
                    target: fileInputRef.current,
                    currentTarget: fileInputRef.current
                };

                onChange(event);
            }

            setImageSrc(null);
        } catch (e) {
            console.error('Error cropping image', e);
            setError("Failed to crop image.");
        }
    }, [croppedAreaPixels, imageSrc, fileName, onChange]);

    const handleCancelCrop = () => {
        setImageSrc(null);
        setFileName("");
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <label className="block mb-1 text-sm font-medium text-black">
                {label} {required && <span className="text-danger text-sm">*</span>}
            </label>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon name={icon} size={20} />
                </div>

                <label
                    htmlFor={id}
                    className="bg-white border border-black text-black text-md rounded focus:ring-primary focus:border-primary block w-full pl-10 p-0.5 focus:shadow-sm focus:outline-light cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis"
                >
                    <input
                        type="file"
                        name={name}
                        id={id}
                        className="hidden"
                        accept={acceptedFormats || '.pdf,.jpg,.jpeg,.png'}
                        onChange={handleFileChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        ref={fileInputRef}
                    />
                    <span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {fileName || "No file chosen"}
                    </span>
                </label>
            </div>

            {/* ✅ Error Display */}
            {error && (
                <p className="text-red-600 text-xs mt-1">{error}</p>
            )}

            {/* ✅ Crop Modal */}
            {imageSrc && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className={`bg-gray-200 rounded-lg ${maxSize}`}>
                        <div className="bg-primary text-white flex flex-row text-lg rounded-t-lg">
                            <h3 className="text-lg font-medium px-5 py-2">Crop Image</h3>
                        </div>
                        <div className="relative w-full h-[40vh]">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect || 16 / 10}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="flex justify-end gap-2 py-2 px-5">
                            <button
                                type="button"
                                onClick={handleCancelCrop}
                                className="px-4 py-1 border border-danger text-danger rounded hover:bg-danger hover:text-white shadow"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCropAndSave}
                                className="px-4 py-1 bg-primary text-white rounded hover:bg-blue-600 shadow"
                            >
                                Crop & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UploadInput;

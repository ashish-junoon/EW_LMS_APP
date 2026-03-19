import { useState, useEffect } from "react";

function ImageInput({ name, id, label, onChange, onBlur, value, disabled }) {
    const [fileName, setFileName] = useState(value ? value.name : "");
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setImageSrc(objectUrl);

            // Cleanup when the component is unmounted or value changes
            return () => URL.revokeObjectURL(objectUrl);
        } else if (typeof value === "string") {
            // If the value is a URL or base64 string, display it directly
            setImageSrc(value);
        }
    }, [value]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
            setFileName(file.name);
            const objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);
            onChange(file); // Pass the file directly to Formik's setFieldValue
        } else {
            setFileName("");
            setImageSrc(null);
            alert("Please upload a valid JPEG/JPG image.");
        }
    };

    return (
        <>
            <div
                className={`image-uploader cursor-pointer rounded overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={!disabled ? () => document.getElementById(id).click() : undefined}
            >
                <input
                    type="file"
                    name={name}
                    id={id}
                    accept="image/jpeg, image/jpg, image/png"
                    className="hidden"
                    onChange={handleFileChange}
                    onBlur={onBlur}
                    disabled={disabled}
                />
                {imageSrc ? (
                    <img src={imageSrc} alt="Uploaded" className="object-fit w-full h-full" />
                ) : (
                    <div className="placeholder flex items-center justify-center w-full h-full">
                        <span className="text-black text-center text-sm">{label}</span>
                    </div>
                )}

            </div>
            {/* {fileName && (
                <div className="text-sm text-gray-500 mt-1">
                    Selected file: {fileName}
                </div>
            )} */}
        </>
    );
}

export default ImageInput;

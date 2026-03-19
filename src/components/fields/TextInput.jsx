import { useState } from "react";
import Icon from "../utils/Icon";

function TextInput({ label, icon, type, name, id, placeholder, onChange, onBlur, value, required, disabled, maxLength, style, readOnly, hideEye=false }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(prevState => !prevState);
    };

    // const handlePaste = (e) => {
    //     e.preventDefault();
    // };

    return (
        <>
            <label htmlFor={id} className="block mb-1 text-sm font-medium text-black">
                {label}{required ? <span className="text-danger text-sm">*</span> : ""}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                    <Icon name={icon} size={20} />
                </div>
                <input
                readOnly={readOnly}
                    type={showPassword ? "text" : type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoComplete="off"
                    disabled={disabled}
                    maxLength={maxLength}
                    // onPaste={handlePaste}
                    spellCheck="false"
                    className={`bg-white border border-black text-black text-md rounded focus:ring-primary focus:border-primary block w-full ps-10 p-1 focus:shadow-sm focus:outline-light ${disabled ? " bg-zinc-100" : ""} ${style}`}
                />
                {type === "password" && !hideEye && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-auto"
                    >
                        <Icon name={showPassword ? "RiEyeOffLine" : "RiEyeLine"} size={22} />
                    </button>
                )}
            </div>
        </>
    );
}

export default TextInput;

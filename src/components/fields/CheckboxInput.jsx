import { useState } from "react";

function CheckboxInput({ label, name, id, checked, onChange, disabled, required }) {
    const [isChecked, setIsChecked] = useState(checked || false);

    const handleChange = (event) => {
        setIsChecked(event.target.checked);
        onChange && onChange(event);
        console.log(event.target.checked);
    };

    return (
        <label htmlFor={id} className="inline-flex items-center pe-3">
            <input
                type="checkbox"
                name={name}
                id={id}
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
                className="bg-white border border-black text-black text-md rounded focus:ring-primary focus:border-primary mr-2"
            />
            {label}
            {required && <span className="text-danger text-sm">*</span>}
        </label>
    );
}

export default CheckboxInput;
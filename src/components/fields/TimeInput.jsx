import React, { useRef } from "react";
import Icon from "../utils/Icon";

const TimeInput = ({
  label,
  name,
  id,
  placeholder,
  onChange,
  onBlur,
  value,
  required,
  disabled,
  max,
  min,
}) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.();
    }
  };

  return (
    <>
      <label htmlFor={id} className="block mb-1 text-sm font-medium text-black">
        {label}
        {required && <span className="text-danger text-sm">*</span>}
      </label>

      <div className="relative w-full">
        <div
          className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10"
          aria-hidden="true"
        >
          {/* Optional: change icon */}
          <Icon name="RiTimeLine" size={20} />
        </div>

        <input
          ref={inputRef}
          type="time"
          name={name}
          id={id}
          placeholder={placeholder}
          className="bg-white border border-black text-black rounded focus:ring-primary focus:border-primary block w-full pl-10 p-1 focus:shadow-sm focus:outline-light"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          min={min}   // format: "HH:mm"
          max={max}   // format: "HH:mm"
          disabled={disabled}
          style={{
            colorScheme: "dark",
          }}
        />

        <div
          className="absolute inset-0 cursor-pointer"
          onClick={handleClick}
          aria-label="Open time picker"
        />
      </div>
    </>
  );
};

export default TimeInput;

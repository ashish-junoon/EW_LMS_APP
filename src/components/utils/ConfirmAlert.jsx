import React, { useRef } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Button from '../utils/Button';

const ConfirmAlert = ({ onConfirm, onCancel, confirmLabel, cancelLabel, btnName, btnIcon, style }) => {
    const formRef = useRef(null);

    const handleClick = () => {
        confirmAlert({
            // title: 'Are you sure?',
            message: 'Are you sure you want to proceed?',
            buttons: [
                {
                    label: confirmLabel || 'Yes',
                    onClick: () => {
                        if (onConfirm) onConfirm();
                        if (formRef.current) formRef.current.submit();
                    },
                    className: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded'
                },
                {
                    label: cancelLabel || 'No',
                    onClick: () => onCancel && onCancel(),
                    className: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded'
                }
            ],
            overlayClassName: "bg-black bg-opacity-50 flex justify-center items-center",
        });
    };

    return (
        <div>
            {/* <form ref={formRef} action="/submit-form" method="POST"> */}
            {/* <form> */}
            <Button
                btnName={btnName}
                btnIcon={btnIcon}
                type={"button"}
                onClick={handleClick}
                style={`min-w-[150px] md:w-auto mt-4 py-2 px-6 border border-blue-600 text-blue-600 hover:border-blue-700 hover:bg-blue-700 hover:text-white font-medium rounded ${style}`}
            />
            {/* </form> */}
        </div>
    );
};

export default ConfirmAlert;

import React, { useState, useEffect, useRef } from 'react';

const Tooltip = ({
    children,
    message,
    position = 'top',
    delay = 200,
    offset = 8,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);

    const calculatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - offset;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + offset;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.left - tooltipRect.width - offset;
                break;
            case 'right':
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.right + offset;
                break;
            default:
                break;
        }

        setCoords({ top, left });
    };

    useEffect(() => {
        if (isVisible) {
            calculatePosition();
            window.addEventListener('scroll', calculatePosition);
            window.addEventListener('resize', calculatePosition);

            return () => {
                window.removeEventListener('scroll', calculatePosition);
                window.removeEventListener('resize', calculatePosition);
            };
        }
    }, [isVisible]);

    let timer;
    const handleMouseEnter = () => {
        timer = setTimeout(() => setIsVisible(true), delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(timer);
        setIsVisible(false);
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={triggerRef}
        >
            {children}
            {isVisible && (
                <div
                    role="tooltip"
                    ref={tooltipRef}
                    className={`
            fixed z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg
            transition-opacity duration-200
            ${isVisible ? 'opacity-100' : 'opacity-0'}
           
          `}
                    style={{
                        top: `${coords.top}px`,
                        left: `${coords.left}px`
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
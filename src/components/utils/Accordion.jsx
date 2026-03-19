import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../utils/Icon';
import Tooltip from './Tooltip';

const Accordion = ({
    title,
    verified,
    reset,
    open,
    children,
    actionButtons = [],
    iconColor = 'green',
    tooltipMsg,
    bgColor = 'bg-green-200',
}) => {
    const [isOpen, setIsOpen] = useState(open);

    const toggleAccordion = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setIsOpen(!isOpen);
    };

    return (
        <div className={`border border-gray-100 mb-3 ${isOpen ? 'shadow-md' : ''}`}>
            <div className={`lg:pl-5 max-md:py-2  ${verified ? `${bgColor} border border-green-400` : 'bg-gray-100'} ${!reset ? 'bg-red-50 border border-red-400' : ''}`}>
                <div className="md:grid flex justify-between md:grid-cols-7 items-center hover:cursor-pointer" onClick={toggleAccordion}>
                    <div className="col-span-6 md:col-span-5">
                        <div className="flex flex-row items-center">
                            <motion.span
                                className="ps-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {verified ? <Icon name="RiVerifiedBadgeLine" size={15} color={iconColor} /> : ""}
                            </motion.span>
                            <span className="font-semibold ml-3">{title}</span>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex justify-end items-center p-1">
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        className="flex justify-between items-center"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-center items-center gap-2.5">
                                            {actionButtons?.map((btn, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ duration: 0.2, delay: index * 0.1 }}
                                                >
                                                    <Tooltip
                                                        position="top"
                                                        delay={200}
                                                        offset={8}
                                                        message={tooltipMsg}
                                                    >
                                                        <button
                                                            type="button"
                                                            className={`rounded-full ${btn.className} border p-1.5 shadow-lg border-primary hover:shadow-xl ${verified ? 'border-green-400' : 'border-gray-300'}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();   // ⛔ stops parent click
                                                                btn.onClick?.(e);      // ✅ still runs child logic
                                                            }} // Ensure onClick is defined for each button
                                                        >
                                                            <Icon name={btn.icon} size={btn.iconSize || 15} />
                                                        </button>
                                                    </Tooltip>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="button" // Ensure the button type is "button" to prevent form submission
                                // onClick={toggleAccordion}
                                className="py-1 px-3 ms-2 rounded bg-gray-100 hover:bg-primary hover:text-white text-sm"
                            >
                                <motion.div
                                    animate={{ rotate: isOpen ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Icon name="MdKeyboardArrowRight" size={18} />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                                height: { duration: 0.3 },
                                opacity: { duration: 0.2, delay: 0.1 }
                            }
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                                height: { duration: 0.3 },
                                opacity: { duration: 0.2 }
                            }
                        }}
                        className="bg-white overflow-hidden"
                    >
                        <div className="py-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Accordion;
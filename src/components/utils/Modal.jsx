'use client'
import { useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'

const Modal = ({
    isOpen,
    onClose,
    children,
    heading,
    width
}) => {

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
        } else {
            window.removeEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-999">
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto mt-10">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        //width if width is passed Rohit
                        className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg md:max-w-2xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 ${width && `min-w-[70%]`}`}
                    >
                        <div className="bg-primary text-white px-4 py-1 text-base font-semibold">
                            {heading}
                        </div>

                        <div className="bg-white py-4 px-5">
                            {children}
                        </div>
                    </DialogPanel>
                </div>
            </div>

            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
        </Dialog>
    )
}

export default Modal

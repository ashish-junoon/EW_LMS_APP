import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icon";
function FilterCard({ onClick, children }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className=''
            >
                <div className='border border-gray-300 rounded shadow-sm'>
                    <div className='flex justify-between bg-gray-50 px-2 rounded-t'>
                        <div className='flex justify-start'>
                            <span className='font-semibold text-base text-primary'>Advance Filter</span>
                        </div>
                        <div className='flex justify-end'>
                            <button className=''
                                onClick={onClick}
                            >
                                <Icon name="IoCloseCircleSharp" size={24} color="#FF0000" />
                            </button>
                        </div>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
export default FilterCard
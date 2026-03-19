import { motion } from "framer-motion"

function Card({ heading, children, style }) {
    return (
        <motion.div
            className={`w-full shadow rounded-b`}>
            <div className={`bg-primary text-white flex flex-row text-lg py-1 px-3 rounded-t items-center`}>
                <span className="font-bold text-sm ml-2">{heading}</span>
            </div>
            <div className={`${style}`}>
                {children}
            </div>
        </motion.div>
    )
}
export default Card
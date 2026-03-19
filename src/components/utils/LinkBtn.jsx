import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../utils/Icon";

function LinkBtn({ linkName, linkUrl, icon, className }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={linkUrl}
            className={`flex items-center justify-center gap-2 border  py-1 px-4 rounded shadow-md font-semibold hover:bg-primary hover:text-white transition-colors duration-200 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Icon
                name={icon}
                size={20}
                color={isHovered ? "#ffffff" : " "}
            />
            <span>{linkName}</span>

        </Link>
    );
}

export default LinkBtn;

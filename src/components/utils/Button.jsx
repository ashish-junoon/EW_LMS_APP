import Icon from "../utils/Icon";

function Button({ btnName, style, onClick, btnIcon, type, disabled }) {
    return (
        <button
            className={`shadow-md py-[4px] px-3 rounded flex items-center justify-center hover:shadow-lg ${style}`}
            type={type ? type : "button"}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="mr-1"><Icon name={btnIcon} size={18} /></span>
            {btnName}
        </button>
    )
}

export default Button
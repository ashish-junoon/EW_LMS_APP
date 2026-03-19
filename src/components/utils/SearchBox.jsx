import React from 'react';
import Icon from '../utils/Icon';

const SearchBox = ({ value, onChange, placeholder, onSearch, style }) => {
    return (
        <div className="hidden md:flex items-center border border-primary bg-white">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="flex-grow p-1.5 border-none focus:outline-none"
            />
            <button
                onClick={onSearch}
                className={`text-white transition-colors px-4 py-2 ${style}`}
                aria-label="Search border border-primary"
            >
                <Icon name="IoSearchSharp" size={20} color="#fff" />
            </button>
        </div>

    );
};

export default SearchBox;


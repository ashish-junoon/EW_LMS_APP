
import React from 'react';

function formatNumber(num) {
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2) + 'CR';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2) + 'L';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    } else {
        return num.toString();
    }
}

const NumberFormatter = ({ number }) => {
    return <span>{formatNumber(number)}</span>;
};

export default NumberFormatter;

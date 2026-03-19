/**
 * Masks a single piece of sensitive data based on its type.
 * @param {string} value - The value to be masked.
 * @param {"mobile" | "email" | "pan" | "aadhaar"} type - The type of data.
 * @returns {string} Masked version of the input value.
 */
export function maskData(value, type) {
    if (!value) return '';

    switch (type.toLowerCase()) {
        case 'mobile':
            return value.length === 10
                ? value.replace(/^(\d{2})\d{6}(\d{2})$/, '$1XXXXXX$2')
                : value;

        case 'email':
            if (!value.includes('@')) return value;
            const [user, domain] = value.split('@');
            const maskedUser = user.length <= 2
                ? user[0] + '*'.repeat(user.length - 1)
                : user[0] + '*'.repeat(user.length - 2) + user.slice(-1);
            return `${maskedUser}@${domain}`;

        case 'pan':
            return value.length === 10
                ? value.replace(/^(.{2}).{6}(.{2})$/, '$1XXXXX$2')
                : value;

        case 'aadhaar':
            return value.length === 12
                ? value.replace(/^(\d{4})\d{4}(\d{4})$/, '$1 XXXX $2')
                : value;

        default:
            return value;
    }
}

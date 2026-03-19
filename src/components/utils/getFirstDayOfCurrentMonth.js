function getFirstDayOfCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 2);
}

export default getFirstDayOfCurrentMonth
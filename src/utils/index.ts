export const formatDate = () => {
    const date = new Date();
    const curr_date = date.getDate();
    const curr_month = date.getMonth();
    const curr_year = date.getFullYear();

    return `${curr_date}/${curr_month}/${curr_year}`;
};

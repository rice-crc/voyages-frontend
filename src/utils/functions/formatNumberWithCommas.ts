
export const formattedData = (data: string) => {
    return data.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, (match) => match + ',');

}

export const formatNumberWithCommas = (data: string) => {
    return data.replace(/\d+(\.\d+)?/g, (match) => {
        const floatValue = parseFloat(match);
        return isNaN(floatValue) ? match : floatValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

        // return isNaN(floatValue) ? match : floatValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });
};

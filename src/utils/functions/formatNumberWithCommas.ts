export const formatNumberWithCommasOrPercentage = (data: string) => {

    return data.replace(/\d+(\.\d+)?/g, (match) => {
        const floatValue = parseFloat(match);
        return isNaN(floatValue) ? match : floatValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

        // return isNaN(floatValue) ? match : floatValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });
};

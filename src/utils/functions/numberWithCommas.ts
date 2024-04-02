export const numberWithCommas = (number: number | string) => {
    // Convert the input to a number if it's a string
    const num = typeof number === 'string' ? parseFloat(number) : number;

    // Check if the input is a valid number
    if (isNaN(num)) {
        return number; // Return the input as is
    }

    // Use toLocaleString to add commas to the number
    return num.toLocaleString('en-US');
};
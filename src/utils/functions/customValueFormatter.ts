// Define a custom value formatter function
export const customValueFormatter = (params: any) => {
    const { value } = params; // Extract the value from the params object
    // Perform custom formatting based on your requirements
    let formattedValue = ''; // Initialize the formatted value variable

    if (typeof value === 'number') {
        formattedValue = value.toLocaleString('en-US'); // Format numbers with commas
    } else {
        formattedValue = value.toString(); // Convert non-numeric values to strings
    }

    return formattedValue; // Return the formatted value
};
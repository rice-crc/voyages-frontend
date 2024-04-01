export function formatTextURL(inputText: string) {
    if (!inputText) return null;
    return inputText
        .toLowerCase() // Convert the text to lowercase
        .replace(/[^\w\s]/g, '') // Remove all punctuation marks except spaces
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/\b\w\b/g, ''); // Remove single-letter words
}

export function reverseFormatTextURL(formattedURL: string) {
    if (!formattedURL) return null;

    return formattedURL
        .replace(/-/g, ' ') // Replace dashes with spaces
        .replace(/\b\w\b/g, '') // Remove single-letter words
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
        .trim() // Trim any leading or trailing spaces
        .split(' ') // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
        .join(' '); // Join the words back into a string
}
export function formatTextURL(inputText: string) {
    if (!inputText) return null;
    return inputText
        .toLowerCase() // Convert the text to lowercase
        .replace(/[^\w\s]/g, '') // Remove all punctuation marks except spaces
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/\b\w\b/g, ''); // Remove single-letter words
}
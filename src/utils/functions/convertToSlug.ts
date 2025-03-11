export function convertToSlug(str: string) {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/'/g, '') // Remove apostrophes
    .replace(/\W+/g, '-') // Replace non-word characters with dashes
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

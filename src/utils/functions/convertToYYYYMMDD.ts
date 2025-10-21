export function convertToYYYYMMDD(dateString: string | number | null | undefined): string {
    // Handle null, undefined, or empty values
    if (!dateString && dateString !== 0) {
      return '';
    }
  
    // Convert to string if it's a number
    const dateStr = String(dateString);
  
    // Check if it contains commas
    if (!dateStr.includes(',')) {
      return dateStr; // Return as-is if not in expected format
    }
  
    const parts = dateStr.split(',');
    
    // Validate we have 3 parts
    if (parts.length !== 3) {
      return dateStr;
    }
  
    const [month, day, year] = parts;
  
    const formattedMonth = month.trim().padStart(2, '0');
    const formattedDay = day.trim().padStart(2, '0');
    
    return `${year.trim()}-${formattedMonth}-${formattedDay}`;
  }
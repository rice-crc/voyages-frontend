export const customValueFormatter = (params: any) => {
  const { value } = params;
  
  // Handle null, undefined first
  if (value === null || value === undefined) {
    return '0';
  }

  // Handle numbers (including 0)
  if (typeof value === 'number') {
    const formatted = value.toLocaleString('en-US');
    return formatted;
  }

  // Handle string numbers
  if (typeof value === 'string' && !isNaN(Number(value))) {
    const numValue = Number(value);
    const formatted = numValue.toLocaleString('en-US');
    return formatted;
  }

  // Handle other values
  if (value) {
    const formatted = value.toString();
    return formatted;
  }
  return '0';
};

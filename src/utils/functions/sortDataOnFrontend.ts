/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from '@/components/NavigationComponents/Header/CustomHeaderTable';

// Add this sorting function
export const sortDataOnFrontend = (
  data: any[],
  sortOrder: SortOrder,
  sortingFields: string[],
) => {
  return data.sort((a, b) => {
    for (const field of sortingFields) {
      const aValue = a[field];
      const bValue = b[field];

      // Handle null/undefined values
      if (aValue == null && bValue == null) continue;
      if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
      if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        if (comparison !== 0) {
          return sortOrder === 'desc' ? -comparison : comparison;
        }
        continue;
      }
      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        if (comparison !== 0) {
          return sortOrder === 'desc' ? -comparison : comparison;
        }
        continue;
      }
      // Handle mixed types - convert to string
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      if (comparison !== 0) {
        return sortOrder === 'desc' ? -comparison : comparison;
      }
    }
    return 0;
  });
};

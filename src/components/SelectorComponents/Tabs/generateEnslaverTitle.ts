// ============= ENSLAVER SEO GENERATORS =============
export const generateEnslaverTitle = (enslaverData: any, enslaverId: string): string => {
  // Get the primary name from the names array
  const name = enslaverData?.names?.[0] || 'Unknown enslaver';
  const voyageCount = enslaverData?.voyages?.length || 0;
  const birthYear = enslaverData?.birth || '';
  const deathYear = enslaverData?.death || '';
  
  let title = `Enslaver #${enslaverId}: ${name}`;
  
  // Add birth/death years if available
  if (birthYear || deathYear) {
    title += ` (${birthYear || '?'}-${deathYear || '?'})`;
  }
  
  // Add voyage count
  if (voyageCount > 0) {
    title += ` - ${voyageCount} voyage${voyageCount !== 1 ? 's' : ''}`;
  }
  
  return title;
};
  
export const generateEnslaverDescription = (enslaverData: any, enslaverId: string): string => {
  const name = enslaverData?.names?.[0] || 'This enslaver';
  const voyageCount = enslaverData?.voyages?.length || 0;
  const birthYear = enslaverData?.birth || '';
  const deathYear = enslaverData?.death || '';
  const location = enslaverData?.principal_location || '';
  
  let description = `Enslaver #${enslaverId}: ${name}`;
  
  // Add birth/death years
  if (birthYear || deathYear) {
    description += ` (${birthYear || '?'}-${deathYear || '?'})`;
  }
  
  description += ` was involved in ${voyageCount} documented voyage${voyageCount !== 1 ? 's' : ''} in the transatlantic slave trade`;
  
  // Add location if available
  if (location) {
    description += `, based in ${location}`;
  }
  
  description += '. ';
  
  // Add some voyage examples if available
  if (enslaverData?.voyages && enslaverData.voyages.length > 0) {
    const firstVoyages = enslaverData.voyages.slice(0, 3);
    description += `Voyages include: ${firstVoyages.join(', ')}`;
    if (enslaverData.voyages.length > 3) {
      description += `, and ${enslaverData.voyages.length - 3} more`;
    }
    description += '. ';
  }
  
  description += 'View complete historical records, voyages, and connections.';
  
  return description;
};
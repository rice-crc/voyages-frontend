// ============= ENSLAVED INDIVIDUAL SEO GENERATORS =============
export const generateEnslavedTitle = (enslavedData: any, enslavedId: string): string => {
    const name = enslavedData?.documented_name || enslavedData?.modern_name || 'Unknown';
    const age = enslavedData?.age || '';
    const gender = enslavedData?.gender || '';
    const voyageId = enslavedData?.voyages?.id || '';
    const shipName = enslavedData?.voyages?.ship_name || '';
    const year = enslavedData?.voyages?.year || '';
    
    let title = `Enslaved #${enslavedId}: ${name}`;
    
    // Add age and gender in parentheses if available
    const details = [];
    if (gender) details.push(gender);
    if (age) details.push(`age ${age}`);
    
    if (details.length > 0) {
      title += ` (${details.join(', ')})`;
    }
    
    // Add voyage info if available
    if (voyageId) {
      title += ` - voyage #${voyageId}`;
      if (shipName) {
        title += `, ${shipName}`;
      }
      if (year) {
        title += ` ${year}`;
      }
    }
    
    return title;
};

export const generateEnslavedDescription = (enslavedData: any, enslavedId: string): string => {
    const name = enslavedData?.documented_name || enslavedData?.modern_name || 'This individual';
    const age = enslavedData?.age;
    const gender = enslavedData?.gender || 'unknown gender';
    const height = enslavedData?.height;
    const voyageId = enslavedData?.voyages?.id;
    const shipName = enslavedData?.voyages?.ship_name || '';
    const embarkation = enslavedData?.voyages?.embarkation || '';
    const disembarkation = enslavedData?.voyages?.disembarkation || '';
    const year = enslavedData?.voyages?.year || '';
    const fate = enslavedData?.captive_fate?.name || '';
    const postDisembarkLocation = enslavedData?.post_disembark_location?.name || '';
    
    let description = `Enslaved #${enslavedId}: ${name} was `;
    
    // Add age and gender
    if (age) {
      description += `${age} years old, ${gender}`;
    } else {
      description += `of unknown age, ${gender}`;
    }
    
    // Add height if available (convert inches to feet and inches)
    if (height) {
      const feet = Math.floor(height / 12);
      const inches = Math.round(height % 12);
      description += `, ${feet}'${inches}" tall`;
    }
    
    description += '. ';
    
    // Add voyage information
    if (voyageId) {
      description += `Documented on voyage #${voyageId}`;
      
      if (shipName) {
        description += ` aboard the ${shipName}`;
      }
      
      if (year) {
        description += ` in ${year}`;
      }
      
      if (embarkation && disembarkation) {
        description += `, from ${embarkation} to ${disembarkation}`;
      } else if (embarkation) {
        description += `, embarking from ${embarkation}`;
      } else if (disembarkation) {
        description += `, disembarking at ${disembarkation}`;
      }
      
      description += '. ';
    }
    
    // Add fate information if available
    if (fate) {
      description += `${fate}`;
      if (postDisembarkLocation) {
        description += ` in ${postDisembarkLocation}`;
      }
      description += '. ';
    }
    
    description += 'View historical records and biographical information.';
    
    return description;
};
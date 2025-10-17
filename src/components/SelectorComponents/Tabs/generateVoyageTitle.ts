// ============= VOYAGE SEO GENERATORS =============
export const generateVoyageTitle = (voyageData: any, voyageId: string): string => {
    const vesselName = voyageData?.voyage_ship?.ship_name || 'unknown vessel';
    const year = voyageData?.voyage_dates?.imp_departed_africa_sparsedate?.year || 
                 voyageData?.voyage_dates?.voyage_began_sparsedate?.year || 
                 voyageData?.voyage_dates?.imp_voyage_began_sparsedate?.year ||
                 'unknown year';
    const placePurchased = voyageData?.voyage_itinerary?.imp_principal_place_of_slave_purchase?.name || 
                           'unknown origin';
    const placeLanded = voyageData?.voyage_itinerary?.imp_principal_port_slave_dis?.name || 
                        voyageData?.voyage_itinerary?.principal_port_of_slave_dis?.name ||
                        'unknown destination';
  
    return `Voyage #${voyageId}: ${vesselName} ${year} from ${placePurchased} to ${placeLanded}`;
};


export  const generateVoyageDescription = (voyageData: any, voyageId: string): string => {
    const year = voyageData?.voyage_dates?.imp_departed_africa_sparsedate?.year || 
                 voyageData?.voyage_dates?.imp_voyage_began_sparsedate?.year || '';
    const shipName = voyageData?.voyage_ship?.ship_name || '';
    const embarked = voyageData?.voyage_slaves_numbers?.imp_total_num_slaves_embarked;
    const disembarked = voyageData?.voyage_slaves_numbers?.imp_total_num_slaves_disembarked;
    const placePurchased = voyageData?.voyage_itinerary?.imp_principal_place_of_slave_purchase?.name || 'an unspecified location';
    const placeLanded = voyageData?.voyage_itinerary?.imp_principal_port_slave_dis?.name || 
                        voyageData?.voyage_itinerary?.principal_port_of_slave_dis?.name || 
                        'an unspecified destination';
    
    // Get enslavers information
    let enslaversText = 'unknown';
    const enslavers = voyageData?.enslavers;
    if (enslavers && Array.isArray(enslavers) && enslavers.length > 0) {
      const enslaverNames = enslavers.map((enslaver: any) => {
        const name = enslaver?.enslaver_alias?.alias || enslaver?.name || 'unknown';
        const role = enslaver?.enslaver_role?.role || enslaver?.role || '';
        return role ? `${name} (${role})` : name;
      });
      enslaversText = enslaverNames.join(', and ');
    }
  
    // Build description following the exact format from your example
    let description = `Voyage #${voyageId}: `;
    
    if (year) {
      description += `In ${year} `;
    }
    
    if (shipName) {
      description += `the ship ${shipName} `;
    }
    
    // Handle embarked number
    if (embarked !== null && embarked !== undefined) {
      description += `embarked ${embarked} people at ${placePurchased}. `;
    } else {
      description += `embarked an unknown number at ${placePurchased}. `;
    }
    
    // Handle disembarked number
    if (disembarked !== null && disembarked !== undefined) {
      description += `${disembarked} people were disembarked at ${placeLanded}. `;
    } else {
      description += `An unknown number of people were disembarked at ${placeLanded}. `;
    }
    
    description += `The ship's enslavers were ${enslaversText}.`;
  
    return description;
};
  
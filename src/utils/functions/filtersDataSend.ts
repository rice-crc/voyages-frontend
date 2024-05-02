import {
    AFRICANORIGINS,
    ENSLAVEDTEXAS,
    INTRAAMERICAN,
    INTRAAMERICANTRADS,
    TRANSATLANTICPATH,
    TRANSATLANTICTRADS,
} from '@/share/CONST_DATA';
import { Filter } from "@/share/InterfaceTypes";

export const filtersDataSend = (filtersObj: Filter[], styleNameRoute: string, clusterNodeKeyVariable?: string, clusterNodeValue?: string) => {

    let filters: Filter[] = []
    if (Array.isArray(filtersObj[0]?.searchTerm) && filtersObj[0]?.searchTerm.length > 0) {
        filters = filtersObj;
    } else if (!Array.isArray(filtersObj[0]?.op) && filtersObj[0]?.op === 'exact') {
        filters = filtersObj;
    } else if (styleNameRoute === TRANSATLANTICPATH) {
        filters.push({
            varName: 'dataset',
            searchTerm: [0],
            op: 'in',
        });
    } else if (styleNameRoute === INTRAAMERICAN) {
        filters.push({
            varName: 'dataset',
            searchTerm: [1],
            op: 'in',
        });
    } else if (styleNameRoute === ENSLAVEDTEXAS) {
        filters.push({
            varName:
                'enslaved_relations__relation__voyage__voyage_itinerary__imp_principal_region_slave_dis__name',
            searchTerm: ['Texas'],
            op: 'in',
        });
    } else if (styleNameRoute === AFRICANORIGINS) {
        filters.push({
            varName: 'dataset',
            searchTerm: [0, 0],
            op: 'in',
        });
    } else if (styleNameRoute === TRANSATLANTICTRADS) {
        filters.push({
            varName: 'aliases__enslaver_relations__relation__voyage__dataset',
            searchTerm: 0,
            op: "exact"
        });
    } else if (styleNameRoute === INTRAAMERICANTRADS) {
        filters.push({
            varName: 'aliases__enslaver_relations__relation__voyage__dataset',
            searchTerm: 1,
            op: "exact"
        });
    }
    if (clusterNodeKeyVariable && clusterNodeValue) {
        filters = filters.concat({
            varName: clusterNodeKeyVariable,
            searchTerm: [clusterNodeValue],
            op: 'in',
        });
    }

    const uniqueFiltersSet = new Set<string>();
    let uniqueFilters: Filter[] = [];
    for (const filter of filters) {
        const key = `${filter.varName}_${JSON.stringify(filter.searchTerm)}`;
        if (!uniqueFiltersSet.has(key)) {
            uniqueFiltersSet.add(key);
            uniqueFilters.push(filter);
        }
    }
    const filterObjectUpdate = {
        filter: uniqueFilters
    };

    // Update localStorages
    if (filters.length === 0) {
        const storedValue = localStorage.getItem('filterObject');
        if (!storedValue) return;
        const parsedValue = JSON.parse(storedValue);
        uniqueFilters = parsedValue.filter;
    } else {
        const filterObjectString = JSON.stringify(filterObjectUpdate);
        localStorage.setItem('filterObject', filterObjectString);
    }

    return uniqueFilters;
}

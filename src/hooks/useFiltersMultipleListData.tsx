import { useMemo, useCallback } from 'react';

import {
  AFRICANORIGINS,
  ALLENSLAVED,
  ALLVOYAGES,
  ENSALVERSTYLE,
  ENSLAVEDTEXAS,
  INTRAAMERICAN,
  INTRAAMERICANTRADS,
  TRANSATLANTICPATH,
  TRANSATLANTICTRADS,
} from '@/share/CONST_DATA';
import {
  Filter,
  FilterEnslavedVoyageOutcomeRequest,
} from '@/share/InterfaceTypes';
import { checkPagesRouteForEnslaved } from '@/utils/functions/checkPagesRoute';

const ROUTE_FILTER_MAP: Record<string, Filter> = {
  [TRANSATLANTICPATH]: {
    varName: 'dataset',
    searchTerm: [0],
    op: 'in',
  },
  [INTRAAMERICAN]: {
    varName: 'dataset',
    searchTerm: [1],
    op: 'in',
  },
  [ENSLAVEDTEXAS]: {
    varName:
      'enslaved_relations__relation__voyage__voyage_itinerary__imp_principal_region_slave_dis__name',
    searchTerm: ['Texas'],
    op: 'in',
  },
  [AFRICANORIGINS]: {
    varName: 'dataset',
    searchTerm: [0, 0],
    op: 'in',
  },
  [TRANSATLANTICTRADS]: {
    varName: 'aliases__enslaver_relations__relation__voyage__dataset',
    searchTerm: 0,
    op: 'exact',
  },
  [INTRAAMERICANTRADS]: {
    varName: 'aliases__enslaver_relations__relation__voyage__dataset',
    searchTerm: 1,
    op: 'exact',
  },
};

interface UseFiltersDataProps {
  filtersObj: Filter[];
  styleNameRoute?: string;
  clusterNodeKeyVariable?: string;
  clusterNodeValue?: string;
}

interface UseFiltersDataReturn {
  filters: Filter[];
  processedFilters: Filter[];
  dataSend: FilterEnslavedVoyageOutcomeRequest;
  updateLocalStorage: (filters: Filter[]) => void;
}

export const useFiltersMultipleListData = ({
  filtersObj,
  styleNameRoute,
  clusterNodeKeyVariable,
  clusterNodeValue,
}: UseFiltersDataProps): UseFiltersDataReturn => {
  // Check if route should use original filters
  const shouldUseFilters = checkPagesRouteForEnslaved(styleNameRoute!);

  const shouldUseOriginalFilters = useMemo(() => {
    return [ALLVOYAGES, ALLENSLAVED, ENSALVERSTYLE].includes(styleNameRoute!);
  }, [styleNameRoute]);

  // // Check if filters object has valid data
  const hasValidFiltersData = useMemo(() => {
    if (!filtersObj?.[0]) return false;
    return (
      (Array.isArray(filtersObj[0]?.searchTerm) &&
        filtersObj[0]?.searchTerm.length > 0) ||
      (!Array.isArray(filtersObj[0]?.op) && filtersObj[0]?.op === 'exact')
    );
  }, [filtersObj]);
  // // Generate base filters based on route
  const generateRouteFilters = useCallback((): Filter[] => {
    if (shouldUseOriginalFilters || hasValidFiltersData) {
      return filtersObj;
    }
    const routeFilter = ROUTE_FILTER_MAP[styleNameRoute!];
    return routeFilter ? [routeFilter] : [];
  }, [
    shouldUseOriginalFilters,
    hasValidFiltersData,
    filtersObj,
    styleNameRoute,
  ]);

  const updateLocalStorage = useCallback((filters: Filter[]) => {
    try {
      const filterObjectUpdate = { filter: filters };
      localStorage.setItem('filterObject', JSON.stringify(filterObjectUpdate));
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
  }, []);

  // // Add cluster node filter if provided
  const addClusterNodeFilter = useCallback(
    (baseFilters: Filter[]): Filter[] => {
      if (!clusterNodeKeyVariable || !clusterNodeValue) {
        return baseFilters;
      }
      const clusterFilter: Filter = {
        varName: clusterNodeKeyVariable,
        searchTerm: [clusterNodeValue],
        op: 'in',
      };
      return [...baseFilters, clusterFilter];
    },
    [clusterNodeKeyVariable, clusterNodeValue],
  );
  // // Remove duplicate filters
  const removeDuplicateFilters = useCallback((filters: Filter[]): Filter[] => {
    const uniqueFiltersSet = new Set<string>();
    const uniqueFilters: Filter[] = [];
    for (const filter of filters) {
      const key = `${filter.varName}_${JSON.stringify(filter.searchTerm)}`;
      if (!uniqueFiltersSet.has(key)) {
        uniqueFiltersSet.add(key);
        uniqueFilters.push(filter);
      }
    }
    return uniqueFilters;
  }, []);

  // // Main filter processing
  const filters = useMemo(() => {
    if (!shouldUseFilters) return [];
    const baseFilters = generateRouteFilters();
    const filtersWithCluster = addClusterNodeFilter(baseFilters);
    const uniqueFilters = removeDuplicateFilters(filtersWithCluster);
    // Update localStorage
    updateLocalStorage(uniqueFilters);
    return filtersObj.length === 0 ? filtersWithCluster : uniqueFilters;
  }, [
    shouldUseFilters,
    generateRouteFilters,
    addClusterNodeFilter,
    removeDuplicateFilters,
    updateLocalStorage,
    filtersObj.length,
  ]);

  const processedFilters = useMemo(
    () => filters.map((f) => ({ ...f })),
    [filters],
  );
  const dataSend = useMemo(
    () => ({ filter: processedFilters }),
    [processedFilters],
  );

  return {
    filters,
    processedFilters,
    dataSend,
    updateLocalStorage,
  };
};

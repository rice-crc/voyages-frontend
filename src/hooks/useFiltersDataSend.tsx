import { useMemo } from 'react';

import { Filter } from '@/share/InterfaceTypes';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';

// Alternative simpler version if you want to keep it closer to the original
export const useFiltersDataSend = (
  filtersObj: Filter[],
  styleNameRoute: string,
  clusterNodeKeyVariable?: string,
  clusterNodeValue?: string,
) => {
  const filters = useMemo(() => {
    return filtersDataSend(
      filtersObj,
      styleNameRoute,
      clusterNodeKeyVariable,
      clusterNodeValue,
    );
  }, [filtersObj, styleNameRoute, clusterNodeKeyVariable, clusterNodeValue]);

  const processedFilters = useMemo(() => {
    return filters?.map(({ ...rest }) => rest) || [];
  }, [filters]);

  const dataSend = useMemo(
    () => ({
      filter: processedFilters || [],
    }),
    [processedFilters],
  );

  return {
    filters,
    processedFilters,
    dataSend,
  };
};

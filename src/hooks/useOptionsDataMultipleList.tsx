import { useCallback, useEffect, useState } from 'react';

import { FETCH_FUNCTION_MAP } from '@/components/SelectorComponents/SelectDrowdown/FETCH_FUNCTION_MAP';
import { fetchEnslavedVoyageOutcome } from '@/fetch/pastEnslavedFetch/fetchEnslavedVoyageOutcome';
import { varNameEnslavedVoyageOutcome } from '@/share/CONST_DATA';
import { MultiselectListProps } from '@/share/InterfaceTypes';
import { checkPagesRouteForEnslaved } from '@/utils/functions/checkPagesRoute';

import { useFiltersMultipleListData } from './useFiltersMultipleListData';

export const useOptionsDataMultipleList = (
  styleNameRoute: string,
  varName: string,
  filtersObj: any,
) => {
  const [multipleOptionsList, setMultipleOptionsList] = useState<
    MultiselectListProps[]
  >([]);

  const { dataSend } = useFiltersMultipleListData({
    filtersObj,
    styleNameRoute,
  });

  const fetchData = useCallback(async () => {
    try {
      let response;
      if (
        checkPagesRouteForEnslaved(styleNameRoute) &&
        varNameEnslavedVoyageOutcome === varName
      ) {
        response = await fetchEnslavedVoyageOutcome(dataSend);
      } else {
        // For other cases, just fetch the static list - no filters needed
        const fetchFunction = FETCH_FUNCTION_MAP[varName];
        if (!fetchFunction) return;
        response = await fetchFunction();
      }

      if (!response) return;

      if (
        checkPagesRouteForEnslaved(styleNameRoute) &&
        varNameEnslavedVoyageOutcome === varName
      ) {
        setMultipleOptionsList(response as MultiselectListProps[]);
      } else {
        const { data } = response as { data: MultiselectListProps[] };
        setMultipleOptionsList(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleNameRoute, varName]);

  // Only re-fetch when the component mounts or when varName/styleNameRoute changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { multipleOptionsList, fetchData };
};

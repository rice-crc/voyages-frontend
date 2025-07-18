import { useEffect, useState } from 'react';

import { setFilterObject } from '@/redux/getFilterSlice';
import { AppDispatch } from '@/redux/store';
import { FILTER_OBJECT_KEY } from '@/share/CONST_DATA';
import { Filter, MultiselectListProps } from '@/share/InterfaceTypes';

export const useStoredFilters = (varName: string, dispatch: AppDispatch) => {
  const [multipleList, setMultipleList] = useState<MultiselectListProps[]>([]);

  useEffect(() => {
    const loadStoredFilters = () => {
      try {
        const storedValue = localStorage.getItem(FILTER_OBJECT_KEY);
        if (!storedValue) return;

        const parsedValue = JSON.parse(storedValue);
        const filter: Filter[] = parsedValue.filter;

        if (!filter?.length) return;

        const filterByVarName = filter.find(
          (filterItem) => filterItem.varName === varName,
        );
        if (!filterByVarName) return;

        const multipleList: string[] = filterByVarName.searchTerm as string[];
        const values = multipleList.map<MultiselectListProps>(
          (name: string) => ({ name }),
        );

        setMultipleList(values);
        dispatch(setFilterObject(filter));
      } catch (error) {
        console.error('Error loading stored filters:', error);
      }
    };

    loadStoredFilters();
  }, [dispatch, varName]);

  return { multipleList, setMultipleList };
};

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setRowData } from '@/redux/getTableSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { TableListPropsRequest } from '@/share/InterfaceTypes';
import { StateRowData } from '@/share/InterfaceTypesTable';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';

// Extracted types
interface ColumnDef {
  context?: {
    fieldToSort: string[];
  };
}

interface Column {
  colId: string;
  sort: string | null;
  colDef: ColumnDef;
  isSortAscending: () => boolean;
  isSortDescending: () => boolean;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}

interface CustomHeaderTableProps {
  showColumnMenu: (ref: React.RefObject<HTMLDivElement> | null) => void;
  column: Column;
  setSort: (order: string, shiftKey: boolean) => void;
  enableMenu: boolean;
  menuIcon: string;
  enableSorting: boolean;
  displayName: string;
  pageSize: number;
  setSortColumn: React.Dispatch<React.SetStateAction<string[]>>;
  ascSort: string;
  descSort: string;
}

type SortOrder = 'asc' | 'desc';

const CustomHeaderTable: React.FC<CustomHeaderTableProps> = ({
  column,
  setSort,
  enableSorting,
  displayName,
  pageSize,
  setSortColumn,
  ascSort,
  descSort,
}) => {
  // State
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Selectors
  const { page } = useSelector(
    (state: RootState) => state.getTableData as StateRowData,
  );
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch,
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );

  // Hooks
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = usePageRouter();

  // Effects
  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);

  // Memoized values
  const filters = useMemo(
    () =>
      filtersDataSend(
        filtersObj,
        styleName!,
        clusterNodeKeyVariable,
        clusterNodeValue,
      ),
    [filtersObj, styleName, clusterNodeKeyVariable, clusterNodeValue],
  );

  const processedFilters = useMemo(() => {
    if (!filters) return undefined;
    return filters.map((filter) => {
      const { ...filteredFilter } = filter;
      return filteredFilter;
    });
  }, [filters]);

  const baseRequestData: TableListPropsRequest = useMemo(
    () => ({
      filter: processedFilters || [],
      page: Number(page + 1),
      page_size: Number(currentPageSize),
    }),
    [processedFilters, page, currentPageSize],
  );

  // Helper functions
  const getApiFunction = useCallback(() => {
    if (checkPagesRouteForVoyages(styleName!)) {
      return fetchVoyageOptionsAPI;
    }
    if (checkPagesRouteForEnslaved(styleName!)) {
      return fetchEnslavedOptionsList;
    }
    if (checkPagesRouteForEnslavers(styleName!)) {
      return fetchEnslaversOptionsList;
    }
    return null;
  }, [styleName]);

  const createSortOrder = useCallback(
    (sortOrder: SortOrder, sortingFields: string[]) => {
      if (sortingFields.length === 0) return [];
      return sortOrder === 'desc'
        ? sortingFields
        : sortingFields.map((field) => `-${field}`);
    },
    [],
  );

  // Main data fetching function
  const fetchData = useCallback(
    async (sortOrder: SortOrder, sortingFields: string[]) => {
      const apiFunction = getApiFunction();
      if (!apiFunction) return;

      const requestData = { ...baseRequestData };

      // Add global search if present
      if (inputSearchValue) {
        requestData.global_search = inputSearchValue;
      }

      // Add sorting if fields are provided
      if (sortingFields.length > 0) {
        const orderBy = createSortOrder(sortOrder, sortingFields);
        setSortColumn(orderBy);
        requestData.order_by = orderBy;
      }

      try {
        const response = await dispatch(apiFunction(requestData)).unwrap();
        if (response?.data?.results) {
          dispatch(setRowData(response.data.results));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },
    [
      baseRequestData,
      inputSearchValue,
      dispatch,
      getApiFunction,
      createSortOrder,
      setSortColumn,
    ],
  );

  // Event handlers
  const handleSortRequest = useCallback(
    (
      order: SortOrder,
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>,
    ) => {
      setSort(order, event.shiftKey);
      const currentSortOrder: SortOrder = column.isSortAscending()
        ? 'asc'
        : 'desc';
      const sortingFields = column.colDef?.context?.fieldToSort || [];

      fetchData(currentSortOrder, sortingFields);
    },
    [setSort, column, fetchData],
  );

  // Render sorting buttons
  const renderSortButtons = () => {
    if (!enableSorting) return null;

    return (
      <div className="sort-buttons" style={{ display: 'flex' }}>
        <button
          type="button"
          onClick={(event) =>
            descSort !== 'active' && handleSortRequest('desc', event)
          }
          onTouchEnd={(event) => handleSortRequest('desc', event)}
          className={`customSortDownLabel ${descSort}`}
          aria-label="Sort descending"
          disabled={descSort === 'active'}
        >
          <i className="fa fa-long-arrow-alt-down" />
        </button>
        <button
          type="button"
          onClick={(event) =>
            ascSort !== 'active' && handleSortRequest('asc', event)
          }
          onTouchEnd={(event) => handleSortRequest('asc', event)}
          className={`customSortUpLabel ${ascSort}`}
          aria-label="Sort ascending"
          disabled={ascSort === 'active'}
        >
          <i className="fa fa-long-arrow-alt-up" />
        </button>
      </div>
    );
  };

  return (
    <div className="customHeaderLabel-box">
      <div
        className="customHeaderLabel"
        style={{ color: getHeaderColomnColor(styleName!) }}
      >
        {displayName}
      </div>
      {renderSortButtons()}
    </div>
  );
};

export default CustomHeaderTable;

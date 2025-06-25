/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setRowData, setPage } from '@/redux/getTableSlice';
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
interface Props {
  showColumnMenu: (ref: React.RefObject<HTMLDivElement> | null) => void;
  column: {
    colId: string;
    sort: string | null;
    colDef: unknown;
    isSortAscending: () => boolean;
    isSortDescending: () => boolean;
    addEventListener: (event: string, callback: () => void) => void;
    removeEventListener: (event: string, callback: () => void) => void;
  };
  setSort: (order: string, shiftKey: boolean) => void;
  enableMenu: boolean;
  menuIcon: string;
  enableSorting: boolean;
  displayName: string;
  pageSize: number;
  setSortColumn: React.Dispatch<React.SetStateAction<string[]>>;
}

const CustomHeaderTable: React.FC<Props> = (props) => {
  const {
    column,
    setSort,
    enableSorting,
    displayName,
    pageSize,
    setSortColumn,
  } = props;
  // Add state to track pageSize
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Update currentPageSize when prop changes
  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);

  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const dispatch: AppDispatch = useDispatch();
  const [ascSort, setAscSort] = useState<string>('inactive');
  const [descSort, setDescSort] = useState<string>('inactive');
  const { styleName } = usePageRouter();
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch,
  );
  const { page } = useSelector(
    (state: RootState) => state.getTableData as StateRowData,
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );

  const onSortChanged = useCallback(() => {
    console.log('sort: ', column.isSortAscending());
    console.log({ ascSort, descSort });
    setAscSort(column.isSortAscending() ? 'active' : 'inactive');
    setDescSort(column.isSortDescending() ? 'active' : 'inactive');
    dispatch(setPage(page));
  }, [column, dispatch, page]);

  const onSortRequested = (
    order: string,
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    setSort(order, event.shiftKey);
    const sortOrder = column.isSortAscending() ? 'asc' : 'desc';

    fetchData(sortOrder, (column.colDef as any)?.context?.fieldToSort);
  };

  useEffect(() => {
    props.column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();
    return () => {
      props.column.removeEventListener('sortChanged', onSortChanged);
    };
  }, [onSortChanged, props.column]);

  const filters = filtersDataSend(
    filtersObj,
    styleName!,
    clusterNodeKeyVariable,
    clusterNodeValue,
  );
  const newFilters =
    filters !== undefined &&
    filters!.map((filter) => {
      const { ...filteredFilter } = filter;
      return filteredFilter;
    });

  const dataSend: TableListPropsRequest = useMemo(
    () => ({
      filter: newFilters || [],
      page: Number(page + 1),
      page_size: Number(currentPageSize), // Use currentPageSize instead of pageSize
    }),
    [newFilters, page, currentPageSize],
  );

  const fetchData = async (sortOrder: string, sortingOrder: string[]) => {
    const requestData = { ...dataSend };
    if (inputSearchValue) {
      requestData.global_search = inputSearchValue;
    }

    if (sortOrder === 'asc') {
      if (sortingOrder?.length > 0) {
        const sort = sortingOrder[0];
        setSortColumn([sort]);
        requestData.order_by = [sort];
      }
    } else if (sortOrder === 'desc') {
      if (sortingOrder?.length > 0) {
        const sort = `-${sortingOrder[0]}`;
        setSortColumn([sort]);
        requestData.order_by = [sort];
      }
    }
    try {
      let response;
      if (checkPagesRouteForVoyages(styleName!)) {
        response = await dispatch(fetchVoyageOptionsAPI(requestData)).unwrap();
      } else if (checkPagesRouteForEnslaved(styleName!)) {
        response = await dispatch(
          fetchEnslavedOptionsList(requestData),
        ).unwrap();
      } else if (checkPagesRouteForEnslavers(styleName!)) {
        response = await dispatch(
          fetchEnslaversOptionsList(requestData),
        ).unwrap();
      }
      if (response) {
        const { results } = response.data;
        dispatch(setRowData(results));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  let sort: React.ReactNode = null;
  if (enableSorting) {
    sort = (
      <div
        style={{
          display: 'flex',
        }}
      >
        <button
          type="button"
          onClick={(event) => onSortRequested('asc', event)}
          onTouchEnd={(event) => onSortRequested('asc', event)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSortRequested('asc', event);
            }
          }}
          className={`customSortDownLabel ${ascSort}`}
          aria-label="Sort ascending"
        >
          <i className="fa fa-long-arrow-alt-down"></i>
        </button>
        <button
          type="button"
          onClick={(event) => onSortRequested('desc', event)}
          onTouchEnd={(event) => onSortRequested('desc', event)}
          className={`customSortUpLabel ${descSort}`}
        >
          <i className="fa fa-long-arrow-alt-up"></i>
        </button>
        {/* <div
          onClick={(event) => onSortRequested('asc', event)}
          onTouchEnd={(event) => onSortRequested('asc', event)}
          className={`customSortDownLabel ${ascSort}`}
        >
          <i className="fa fa-long-arrow-alt-down"></i>
        </div>
        <div
          onClick={(event) => onSortRequested('desc', event)}
          onTouchEnd={(event) => onSortRequested('desc', event)}
          className={`customSortUpLabel ${descSort}`}
        >
          <i className="fa fa-long-arrow-alt-up"></i>
        </div> */}
      </div>
    );
  }

  return (
    <div className="customHeaderLabel-box">
      <div
        className="customHeaderLabel"
        style={{ color: getHeaderColomnColor(styleName!) }}
      >
        {displayName}
      </div>
      {sort}
    </div>
  );
};

export default CustomHeaderTable;

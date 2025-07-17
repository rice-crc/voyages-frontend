/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';

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
  ascSort: string;
  descSort: string;
}

const CustomHeaderTable: React.FC<Props> = (props) => {
  const {
    column,
    setSort,
    enableSorting,
    displayName,
    pageSize,
    setSortColumn,
    ascSort,
    descSort,
  } = props;
  const { page } = useSelector(
    (state: RootState) => state.getTableData as StateRowData,
  );
  // Add state to track pageSize
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Update currentPageSize when prop changes
  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);

  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = usePageRouter();
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch,
  );

  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );

  const onSortRequested = (
    order: string,
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    setSort(order, event.shiftKey);
    const sortOrder = column.isSortAscending() ? 'asc' : 'desc';

    fetchData(sortOrder, (column.colDef as any)?.context?.fieldToSort);
  };

  const filters = filtersDataSend(
    filtersObj,
    styleName!,
    clusterNodeKeyVariable,
    clusterNodeValue,
  );

  const newFilters = useMemo(() => {
    return filters === undefined
      ? undefined
      : filters!.map((filter) => {
        const { ...filteredFilter } = filter;
        return filteredFilter;
      });
  }, [filters]);

  const dataSend: TableListPropsRequest = useMemo(
    () => ({
      filter: newFilters || [],
      page: Number(page + 1),
      page_size: Number(currentPageSize),
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
    console.log({requestData})
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
          className={`customSortDownLabel ${ascSort}`}
          aria-label="Sort ascending"
        >
          <i className="fa fa-long-arrow-alt-down"></i>
        </button>
        <button
          onClick={(event) => onSortRequested('desc', event)}
          onTouchEnd={(event) => onSortRequested('desc', event)}
          className={`customSortUpLabel ${descSort}`}
          aria-label="Sort descending"
        >
          <i className="fa fa-long-arrow-alt-up"></i>
        </button>
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

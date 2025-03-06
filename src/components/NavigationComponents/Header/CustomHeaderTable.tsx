import { setData, setPage } from '@/redux/getTableSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { TableListPropsRequest } from '@/share/InterfaceTypes';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { StateRowData } from '@/share/InterfaceTypesTable';

interface Props {
  showColumnMenu: (ref: React.RefObject<HTMLDivElement> | null) => void;
  column: {
    colId: string;
    sort: string | null;
    colDef: any;
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
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { page } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );

  const onSortChanged = () => {
    setAscSort(column.isSortAscending() ? 'active' : 'inactive');
    setDescSort(column.isSortDescending() ? 'active' : 'inactive');
    dispatch(setPage(page));
  };

  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setSort(order, event.shiftKey);
    const sortOrder = column.isSortAscending() ? 'asc' : 'desc';

    fetchData(sortOrder, column.colDef?.context?.fieldToSort);
  };

  useEffect(() => {
    props.column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();
    return () => {
      props.column.removeEventListener('sortChanged', onSortChanged);
    };
  }, []);

  const filters = filtersDataSend(
    filtersObj,
    styleName!,
    clusterNodeKeyVariable,
    clusterNodeValue
  );
  const newFilters =
    filters !== undefined &&
    filters!.map((filter) => {
      const { label, title, ...filteredFilter } = filter;
      return filteredFilter;
    });

  const dataSend: TableListPropsRequest = useMemo(() => ({
    filter: newFilters || [],
    page: Number(page + 1),
    page_size: Number(currentPageSize), // Use currentPageSize instead of pageSize
  }), [newFilters, page, currentPageSize]);

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
        response = await dispatch(fetchEnslavedOptionsList(requestData)).unwrap();
      } else if (checkPagesRouteForEnslavers(styleName!)) {
        response = await dispatch(fetchEnslaversOptionsList(requestData)).unwrap();
      }
      if (response) {
        const { results } = response.data;
        dispatch(setData(results));
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
        <div
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
        </div>
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

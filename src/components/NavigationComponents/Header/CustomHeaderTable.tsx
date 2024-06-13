import { setData } from '@/redux/getTableSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { Filter, TableListPropsRequest } from '@/share/InterfaceTypes';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';

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
  page: number
  pageSize: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setSortColumn: React.Dispatch<React.SetStateAction<string[]>>
}

const CustomHeaderTable: React.FC<Props> = (props) => {
  const {
    column,
    setSort,
    enableSorting, setPage,
    displayName, page, pageSize, setSortColumn
  } = props;

  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const dispatch: AppDispatch = useDispatch();
  const [ascSort, setAscSort] = useState<string>('inactive');
  const [descSort, setDescSort] = useState<string>('inactive');
  const { styleName } = usePageRouter()
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { clusterNodeKeyVariable, clusterNodeValue } =
    useSelector((state: RootState) => state.getNodeEdgesAggroutesMapData);

  const onSortChanged = () => {
    setAscSort(column.isSortAscending() ? 'active' : 'inactive');
    setDescSort(column.isSortDescending() ? 'active' : 'inactive')
    setPage(page)
  };

  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setSort(order, event.shiftKey);
    const sortOrder = column.isSortAscending() ? 'asc' : 'desc';

    fetchData(sortOrder, column.colDef.sortingOrder);
  };

  useEffect(() => {
    props.column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();
    return () => {
      props.column.removeEventListener('sortChanged', onSortChanged);
    }
  }, []);

  const filters = filtersDataSend(filtersObj, styleName!, clusterNodeKeyVariable, clusterNodeValue)
  const newFilters = filters !== undefined && filters!.map(filter => {
    const { label, title, ...filteredFilter } = filter;
    return filteredFilter;
  });
  const dataSend: TableListPropsRequest = {
    filter: newFilters || [],
    page: Number(page + 1),
    page_size: Number(pageSize),
  };



  const fetchData = async (sortOrder: string, sortingOrder: string[]) => {

    if (inputSearchValue) {
      dataSend['global_search'] = inputSearchValue;
    }
    if (sortOrder === 'asc') {
      if (sortingOrder?.length > 0) {

        sortingOrder.forEach((sort: string) => {
          setSortColumn([sort])
          return dataSend['order_by'] = [sort]
        });
      }
    } else if (sortOrder === 'desc') {
      if (sortingOrder?.length > 0) {
        sortingOrder.forEach(
          (sort: string) => {
            setSortColumn([`-${sort}`])
            return dataSend['order_by'] = [`-${sort}`]
          }
        );
      }
    }

    try {
      let response;
      if (checkPagesRouteForVoyages(styleName!)) {
        response = await dispatch(fetchVoyageOptionsAPI(dataSend)).unwrap();
      } else if (checkPagesRouteForEnslaved(styleName!)) {
        response = await dispatch(fetchEnslavedOptionsList(dataSend)).unwrap()
      } else if (checkPagesRouteForEnslavers(styleName!)) {
        response = await dispatch(fetchEnslaversOptionsList(dataSend)).unwrap();
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
          onClick={(event) => onSortRequested("asc", event)}
          onTouchEnd={(event) => onSortRequested("asc", event)}
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
      <div className="customHeaderLabel" style={{ color: getHeaderColomnColor(styleName!) }}>{displayName}</div>
      {sort}
    </div>
  );
};

export default CustomHeaderTable;

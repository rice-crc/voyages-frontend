import { setData } from '@/redux/getTableSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { TableListPropsRequest } from '@/share/InterfaceTypes';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';

interface Props {
  showColumnMenu: (ref: React.RefObject<HTMLDivElement> | null) => void;
  column: {
    colId: string;
    sort: string | null;
    colDef: any;
    isSortAscending: () => boolean;
    isSortDescending: () => boolean;
    addEventListener: (event: string, callback: () => void) => void;
  };
  setSort: (order: string, shiftKey: boolean) => void;
  enableMenu: boolean;
  menuIcon: string;
  enableSorting: boolean;
  displayName: string;
  page: number
  pageSize: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const CustomHeaderTable: React.FC<Props> = (props) => {
  const {
    showColumnMenu,
    column,
    setSort,
    enableMenu,
    menuIcon,
    enableSorting, setPage,
    displayName, page, pageSize
  } = props;


  const dispatch: AppDispatch = useDispatch();
  const [ascSort, setAscSort] = useState<string>('inactive');
  const [descSort, setDescSort] = useState<string>('inactive');
  const [noSort, setNoSort] = useState<string>('inactive');

  const refButton = useRef<HTMLDivElement>(null);
  const onMenuClicked = () => {
    showColumnMenu(refButton);
  };
  const { styleName } = usePageRouter()

  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setSort(order, event.shiftKey);
    setAscSort(column.isSortAscending() ? 'active' : 'inactive');
    setDescSort(column.isSortDescending() ? 'active' : 'inactive');
    setNoSort(
      !column.isSortAscending() && !column.isSortDescending()
        ? 'active'
        : 'inactive'
    );

    setPage(page)
    const sortOrder = column.isSortAscending() ? 'asc' : 'desc';
    fetchData(sortOrder, column.colDef.sortingOrder);
  };
  const fetchData = async (sortOrder: string, sortingOrder: string[]) => {
    const dataSend: TableListPropsRequest = {
      filter: [],
      page: Number(page + 1),
      page_size: Number(pageSize),
    };
    if (sortOrder === 'asc') {
      if (sortingOrder.length > 0) {
        sortingOrder.forEach((sort: string) => (dataSend['order_by'] = [sort]));
      }
    } else if (sortOrder === 'desc') {
      if (sortingOrder.length > 0) {
        sortingOrder.forEach(
          (sort: string) => (dataSend['order_by'] = [`-${sort}`])
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



  let menu: React.ReactNode = null;
  if (enableMenu) {
    menu = (
      <div
        ref={refButton}
        className="customHeaderMenuButton"
        onClick={() => onMenuClicked()}
      >
        <i className={`fa ${menuIcon}`}></i>
      </div>
    );
  }

  let sort: React.ReactNode = null;
  if (enableSorting) {
    sort = (
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          onClick={(event) => {
            onSortRequested('asc', event)
          }}
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
      <div className="customHeaderLabel">{displayName}</div>
      {sort}
    </div>
  );
};

export default CustomHeaderTable;

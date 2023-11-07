import { fetchVoyageOptionsData } from '@/fetch/voyagesFetch/fetchVoyageOptionsData';
import { setData } from '@/redux/getTableSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@/style/table.scss';
import { AFRICANORIGINS, ALLENSLAVED, ALLENSLAVERS, ALLVOYAGES, ENSLAVEDTEXAS } from '@/share/CONST_DATA';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import { usePageRouter } from '@/hooks/usePageRouter';
import { TYPESOFDATASET } from '@/share/InterfaceTypes';

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
}

const CustomHeader: React.FC<Props> = (props) => {
  const {
    showColumnMenu,
    column,
    setSort,
    enableMenu,
    menuIcon,
    enableSorting,
    displayName,
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

  const { pathNameVoyages, pathNameEnslaved, pathNameEnslavers } = useSelector((state: RootState) => state.getPathName);

  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setSort(order, event.shiftKey);
    onSortChanged();
  };

  const fetchData = async (sortOrder: string, sortingOrder: string[]) => {
    const dataSend: { [key: string]: string[] } = {};
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

      if (pathNameVoyages === TYPESOFDATASET.allVoyages || styleName === TYPESOFDATASET.allVoyages || styleName === TYPESOFDATASET.intraAmerican || styleName === TYPESOFDATASET.transatlantic) {
        response = await dispatch(fetchVoyageOptionsData(dataSend)).unwrap();

      } else if (pathNameEnslaved === ALLENSLAVED || styleName === ALLENSLAVED || styleName === AFRICANORIGINS) {
        response = await dispatch(fetchEnslavedOptionsList(dataSend)).unwrap();
      } else if (pathNameEnslavers === ALLENSLAVERS) {
        response = await dispatch(fetchEnslaversOptionsList(dataSend)).unwrap();
      }
      if (response) {
        dispatch(setData(response));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  let isMounted = true;

  const onSortChanged = () => {
    if (isMounted) {
      setAscSort(column.isSortAscending() ? 'active' : 'inactive');
      setDescSort(column.isSortDescending() ? 'active' : 'inactive');
      setNoSort(
        !column.isSortAscending() && !column.isSortDescending()
          ? 'active'
          : 'inactive'
      );

      const sortOrder = column.isSortAscending() ? 'asc' : 'desc';
      fetchData(sortOrder, column.colDef.sortingOrder);
    }
  };

  useEffect(() => {
    column.addEventListener('sortChanged', onSortChanged);
    return () => {
      isMounted = false;
    };
  }, [pathNameEnslaved, pathNameEnslavers, pathNameVoyages]);

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
          display: 'inline-block',
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
      <div className="customHeaderLabel">{displayName}</div>
      {sort}
    </div>
  );
};

export default CustomHeader;

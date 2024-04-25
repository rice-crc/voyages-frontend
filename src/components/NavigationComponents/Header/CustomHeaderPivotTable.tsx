import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@/style/table.scss';
import { Filter, PivotTablesPropsRequest } from '@/share/InterfaceTypes';
import { fetchPivotCrosstabsTables } from '@/fetch/voyagesFetch/fetchPivotCrosstabsTables';
import { setPivotTablColumnDefs, setRowPivotTableData } from '@/redux/getPivotTablesDataSlice';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';
import { usePageRouter } from '@/hooks/usePageRouter';
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
  columns: string[]
  rows: string;
  rows_label: string;
  agg_fn: string;
  binsize: number | null
  value_field: string;
  offset: number
  limit: number
  page: number
  setTotalResultsCount: React.Dispatch<React.SetStateAction<number>>
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const CustomHeaderPivotTable: React.FC<Props> = (props) => {
  const {
    column,
    setSort,
    enableSorting,
    displayName, columns,
    rows,
    rows_label,
    agg_fn,
    binsize,
    value_field,
    offset,
    limit,
    setTotalResultsCount, page, setPage
  } = props;

  const dispatch: AppDispatch = useDispatch();
  const [ascSort, setAscSort] = useState<string>('inactive');
  const [descSort, setDescSort] = useState<string>('inactive');
  const { styleName } = usePageRouter()
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const filters = filtersDataSend(filtersObj, styleName!)

  useEffect(() => {
    const headerColor = getHeaderColomnColor(styleName!);
    document.documentElement.style.setProperty('--header-color--', headerColor);
    document.documentElement.style.setProperty('--ag-secondary-foreground-color', headerColor);
    document.documentElement.style.setProperty('--ag-header-foreground-color', headerColor);
  }, []);

  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setSort(order, event.shiftKey);
    setAscSort(column.isSortAscending() ? 'active' : 'inactive');
    setDescSort(column.isSortDescending() ? 'active' : 'inactive');
    setPage(page)
    const sortOrder = column.isSortAscending() ? 'asc' : 'desc';
    fetchDataPivotTable(sortOrder, [column.colDef.field])
  };

  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const dataSend: PivotTablesPropsRequest = {
    columns: columns,
    rows: rows,
    rows_label: rows_label,
    agg_fn: agg_fn,
    binsize: binsize!,
    value_field: value_field,
    offset: offset,
    limit: limit,
    filter: filters || [],
  }

  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue
  }

  const fetchDataPivotTable = async (sortOrder: string, sortingOrder: string[]) => {
    if (sortOrder === 'asc') {
      if (sortingOrder?.length > 0) {
        sortingOrder.forEach((sort: string) => (dataSend['order_by'] = [sort]));
      }
    } else if (sortOrder === 'desc') {
      if (sortingOrder?.length > 0) {
        sortingOrder.forEach(
          (sort: string) => (dataSend['order_by'] = [`-${sort}`])
        );
      }
    }

    try {
      const response = await dispatch(
        fetchPivotCrosstabsTables(dataSend)
      ).unwrap();
      if (response) {
        const { tablestructure, data, metadata } = response.data
        dispatch(setPivotTablColumnDefs(tablestructure));
        dispatch(setRowPivotTableData(data));
        setTotalResultsCount(metadata.total_results_count)
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

export default CustomHeaderPivotTable;


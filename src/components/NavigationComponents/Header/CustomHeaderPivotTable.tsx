import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@/style/table.scss';
import { PivotTableResponse, PivotTablesPropsRequest } from '@/share/InterfaceTypes';
import { fetchPivotCrosstabsTables } from '@/fetch/voyagesFetch/fetchPivotCrosstabsTables';
import { setPivotTablColumnDefs, setRowPivotTableData, setTotalResultsCount } from '@/redux/getPivotTablesDataSlice';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';
import { usePageRouter } from '@/hooks/usePageRouter';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { customValueFormatter } from '@/utils/functions/customValueFormatter';
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
  dataSend: PivotTablesPropsRequest
  displayName?: string;
}

const CustomHeaderPivotTable: React.FC<Props> = (props) => {
  const {
    column,
    setSort,
    enableSorting,
    displayName,
  } = props;

  const dispatch: AppDispatch = useDispatch();
  const [ascSort, setAscSort] = useState<string>('inactive');
  const [descSort, setDescSort] = useState<string>('inactive');
  const { styleName } = usePageRouter()
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { offset, pivotValueOptions, aggregation, rowsPerPage } = useSelector(
    (state: RootState) => state.getPivotTablesData
  );
  const filters = filtersDataSend(filtersObj, styleName!)
  const newFilters = filters!.map(filter => {
    const { label, title, ...filteredFilter } = filter;
    return filteredFilter;
  });
  const onSortChanged = () => {
    setAscSort(column!.isSortAscending() ? 'active' : 'inactive');
    setDescSort(column!.isSortDescending() ? 'active' : 'inactive');
  };
  const onSortRequested = (
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (setSort) {
      setSort(order, event.shiftKey);
    }

    const sortOrder = column!.isSortAscending() ? 'asc' : 'desc';
    fetchDataPivotTable(sortOrder, [column.colDef.field])
  };

  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  const {
    row_vars, rows_label, binsize,
    column_vars,
    cell_vars,
  } = pivotValueOptions;
  const updatedRowsValue = row_vars.replace(/_(\d+)$/, '');
  const updatedRowsLabel = rows_label.replace(/_(\d+)$/, '');

  const dataSend: PivotTablesPropsRequest = {
    columns: column_vars,
    rows: updatedRowsValue,
    rows_label: updatedRowsLabel,
    agg_fn: aggregation,
    binsize: binsize!,
    value_field: cell_vars,
    offset: offset,
    limit: rowsPerPage,
    filter: newFilters || [],
  }

  const fetchDataPivotTable = async (sortOrder: string, sortingOrder: string[]) => {
    if (inputSearchValue) {
      dataSend['global_search'] = inputSearchValue
    }
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
        const { tablestructure, data, metadata } = response.data as PivotTableResponse
        tablestructure.forEach(structure => {
          if (structure.children) {
            structure.children.forEach(child => {
              if (child.field === 'Year range') {
                child.type = 'leftAligned'
                child.cellClass = 'ag-left-aligned-cell'
              } else if (child.field === 'All') {
                child.type = 'rightAligned'
                child.cellClass = 'ag-right-aligned-cell'
                child.valueFormatter = (params: any) => customValueFormatter(params)
              }
            });
          } else {
            structure.type = 'rightAligned'
            structure.cellClass = 'ag-right-aligned-cell'
            structure.valueFormatter = (params: any) => customValueFormatter(params)
          }
        });
        dispatch(setPivotTablColumnDefs(tablestructure));
        dispatch(setRowPivotTableData(data));
        dispatch(setTotalResultsCount(metadata.total_results_count))
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    props.column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();

    const headerColor = getHeaderColomnColor(styleName!);
    document.documentElement.style.setProperty('--header-color--', headerColor);
    document.documentElement.style.setProperty('--ag-secondary-foreground-color', headerColor);
    document.documentElement.style.setProperty('--ag-header-foreground-color', headerColor);
    return () => {
      props.column.removeEventListener('sortChanged', onSortChanged);
    }
  }, []);

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


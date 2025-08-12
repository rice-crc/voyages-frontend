/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import '@/style/table.scss';
import { fetchPivotCrosstabsTables } from '@/fetch/voyagesFetch/fetchPivotCrosstabsTables';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  setPivotTablColumnDefs,
  setRowPivotTableData,
  setTotalResultsCount,
} from '@/redux/getPivotTablesDataSlice';
import { AppDispatch, RootState } from '@/redux/store';
import {
  PivotTableResponse,
  PivotTablesPropsRequest,
} from '@/share/InterfaceTypes';
import { customValueFormatter } from '@/utils/functions/customValueFormatter';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';

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
  displayName?: string;
}

type SortOrder = 'asc' | 'desc';

const CustomHeaderPivotTable: React.FC<Props> = (props) => {
  const { column, setSort, enableSorting, displayName } = props;

  const dispatch: AppDispatch = useDispatch();
  const [ascSort, setAscSort] = useState<string>('inactive');
  const [descSort, setDescSort] = useState<string>('inactive');
  const { styleName } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { offset, pivotValueOptions, aggregation, rowsPerPage } = useSelector(
    (state: RootState) => state.getPivotTablesData,
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );

  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch,
  );

  const filters = useMemo(
    () =>
      filtersDataSend(
        filtersObj,
        styleName!,
        clusterNodeKeyVariable,
        clusterNodeValue,
      ),
    [filtersObj, styleName, clusterNodeKeyVariable, clusterNodeValue]
  );
  
  const processedFilters = useMemo(() => {
    if (!filters) return undefined;
    return filters.map((filter) => {
      const { ...filteredFilter } = filter;
      return filteredFilter;
    });
  }, [filters]);

  const createSortOrder = useCallback(
    (sortOrder: SortOrder, sortingFields: string[]) => {
      if (sortingFields.length === 0) return [];

      return sortOrder === 'desc'
        ? sortingFields
        : sortingFields.map((field) => `-${field}`);
    },
    [],
  );

  const fetchDataPivotTable = useCallback(async (
    sortOrder: SortOrder,
    sortingOrder: string[],
  ) => {
    // Get fresh values from Redux state at the time of sorting
    const { row_vars, rows_label, binsize, column_vars, cell_vars } = pivotValueOptions;
    const updatedRowsValue = row_vars.replace(/_(\d+)$/, '');
    const updatedRowsLabel = rows_label.replace(/_(\d+)$/, '');

    const requestData: PivotTablesPropsRequest = {
      columns: column_vars,
      rows: updatedRowsValue,
      rows_label: updatedRowsLabel,
      agg_fn: aggregation,
      binsize: binsize!,
      value_field: cell_vars,
      offset: offset,
      limit: rowsPerPage,
      filter: processedFilters || [],
    };

    if (inputSearchValue) {
      requestData.global_search = inputSearchValue;
    }

    // Add sorting if fields are provided
    if (sortingOrder?.length > 0) {
      const orderBy = createSortOrder(sortOrder, sortingOrder);
      requestData.order_by = orderBy;
    }

    try {
      const response = await dispatch(
        fetchPivotCrosstabsTables(requestData),
      ).unwrap();
      
      if (response) {
        const { tablestructure, data, metadata } =
          response.data as PivotTableResponse;
        tablestructure.forEach((structure) => {
          if (structure.children) {
            structure.children.forEach((child) => {
              if (
                child.field === 'Year range' ||
                child.field === 'Año Rango' ||
                child.field === 'Intervalo de anos'
              ) {
                child.type = 'leftAligned';
                child.cellClass = 'ag-left-aligned-cell';
              } else if (child.field === 'All') {
                child.type = 'rightAligned';
                child.cellClass = 'ag-right-aligned-cell';
                child.valueFormatter = (params: any) =>
                  customValueFormatter(params);
              }
            });
          } else {
            structure.type = 'rightAligned';
            structure.cellClass = 'ag-right-aligned-cell';
            structure.valueFormatter = (params: any) =>
              customValueFormatter(params);
          }
        });
        dispatch(setPivotTablColumnDefs(tablestructure));
        dispatch(setRowPivotTableData(data));
        dispatch(setTotalResultsCount(metadata.total_results_count));
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [
    pivotValueOptions,
    aggregation,
    offset,
    rowsPerPage,
    processedFilters,
    inputSearchValue,
    dispatch,
    createSortOrder,
  ]);

  const onSortChanged = useCallback(() => {
    setAscSort(column?.isSortAscending() ? 'active' : 'inactive');
    setDescSort(column?.isSortDescending() ? 'active' : 'inactive');
  }, [column]);
  
  const onSortRequested = useCallback((
    order: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (setSort) {
      setSort(order, (event as any).shiftKey);
    }

    const sortOrder = column!.isSortAscending() ? 'asc' : 'desc';
    fetchDataPivotTable(sortOrder, [column.colDef.field]);
  }, [setSort, column, fetchDataPivotTable]);

  useEffect(() => {
    props.column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();

    const headerColor = getHeaderColomnColor(styleName!);
    document.documentElement.style.setProperty('--header-color--', headerColor);
    document.documentElement.style.setProperty(
      '--ag-secondary-foreground-color',
      headerColor,
    );
    document.documentElement.style.setProperty(
      '--ag-header-foreground-color',
      headerColor,
    );
    return () => {
      props.column.removeEventListener('sortChanged', onSortChanged);
    };
  }, [onSortChanged, props.column, styleName]);

  let sort: React.ReactNode = null;
  if (enableSorting) {
    sort = (
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={(event) => onSortRequested('asc', event)}
          onTouchEnd={(event) => onSortRequested('asc', event)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSortRequested('asc', { shiftKey: e.shiftKey } as any);
          }}
          className={`customSortUpLabel-pivot ${ascSort}`}
        >
          <i className="fa fa-long-arrow-alt-down"></i>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={(event) => onSortRequested('desc', event)}
          onTouchEnd={(event) => onSortRequested('desc', event)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSortRequested('desc', { shiftKey: e.shiftKey } as any);
          }}
          className={`customSortDownLabel-pivot ${descSort}`}
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

export default CustomHeaderPivotTable;
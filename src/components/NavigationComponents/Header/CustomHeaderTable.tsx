/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';

import type { CustomHeaderProps } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';

import { useOtherTableCellStructure } from '@/hooks/useOtherTableCellStructure';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setSortColumn, initializeSortColumn } from '@/redux/getTableSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { StateRowData } from '@/share/InterfaceTypesTable';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';

type SortOrder = 'asc' | 'desc' | null;

export interface MyCustomHeaderProps extends CustomHeaderProps {
  menuIcon: string;
  column: any;
}

const CustomHeaderTable = (props: MyCustomHeaderProps) => {
  const { styleName } = usePageRouter();
  const dispatch: AppDispatch = useDispatch();
  const [ascSort, setAscSort] = useState('inactive');
  const [descSort, setDescSort] = useState('inactive');

  const otherTableCellStrructure = useOtherTableCellStructure(styleName!);
  const { sortColumn } = useSelector(
    (state: RootState) => state.getTableData as StateRowData,
  );

  useEffect(() => {
    if (otherTableCellStrructure?.default_order_by && sortColumn.length === 0) {
      dispatch(initializeSortColumn(otherTableCellStrructure.default_order_by));
    }
  }, [otherTableCellStrructure?.default_order_by, sortColumn.length, dispatch]);

  const createSortOrder = useCallback(
    (sortOrder: SortOrder, sortingFields: string[]) => {
      if (sortingFields.length === 0) return [];
      return sortOrder === 'asc'
        ? sortingFields
        : sortingFields.map((field) => `-${field}`);
    },
    [],
  );

  useEffect(() => {
    if (!sortColumn.length) {
      setAscSort('inactive');
      setDescSort('inactive');
      return;
    }

    const sortedField = sortColumn[0];
    const isDescending = sortedField?.startsWith('-');
    const fieldName = isDescending ? sortedField.substring(1) : sortedField;

    // ✅ Get order_by from column context/definition
    // This should come from your generateColumnDef function where you set:
    // colDef: { context: { fieldToSort: cell.order_by } }
    const orderByFields = props.column?.colDef?.context?.fieldToSort || [];

    // ✅ Check if current column's order_by includes the sorted field
    const isMatch = orderByFields.includes(fieldName);

    if (isMatch) {
      if (isDescending) {
        setAscSort('inactive');
        setDescSort('active');
      } else {
        setAscSort('active');
        setDescSort('inactive');
      }
    } else {
      setAscSort('inactive');
      setDescSort('inactive');
    }
  }, [
    sortColumn,
    props.column?.colDef?.context?.fieldToSort,
    props.displayName,
  ]);

  const handleSortRequest = useCallback(
    (
      order: 'asc' | 'desc' | null,
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>,
    ) => {
      props.setSort(order, event.shiftKey);

      // ✅ Use order_by fields from context (set by generateColumnDef)
      const sortingFields = props.column.colDef?.context?.fieldToSort || [];

      if (sortingFields.length > 0) {
        const orderBy = createSortOrder(order, sortingFields);
        dispatch(setSortColumn(orderBy));
      }
    },
    [props, dispatch, createSortOrder],
  );

  const renderSortButtons = () => {
    if (!props.enableSorting) return null;
    return (
      <div className="sort-buttons" style={{ display: 'flex' }}>
        <button
          type="button"
          onClick={(event) => handleSortRequest('desc', event)}
          onTouchEnd={(event) => handleSortRequest('desc', event)}
          className={`customSortDownLabel ${descSort}`}
        >
          <i className="fa fa-long-arrow-alt-down"></i>
        </button>
        <button
          type="button"
          onClick={(event) => handleSortRequest('asc', event)}
          onTouchEnd={(event) => handleSortRequest('asc', event)}
          className={`customSortUpLabel ${ascSort}`}
        >
          <i className="fa fa-long-arrow-alt-up"></i>
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
        {props.displayName}
      </div>
      {renderSortButtons()}
    </div>
  );
};

export default CustomHeaderTable;

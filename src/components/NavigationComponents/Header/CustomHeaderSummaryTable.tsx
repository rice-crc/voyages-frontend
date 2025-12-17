import React, { useCallback, useEffect, useState } from 'react';

import type { CustomHeaderProps } from 'ag-grid-react';

import { usePageRouter } from '@/hooks/usePageRouter';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';

type SortOrder = 'asc' | 'desc' | null;

export interface CustomHeaderTableProps extends CustomHeaderProps {
  menuIcon: string;
  column: any;
}

const CustomHeaderSummaryTable = (props: CustomHeaderTableProps) => {
  const { styleName } = usePageRouter();
  const [ascSort, setAscSort] = useState('inactive');
  const [descSort, setDescSort] = useState('inactive');

  useEffect(() => {
    const updateSortState = () => {
      const sortModel = props.api
        .getColumnState()
        .find((col) => col.colId === props.column.getColId());

      if (!sortModel || !sortModel.sort) {
        setAscSort('inactive');
        setDescSort('inactive');
      } else if (sortModel.sort === 'asc') {
        setAscSort('active');
        setDescSort('inactive');
      } else if (sortModel.sort === 'desc') {
        setAscSort('inactive');
        setDescSort('active');
      }
    };

    // Initial check
    updateSortState();

    // Listen for sort changes from AG-Grid
    const sortChangedListener = () => {
      updateSortState();
    };

    props.api.addEventListener('sortChanged', sortChangedListener);

    return () => {
      props.api.removeEventListener('sortChanged', sortChangedListener);
    };
  }, [props.api, props.column]);

  const handleSortRequest = useCallback(
    (
      order: SortOrder,
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>,
    ) => {
      props.setSort(order, event.shiftKey);

      // const sortingFields = props.column.colDef?.context?.fieldToSort || [];
      // console.log({ sortingFields });

      if (order === 'asc') {
        setAscSort('active');
        setDescSort('inactive');
      } else if (order === 'desc') {
        setAscSort('inactive');
        setDescSort('active');
      } else {
        setAscSort('inactive');
        setDescSort('inactive');
      }
    },
    [props],
  );

  const renderSortButtons = () => {
    if (!props.enableSorting) return null;
    return (
      <div className="sort-buttons" style={{ display: 'flex' }}>
        <button
          type="button"
          onClick={(event) => handleSortRequest('asc', event)}
          onTouchEnd={(event) => handleSortRequest('asc', event)}
          className={`customSortUpLabel ${ascSort}`}
        >
          <i className="fa fa-long-arrow-alt-up"></i>
        </button>
        <button
          type="button"
          onClick={(event) => handleSortRequest('desc', event)}
          onTouchEnd={(event) => handleSortRequest('desc', event)}
          className={`customSortDownLabel ${descSort}`}
        >
          <i className="fa fa-long-arrow-alt-down"></i>
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

export default CustomHeaderSummaryTable;

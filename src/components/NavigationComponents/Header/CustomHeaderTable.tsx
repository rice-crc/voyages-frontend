import React, { useCallback, useEffect, useState } from 'react';

import '@/style/table.scss';
import { SortDirection } from 'ag-grid-community';
import type { CustomHeaderProps } from 'ag-grid-react';
export interface MyCustomHeaderProps extends CustomHeaderProps {
  menuIcon: string;
}

import { usePageRouter } from '@/hooks/usePageRouter';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';

// Extracted types
interface ColumnDef {
  context?: {
    fieldToSort: string[];
  };
}

interface Column {
  colId: string;
  sort: string | null;
  colDef: ColumnDef;
  getSort: () => SortDirection | undefined;
  isSortAscending: () => boolean;
  isSortDescending: () => boolean;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}

interface CustomHeaderTableProps {
  showColumnMenu?: (ref: React.RefObject<HTMLDivElement> | null) => void;
  column: Column;
  setSort: (order: string, shiftKey: boolean) => void;
  enableMenu?: boolean;
  menuIcon?: string;
  enableSorting?: boolean;
  displayName: string;
  pageSize?: number;
  setSortColumn: React.Dispatch<React.SetStateAction<string[]>>;
  ascSort: string;
  descSort: string;
  // New prop to handle sorting externally
  onSortChange?: (sortOrder: 'asc' | 'desc', sortingFields: string[]) => void;
}

type SortOrder = 'asc' | 'desc';

const CustomHeaderTable: React.FC<CustomHeaderTableProps> = ({
  column,
  setSort,
  enableSorting = true,
  displayName,
  setSortColumn,
  // ascSort,
  // descSort,
  onSortChange,
}) => {
  const { styleName } = usePageRouter();
  const [ascSort, setAscSort] = useState('inactive');
  const [descSort, setDescSort] = useState('inactive');

  // Helper function to create sort order
  const createSortOrder = useCallback(
    (sortOrder: SortOrder, sortingFields: string[]) => {
      if (sortingFields.length === 0) return [];
      return sortOrder === 'desc'
        ? sortingFields
        : sortingFields.map((field) => `-${field}`);
    },
    [],
  );

  // Event handlers - NO MORE DATA FETCHING HERE
  const handleSortRequest = useCallback(
    (
      order: SortOrder,
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>,
    ) => {
      setSort(order, event.shiftKey);

      const sortingFields = column.colDef?.context?.fieldToSort || [];

      if (sortingFields.length > 0) {
        // Create the sort order array
        const orderBy = createSortOrder(order, sortingFields);

        // Update the sort column state
        setSortColumn(orderBy);

        // Notify parent component about sort change (if callback provided)
        if (onSortChange) {
          onSortChange(order, sortingFields);
        }
      }
    },
    [setSort, column, createSortOrder, setSortColumn, onSortChange],
  );

  // Render sorting buttons
  const renderSortButtons = () => {
    if (!enableSorting) return null;

    return (
      <div className="sort-buttons" style={{ display: 'flex' }}>
        <button
          type="button"
          onClick={(event) =>
            descSort !== 'active' && handleSortRequest('desc', event)
          }
          onTouchEnd={(event) => handleSortRequest('desc', event)}
          className={`customSortDownLabel ${descSort}`}
          aria-label="Sort descending"
          disabled={descSort === 'active'}
        >
          <i className="fa fa-long-arrow-alt-down" />
        </button>
        <button
          type="button"
          onClick={(event) =>
            ascSort !== 'active' && handleSortRequest('asc', event)
          }
          onTouchEnd={(event) => handleSortRequest('asc', event)}
          className={`customSortUpLabel ${ascSort}`}
          aria-label="Sort ascending"
          disabled={ascSort === 'active'}
        >
          <i className="fa fa-long-arrow-alt-up" />
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
        {displayName}
      </div>
      {renderSortButtons()}
    </div>
  );
};

export default CustomHeaderTable;

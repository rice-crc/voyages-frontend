import React, { useEffect, useRef, useState } from 'react';

import '@/style/table.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
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
  };
  setSort: (order: string, shiftKey: boolean) => void;
  enableMenu: boolean;
  menuIcon: string;
  enableSorting: boolean;
  displayName: string;
}

type SortOrder = 'asc' | 'desc';

const CustomSummaryHeader: React.FC<Props> = (props) => {
  const { styleName } = usePageRouter();
  const [ascSort, setAscSort] = useState('inactive');
  const [descSort, setDescSort] = useState('inactive');
  const [noSort, setNoSort] = useState('inactive');
  const refButton = useRef(null);

  const onMenuClicked = () => {
    props.showColumnMenu(refButton.current);
  };

  const onSortChanged = () => {
    setAscSort(props.column.isSortAscending() ? 'active' : 'inactive');
    setDescSort(props.column.isSortDescending() ? 'active' : 'inactive');
    setNoSort(
      !props.column.isSortAscending() && !props.column.isSortDescending()
        ? 'active'
        : 'inactive',
    );
  };

  const onSortRequested = (
    order: SortOrder,
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>,
  ) => {
    props.setSort(order, event.shiftKey);
  };

  useEffect(() => {
    props.column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();
  }, []);

  let menu = null;
  if (props.enableMenu) {
    menu = (
      <div
        ref={refButton}
        className="customHeaderMenuButton"
        onClick={() => onMenuClicked()}
      >
        <i className={`fa ${props.menuIcon}`}></i>
      </div>
    );
  }

  const renderSortButtons = () => {
    if (!props.enableSorting) return null;
    return (
      <div className="sort-buttons" style={{ display: 'flex' }}>
        <button
          type="button"
          onClick={(event) =>
            descSort !== 'active' && onSortRequested('desc', event)
          }
          onTouchEnd={(event) => onSortRequested('desc', event)}
          className={`customSortDownLabel ${descSort}`}
          aria-label="Sort descending"
          disabled={descSort === 'active'}
        >
          <i className="fa fa-long-arrow-alt-down" />
        </button>
        <button
          type="button"
          onClick={(event) =>
            ascSort !== 'active' && onSortRequested('asc', event)
          }
          onTouchEnd={(event) => onSortRequested('asc', event)}
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
        {menu}
      </div>
      {renderSortButtons()}
    </div>
  );
};
export default CustomSummaryHeader;

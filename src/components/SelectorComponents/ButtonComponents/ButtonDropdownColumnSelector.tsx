import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import { Button } from '@mui/material';
import {
  DropdownMenuItem,
  DropdownNestedMenuItemChildren,
} from '@/styleMUI';
import { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import {
  ColumnSelectorTree,
  TableCellStructureInitialStateProp,
} from '@/share/InterfaceTypesTable';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved_table_cell_structure.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/african_origins_table_cell_structure.json';
import TEXAS_TABLE from '@/utils/flatfiles/texas_table_cell_structure.json';
import VOYAGESTABLE_FLAT from '@/utils/flatfiles/voyage_table_cell_structure__updated21June.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers_table_cell_structure.json';
import { TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { ENSALVERSTYLE, INTRAAMERICANENSLAVERS, TRANSATLANTICTRADS } from '@/share/CONST_DATA';
import { DropdownCascading } from '../Cascading/DropdownCascading';
import { getColorBTNVoyageDatasetBackground, getColorBoxShadow, getColorHoverBackground } from '@/utils/functions/getColorStyle';

const ButtonDropdownColumnSelector = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName: styleNameRoute } = usePageRouter()
  const { visibleColumnCells } = useSelector(
    (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
  );

  const [menuValueCells, setMenuValueCells] = useState<ColumnSelectorTree[]>(
    []
  );

  const handleColumnVisibilityChange = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => {
    const target = event.currentTarget as HTMLLIElement | HTMLDivElement;
    const colID = target.dataset.colid;
    if (colID) {
      const updatedVisibleColumns = visibleColumnCells.includes(colID)
        ? visibleColumnCells.filter((column: string) => column !== colID)
        : [...visibleColumnCells, colID];
      dispatch(setVisibleColumn(updatedVisibleColumns));
    }
  };

  useEffect(() => {
    const loadMenuValueCellStructure = async () => {
      try {
        if (checkPagesRouteForVoyages(styleNameRoute!)) {
          setMenuValueCells(VOYAGESTABLE_FLAT.column_selector_tree);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved) {
          setMenuValueCells(ENSLAVED_TABLE.column_selector_tree);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.africanOrigins) {
          setMenuValueCells(AFRICANORIGINS_TABLE.column_selector_tree);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.texas) {
          setMenuValueCells(TEXAS_TABLE.column_selector_tree);
        } else if (styleNameRoute === ENSALVERSTYLE) {
          setMenuValueCells(ENSLAVERS_TABLE.column_selector_tree);
        } else if (styleNameRoute === TRANSATLANTICTRADS) {
          setMenuValueCells(ENSLAVERS_TABLE.column_selector_tree);
        } else if (styleNameRoute === INTRAAMERICANENSLAVERS) {
          setMenuValueCells(ENSLAVERS_TABLE.column_selector_tree);
        }
      } catch (error) {
        console.error('Failed to load table cell structure:', error);
      }
    };
    loadMenuValueCellStructure();
  }, [menuValueCells]);

  function renderMenuItems(nodes: any[]) {
    return nodes.map((node) => {
      const { label, children, var_name, colID } = node;
      const hasChildren = children && children.length > 0;

      if (hasChildren) {
        return (
          <DropdownNestedMenuItemChildren
            label={`${label}`}
            dense
            data-colid={colID}
            data-value={var_name}
            data-label={label}
            rightIcon={<ArrowRight style={{ fontSize: 15 }} />}
            onClickMenu={handleColumnVisibilityChange}
            menu={renderMenuItems(children)}
            disabled={visibleColumnCells.includes(colID)}
          />
        );
      }

      return (
        <DropdownMenuItem
          onClick={handleColumnVisibilityChange}
          data-colid={colID}
          data-value={var_name}
          data-label={label}
          dense
          disabled={visibleColumnCells.includes(colID)}
        >
          {label}
        </DropdownMenuItem>
      );
    });
  }
  return (
    <DropdownCascading
      trigger={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            sx={{
              fontSize: '0.80rem',
              textTransform: 'unset',
              backgroundColor: getColorBTNVoyageDatasetBackground(styleNameRoute!),
              boxShadow: getColorBoxShadow(styleNameRoute!),
              fontWeight: 600,
              color: '#ffffff',
              width: { xs: 170, sm: 170 },
              '&:hover': {
                backgroundColor: getColorHoverBackground(styleNameRoute!),
              },
            }}
            className="configureColumnsButton"
            endIcon={<ArrowDropDown />}
          >
            Configure columns
          </Button>
        </span>
      }
      menu={renderMenuItems(menuValueCells)}
    />
  );
};
export default ButtonDropdownColumnSelector;

import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import { Button } from '@mui/material';

import {
  DropdownMenuColumnItem,
  DropdownNestedMenuColumnItem,
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
import { TYPESOFDATASETPEOPLE } from '@/share/InterfaceTypes';
import { DropdownColumn } from '@/components/FunctionComponents/ColumnSelectorTable/DropdownColumn';

const ButtonDropdownSelectorEnslavers = () => {
  const dispatch: AppDispatch = useDispatch();

  const { visibleColumnCells } = useSelector(
    (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
  );
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleDataSetCollection
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
        if (styleNamePeople === TYPESOFDATASETPEOPLE.allEnslaved) {
          setMenuValueCells(ENSLAVED_TABLE.column_selector_tree);
        } else if (styleNamePeople === TYPESOFDATASETPEOPLE.africanOrigins) {
          setMenuValueCells(AFRICANORIGINS_TABLE.column_selector_tree);
        } else if (styleNamePeople === TYPESOFDATASETPEOPLE.texas) {
          setMenuValueCells(TEXAS_TABLE.column_selector_tree);
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
          <DropdownNestedMenuColumnItem
            label={`${label}`}
            dense
            data-colid={colID}
            data-value={var_name}
            data-label={label}
            rightIcon={<ArrowRight />}
            onClickMenu={handleColumnVisibilityChange}
            menu={renderMenuItems(children)}
            disabled={visibleColumnCells.includes(colID)}
          />
        );
      }

      return (
        <DropdownMenuColumnItem
          onClick={handleColumnVisibilityChange}
          data-colid={colID}
          data-value={var_name}
          data-label={label}
          dense
          disabled={visibleColumnCells.includes(colID)}
        >
          {label}
        </DropdownMenuColumnItem>
      );
    });
  }
  return (
    <DropdownColumn
      trigger={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            sx={{
              fontSize: 10,
              backgroundColor: '#17a2b8',
              fontWeight: 600,
              color: '#ffffff',
              width: { xs: 160, sm: 160 },
              '&:hover': {
                backgroundColor: 'rgb(84, 191, 182)',
              },
            }}
            className="configureColumnsButton"
            endIcon={<ArrowDropDown />}
          >
            configure columns
          </Button>
        </span>
      }
      menu={renderMenuItems(menuValueCells)}
    />
  );
};
export default ButtonDropdownSelectorEnslavers;

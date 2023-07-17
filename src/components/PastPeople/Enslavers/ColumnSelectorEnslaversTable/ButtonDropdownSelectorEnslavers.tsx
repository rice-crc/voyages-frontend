import { ArrowDropDown, ArrowRight } from '@mui/icons-material';
import { Button } from '@mui/material';
import { DropdownColumn } from '@/components/FunctionComponents/ColumnSelectorTable/DropdownColumn';
import {
  DropdownMenuColumnItem,
  DropdownNestedMenuColumnItem,
} from '@/styleMUI';
import { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { TableCellStructureInitialStateProp } from '@/share/InterfaceTypesTable';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers_table_cell_structure.json';

const ButtonDropdownSelectorEnslavers = () => {
  const dispatch: AppDispatch = useDispatch();
  const { visibleColumnCells } = useSelector(
    (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
  );
  const menuValueCells = ENSLAVERS_TABLE.column_selector_tree;

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

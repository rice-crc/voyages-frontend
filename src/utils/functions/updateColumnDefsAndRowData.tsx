import { ColumnDef, TableCellStructure } from '@/share/InterfaceTypesTable';
import { generateColumnDef } from './generateColumnDef';
import { generateRowsData } from './generateRowsData';
import { setColumnDefs, setRowData } from '@/redux/getTableSlice';

export const updateColumnDefsAndRowData = (
  data: Record<string, any>[],
  visibleColumnCells: string[],
  dispatch: any,
  fileName: string,
  tablesCell: TableCellStructure[]
) => {
  if (data.length > 0) {
    const finalRowData = generateRowsData(data, fileName);

    const newColumnDefs: ColumnDef[] = tablesCell.map(
      (value: TableCellStructure) =>
        generateColumnDef(value, visibleColumnCells)
    );
    dispatch(setColumnDefs(newColumnDefs));
    dispatch(setRowData(finalRowData as Record<string, any>[]));
  }
};

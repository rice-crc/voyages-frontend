import {
  InitialStateColumnProps,
  TableCellStructureProps,
} from '@/share/InterfaceTypesTable';
import jsonDataTable from '@/utils/flatfiles/voyages/voyages_transatlantic_table.json';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const initialState: InitialStateColumnProps = {
  valueCells: jsonDataTable as any,
  visibleColumnCells: [],
};
export const getColumnsSlice = createSlice({
  name: 'getColumns',
  initialState,
  reducers: {
    setColumnsSelectorTree: (
      state,
      action: PayloadAction<TableCellStructureProps>
    ) => {
      state.valueCells = action.payload;
    },
    setVisibleColumn: (state, action: PayloadAction<string[]>) => {
      state.visibleColumnCells = action.payload;
    },
  },
});

export const { setVisibleColumn, setColumnsSelectorTree } =
  getColumnsSlice.actions;

export default getColumnsSlice.reducer;

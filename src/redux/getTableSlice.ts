import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColumnDef, StateRowData } from '@/share/InterfaceTypesTable';
import { ColumnObjectProps } from '@/share/InterfaceTypes';

const initialState: StateRowData = {
  data: [],
  rowData: [],
  columnDefs: [],
  tableOptions: {},
  loading: false,
  error: null,
  page: 0,
};
export const getTableSlice = createSlice({
  name: 'getTableData',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Record<string, any>[]>) => {
      state.data = action.payload;
    },
    setRowData: (state, action: PayloadAction<Record<string, any>[]>) => {
      state.rowData = action.payload;
    },
    setColumnDefs: (state, action: PayloadAction<ColumnDef[]>) => {
      state.columnDefs = action.payload;
    },
    setTableOptions: (state, action: PayloadAction<ColumnObjectProps>) => {
      state.tableOptions = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetSliceTable: (state) => initialState,
  },
});

export const {
  setData,
  setPage,
  resetSliceTable,
  setRowData,
  setColumnDefs,
  setTableOptions,
} = getTableSlice.actions;
export default getTableSlice.reducer;

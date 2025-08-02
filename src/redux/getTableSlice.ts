// 1. Updated Redux slice (getTableSlice.ts)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ColumnObjectProps } from '@/share/InterfaceTypes';
import { ColumnDef, StateRowData } from '@/share/InterfaceTypesTable';

const initialState: StateRowData = {
  data: [],
  rowData: [],
  columnDefs: [],
  tableOptions: {},
  loading: false,
  error: null,
  page: 0,
  sortColumn: [],
};

export const getTableSlice = createSlice({
  name: 'getTableData',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Record<string, never>[]>) => {
      state.data = action.payload;
    },
    setRowData: (state, action: PayloadAction<Record<string, never>[]>) => {
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
    setSortColumn: (state, action: PayloadAction<string[]>) => {
      state.sortColumn = action.payload;
    },
    initializeSortColumn: (state, action: PayloadAction<string>) => {
      if (state.sortColumn.length === 0) {
        state.sortColumn = [action.payload];
      }
    },
    resetSliceTable: () => initialState,
  },
});

export const {
  setData,
  setPage,
  resetSliceTable,
  setRowData,
  setColumnDefs,
  setTableOptions,
  setSortColumn,
  initializeSortColumn,
} = getTableSlice.actions;

export default getTableSlice.reducer;

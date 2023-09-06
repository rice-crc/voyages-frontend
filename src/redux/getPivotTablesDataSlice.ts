import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ColumnObjectProps } from '@/share/InterfaceTypes';
import { PivotColumnDef, StatePivotRowData } from '@/share/InterfaceTypePivotTable';

const initialState: StatePivotRowData = {
    data: [],
    rowData: [],
    columnDefs: [],
    tableOptions: {},
    loading: false,
    error: null
};
export const getPivotTablesDataSlice = createSlice({
    name: 'getPivotTablesDataSlice',
    initialState,
    reducers: {
        setPivotTableData: (state, action: PayloadAction<Record<string, any>[]>) => {
            state.data = action.payload;
        },
        setRowPivotTableData: (state, action: PayloadAction<Record<string, any>[]>) => {
            state.rowData = action.payload;
        },
        setPivotTablColumnDefs:
            (state, action: PayloadAction<PivotColumnDef[]>) => {
                state.columnDefs = action.payload;
            },
        setTableOptions:
            (state, action: PayloadAction<ColumnObjectProps>) => {
                state.tableOptions = action.payload;
            },
    }
});

export const { setPivotTableData, setRowPivotTableData, setPivotTablColumnDefs, setTableOptions } = getPivotTablesDataSlice.actions;
export default getPivotTablesDataSlice.reducer;

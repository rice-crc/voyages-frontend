import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PivotColumnDef, StatePivotRowData } from '@/share/InterfaceTypePivotTable';

const initialState: StatePivotRowData = {
    data: [],
    rowData: [],
    columnDefs: []
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

    }
});

export const { setPivotTableData, setRowPivotTableData, setPivotTablColumnDefs } = getPivotTablesDataSlice.actions;
export default getPivotTablesDataSlice.reducer;

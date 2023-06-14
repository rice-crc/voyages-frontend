import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColumnDef, RowData, StateRowData } from '@/share/InterfaceTypesTable'


const initialState: StateRowData = {
    rowData: [],
    columnDefs: [],
};
export const getTableSlice = createSlice({
    name: "getTableData",
    initialState,
    reducers: {
        setRowData: (state, action: PayloadAction<RowData[]>) => {
            state.rowData = action.payload;
        },
        setColumnDefs:
            (state, action: PayloadAction<ColumnDef[]>) => {
                state.columnDefs = action.payload;
            },
    },
});

export const { setRowData, setColumnDefs } = getTableSlice.actions;
export default getTableSlice.reducer;

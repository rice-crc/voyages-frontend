import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColumnDef, RowData, StateRowData, VoyageOptionsGropProps } from '@/share/InterfaceTypesTable'
import { ColumnObjectProps } from "@/share/InterfaceTypes";


const initialState: StateRowData = {
    data: [],
    rowData: [],
    columnDefs: [],
    tableOptions: {}
};
export const getTableSlice = createSlice({
    name: "getTableData",
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<VoyageOptionsGropProps[]>) => {
            state.data = action.payload;
        },
        setRowData: (state, action) => {
            state.rowData = action.payload;
        },
        setColumnDefs:
            (state, action: PayloadAction<ColumnDef[]>) => {
                state.columnDefs = action.payload;
            },
        setTableOptions:
            (state, action: PayloadAction<ColumnObjectProps>) => {
                state.tableOptions = action.payload;
            },
    },
});

export const { setData, setRowData, setColumnDefs, setTableOptions } = getTableSlice.actions;
export default getTableSlice.reducer;

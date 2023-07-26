import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColumnDef, StateRowData } from '@/share/InterfaceTypesTable'
import { ColumnObjectProps } from '@/share/InterfaceTypes';
import { fetchEnslavedOptionsList } from '@/fetchAPI/pastEnslavedApi/fetchPastEnslavedOptionsList';
import { fetchVoyageOptionsPagination } from '@/fetchAPI/voyagesApi/fetchVoyageOptionsPagination';
import { fetchEnslaversOptionsList } from '@/fetchAPI/pastEnslaversApi/fetchPastEnslaversOptionsList';


const initialState: StateRowData = {
    data: [],
    rowData: [],
    columnDefs: [],
    tableOptions: {},
    loading: false,
    error: null
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
        setColumnDefs:
            (state, action: PayloadAction<ColumnDef[]>) => {
                state.columnDefs = action.payload;
            },
        setTableOptions:
            (state, action: PayloadAction<ColumnObjectProps>) => {
                state.tableOptions = action.payload;
            },
    }
});

export const { setData, setRowData, setColumnDefs, setTableOptions } = getTableSlice.actions;
export default getTableSlice.reducer;

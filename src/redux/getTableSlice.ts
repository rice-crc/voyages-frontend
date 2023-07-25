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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVoyageOptionsPagination.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVoyageOptionsPagination.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload.data;
            })
            .addCase(fetchVoyageOptionsPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEnslavedOptionsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnslavedOptionsList.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload.data;
            })
            .addCase(fetchEnslavedOptionsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEnslaversOptionsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnslaversOptionsList.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload.data;
            })
            .addCase(fetchEnslaversOptionsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setData, setRowData, setColumnDefs, setTableOptions } = getTableSlice.actions;
export default getTableSlice.reducer;

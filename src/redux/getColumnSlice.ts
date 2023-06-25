import jsonData from '@/utils/voyage_table_cell_structure__updated21June.json'
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
const initialState = {
    valueCells: jsonData,
    visibleColumnCells: [] // Initialize as an empty array
};
export const getColumnsSlice = createSlice({
    name: "getColumns",
    initialState,
    reducers: {
        getColumnsSelectorTree: (state, action) => {
            state.valueCells = action.payload;
        },
        setVisibleColumn: (state, action) => {
            state.visibleColumnCells = action.payload;
        },
    },
});

export const { setVisibleColumn } = getColumnsSlice.actions;

export default getColumnsSlice.reducer;
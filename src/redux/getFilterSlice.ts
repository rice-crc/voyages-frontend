
import { Filter } from '@/share/InterfaceTypes';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
interface FilterState {
    isFilter: boolean;
    filtersObj: Filter[];
}
const initialState: FilterState = {
    isFilter: false,
    filtersObj: []
};
export const getFilterSlice = createSlice({
    name: 'getFilter',
    initialState,
    reducers: {
        setIsFilter: (state, action: PayloadAction<boolean>) => {
            state.isFilter = action.payload;
        },
        setFilterObject: (state, action: PayloadAction<Filter[]>) => {
            state.filtersObj = action.payload;
        },
        resetSlice: (state) => initialState,
    },
});

export const { resetSlice, setIsFilter, setFilterObject } = getFilterSlice.actions;

export default getFilterSlice.reducer;

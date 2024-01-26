
import { Filter } from '@/share/InterfaceTypes';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
interface FilterState {
    isFilter: boolean;
    filtersObj: Filter[];
    nameIdURL: string;
}
const initialState: FilterState = {
    isFilter: false,
    filtersObj: [],
    nameIdURL: ''
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
        setVariableNameIdURL: (state, action: PayloadAction<string>) => {
            state.nameIdURL = action.payload;
        },
        resetSlice: (state) => initialState,
    },
});

export const { resetSlice, setIsFilter, setFilterObject, setVariableNameIdURL } = getFilterSlice.actions;

export default getFilterSlice.reducer;

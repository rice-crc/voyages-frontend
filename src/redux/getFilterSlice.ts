
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getFilterSlice = createSlice({
    name: 'getFilter',
    initialState: {
        isFilter: false
    },
    reducers: {
        setIsFilter: (state, action: PayloadAction<boolean>) => {
            state.isFilter = action.payload;
        },
        resetSlice: (state) => {
            state.isFilter = false
        }
    },
});

export const { resetSlice, setIsFilter } = getFilterSlice.actions;

export default getFilterSlice.reducer;

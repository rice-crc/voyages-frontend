
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export const getFilterSlice = createSlice({
    name: "getFilter",
    initialState: {
        isFilter: false
    },
    reducers: {
        setIsFilter: (state, action: PayloadAction<boolean>) => {
            state.isFilter = action.payload;
        },
    },
});

export const { setIsFilter } = getFilterSlice.actions;

export default getFilterSlice.reducer;

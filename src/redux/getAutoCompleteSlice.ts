import { createSlice } from "@reduxjs/toolkit"

export const getAutoCompleteSlice = createSlice({
    name: "autoCompleteList",
    initialState: {
        results: [],
        total_results_count: 0
    },
    reducers: {
        getAutoCompleteList: (state, action) => {
            state.results = action.payload;
        }
    }
})

export const { getAutoCompleteList } = getAutoCompleteSlice.actions;
export default getAutoCompleteSlice.reducer;
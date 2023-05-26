import { createSlice } from "@reduxjs/toolkit"

export const getVoyageGroupbySlice = createSlice({
    name: "VoyageGroupby",
    initialState: {
        value: {}
    },
    reducers: {
        getVoyageGroupbyList: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { getVoyageGroupbyList } = getVoyageGroupbySlice.actions;
export default getVoyageGroupbySlice.reducer;
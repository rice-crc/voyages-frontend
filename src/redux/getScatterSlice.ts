
import { PayloadAction, createSlice } from "@reduxjs/toolkit"


export const getScatterSlice = createSlice({
    name: "getScatter",
    initialState: {
        aggregation: "sum"
    },
    reducers: {
        setAggregation: (state, action: PayloadAction<string>) => {
            state.aggregation = action.payload;
        }
    }
})

export const { setAggregation } = getScatterSlice.actions;
export default getScatterSlice.reducer;
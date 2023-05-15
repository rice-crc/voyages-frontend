import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsDataState } from '../share/TableRangeSliderType'


const initialState: OptionsDataState = {
    value: {},
};

export const optionsDataSlice = createSlice({
    name: "optionsData",
    initialState,
    reducers: {
        getOptions: (state, action: PayloadAction<Record<string, unknown>>) => {
            state.value = action.payload;
        },
    },
});

export const { getOptions } = optionsDataSlice.actions;
export default optionsDataSlice.reducer;


/*
export const opptionsDataSlice = createSlice({
    name: "opptionsData", 
    initialState: {
        value: {}
    }, 
    reducers:{
        getOptions: (state, action) =>{
            state.value = action.payload;
        }
    }
})

export const { getOptions } = opptionsDataSlice.actions;
export default opptionsDataSlice.reducer;

*/
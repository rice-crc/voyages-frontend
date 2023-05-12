import {createSlice } from "@reduxjs/toolkit"


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
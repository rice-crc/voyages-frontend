import {createSlice } from "@reduxjs/toolkit"

export const getRangeSliderSlice = createSlice({
    name: "rangeSlider", 
    initialState: {
        range: {}
    }, 
    reducers:{
        getRangeSlider: (state, action) =>{
            state.range = action.payload;
        }
    }
})

export const { getRangeSlider } = getRangeSliderSlice.actions;
export default getRangeSliderSlice.reducer;
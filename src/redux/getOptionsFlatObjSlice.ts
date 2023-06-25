import { createSlice } from "@reduxjs/toolkit"
import jsonData from '@/utils/transatlantic_voyages_filter_menu.json'
const initialState = {
    value: jsonData
};
export const getOptionsFlatObjSlice = createSlice({
    name: "optionFlatMenu",
    initialState,
    reducers: {
        getOptionsFlatMenu: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { getOptionsFlatMenu } = getOptionsFlatObjSlice.actions;
export default getOptionsFlatObjSlice.reducer;
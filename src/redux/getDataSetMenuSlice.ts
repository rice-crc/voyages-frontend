import jsonData from '@/utils/VOYAGE_MENU_WEB.json'
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    value: jsonData,
    selectDataset: jsonData[0].label,
    textIntroduce: jsonData[0].text_introduce
}

export const getDataSetMenuSlice = createSlice({
    name: "getSelectDataset",
    initialState,
    reducers: {
        setSelectDataset: (state, action) => {
            state.selectDataset = action.payload;
        },
    },
});

export const { setSelectDataset } = getDataSetMenuSlice.actions;

export default getDataSetMenuSlice.reducer;

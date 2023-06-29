import jsonData from '@/utils/VOYAGE_COLLECTIONS.json'
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    value: jsonData,
    textHeader: jsonData[0].headers.label,
    textIntroduce: jsonData[0].headers.text_introduce,
    styleName: jsonData[0].style_name,
    dataSetValueBaseFilter: [],
    dataSetKey: '',
    dataSetValue: [],
    blocks: jsonData[0].blocks.reverse()
}

export const getDataSetCollectionSlice = createSlice({
    name: "getDataSetCollection",
    initialState,
    reducers: {
        setBaseFilterDataSetValue: (state, action) => {
            state.dataSetValueBaseFilter = action.payload;
        },
        setBaseFilterDataKey: (state, action) => {
            state.dataSetKey = action.payload;
        },
        setBaseFilterDataValue: (state, action) => {
            state.dataSetValue = action.payload;
        },
        setDataSetHeader: (state, action) => {
            state.textHeader = action.payload
        },
        setTextIntro: (state, action) => {
            state.textIntroduce = action.payload
        },
        setStyleName: (state, action) => {
            state.styleName = action.payload
        },
        setBlocksMenuList: (state, action) => {
            state.blocks = action.payload
        },

    },
});

export const { setBaseFilterDataSetValue, setBlocksMenuList, setBaseFilterDataValue, setBaseFilterDataKey, setDataSetHeader, setTextIntro, setStyleName } = getDataSetCollectionSlice.actions;

export default getDataSetCollectionSlice.reducer;

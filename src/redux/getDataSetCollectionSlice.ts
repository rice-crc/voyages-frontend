import { BaseFilter, InitialStateDataSetCollection } from '@/share/InterfactTypesDatasetCollection';
import jsonData from '@/utils/VOYAGE_COLLECTIONS.json'
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
export const initialState: InitialStateDataSetCollection = {
    value: jsonData,
    textHeader: jsonData[0].headers.label,
    textIntroduce: jsonData[0].headers.text_introduce,
    styleName: jsonData[0].style_name,
    dataSetValueBaseFilter: [],
    dataSetKey: '',
    dataSetValue: [],
    blocks: jsonData[0].blocks
}

export const getDataSetCollectionSlice = createSlice({
    name: "getDataSetCollection",
    initialState,
    reducers: {
        setBaseFilterDataSetValue: (state, action: PayloadAction<BaseFilter[]>) => {
            state.dataSetValueBaseFilter = action.payload;
        },
        setBaseFilterDataKey: (state, action: PayloadAction<string>) => {
            state.dataSetKey = action.payload;
        },
        setBaseFilterDataValue: (state, action: PayloadAction<string[] | number[]>) => {
            state.dataSetValue = action.payload;
        },
        setDataSetHeader: (state, action: PayloadAction<string>) => {
            state.textHeader = action.payload
        },
        setTextIntro: (state, action: PayloadAction<string>) => {
            state.textIntroduce = action.payload
        },
        setStyleName: (state, action: PayloadAction<string>) => {
            state.styleName = action.payload
        },
        setBlocksMenuList: (state, action: PayloadAction<string[]>) => {
            state.blocks = action.payload
        },

    },
});

export const { setBaseFilterDataSetValue, setBlocksMenuList, setBaseFilterDataValue, setBaseFilterDataKey, setDataSetHeader, setTextIntro, setStyleName } = getDataSetCollectionSlice.actions;

export default getDataSetCollectionSlice.reducer;

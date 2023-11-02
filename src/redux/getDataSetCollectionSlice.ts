import { BaseFilter, InitialStateDataSetCollection } from '@/share/InterfactTypesDatasetCollection';
import jsonDataVoyageCollection from '@/utils/flatfiles/VOYAGE_COLLECTIONS.json'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
export const initialState: InitialStateDataSetCollection = {
    value: jsonDataVoyageCollection,
    textHeader: jsonDataVoyageCollection[0].headers.label,
    textIntroduce: jsonDataVoyageCollection[0].headers.text_introduce,
    styleName: jsonDataVoyageCollection[0].style_name,
    dataSetValueBaseFilter: [],
    dataSetKey: '',
    dataSetValue: [],
    blocks: jsonDataVoyageCollection[0].blocks,
}

export const getDataSetCollectionSlice = createSlice({
    name: 'getDataSetCollection',
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
        resetSlice: (state) => {
            state.dataSetValueBaseFilter,
                state.dataSetKey,
                state.dataSetValue,
                state.dataSetValueBaseFilter,
                state.dataSetKey,
                state.dataSetValue,
                state.textHeader,
                state.textIntroduce,
                state.blocks,
                state.styleName = ''
        },
    },
});

export const { setBaseFilterDataSetValue, resetSlice, setBlocksMenuList, setBaseFilterDataValue, setBaseFilterDataKey, setDataSetHeader, setTextIntro, setStyleName } = getDataSetCollectionSlice.actions;

export default getDataSetCollectionSlice.reducer;

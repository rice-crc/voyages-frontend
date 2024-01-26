import { BaseFilter, InitialStateDataSetCollection } from '@/share/InterfactTypesDatasetCollection';
import jsonDataVoyageCollection from '@/utils/flatfiles/VOYAGE_COLLECTIONS.json'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
export const initialState: InitialStateDataSetCollection = {
    value: jsonDataVoyageCollection,
    textHeader: jsonDataVoyageCollection[0].headers.label,
    textIntroduce: jsonDataVoyageCollection[0].headers.text_introduce,
    styleName: jsonDataVoyageCollection[0].style_name,
    dataSetValueBaseFilter: [],
    blocks: jsonDataVoyageCollection[0].blocks,
    filterMenuVoyageFlatfile: jsonDataVoyageCollection[0].filter_menu_flatfile,
    tableFlatfileVoyages: jsonDataVoyageCollection[0].table_flatfile
}

export const getDataSetCollectionSlice = createSlice({
    name: 'getDataSetCollection',
    initialState,
    reducers: {
        setBaseFilterDataSetValue: (state, action: PayloadAction<BaseFilter[]>) => {
            state.dataSetValueBaseFilter = action.payload;
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
        setTableVoyagesFlatfile: (state, action: PayloadAction<string>) => {
            state.tableFlatfileVoyages = action.payload;
        },
        setVoyagesFilterMenuFlatfile: (
            state,
            action: PayloadAction<string>
        ) => {
            state.filterMenuVoyageFlatfile = action.payload;
        },
        resetSlice: (state) => {
            state.dataSetValueBaseFilter,
                state.dataSetValueBaseFilter,
                state.textHeader,
                state.textIntroduce,
                state.blocks,
                state.styleName = ''
        },
        resetAllStateSlice: (state) => initialState,
    },
});

export const { setBaseFilterDataSetValue, setTableVoyagesFlatfile, setVoyagesFilterMenuFlatfile, resetAllStateSlice, resetSlice, setBlocksMenuList, setDataSetHeader, setTextIntro, setStyleName } = getDataSetCollectionSlice.actions;

export default getDataSetCollectionSlice.reducer;

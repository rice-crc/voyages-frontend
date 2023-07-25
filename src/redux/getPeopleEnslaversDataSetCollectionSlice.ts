import {
    BaseFilter,
    InitialStateDataPeopleSetCollection,
} from '@/share/InterfactTypesDatasetCollection';
import jsonDataEnslaversCOLLECTIONS from '@/utils/flatfiles/ENSLAVERS_COLLECTIONS.json';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const initialState: InitialStateDataPeopleSetCollection = {
    value: jsonDataEnslaversCOLLECTIONS,
    textHeader: jsonDataEnslaversCOLLECTIONS[0].headers.label,
    textIntroduce: jsonDataEnslaversCOLLECTIONS[0].headers.text_introduce,
    styleNamePeople: jsonDataEnslaversCOLLECTIONS[0].style_name,
    dataSetValueBaseFilter: [],
    dataSetKeyPeople: '',
    dataSetValuePeople: [],
    blocksPeople: jsonDataEnslaversCOLLECTIONS[0].blocks,
    filterMenuFlatfile: jsonDataEnslaversCOLLECTIONS[0].filter_menu_flatfile,
    tableFlatfile: jsonDataEnslaversCOLLECTIONS[0].table_flatfile,
};

export const getPeopleEnslaversDataSetCollectionSlice = createSlice({
    name: 'getPeopleEnslaversDataSetCollectionSlice',
    initialState,
    reducers: {
        setBaseFilterEnslaversDataSetValue: (
            state,
            action: PayloadAction<BaseFilter[]>
        ) => {
            state.dataSetValueBaseFilter = action.payload;
        },
        setBaseFilterEnslaversDataKey: (
            state,
            action: PayloadAction<string>
        ) => {
            state.dataSetKeyPeople = action.payload;
        },
        setBaseFilterEnslaversDataValue: (
            state,
            action: PayloadAction<string[] | number[]>
        ) => {
            state.dataSetValuePeople = action.payload;
        },
        setDataSetEnslaversHeader: (state, action: PayloadAction<string>) => {
            state.textHeader = action.payload;
        },
        setEnslaversTextIntro: (state, action: PayloadAction<string>) => {
            state.textIntroduce = action.payload;
        },
        setEnslaversStyleName: (state, action: PayloadAction<string>) => {
            state.styleNamePeople = action.payload;
        },
        setEnslaversBlocksMenuList: (
            state,
            action: PayloadAction<string[]>
        ) => {
            state.blocksPeople = action.payload;
        },
        setEnslaversFilterMenuFlatfile: (
            state,
            action: PayloadAction<string>
        ) => {
            state.filterMenuFlatfile = action.payload;
        },
        setPeopleTableEnslavedFlatfile: (state, action: PayloadAction<string>) => {
            state.tableFlatfile = action.payload;
        },
    },
});

export const {
    setBaseFilterEnslaversDataSetValue,
    setBaseFilterEnslaversDataKey,
    setBaseFilterEnslaversDataValue,
    setDataSetEnslaversHeader,
    setPeopleTableEnslavedFlatfile,
    setEnslaversTextIntro,
    setEnslaversStyleName,
    setEnslaversBlocksMenuList,
} = getPeopleEnslaversDataSetCollectionSlice.actions;

export default getPeopleEnslaversDataSetCollectionSlice.reducer;

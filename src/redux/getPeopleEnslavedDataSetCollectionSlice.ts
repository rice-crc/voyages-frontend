import {
    BaseFilter,
    InitialStateDataPeopleSetCollection,
} from '@/share/InterfactTypesDatasetCollection';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/PEOPLE_COLLECTIONS.json';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const initialState: InitialStateDataPeopleSetCollection = {
    value: jsonDataPEOPLECOLLECTIONS,
    textHeader: jsonDataPEOPLECOLLECTIONS[0].headers.label,
    textIntroduce: jsonDataPEOPLECOLLECTIONS[0].headers.text_introduce,
    styleNamePeople: jsonDataPEOPLECOLLECTIONS[0].style_name,
    dataSetValueBaseFilter: [],
    dataSetKeyPeople: '',
    dataSetValuePeople: [],
    blocksPeople: jsonDataPEOPLECOLLECTIONS[0].blocks,
    filterMenuFlatfile: jsonDataPEOPLECOLLECTIONS[0].filter_menu_flatfile,
    tableFlatfile: jsonDataPEOPLECOLLECTIONS[0].table_flatfile,
};

export const getPeopleEnslavedDataSetCollectionSlice = createSlice({
    name: 'getPeopleEnslavedDataSetCollectionSlice',
    initialState,
    reducers: {
        setBaseFilterPeopleEnslavedDataSetValue: (
            state,
            action: PayloadAction<BaseFilter[]>
        ) => {
            state.dataSetValueBaseFilter = action.payload;
        },
        setBaseFilterPeopleEnslavedDataKey: (
            state,
            action: PayloadAction<string>
        ) => {
            state.dataSetKeyPeople = action.payload;
        },
        setBaseFilterPeopleEnslavedDataValue: (
            state,
            action: PayloadAction<string[] | number[]>
        ) => {
            state.dataSetValuePeople = action.payload;
        },
        setDataSetPeopleEnslavedHeader: (state, action: PayloadAction<string>) => {
            state.textHeader = action.payload;
        },
        setPeopleEnslavedTextIntro: (state, action: PayloadAction<string>) => {
            state.textIntroduce = action.payload;
        },
        setPeopleEnslavedStyleName: (state, action: PayloadAction<string>) => {
            state.styleNamePeople = action.payload;
        },
        setPeopleEnslavedBlocksMenuList: (
            state,
            action: PayloadAction<string[]>
        ) => {
            state.blocksPeople = action.payload;
        },
        setPeopleEnslavedFilterMenuFlatfile: (
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
    setBaseFilterPeopleEnslavedDataSetValue,
    setBaseFilterPeopleEnslavedDataKey,
    setBaseFilterPeopleEnslavedDataValue,
    setDataSetPeopleEnslavedHeader,
    setPeopleTableEnslavedFlatfile,
    setPeopleEnslavedTextIntro,
    setPeopleEnslavedStyleName,
    setPeopleEnslavedBlocksMenuList, setPeopleEnslavedFilterMenuFlatfile
} = getPeopleEnslavedDataSetCollectionSlice.actions;

export default getPeopleEnslavedDataSetCollectionSlice.reducer;

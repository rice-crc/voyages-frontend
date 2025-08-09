import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  BaseFilter,
  BlockCollectionProps,
  InitialStateDataPeopleSetCollection,
} from '@/share/InterfactTypesDatasetCollection';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/people/people_collections.json';

export const initialState: InitialStateDataPeopleSetCollection = {
  value: jsonDataPEOPLECOLLECTIONS,
  textHeader: jsonDataPEOPLECOLLECTIONS[0].headers.label.en,
  textIntroduce: jsonDataPEOPLECOLLECTIONS[0].headers.text_introduce,
  styleNamePeople: jsonDataPEOPLECOLLECTIONS[0].style_name,
  dataSetValueBaseFilter: [],
  dataSetKeyPeople: '',
  dataSetValuePeople: [],
  blocksPeople: jsonDataPEOPLECOLLECTIONS[0].blocks,
  filterMenuFlatfile: jsonDataPEOPLECOLLECTIONS[0].filter_menu_flatfile,
  tableFlatfileEnslaved: jsonDataPEOPLECOLLECTIONS[0].table_flatfile,
};

const getPeopleEnslavedDataSetCollectionSlice = createSlice({
  name: 'getPeopleEnslavedDataSetCollectionSlice',
  initialState,
  reducers: {
    setBaseFilterPeopleEnslavedDataSetValue: (
      state,
      action: PayloadAction<BaseFilter[]>,
    ) => {
      state.dataSetValueBaseFilter = action.payload;
    },
    setBaseFilterPeopleEnslavedDataKey: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.dataSetKeyPeople = action.payload;
    },
    setBaseFilterPeopleEnslavedDataValue: (
      state,
      action: PayloadAction<string[] | number[]>,
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
      action: PayloadAction<BlockCollectionProps[]>,
    ) => {
      state.blocksPeople = action.payload;
    },
    setPeopleEnslavedFilterMenuFlatfile: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.filterMenuFlatfile = action.payload;
    },
    setPeopleTableEnslavedFlatfile: (state, action: PayloadAction<string>) => {
      state.tableFlatfileEnslaved = action.payload;
    },
    resetSlice: (state) => {
      state.dataSetValueBaseFilter,
        state.dataSetValueBaseFilter,
        state.textHeader,
        state.textIntroduce,
        state.blocksPeople,
        (state.styleNamePeople = ''),
        state.filterMenuFlatfile;
    },
    resetAllStateSlice: (state) => initialState,
  },
});

export const {
  resetAllStateSlice,
  resetSlice,
  setBaseFilterPeopleEnslavedDataSetValue,
  setBaseFilterPeopleEnslavedDataKey,
  setBaseFilterPeopleEnslavedDataValue,
  setDataSetPeopleEnslavedHeader,
  setPeopleTableEnslavedFlatfile,
  setPeopleEnslavedTextIntro,
  setPeopleEnslavedStyleName,
  setPeopleEnslavedBlocksMenuList,
  setPeopleEnslavedFilterMenuFlatfile,
} = getPeopleEnslavedDataSetCollectionSlice.actions;

export default getPeopleEnslavedDataSetCollectionSlice.reducer;

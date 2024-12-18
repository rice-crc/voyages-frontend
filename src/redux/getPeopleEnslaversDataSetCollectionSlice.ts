import {
  BaseFilter,
  BlockCollectionProps,
  InitialStateDataPeopleEnslaversSetCollection,
} from '@/share/InterfactTypesDatasetCollection';
import jsonDataEnslaversCOLLECTIONS from '@/utils/flatfiles/enslavers/enslavers_collections.json';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const initialState: InitialStateDataPeopleEnslaversSetCollection = {
  value: jsonDataEnslaversCOLLECTIONS,
  textHeader: jsonDataEnslaversCOLLECTIONS[0].headers.label.en,
  textIntroduce: jsonDataEnslaversCOLLECTIONS[0].headers.text_introduce,
  styleNamePeople: jsonDataEnslaversCOLLECTIONS[0].style_name,
  dataSetValueBaseFilter: [],
  dataSetKeyPeople: '',
  dataSetValuePeople: [],
  blocksEnslavers: jsonDataEnslaversCOLLECTIONS[0].blocks,
  filterMenuEnslaversFlatfile:
    jsonDataEnslaversCOLLECTIONS[0].filter_menu_flatfile,
  tableFlatfileEnslavers: jsonDataEnslaversCOLLECTIONS[0].table_flatfile,
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
    setBaseFilterEnslaversDataKey: (state, action: PayloadAction<string>) => {
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
      action: PayloadAction<BlockCollectionProps[]>
    ) => {
      state.blocksEnslavers = action.payload;
    },
    setEnslaversFilterMenuFlatfile: (state, action: PayloadAction<string>) => {
      state.filterMenuEnslaversFlatfile = action.payload;
    },
    setPeopleTableEnslavedFlatfile: (state, action: PayloadAction<string>) => {
      state.tableFlatfileEnslavers = action.payload;
    },
    resetSlice: (state) => {
      state.dataSetValueBaseFilter,
        state.dataSetKeyPeople,
        state.dataSetValuePeople,
        state.textHeader,
        state.textIntroduce,
        state.filterMenuEnslaversFlatfile,
        state.tableFlatfileEnslavers;
    },
    resetAllStateSlice: (state) => initialState,
  },
});

export const {
  resetAllStateSlice,
  resetSlice,
  setBaseFilterEnslaversDataSetValue,
  setBaseFilterEnslaversDataKey,
  setBaseFilterEnslaversDataValue,
  setDataSetEnslaversHeader,
  setPeopleTableEnslavedFlatfile,
  setEnslaversTextIntro,
  setEnslaversStyleName,
  setEnslaversBlocksMenuList,
  setEnslaversFilterMenuFlatfile,
} = getPeopleEnslaversDataSetCollectionSlice.actions;

export default getPeopleEnslaversDataSetCollectionSlice.reducer;

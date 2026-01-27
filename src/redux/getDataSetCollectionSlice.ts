import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  BaseFilter,
  BlockCollectionProps,
  InitialStateDataSetCollection,
} from '@/share/InterfactTypesDatasetCollection';
import jsonDataVoyageCollection from '@/utils/flatfiles/voyages/voyages_collections.json';
export const initialState: InitialStateDataSetCollection = {
  value: jsonDataVoyageCollection,
  textHeader: jsonDataVoyageCollection[0].headers.label.en,
  textIntroduce: jsonDataVoyageCollection[0].headers.text_introduce,
  styleName: jsonDataVoyageCollection[0].style_name,
  dataSetValueBaseFilter: [],
  blocks: jsonDataVoyageCollection[0].blocks,
  filterMenuVoyageFlatfile: jsonDataVoyageCollection[0].filter_menu_flatfile,
  tableFlatfileVoyages: jsonDataVoyageCollection[0].table_flatfile,
};

const getDataSetCollectionSlice = createSlice({
  name: 'getDataSetCollection',
  initialState,
  reducers: {
    setBaseFilterDataSetValue: (state, action: PayloadAction<BaseFilter[]>) => {
      state.dataSetValueBaseFilter = action.payload;
    },
    setDataSetHeader: (state, action: PayloadAction<string>) => {
      state.textHeader = action.payload;
    },
    setTextIntro: (state, action: PayloadAction<string>) => {
      state.textIntroduce = action.payload;
    },
    setStyleName: (state, action: PayloadAction<string>) => {
      state.styleName = action.payload;
    },
    setBlocksMenuList: (
      state,
      action: PayloadAction<BlockCollectionProps[]>,
    ) => {
      state.blocks = action.payload;
    },
    setTableVoyagesFlatfile: (state, action: PayloadAction<string>) => {
      state.tableFlatfileVoyages = action.payload;
    },
    setVoyagesFilterMenuFlatfile: (state, action: PayloadAction<string>) => {
      state.filterMenuVoyageFlatfile = action.payload;
    },
    resetSlice: (state) => {
      state.dataSetValueBaseFilter = initialState.dataSetValueBaseFilter;
      state.textHeader = initialState.textHeader;
      state.textIntroduce = initialState.textIntroduce;
      state.blocks = initialState.blocks;
      state.styleName = initialState.styleName;
      state.filterMenuVoyageFlatfile = initialState.filterMenuVoyageFlatfile;
      state.tableFlatfileVoyages = initialState.tableFlatfileVoyages;
      state.value = initialState.value;
    },
  },
});

export const {
  setBaseFilterDataSetValue,
  setTableVoyagesFlatfile,
  setVoyagesFilterMenuFlatfile,
  resetSlice,
  setBlocksMenuList,
  setDataSetHeader,
  setTextIntro,
  setStyleName,
} = getDataSetCollectionSlice.actions;

export default getDataSetCollectionSlice.reducer;

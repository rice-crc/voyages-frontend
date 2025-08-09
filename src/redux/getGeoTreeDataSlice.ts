import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  TreeSelectItemInitialState,
  GeoTreeSelectItem,
} from '@/share/InterfaceTypes';

const initialState: TreeSelectItemInitialState = {
  geoTreeValue: {},
  geoTreeSelectValue: [],
  isChangeGeoTree: false,
};

const getGeoTreeDataSlice = createSlice({
  name: 'getGeoTreeBoxSlice',
  initialState,
  reducers: {
    setGeoTreeValues: (
      state,
      action: PayloadAction<Record<string, GeoTreeSelectItem[] | string[]>>,
    ) => {
      state.geoTreeValue = action.payload;
    },
    setGeoTreeValueSelect: (state, action: PayloadAction<string[]>) => {
      state.geoTreeSelectValue = action.payload;
    },
    setIsChangeGeoTree: (state, action: PayloadAction<boolean>) => {
      state.isChangeGeoTree = action.payload;
    },
    resetSlice: (state) => initialState,
  },
});

export const {
  setGeoTreeValues,
  setGeoTreeValueSelect,
  setIsChangeGeoTree,
  resetSlice,
} = getGeoTreeDataSlice.actions;

export default getGeoTreeDataSlice.reducer;

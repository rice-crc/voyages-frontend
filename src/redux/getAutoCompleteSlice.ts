import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AutoCompleteInitialState, Filter } from '@/share/InterfaceTypes';

const initialState: AutoCompleteInitialState = {
  results: [],
  total_results_count: 0,
  autoCompleteValue: {},
  autoLabelName: [],
  textFilterValue: '',
  isChangeAuto: false,
  offset: 0,
  isLoadingList: false,
};

const getAutoCompleteSlice = createSlice({
  name: 'autoCompleteList',
  initialState,
  reducers: {
    getAutoCompleteList: (state, action) => {
      state.results = action.payload;
    },
    setAutoCompleteValue: (
      state,
      action: PayloadAction<Record<string, string[]>>,
    ) => {
      state.autoCompleteValue = action.payload;
    },
    setAutoLabel: (state, action: PayloadAction<string[]>) => {
      state.autoLabelName = action.payload;
    },
    setTextFilterValue: (state, action: PayloadAction<string>) => {
      state.textFilterValue = action.payload;
    },
    setIsChangeAuto: (state, action: PayloadAction<boolean>) => {
      state.isChangeAuto = action.payload;
    },
    setIsLoadingList: (state, action: PayloadAction<boolean>) => {
      state.isLoadingList = action.payload;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    resetSlice: (state) => initialState,
  },
});

export const {
  getAutoCompleteList,
  setOffset,
  setTextFilterValue,
  setIsLoadingList,
  setAutoCompleteValue,
  resetSlice,
  setAutoLabel,
  setIsChangeAuto,
} = getAutoCompleteSlice.actions;

export default getAutoCompleteSlice.reducer;

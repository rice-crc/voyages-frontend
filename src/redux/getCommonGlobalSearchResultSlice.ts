import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { GlobalSearchProp } from '@/share/InterfaceTypesGlobalSearch';

const getCommonGlobalSearchResultSlice = createSlice({
  name: 'getFilter',
  initialState: {
    data: [] as GlobalSearchProp[],
    inputSearchValue: '',
    typePage: '',
    requestId: null,
  },
  reducers: {
    setSearchGlobalData: (state, action: PayloadAction<GlobalSearchProp[]>) => {
      state.data = action.payload;
    },
    setInputSearchValue: (state, action: PayloadAction<string>) => {
      state.inputSearchValue = action.payload;
    },
    setTypePage: (state, action: PayloadAction<string>) => {
      state.typePage = action.payload;
    },
    setRequestId: (state, action) => {
      state.requestId = action.payload;
    },
    resetSlice: (state) => {
      state.inputSearchValue = '';
    },
  },
});

export const {
  setSearchGlobalData,
  resetSlice,
  setInputSearchValue,
  setTypePage,
  setRequestId,
} = getCommonGlobalSearchResultSlice.actions;

export default getCommonGlobalSearchResultSlice.reducer;

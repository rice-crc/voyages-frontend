import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Filter } from '@/share/InterfaceTypes';
interface FilterState {
  isFilter: boolean;
  filtersObj: Filter[];
  nameIdURL: string;
  type: string;
}
const initialState: FilterState = {
  isFilter: false,
  filtersObj: [],
  nameIdURL: '',
  type: '',
};
const getFilterSlice = createSlice({
  name: 'getFilter',
  initialState,
  reducers: {
    setIsFilter: (state, action: PayloadAction<boolean>) => {
      state.isFilter = action.payload;
    },
    setFilterObject: (state, action: PayloadAction<Filter[]>) => {
      state.filtersObj = action.payload;
    },
    setVariableNameIdURL: (state, action: PayloadAction<string>) => {
      state.nameIdURL = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    resetSlice: () => initialState,
  },
});

export const {
  resetSlice,
  setIsFilter,
  setType,
  setFilterObject,
  setVariableNameIdURL,
} = getFilterSlice.actions;

export default getFilterSlice.reducer;

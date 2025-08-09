import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { FilterMenu, InitialStateFilterMenu } from '@/share/InterfaceTypes';
import jsonDataTransatlanticVoyages from '@/utils/flatfiles/voyages/voyages_transatlantic_filter_menu.json';
const initialState: InitialStateFilterMenu = {
  value: jsonDataTransatlanticVoyages,
};
const getOptionsFlatObjSlice = createSlice({
  name: 'optionFlatMenu',
  initialState,
  reducers: {
    getOptionsFlatMenu: (state, action: PayloadAction<FilterMenu[]>) => {
      state.value = action.payload;
    },
    resetSlice: (state) => initialState,
  },
});

export const { resetSlice, getOptionsFlatMenu } =
  getOptionsFlatObjSlice.actions;
export default getOptionsFlatObjSlice.reducer;

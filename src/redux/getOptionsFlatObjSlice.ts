import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import jsonDataTransatlanticVoyages from '@/utils/flatfiles/voyages/voyages_transatlantic_filter_menu.json';
import { FilterMenu, InitialStateFilterMenu } from '@/share/InterfaceTypes';
const initialState: InitialStateFilterMenu = {
  value: jsonDataTransatlanticVoyages,
};
export const getOptionsFlatObjSlice = createSlice({
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

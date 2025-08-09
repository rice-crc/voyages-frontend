import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OptionsDataState } from '@/share/InterfaceTypes';

const initialState: OptionsDataState = {
  value: {},
};

const getOptionsDataSlice = createSlice({
  name: 'optionsData',
  initialState,
  reducers: {
    getOptions: (state, action: PayloadAction<Record<string, never>>) => {
      state.value = action.payload;
    },
    resetSlice: (state) => initialState,
  },
});

export const { getOptions, resetSlice } = getOptionsDataSlice.actions;
export default getOptionsDataSlice.reducer;

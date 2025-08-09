import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Filter } from '@/share/InterfaceTypes';
interface QueryState {
  querySaveSearch: Filter[];
}
const initialState: QueryState = {
  querySaveSearch: [],
};
const getQuerySaveSearchSlice = createSlice({
  name: 'getQuerySaveSearch',
  initialState,
  reducers: {
    setQuerySaveSeary: (state, action: PayloadAction<Filter[]>) => {
      state.querySaveSearch = action.payload;
    },
  },
});

export const { setQuerySaveSeary } = getQuerySaveSearchSlice.actions;

export default getQuerySaveSearchSlice.reducer;

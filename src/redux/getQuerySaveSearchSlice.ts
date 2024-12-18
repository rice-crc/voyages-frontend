import { Filter } from '@/share/InterfaceTypes';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
interface QueryState {
  querySaveSearch: Filter[];
}
const initialState: QueryState = {
  querySaveSearch: [],
};
export const getQuerySaveSearchSlice = createSlice({
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

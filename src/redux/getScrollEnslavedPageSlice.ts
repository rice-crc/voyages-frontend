import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentEnslavedPage: 1,
  currentPageBlockName: 'people',
};
export const getScrollEnslavedPageSlice = createSlice({
  name: 'getScrollEnslavedPage',
  initialState,
  reducers: {
    setCurrentEnslavedPage: (state, action: PayloadAction<number>) => {
      state.currentEnslavedPage = action.payload;
    },
    setCurrentBlockName: (state, action: PayloadAction<string>) => {
      state.currentPageBlockName = action.payload;
    },
    resetSlice: (state) => initialState,
  },
});

export const { resetSlice, setCurrentEnslavedPage, setCurrentBlockName } =
  getScrollEnslavedPageSlice.actions;
export default getScrollEnslavedPageSlice.reducer;

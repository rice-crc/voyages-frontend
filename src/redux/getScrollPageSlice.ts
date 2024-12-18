import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 1,
  isOpenDialog: false,
  isOpenDialogMobile: false,
  currentVoyageBlockName: 'voyages',
};

export const getScrollPageSlice = createSlice({
  name: 'getScrollPage',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setIsOpenDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenDialog = action.payload;
    },
    setIsOpenDialogMobile: (state, action: PayloadAction<boolean>) => {
      state.isOpenDialogMobile = action.payload;
    },
    setCurrentVoyagesBlockName: (state, action: PayloadAction<string>) => {
      state.currentVoyageBlockName = action.payload;
    },
    resetSlice: (state) => {
      state.currentPage = initialState.currentPage;
      state.isOpenDialog = initialState.isOpenDialog;
      state.isOpenDialogMobile = initialState.isOpenDialogMobile;
    },
    resetSliceCurrentPageAndDialog: (state) => state,
  },
});

export const {
  resetSliceCurrentPageAndDialog,
  resetSlice,
  setCurrentPage,
  setIsOpenDialog,
  setIsOpenDialogMobile,
  setCurrentVoyagesBlockName,
} = getScrollPageSlice.actions;
export default getScrollPageSlice.reducer;

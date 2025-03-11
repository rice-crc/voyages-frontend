import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const setSelectedLanguageToLocalStorage = (language: string) => {
  localStorage.setItem('languages', language);
};
interface StateViewHideProps {
  viewAll: boolean;
  labelVarName: string;
  textFilter: string;
  isView: boolean;
}
const initialStateViewHide: StateViewHideProps = {
  viewAll: false,
  labelVarName: '',
  textFilter: '',
  isView: false,
};

export const getShowFilterObjectSlice = createSlice({
  name: 'getShowFilterObjectSlice',
  initialState: initialStateViewHide,
  reducers: {
    setViewAll: (state, action: PayloadAction<boolean>) => {
      state.viewAll = action.payload;
    },
    setLabelVarName: (state, action: PayloadAction<string>) => {
      state.labelVarName = action.payload;
    },
    setTextFilter: (state, action: PayloadAction<string>) => {
      state.textFilter = action.payload;
    },
    setIsViewButtonViewAllResetAll: (state, action: PayloadAction<boolean>) => {
      state.isView = action.payload;
    },
    resetSliceShowHideFilter: (state) => initialStateViewHide,
  },
});

export const {
  setViewAll,
  setIsViewButtonViewAllResetAll,
  resetSliceShowHideFilter,
  setLabelVarName,
  setTextFilter,
} = getShowFilterObjectSlice.actions;

export default getShowFilterObjectSlice.reducer;

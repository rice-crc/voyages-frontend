import { PayloadAction, createSlice } from '@reduxjs/toolkit';
interface SaveSearchProps {
  saveSearchUrlID: string;
  routeSaveSearch: string;
  listSaveSearchURL: string[];
  reloadTable: boolean;
}
const initialState: SaveSearchProps = {
  saveSearchUrlID: '',
  routeSaveSearch: '',
  listSaveSearchURL: [],
  reloadTable: false,
};
const getSaveSearchSlice = createSlice({
  name: 'getSaveSearchSlice',
  initialState,
  reducers: {
    setSaveSearchUrlID: (state, action: PayloadAction<string>) => {
      state.saveSearchUrlID = action.payload;
    },
    setListSaveSearchURL: (state, action: PayloadAction<string[]>) => {
      state.listSaveSearchURL = action.payload;
    },
    setRouteSaveSearch: (state, action: PayloadAction<string>) => {
      state.routeSaveSearch = action.payload;
    },
    setReloadTable: (state, action: PayloadAction<boolean>) => {
      state.reloadTable = action.payload;
    },
    resetSliceSaveSearch: (state) => initialState,
  },
});

export const {
  resetSliceSaveSearch,
  setSaveSearchUrlID,
  setListSaveSearchURL,
  setRouteSaveSearch,
  setReloadTable,
} = getSaveSearchSlice.actions;

export default getSaveSearchSlice.reducer;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const getDataPathNameSlice = createSlice({
  name: 'getDataPathName',
  initialState: {
    pathNameVoyages: '',
    pathNameEnslaved: '',
    pathNameEnslavers: '',
  },
  reducers: {
    setPathNameVoyages: (state, action: PayloadAction<string>) => {
      state.pathNameVoyages = action.payload;
    },
    setPathNameEnslaved: (state, action: PayloadAction<string>) => {
      state.pathNameEnslaved = action.payload;
    },
    setPathEnslavers: (state, action: PayloadAction<string>) => {
      state.pathNameEnslavers = action.payload;
    },
  },
});

export const { setPathNameVoyages, setPathNameEnslaved, setPathEnslavers } =
  getDataPathNameSlice.actions;

export default getDataPathNameSlice.reducer;

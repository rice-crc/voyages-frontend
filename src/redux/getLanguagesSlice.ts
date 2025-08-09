import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { LanguagesProps } from '@/share/InterfaceTypeLanguages';

const setSelectedLanguageToLocalStorage = (language: string) => {
  localStorage.setItem('languages', language);
};

const initialStateLanguages: LanguagesProps = {
  languageValue: 'en',
  languageValueLabel: 'English',
};

const getLanguagesSlice = createSlice({
  name: 'getLanguagesSlice',
  initialState: initialStateLanguages,
  reducers: {
    setLanguages: (state, action: PayloadAction<string>) => {
      state.languageValue = action.payload;
      setSelectedLanguageToLocalStorage(action.payload);
    },
    setLanguagesLabel: (state, action: PayloadAction<string>) => {
      state.languageValueLabel = action.payload;
      setSelectedLanguageToLocalStorage(action.payload);
    },
  },
});

export const { setLanguages, setLanguagesLabel } = getLanguagesSlice.actions;

export default getLanguagesSlice.reducer;

import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const setSelectedLanguageToLocalStorage = (language: string) => {
    localStorage.setItem('languages', language);
};

export const getLanguagesSlice = createSlice({
    name: 'getLanguagesSlice',
    initialState: {
        languageValue: 'en',
        languageValueLabel: 'English'
    },
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

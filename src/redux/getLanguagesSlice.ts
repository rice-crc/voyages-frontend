import { LanguagesProps } from '@/share/InterfaceTypeLanguages';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const setSelectedLanguageToLocalStorage = (language: string) => {
    localStorage.setItem('languages', language);
};

const initialStateLanguages: LanguagesProps = {
    languageValue: 'en',
    languageValueLabel: 'English',
    configureColumns: 'Configure Columns',
    resetAll: 'Reset all',
}

export const getLanguagesSlice = createSlice({
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
        setConfigureColumns: (state, action: PayloadAction<string>) => {
            state.configureColumns = action.payload;
            setSelectedLanguageToLocalStorage(action.payload);
        },
        setResetAllLanguage:
            (state, action: PayloadAction<string>) => {
                state.resetAll = action.payload;
            },
    },
});

export const { setLanguages, setLanguagesLabel, setConfigureColumns, setResetAllLanguage } = getLanguagesSlice.actions;

export default getLanguagesSlice.reducer;

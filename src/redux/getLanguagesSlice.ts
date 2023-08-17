import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const setSelectedLanguageToLocalStorage = (language: string) => {
    localStorage.setItem('languages', language);
};

export const getLanguagesSlice = createSlice({
    name: 'getLanguagesSlice',
    initialState: {
        language: 'en'
    },
    reducers: {
        setLanguages: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
            setSelectedLanguageToLocalStorage(action.payload);
        },
    },
});

export const { setLanguages } = getLanguagesSlice.actions;

export default getLanguagesSlice.reducer;

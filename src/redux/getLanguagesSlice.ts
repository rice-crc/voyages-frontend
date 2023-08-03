import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getLanguagesSlice = createSlice({
    name: 'getLanguagesSlice',
    initialState: {
        language: 'en'
    },
    reducers: {
        setLanguages: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
    },
});

export const { setLanguages } = getLanguagesSlice.actions;

export default getLanguagesSlice.reducer;

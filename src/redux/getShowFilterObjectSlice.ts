import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const setSelectedLanguageToLocalStorage = (language: string) => {
    localStorage.setItem('languages', language);
};
interface StateViewHideProps {
    viewAll: boolean
    labelVarName: string
}
const initialStateViewHide: StateViewHideProps = {
    viewAll: false,
    labelVarName: '',
}

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
        resetSliceShowHideFilter: (state) => initialStateViewHide,
    },
});

export const { setViewAll, resetSliceShowHideFilter, setLabelVarName } = getShowFilterObjectSlice.actions;

export default getShowFilterObjectSlice.reducer;
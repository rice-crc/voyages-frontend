
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentEnslavedPage: 1,
    currentPageBlockName: 'intro'
};
export const getScrollEnslavedPageSlice = createSlice({
    name: 'getScrollEnslavedPage',
    initialState,
    reducers: {
        setCurrentEnslavedPage: (state, action: PayloadAction<number>) => {
            state.currentEnslavedPage = action.payload;
        },
        setCurrentBlockName: (state, action: PayloadAction<string>) => {
            state.currentPageBlockName = action.payload;
        },
        resetSlice: (state) => {
            state.currentEnslavedPage = initialState.currentEnslavedPage;
            state.currentPageBlockName = initialState.currentPageBlockName;
        },
    }
})

export const { resetSlice, setCurrentEnslavedPage, setCurrentBlockName } = getScrollEnslavedPageSlice.actions;
export default getScrollEnslavedPageSlice.reducer;
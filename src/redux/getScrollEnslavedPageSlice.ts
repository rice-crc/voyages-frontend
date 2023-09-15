
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getScrollEnslavedPageSlice = createSlice({
    name: 'getScrollEnslavedPage',
    initialState: {
        currentEnslavedPage: 1,
    },
    reducers: {
        setCurrentEnslavedPage: (state, action: PayloadAction<number>) => {
            state.currentEnslavedPage = action.payload;
        },
        resetSlice: (state) => {
            state.currentEnslavedPage
        },
    }
})

export const { resetSlice, setCurrentEnslavedPage } = getScrollEnslavedPageSlice.actions;
export default getScrollEnslavedPageSlice.reducer;
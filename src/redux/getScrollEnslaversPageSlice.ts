
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getScrollEnslaversPageSlice = createSlice({
    name: 'getScrollEnslavedPage',
    initialState: {
        currentEnslaversPage: 1,
    },
    reducers: {
        setCurrentEnslaversPage: (state, action: PayloadAction<number>) => {
            state.currentEnslaversPage = action.payload;
        },

    }
})

export const { setCurrentEnslaversPage } = getScrollEnslaversPageSlice.actions;
export default getScrollEnslaversPageSlice.reducer;
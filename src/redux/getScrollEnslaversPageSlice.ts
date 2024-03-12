
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getScrollEnslaversPageSlice = createSlice({
    name: 'getScrollEnslavedPage',
    initialState: {
        currentEnslaversPage: 1,
        currentBlockName: 'people'
    },
    reducers: {
        setCurrentEnslaversPage: (state, action: PayloadAction<number>) => {
            state.currentEnslaversPage = action.payload;
        },
        setCurrentBlockName: (state, action: PayloadAction<string>) => {
            state.currentBlockName = action.payload;
        },

    }
})

export const { setCurrentEnslaversPage, setCurrentBlockName } = getScrollEnslaversPageSlice.actions;
export default getScrollEnslaversPageSlice.reducer;
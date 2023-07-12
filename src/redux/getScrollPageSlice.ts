
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getScrollPageSlice = createSlice({
    name: 'getScrollPage',
    initialState: {
        currentPage: 1,
        isOpenDialog: false,
        isOpenDialogMobile: false
    },
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setIsOpenDialog: (state, action: PayloadAction<boolean>) => {
            state.isOpenDialog = action.payload;
        },
        setIsOpenDialogMobile: (state, action: PayloadAction<boolean>) => {
            state.isOpenDialogMobile = action.payload;
        },
    }
})

export const { setCurrentPage, setIsOpenDialog, setIsOpenDialogMobile } = getScrollPageSlice.actions;
export default getScrollPageSlice.reducer;
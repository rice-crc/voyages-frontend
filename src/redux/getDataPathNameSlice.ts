
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getDataPathNameSlice = createSlice({
    name: 'getDataPathName',
    initialState: {
        pathName: ''
    },
    reducers: {
        setPathName: (state, action: PayloadAction<string>) => {
            state.pathName = action.payload
        },
    },
});

export const { setPathName } = getDataPathNameSlice.actions;

export default getDataPathNameSlice.reducer;

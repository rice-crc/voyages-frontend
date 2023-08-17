import { GlobalSearchProp } from '@/share/InterfaceTypesGlobalSearch';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const getCommonGlobalSearchResultSlice = createSlice({
    name: 'getFilter',
    initialState: {
        data: [] as GlobalSearchProp[],
    },
    reducers: {
        setSearchGlobalData: (state, action: PayloadAction<GlobalSearchProp[]>) => {
            state.data = action.payload;
        },
    },
});

export const { setSearchGlobalData } = getCommonGlobalSearchResultSlice.actions;

export default getCommonGlobalSearchResultSlice.reducer;

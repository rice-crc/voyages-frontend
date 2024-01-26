import { TreeSelectItemInitialState, GeoTreeSelectItem } from '@/share/InterfaceTypes';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: TreeSelectItemInitialState = {
    geoTreeValue: {},
    geoTreeSelectValue: [],
    isChangeGeoTree: false
};

export const getGeoTreeDataSlice = createSlice({
    name: 'getGeoTreeBoxSlice',
    initialState,
    reducers: {
        setGeoTreeValues: (
            state,
            action: PayloadAction<Record<string, GeoTreeSelectItem[] | string[]>>
        ) => {
            state.geoTreeValue = action.payload;
        },
        setGeoTreeValueSelect: (state, action: PayloadAction<string[]>) => {
            state.geoTreeSelectValue = action.payload
        },
        setIsChangeGeoTree: (state, action: PayloadAction<boolean>) => {
            state.isChangeGeoTree = action.payload;
        },
        resetSlice: (state) => initialState,
    },
});

export const { setGeoTreeValues, setGeoTreeValueSelect, setIsChangeGeoTree, resetSlice } =
    getGeoTreeDataSlice.actions;

export default getGeoTreeDataSlice.reducer;

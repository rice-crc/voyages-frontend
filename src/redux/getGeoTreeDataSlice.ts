import { TreeSelectItemInitialState, TreeSelectItem } from '@/share/InterfaceTypes';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: TreeSelectItemInitialState = {
    geoTreeList: [],
    geoTreeValue: {},
    geoTreeSelectValue: [],
    isChangeGeoTree: false
};

export const getGeoTreeDataSlice = createSlice({
    name: 'getGeoTreeBoxSlice',
    initialState,
    reducers: {
        setGeoTreeValueList: (state, action) => {
            state.geoTreeList = action.payload;
        },
        setGeoTreeValues: (
            state,
            action: PayloadAction<Record<string, TreeSelectItem[] | string[]>>
        ) => {
            state.geoTreeValue = action.payload;
        },
        setGeoTreeValueSelect: (state, action: PayloadAction<string[]>) => {
            state.geoTreeSelectValue = action.payload
        },
        setIsChangeGeoTree: (state, action: PayloadAction<boolean>) => {
            state.isChangeGeoTree = action.payload;
        },
    },
});

export const { setGeoTreeValueList, setGeoTreeValues, setGeoTreeValueSelect, setIsChangeGeoTree } =
    getGeoTreeDataSlice.actions;

export default getGeoTreeDataSlice.reducer;

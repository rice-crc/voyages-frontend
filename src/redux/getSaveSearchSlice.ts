import { PayloadAction, createSlice } from '@reduxjs/toolkit'
interface SaveSearchProps {
    saveSearchUrlID: string;
    routeSaveSearch: string,
    listSaveSearchURL: string[];
}
const initialState: SaveSearchProps = {
    saveSearchUrlID: '',
    routeSaveSearch: '',
    listSaveSearchURL: []
};
export const getSaveSearchSlice = createSlice({
    name: 'getSaveSearchSlice',
    initialState,
    reducers: {
        setSaveSearchUrlID: (state, action: PayloadAction<string>) => {
            state.saveSearchUrlID = action.payload;
        },
        setListSaveSearchURL: (state, action: PayloadAction<string[]>) => {
            state.listSaveSearchURL = action.payload;
        },
        setRouteSaveSearch: (state, action: PayloadAction<string>) => {
            state.routeSaveSearch = action.payload;
        },
        resetSliceSaveSearch: (state) => initialState,
    },
});

export const { resetSliceSaveSearch, setSaveSearchUrlID, setListSaveSearchURL, setRouteSaveSearch } = getSaveSearchSlice.actions;

export default getSaveSearchSlice.reducer;

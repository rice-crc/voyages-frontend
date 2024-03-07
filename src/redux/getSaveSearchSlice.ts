import { PayloadAction, createSlice } from '@reduxjs/toolkit'
interface SaveSearchProps {
    saveSearchUrlID: string;
    listSaveSearchURL: string[];
}
const initialState: SaveSearchProps = {
    saveSearchUrlID: '',
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
        resetSliceSaveSearch: (state) => initialState,
    },
});

export const { resetSliceSaveSearch, setSaveSearchUrlID, setListSaveSearchURL } = getSaveSearchSlice.actions;

export default getSaveSearchSlice.reducer;

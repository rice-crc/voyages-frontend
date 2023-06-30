import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import jsonData from '@/utils/transatlantic_voyages_filter_menu.json'
import { FilterMenu, InitialStateFilterMenu } from "@/share/InterfaceTypes";
const initialState: InitialStateFilterMenu = {
    value: jsonData
};
export const getOptionsFlatObjSlice = createSlice({
    name: "optionFlatMenu",
    initialState,
    reducers: {
        getOptionsFlatMenu: (state, action: PayloadAction<FilterMenu[]>) => {
            state.value = action.payload;
        }
    }
})

export const { getOptionsFlatMenu } = getOptionsFlatObjSlice.actions;
export default getOptionsFlatObjSlice.reducer;
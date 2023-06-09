import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsDataState } from '@/share/InterfaceTypes'

const initialState: OptionsDataState = {
    value: {},
};

export const getOptionsDataSlice = createSlice({
    name: "optionsData",
    initialState,
    reducers: {
        getOptions: (state, action: PayloadAction<Record<string, never>>) => {
            state.value = action.payload;
        },
    },
});

export const { getOptions } = getOptionsDataSlice.actions;
export default getOptionsDataSlice.reducer;

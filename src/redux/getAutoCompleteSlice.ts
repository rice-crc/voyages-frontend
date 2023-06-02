import { AutoCompleteInitialState, AutoCompleteOption } from "@/share/InterfaceTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const initialState: AutoCompleteInitialState = {
    results: [],
    total_results_count: 0,
    autoCompleteValue: {},
    autoLabelName: [],
    isChangeAuto: false
};

export const getAutoCompleteSlice = createSlice({
    name: "autoCompleteList",
    initialState,
    reducers: {
        getAutoCompleteList: (state, action) => {
            state.results = action.payload;
        },
        setAutoCompleteValue: (
            state,
            action: PayloadAction<Record<string, AutoCompleteOption[] | string[]>>
        ) => {
            state.autoCompleteValue = action.payload;
        },
        setAutoLabel: (state, action: PayloadAction<string[]>) => {
            state.autoLabelName = action.payload
        },
        setIsChangeAuto: (state, action: PayloadAction<boolean>) => {
            state.isChangeAuto = action.payload;
        },
    },
});

export const { getAutoCompleteList, setAutoCompleteValue, setAutoLabel, setIsChangeAuto } =
    getAutoCompleteSlice.actions;

export default getAutoCompleteSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OptionsDataState } from '@/share/InterfaceTypes'

const initialState: OptionsDataState = {
    value: {},
};

export const getOptionsDataPastPeopleEnslavedSlice = createSlice({
    name: 'getOptionsEnslaved',
    initialState,
    reducers: {
        getOptionsEnslaved: (state, action: PayloadAction<Record<string, never>>) => {
            state.value = action.payload;
        },
    },
});

export const { getOptionsEnslaved } = getOptionsDataPastPeopleEnslavedSlice.actions;
export default getOptionsDataPastPeopleEnslavedSlice.reducer;

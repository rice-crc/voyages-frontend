import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterNationalityList, NationalityListProps } from '@/share/InterfaceTypes';

const initialState: FilterNationalityList = {
    nationalityList: [],
};

const getNationalityListSlice = createSlice({
    name: 'rangeSlider',
    initialState,
    reducers: {
        setNationalityList: (state, action: PayloadAction<NationalityListProps[]>) => {
            state.nationalityList = action.payload;
        },
        resetSliceNations: (state) => initialState,
    },

});
export const { resetSliceNations, setNationalityList } = getNationalityListSlice.actions;
export default getNationalityListSlice.reducer;

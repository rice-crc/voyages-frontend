import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RangeSliderState } from '@/share/InterfaceTypes';
import { fetchRangeVoyageSliderData } from '@/fetch/voyagesFetch/fetchRangeSliderData';

const initialState: RangeSliderState = {
    rangeValue: {},
    loading: false,
    error: false,
    varName: '',
    isChange: false,
    rangeSliderMinMax: {},
};

const rangeSliderSlice = createSlice({
    name: 'rangeSlider',
    initialState,
    reducers: {
        setRangeValue: (state, action: PayloadAction<Record<string, number[]>>) => {
            state.rangeValue = action.payload;
        },
        setKeyValueName: (state, action: PayloadAction<string>) => {
            state.varName = action.payload;
        },
        setIsChange: (state, action: PayloadAction<boolean>) => {
            state.isChange = action.payload;
        },
        setRangeSliderValue: (state, action: PayloadAction<Record<string, number[]>>) => {
            state.rangeSliderMinMax = action.payload;
        },
        resetSlice: (state) => initialState,
    },

});
export const { setRangeValue, setKeyValueName, setIsChange, resetSlice, setRangeSliderValue } = rangeSliderSlice.actions;
export default rangeSliderSlice.reducer;

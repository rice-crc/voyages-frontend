import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRangeSliderData } from '../fetchAPI/FetchAggregationsSlider';
import { RangeSliderState } from '../share/TableRangeSliderType';


const initialState: RangeSliderState = {
    value: {},
    range: [0, 0],
    loading: false,
    error: false
};


const rangeSliderSlice = createSlice({
    name: 'rangeSlider',
    initialState,
    reducers: {
        setRange: (state, action: PayloadAction<number[]>) => {
            state.range = action.payload;
        },
        setValue: (state, action: PayloadAction<Record<string, number[]>>) => {
            state.value = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRangeSliderData.pending, (state) => {
            state.loading = true;
            state.error = true;
        });
        builder.addCase(fetchRangeSliderData.fulfilled, (state, action) => {
            state.value = action.payload.value;
            state.loading = false;
            state.error = false;
        });
        builder.addCase(fetchRangeSliderData.rejected, (state, action) => {
            state.loading = false;
            state.error = false;
        });
    },
});
export const { setRange, setValue } = rangeSliderSlice.actions;
export default rangeSliderSlice.reducer;

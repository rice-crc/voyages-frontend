import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RangeSliderState } from '@/share/InterfaceTypes';
import { fetchRangeSliderData } from '@/fetchAPI/fetchAggregationsSlider';

const initialState: RangeSliderState = {
    value: {},
    range: [0, 0],
    loading: false,
    error: false,
    keyValue: ""
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
        setKeyValue: (state, action: PayloadAction<string>) => {
            state.keyValue = action.payload;
        }
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
export const { setRange, setValue, setKeyValue } = rangeSliderSlice.actions;
export default rangeSliderSlice.reducer;

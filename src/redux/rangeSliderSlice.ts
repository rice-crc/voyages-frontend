import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RangeSliderState } from '@/share/InterfaceTypes';
import { fetchRangeSliderData } from '@/fetchAPI/fetchAggregationsSlider';

const initialState: RangeSliderState = {
    value: {},
    loading: false,
    error: false,
    varName: "",
    isChange: false,
    rangeSliderMinMax: {},

};

const rangeSliderSlice = createSlice({
    name: 'rangeSlider',
    initialState,
    reducers: {
        setValue: (state, action: PayloadAction<Record<string, number[]>>) => {

            state.value = action.payload;
        },
        setKeyValue: (state, action: PayloadAction<string>) => {
            state.varName = action.payload;
        },
        setIsChange: (state, action: PayloadAction<boolean>) => {
            state.isChange = action.payload;
        },
        setRangeSliderValue: (state, action: PayloadAction<Record<string, number[]>>) => {
            state.rangeSliderMinMax = action.payload;
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
export const { setValue, setKeyValue, setIsChange, setRangeSliderValue } = rangeSliderSlice.actions;
export default rangeSliderSlice.reducer;

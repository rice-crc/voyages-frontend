import { configureStore } from "@reduxjs/toolkit";
import getOptionsReducer from './opptionsDataSlice';
import getRangeSliderReducer from './getRangeSliderSlice';
import { voyagesApi } from '../fetchAPI/fetchApiService';

const store = configureStore({
    reducer: {
        getOptions: getOptionsReducer,
        getRangeSlider: getRangeSliderReducer,
        [voyagesApi.reducerPath]: voyagesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(voyagesApi.middleware)
});

export default store;

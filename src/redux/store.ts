import { configureStore } from "@reduxjs/toolkit";
import getOptionsReducer from './opptionsDataSlice';
import getRangeSliderReducer from './getRangeSliderSlice';
import rangeSliderSlice from './rangeSliderSlice';
import getAutoCompleteList from './getAutoCompleteSlice'
import { voyagesApi } from '../fetchAPI/fetchApiService';
import { setupListeners } from "@reduxjs/toolkit/dist/query";


const store = configureStore({
    reducer: {
        getOptions: getOptionsReducer,
        getRangeSlider: getRangeSliderReducer,
        rangeSlider: rangeSliderSlice,
        autoCompleteList: getAutoCompleteList,
        [voyagesApi.reducerPath]: voyagesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(voyagesApi.middleware)
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;


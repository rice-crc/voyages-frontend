import { configureStore } from "@reduxjs/toolkit";
import getOptionsReducer from './opptionsDataSlice';
import rangeSliderSlice from './rangeSliderSlice';
import getAutoCompleteList from './getAutoCompleteSlice'
import getOptionsFlatMenu from './getOptionsFlatObjSlice'
import getScatterSlice from './getScatterSlice'
import getVoyageGroupbySlice from "./getVoyageGroupbySlice";
import getScrollPageSlice from "./getScrollPageSlice"
import { voyagesApi } from '../fetchAPI/fetchApiService';
import { setupListeners } from "@reduxjs/toolkit/dist/query";


const store = configureStore({
    reducer: {
        getOptions: getOptionsReducer,
        rangeSlider: rangeSliderSlice,
        autoCompleteList: getAutoCompleteList,
        optionFlatMenu: getOptionsFlatMenu,
        voyageGroupby: getVoyageGroupbySlice,
        getScatter: getScatterSlice,
        getScrollPage: getScrollPageSlice,
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


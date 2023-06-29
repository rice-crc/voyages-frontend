import { configureStore } from "@reduxjs/toolkit";
import getOptionsDataSlice from './getOptionsDataSlice';
import rangeSliderSlice from './rangeSliderSlice';
import getAutoCompleteList from './getAutoCompleteSlice'
import getOptionsFlatMenu from './getOptionsFlatObjSlice'
import getScrollPageSlice from "./getScrollPageSlice"
import getTableSlice from './getTableSlice'
import { voyagesApi } from '../fetchAPI/fetchApiService';
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import getFilterSlice from "./getFilterSlice";
import getColumnsSlice from "./getColumnSlice";
import getDataSetMenuSlice from './getDataSetMenuSlice'


const store = configureStore({
    reducer: {
        getOptions: getOptionsDataSlice,
        rangeSlider: rangeSliderSlice,
        autoCompleteList: getAutoCompleteList,
        optionFlatMenu: getOptionsFlatMenu,
        getScrollPage: getScrollPageSlice,
        getTableData: getTableSlice,
        getFilter: getFilterSlice,
        getColumns: getColumnsSlice,
        getDataSetMenu: getDataSetMenuSlice,
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


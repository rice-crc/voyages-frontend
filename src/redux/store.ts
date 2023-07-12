import { configureStore } from '@reduxjs/toolkit';
import getOptionsDataSlice from './getOptionsDataSlice';
import rangeSliderSlice from './rangeSliderSlice';
import getAutoCompleteList from './getAutoCompleteSlice'
import getOptionsFlatMenu from './getOptionsFlatObjSlice'
import getScrollPageSlice from './getScrollPageSlice'
import getTableSlice from './getTableSlice'
import { voyagesApi } from '../fetchAPI/voyagesApi/fetchApiService';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import getFilterSlice from './getFilterSlice';
import getColumnsSlice from './getColumnSlice';
import getDataSetCollectionSlice from './getDataSetCollectionSlice'
import getPeopleDataSetCollectionSlice from './getPeopleDataSetCollectionSlice';
import getScrollEnslavedPageSlice from './getScrollEnslavedPageSlice';
import getFilterPeopleObjectSlice from './getFilterPeopleObjectSlice';
import getOptionsDataPastPeopleEnslavedSlice from './getOptionsDataPastPeopleEnslavedSlice';
import { pastEnslavedApi } from '@/fetchAPI/pastEnslavedApi/fetchPastEnslavedApiService';

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
        getDataSetCollection: getDataSetCollectionSlice,
        getPeopleDataSetCollection: getPeopleDataSetCollectionSlice,
        getScrollEnslavedPage: getScrollEnslavedPageSlice,
        getFilterPeople: getFilterPeopleObjectSlice,
        getOptionsEnslaved: getOptionsDataPastPeopleEnslavedSlice,
        [pastEnslavedApi.reducerPath]: pastEnslavedApi.reducer,
        [voyagesApi.reducerPath]: voyagesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat([voyagesApi.middleware, pastEnslavedApi.middleware])
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;


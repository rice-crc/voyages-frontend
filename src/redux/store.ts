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
import getPeopleEnslavedDataSetCollectionSlice from './getPeopleEnslavedDataSetCollectionSlice';
import getScrollEnslavedPageSlice from './getScrollEnslavedPageSlice';
import getFilterPeopleObjectSlice from './getFilterPeopleObjectSlice';
import getOptionsDataPastPeopleEnslavedSlice from './getOptionsDataPastPeopleEnslavedSlice';
import { pastEnslavedApiService } from '@/fetchAPI/pastEnslavedApi/fetchPastEnslavedApiService';
import { pastEnslaversApiService } from '@/fetchAPI/pastEnslaversApi/fetchPastEnslaversApiService';
import getScrollEnslaversPageSlice from './getScrollEnslaversPageSlice';
import getPeopleEnslaversDataSetCollectionSlice from './getPeopleEnslaversDataSetCollectionSlice';
import getBlogDataSlice from './getBlogDataSlice';
import getLanguagesSlice from './getLanguagesSlice';
import getCommonGlobalSearchResultSlice from './getCommonGlobalSearchResultSlice';
import getPastNetworksGraphDataSlice from './getPastNetworksGraphDataSlice';

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
        getPeopleEnlavedDataSetCollection: getPeopleEnslavedDataSetCollectionSlice,
        getEnslaverDataSetCollections: getPeopleEnslaversDataSetCollectionSlice,
        getScrollEnslavedPage: getScrollEnslavedPageSlice,
        getScrollEnslaversPage: getScrollEnslaversPageSlice,
        getFilterPeople: getFilterPeopleObjectSlice,
        getOptionsEnslaved: getOptionsDataPastPeopleEnslavedSlice,
        getBlogData: getBlogDataSlice,
        getLanguages: getLanguagesSlice,
        getCommonGlobalSearch: getCommonGlobalSearchResultSlice,
        getPastNetworksGraphData: getPastNetworksGraphDataSlice,
        [voyagesApi.reducerPath]: voyagesApi.reducer,
        [pastEnslavedApiService.reducerPath]: pastEnslavedApiService.reducer,
        [pastEnslaversApiService.reducerPath]: pastEnslaversApiService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat([voyagesApi.middleware, pastEnslavedApiService.middleware, pastEnslaversApiService.middleware])
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;


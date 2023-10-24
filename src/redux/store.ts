import { configureStore } from '@reduxjs/toolkit';
import getOptionsDataSlice from './getOptionsDataSlice';
import rangeSliderSlice from './getRangeSliderSlice';
import getAutoCompleteList from './getAutoCompleteSlice'
import getOptionsFlatMenu from './getOptionsFlatObjSlice'
import getScrollPageSlice from './getScrollPageSlice'
import getTableSlice from './getTableSlice'
import { voyagesApi } from '../fetch/voyagesFetch/fetchApiService';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import getFilterSlice from './getFilterSlice';
import getColumnsSlice from './getColumnSlice';
import getDataSetCollectionSlice from './getDataSetCollectionSlice'
import getPeopleEnslavedDataSetCollectionSlice from './getPeopleEnslavedDataSetCollectionSlice';
import getScrollEnslavedPageSlice from './getScrollEnslavedPageSlice';
import getFilterPeopleObjectSlice from './getFilterPeopleObjectSlice';
import getOptionsDataPastPeopleEnslavedSlice from './getOptionsDataPastPeopleEnslavedSlice';
import { pastEnslavedService } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedService';
import { pastEnslaversService } from '@/fetch/pastEnslaversFetch/pastEnslaversService';
import getScrollEnslaversPageSlice from './getScrollEnslaversPageSlice';
import getPeopleEnslaversDataSetCollectionSlice from './getPeopleEnslaversDataSetCollectionSlice';
import getBlogDataSlice from './getBlogDataSlice';
import getLanguagesSlice from './getLanguagesSlice';
import getCommonGlobalSearchResultSlice from './getCommonGlobalSearchResultSlice';
import getPastNetworksGraphDataSlice from './getPastNetworksGraphDataSlice';
import getNodeEdgesAggroutesMapDataSlice from './getNodeEdgesAggroutesMapDataSlice';
import getPivotTablesDataSlice from './getPivotTablesDataSlice';
import getCardFlatObjectSlice from './getCardFlatObjectSlice';
import getGeoTreeDataSlice from './getGeoTreeDataSlice';
import getDataPathNameSlice from './getDataPathNameSlice';

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
                getNodeEdgesAggroutesMapData: getNodeEdgesAggroutesMapDataSlice,
                getCardFlatObjectData: getCardFlatObjectSlice,
                getPivotTablesData: getPivotTablesDataSlice,
                getGeoTreeData: getGeoTreeDataSlice,
                getPathName: getDataPathNameSlice,
                [voyagesApi.reducerPath]: voyagesApi.reducer,
                [pastEnslavedService.reducerPath]: pastEnslavedService.reducer,
                [pastEnslaversService.reducerPath]: pastEnslaversService.reducer,
        },
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                        serializableCheck: false,
                }).concat([voyagesApi.middleware, pastEnslavedService.middleware, pastEnslaversService.middleware])
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;


import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
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
import getFilterMenuListSlice from './getFilterMenuListSlice';
import getEstimateAssesmentSlice from './getEstimateAssessmentSlice';
import getSaveSearchSlice from './getSaveSearchSlice';
import getQuerySaveSearchSlice from './getQuerySaveSearchSlice'


// Define types for slices
type GetOptionsDataSlice = ReturnType<typeof getOptionsDataSlice>;
type RangeSliderSlice = ReturnType<typeof rangeSliderSlice>;
type AutoCompleteListSlice = ReturnType<typeof getAutoCompleteList>;
type OptionsFlatMenuSlice = ReturnType<typeof getOptionsFlatMenu>;
type FilterMenuListSlice = ReturnType<typeof getFilterMenuListSlice>;
type ScrollPageSlice = ReturnType<typeof getScrollPageSlice>;
type TableSlice = ReturnType<typeof getTableSlice>;
type FilterSlice = ReturnType<typeof getFilterSlice>;
type ColumnsSlice = ReturnType<typeof getColumnsSlice>;
type DataSetCollectionSlice = ReturnType<typeof getDataSetCollectionSlice>;
type PeopleEnslavedDataSetCollectionSlice = ReturnType<typeof getPeopleEnslavedDataSetCollectionSlice>;
type PeopleEnslaversDataSetCollectionSlice = ReturnType<typeof getPeopleEnslaversDataSetCollectionSlice>;
type ScrollEnslavedPageSlice = ReturnType<typeof getScrollEnslavedPageSlice>;
type ScrollEnslaversPageSlice = ReturnType<typeof getScrollEnslaversPageSlice>;
type OptionsDataPastPeopleEnslavedSlice = ReturnType<typeof getOptionsDataPastPeopleEnslavedSlice>;
type BlogDataSlice = ReturnType<typeof getBlogDataSlice>;
type LanguagesSlice = ReturnType<typeof getLanguagesSlice>;
type CommonGlobalSearchResultSlice = ReturnType<typeof getCommonGlobalSearchResultSlice>;
type PastNetworksGraphDataSlice = ReturnType<typeof getPastNetworksGraphDataSlice>;
type NodeEdgesAggroutesMapDataSlice = ReturnType<typeof getNodeEdgesAggroutesMapDataSlice>;
type CardFlatObjectSlice = ReturnType<typeof getCardFlatObjectSlice>;
type PivotTablesDataSlice = ReturnType<typeof getPivotTablesDataSlice>;
type GeoTreeDataSlice = ReturnType<typeof getGeoTreeDataSlice>;
type DataPathNameSlice = ReturnType<typeof getDataPathNameSlice>;
type EstimateAssesmentSlice = ReturnType<typeof getEstimateAssesmentSlice>;
type SaveSearchSlice = ReturnType<typeof getSaveSearchSlice>;
type QuerySaveSearchSlice = ReturnType<typeof getQuerySaveSearchSlice>;


// Define RootState
export type RootState = {
        getOptions: GetOptionsDataSlice;
        rangeSlider: RangeSliderSlice;
        autoCompleteList: AutoCompleteListSlice;
        optionFlatMenu: OptionsFlatMenuSlice;
        getFilterMenuList: FilterMenuListSlice;
        getScrollPage: ScrollPageSlice;
        getTableData: TableSlice;
        getFilter: FilterSlice;
        getColumns: ColumnsSlice;
        getDataSetCollection: DataSetCollectionSlice;
        getPeopleEnlavedDataSetCollection: PeopleEnslavedDataSetCollectionSlice;
        getEnslaverDataSetCollections: PeopleEnslaversDataSetCollectionSlice;
        getScrollEnslavedPage: ScrollEnslavedPageSlice;
        getScrollEnslaversPage: ScrollEnslaversPageSlice;
        getOptionsEnslaved: OptionsDataPastPeopleEnslavedSlice;
        getBlogData: BlogDataSlice;
        getLanguages: LanguagesSlice;
        getCommonGlobalSearch: CommonGlobalSearchResultSlice;
        getPastNetworksGraphData: PastNetworksGraphDataSlice;
        getNodeEdgesAggroutesMapData: NodeEdgesAggroutesMapDataSlice;
        getCardFlatObjectData: CardFlatObjectSlice;
        getPivotTablesData: PivotTablesDataSlice;
        getGeoTreeData: GeoTreeDataSlice;
        getPathName: DataPathNameSlice;
        getEstimateAssessment: EstimateAssesmentSlice
        getSaveSearch: SaveSearchSlice
        getQuerySaveSearch: QuerySaveSearchSlice
        [voyagesApi.reducerPath]: ReturnType<typeof voyagesApi.reducer>;
};

const store = configureStore({
        reducer: {
                getOptions: getOptionsDataSlice,
                rangeSlider: rangeSliderSlice,
                autoCompleteList: getAutoCompleteList,
                optionFlatMenu: getOptionsFlatMenu,
                getFilterMenuList: getFilterMenuListSlice,
                getScrollPage: getScrollPageSlice,
                getTableData: getTableSlice,
                getFilter: getFilterSlice,
                getColumns: getColumnsSlice,
                getDataSetCollection: getDataSetCollectionSlice,
                getPeopleEnlavedDataSetCollection: getPeopleEnslavedDataSetCollectionSlice,
                getEnslaverDataSetCollections: getPeopleEnslaversDataSetCollectionSlice,
                getScrollEnslavedPage: getScrollEnslavedPageSlice,
                getScrollEnslaversPage: getScrollEnslaversPageSlice,
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
                getEstimateAssessment: getEstimateAssesmentSlice,
                getSaveSearch: getSaveSearchSlice,
                getQuerySaveSearch: getQuerySaveSearchSlice,
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

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;


import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { pastEnslavedService } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedService';
import { pastEnslaversService } from '@/fetch/pastEnslaversFetch/pastEnslaversService';

import documentModalSlice from './documentModalSlice';
import getAuthUserSlice from './getAuthUserSlice';
import getAutoCompleteSlice from './getAutoCompleteSlice';
import getBlogDataSlice from './getBlogDataSlice';
import getCardFlatObjectSlice from './getCardFlatObjectSlice';
import getColumnsSlice from './getColumnSlice';
import getCommonGlobalSearchResultSlice from './getCommonGlobalSearchResultSlice';
import getDataPathNameSlice from './getDataPathNameSlice';
import getDataSetCollectionSlice from './getDataSetCollectionSlice';
import getEstimateAssesmentSlice from './getEstimateAssessmentSlice';
import getFilterMenuListSlice from './getFilterMenuListSlice';
import getFilterSlice from './getFilterSlice';
import getGeoTreeDataSlice from './getGeoTreeDataSlice';
import getLanguagesSlice from './getLanguagesSlice';
import getNodeEdgesAggroutesMapDataSlice from './getNodeEdgesAggroutesMapDataSlice';
import getOptionsDataPastPeopleEnslavedSlice from './getOptionsDataPastPeopleEnslavedSlice';
import getOptionsDataSlice from './getOptionsDataSlice';
import getOptionsFlatObjSlice from './getOptionsFlatObjSlice';
import getPastNetworksGraphDataSlice from './getPastNetworksGraphDataSlice';
import getPeopleEnslavedDataSetCollectionSlice from './getPeopleEnslavedDataSetCollectionSlice';
import getPeopleEnslaversDataSetCollectionSlice from './getPeopleEnslaversDataSetCollectionSlice';
import getPivotTablesDataSlice from './getPivotTablesDataSlice';
import getQuerySaveSearchSlice from './getQuerySaveSearchSlice';
import rangeSliderSlice from './getRangeSliderSlice';
import getSaveSearchSlice from './getSaveSearchSlice';
import getScrollEnslavedPageSlice from './getScrollEnslavedPageSlice';
import getScrollEnslaversPageSlice from './getScrollEnslaversPageSlice';
import getScrollPageSlice from './getScrollPageSlice';
import getShowFilterObjectSlice from './getShowFilterObjectSlice';
import getTableSlice from './getTableSlice';
import { voyagesApi } from '../fetch/voyagesFetch/fetchApiService';

// Define types for slices
type GetAuthUserSlice = ReturnType<typeof getAuthUserSlice>;
type GetOptionsDataSlice = ReturnType<typeof getOptionsDataSlice>;
type RangeSliderSlice = ReturnType<typeof rangeSliderSlice>;
type AutoCompleteListSlice = ReturnType<typeof getAutoCompleteSlice>;
type OptionsFlatMenuSlice = ReturnType<typeof getOptionsFlatObjSlice>;
type FilterMenuListSlice = ReturnType<typeof getFilterMenuListSlice>;
type ScrollPageSlice = ReturnType<typeof getScrollPageSlice>;

type TableSlice = ReturnType<typeof getTableSlice>;
type FilterSlice = ReturnType<typeof getFilterSlice>;
type ColumnsSlice = ReturnType<typeof getColumnsSlice>;
type DataSetCollectionSlice = ReturnType<typeof getDataSetCollectionSlice>;
type PeopleEnslavedDataSetCollectionSlice = ReturnType<
  typeof getPeopleEnslavedDataSetCollectionSlice
>;
type PeopleEnslaversDataSetCollectionSlice = ReturnType<
  typeof getPeopleEnslaversDataSetCollectionSlice
>;
type ScrollEnslavedPageSlice = ReturnType<typeof getScrollEnslavedPageSlice>;
type ScrollEnslaversPageSlice = ReturnType<typeof getScrollEnslaversPageSlice>;
type OptionsDataPastPeopleEnslavedSlice = ReturnType<
  typeof getOptionsDataPastPeopleEnslavedSlice
>;
type BlogDataSlice = ReturnType<typeof getBlogDataSlice>;
type LanguagesSlice = ReturnType<typeof getLanguagesSlice>;
type CommonGlobalSearchResultSlice = ReturnType<
  typeof getCommonGlobalSearchResultSlice
>;
type PastNetworksGraphDataSlice = ReturnType<
  typeof getPastNetworksGraphDataSlice
>;
type NodeEdgesAggroutesMapDataSlice = ReturnType<
  typeof getNodeEdgesAggroutesMapDataSlice
>;
type CardFlatObjectSlice = ReturnType<typeof getCardFlatObjectSlice>;
type PivotTablesDataSlice = ReturnType<typeof getPivotTablesDataSlice>;
type GeoTreeDataSlice = ReturnType<typeof getGeoTreeDataSlice>;
type DataPathNameSlice = ReturnType<typeof getDataPathNameSlice>;
type EstimateAssesmentSlice = ReturnType<typeof getEstimateAssesmentSlice>;
type SaveSearchSlice = ReturnType<typeof getSaveSearchSlice>;
type QuerySaveSearchSlice = ReturnType<typeof getQuerySaveSearchSlice>;
type ShowFilterObjectSlice = ReturnType<typeof getShowFilterObjectSlice>;
type DocumentModalSlice = ReturnType<typeof documentModalSlice>;

// Define RootState
export type RootState = {
  getAuthUserSlice: GetAuthUserSlice;
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
  getEstimateAssessment: EstimateAssesmentSlice;
  getSaveSearch: SaveSearchSlice;
  getQuerySaveSearch: QuerySaveSearchSlice;
  getShowFilterObject: ShowFilterObjectSlice;
  documentModal: DocumentModalSlice;
  [voyagesApi.reducerPath]: ReturnType<typeof voyagesApi.reducer>;
};

const store = configureStore({
  reducer: {
    getAuthUserSlice: getAuthUserSlice,
    getOptions: getOptionsDataSlice,
    rangeSlider: rangeSliderSlice,
    autoCompleteList: getAutoCompleteSlice,
    optionFlatMenu: getOptionsFlatObjSlice,
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
    getShowFilterObject: getShowFilterObjectSlice,
    documentModal: documentModalSlice,
    [voyagesApi.reducerPath]: voyagesApi.reducer,
    [pastEnslavedService.reducerPath]: pastEnslavedService.reducer,
    [pastEnslaversService.reducerPath]: pastEnslaversService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      voyagesApi.middleware,
      pastEnslavedService.middleware,
      pastEnslaversService.middleware,
    ]),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

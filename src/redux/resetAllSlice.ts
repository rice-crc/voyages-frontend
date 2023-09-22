import { Dispatch } from '@reduxjs/toolkit';
import { resetSlice as resetOptionsData } from './getOptionsDataSlice';
import { resetSlice as resetGeoTreeData } from './getGeoTreeDataSlice';
import { resetSlice as resetRangeSliderData } from './getRangeSliderSlice';
import { resetSlice as resetAutoCompleteData } from './getAutoCompleteSlice';
import { resetSlice as resetDataSetCollectionData } from './getDataSetCollectionSlice';
import { resetSlice as resetVoyagesFilter } from './getFilterSlice';
import { resetSlice as resetFilterPeopleData } from './getFilterPeopleObjectSlice';
import { resetSlice as resetNodeEdgesAggroutesMapData } from './getNodeEdgesAggroutesMapDataSlice';
import { resetSlice as resetOptionDataPastEnslaved } from './getOptionsDataPastPeopleEnslavedSlice';
import { resetSlice as resetOptionPlatObjectData } from './getOptionsFlatObjSlice';
import { resetSlice as resetPeopleEnslavedDataSetCollection } from './getPeopleEnslavedDataSetCollectionSlice';
import { resetSlice as resetPeopleEnslaversDataSetCollection } from './getPeopleEnslaversDataSetCollectionSlice';
import { resetSlice as resetScroolVoyages } from './getScrollPageSlice';
import { resetSlice as resetScroolEnslaved } from './getScrollEnslavedPageSlice';
import { resetSlice as resetScroolEnslavers } from './getScrollEnslaversPageSlice';

export const resetAll = () => (dispatch: Dispatch) => {
    dispatch(resetOptionsData());
    dispatch(resetGeoTreeData());
    dispatch(resetRangeSliderData());
    dispatch(resetAutoCompleteData());
    dispatch(resetDataSetCollectionData())
    dispatch(resetVoyagesFilter())
    dispatch(resetFilterPeopleData())
    dispatch(resetNodeEdgesAggroutesMapData())
    dispatch(resetOptionDataPastEnslaved())
    dispatch(resetOptionPlatObjectData())
    dispatch(resetPeopleEnslavedDataSetCollection())
    dispatch(resetPeopleEnslaversDataSetCollection())
    dispatch(resetScroolVoyages())
    dispatch(resetScroolEnslaved())
    dispatch(resetScroolEnslavers())
};

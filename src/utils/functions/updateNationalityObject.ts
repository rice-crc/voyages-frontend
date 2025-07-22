import { setFilterObject } from '@/redux/getFilterSlice';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch } from '@/redux/store';
import { allEnslavers, FILTER_OBJECT_KEY } from '@/share/CONST_DATA';
import {
  Filter,
  TYPESOFDATASET,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';

export const updateNationalityObject = (
  dispatch: AppDispatch,
  valueSelect: string[],
  varName: string,
  labelVarName: string,
  styleNameRoute: string,
) => {
  const existingFilterObjectString = localStorage.getItem(FILTER_OBJECT_KEY);
  let existingFilters: Filter[] = [];

  if (existingFilterObjectString) {
    existingFilters = JSON.parse(existingFilterObjectString).filter || [];
  }
  const existingFilterIndex = existingFilters.findIndex(
    (filter) => filter.varName === varName,
  );
  // Type guard to check if autuLabels is an array before accessing its length property
  if (Array.isArray(valueSelect) && valueSelect.length > 0) {
    if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = [...valueSelect];
    } else {
      existingFilters.push({
        varName: varName,
        searchTerm: valueSelect,
        op: 'in',
        label: labelVarName,
      });
    }
  } else if (
    existingFilterIndex !== -1 &&
    Array.isArray(existingFilters[existingFilterIndex].searchTerm)
  ) {
    existingFilters[existingFilterIndex].searchTerm = [];
  }

  const filteredFilters = existingFilters.filter((filter) => {
    if (filter.varName === varName) {
      return Array.isArray(filter.searchTerm) && filter.searchTerm.length > 0;
    }
    return true;
  });

  dispatch(setFilterObject(filteredFilters));

  const filterObjectUpdate = {
    filter: filteredFilters,
  };

  const filterObjectString = JSON.stringify(filterObjectUpdate);
  localStorage.setItem('filterObject', filterObjectString);
  if (
    (styleNameRoute === TYPESOFDATASET.allVoyages ||
      styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved ||
      styleNameRoute === allEnslavers) &&
    filteredFilters.length > 0
  ) {
    dispatch(setIsViewButtonViewAllResetAll(true));
  } else if (filteredFilters.length > 1) {
    dispatch(setIsViewButtonViewAllResetAll(true));
  }
};

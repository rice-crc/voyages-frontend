import { setFilterObject } from '@/redux/getFilterSlice';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch } from '@/redux/store';
import { allEnslavers } from '@/share/CONST_DATA';
import {
  Filter,
  TYPESOFDATASET,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';

export const updateFilterTextDialog = (
  dispatch: AppDispatch,
  newValue: string,
  styleNameRoute: string,
  varName: string,
  ops: string,
  opsRoles: string,
  labelVarName: string
) => {
  const existingFilterObjectString = localStorage.getItem('filterObject');
  let existingFilters: Filter[] = [];

  if (existingFilterObjectString) {
    existingFilters = JSON.parse(existingFilterObjectString).filter || [];
  }

  const existingFilterIndex = existingFilters.findIndex(
    (filter) => filter.varName === varName
  );

  if (newValue.length > 0) {
    if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm =
        ops === 'icontains' || ops === 'exact'
          ? (newValue as string)
          : [newValue];
      if (existingFilters[existingFilterIndex].op === 'icontains') {
        existingFilters[existingFilterIndex].op = ops!;
      } else {
        existingFilters[existingFilterIndex].op = opsRoles!;
      }
    } else {
      existingFilters.push({
        varName: varName,
        searchTerm:
          ops === 'icontains' || ops === 'exact'
            ? (newValue as string)
            : [newValue],
        op: ops,
        label: labelVarName,
      });
    }
  } else if (existingFilterIndex !== -1) {
    existingFilters[existingFilterIndex].searchTerm = [];
  }

  const filteredFilters = existingFilters.filter(
    (filter) =>
      !Array.isArray(filter.searchTerm) || filter.searchTerm.length > 0
  );

  const filterObjectUpdate = {
    filter: filteredFilters,
  };

  const filterObjectString = JSON.stringify(filterObjectUpdate);
  localStorage.setItem('filterObject', filterObjectString);

  dispatch(setFilterObject(filteredFilters));
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

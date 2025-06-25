import { setFilterObject } from '@/redux/getFilterSlice';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch } from '@/redux/store';
import {
  Filter,
  TYPESOFDATASET,
  TYPESOFDATASETENSLAVERS,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';

export function updatedEnslaversRoleAndNameToLocalStorage(
  dispatch: AppDispatch,
  styleNameRoute: string,
  listEnslavers: string[],
  enslaverName: string,
  varName: string,
  opsRoles: string,
) {
  const existingFilterObjectString = localStorage.getItem('filterObject');
  let existingFilters: Filter[] = [];

  if (existingFilterObjectString) {
    existingFilters = JSON.parse(existingFilterObjectString).filter || [];
  }

  const existingFilterIndex = existingFilters.findIndex(
    (filter) => filter.varName === varName,
  );

  if (listEnslavers.length > 0) {
    if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = [
        { roles: listEnslavers, name: enslaverName },
      ];
      existingFilters[existingFilterIndex].op = opsRoles!;
    } else {
      existingFilters.push({
        varName: varName,
        searchTerm: [{ roles: listEnslavers, name: enslaverName }],
        op: opsRoles!,
      });
    }
  } else if (existingFilterIndex !== -1) {
    existingFilters[existingFilterIndex].searchTerm = [];
  }

  const filteredFilters = existingFilters.filter(
    (filter) =>
      !Array.isArray(filter.searchTerm) || filter.searchTerm.length > 0,
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
      styleNameRoute === TYPESOFDATASETENSLAVERS.transAtlanticTrades ||
      styleNameRoute === TYPESOFDATASETENSLAVERS.intraAmericanTrades ||
      styleNameRoute === TYPESOFDATASETENSLAVERS.enslaver) &&
    filteredFilters.length > 0
  ) {
    dispatch(setIsViewButtonViewAllResetAll(true));
  } else if (filteredFilters.length > 1) {
    dispatch(setIsViewButtonViewAllResetAll(true));
  }
}

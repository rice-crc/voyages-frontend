import { setFilterObject } from '@/redux/getFilterSlice';
import { AppDispatch } from '@/redux/store';
import { FILTER_OBJECT_KEY } from '@/share/CONST_DATA';
import { CheckboxValueType, Filter } from '@/share/InterfaceTypes';

export function updatedSliderToLocalStrageDisEmbarkation(
  updateValue: CheckboxValueType[],
  varName: string,
  dispatch: AppDispatch,
) {
  const existingFilterObjectString = localStorage.getItem(FILTER_OBJECT_KEY);
  let existingFilterObject: any = {};
  if (!existingFilterObjectString) {
    existingFilterObject.filter = [];
  }
  if (existingFilterObjectString) {
    existingFilterObject = JSON.parse(existingFilterObjectString);
  }

  const existingFilters: Filter[] = existingFilterObject.filter || [];

  const existingFilterIndex = existingFilters.findIndex(
    (filter) => filter.varName === varName,
  );

  if (existingFilterIndex !== -1) {
    existingFilters[existingFilterIndex].searchTerm = updateValue as string[];
  } else {
    const newFilter: Filter = {
      varName: varName,
      searchTerm: updateValue!,
      op: 'in',
    };
    existingFilters.push(newFilter);
  }

  dispatch(setFilterObject(existingFilters));

  const filterObjectUpdate = {
    filter: existingFilters,
  };

  const filterObjectString = JSON.stringify(filterObjectUpdate);
  localStorage.setItem('filterObject', filterObjectString);
}

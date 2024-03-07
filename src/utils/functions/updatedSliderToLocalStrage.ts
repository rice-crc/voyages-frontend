import { setFilterObject } from "@/redux/getFilterSlice";
import { AppDispatch } from "@/redux/store";
import { Filter } from "@/share/InterfaceTypes";
import { CheckboxValueType } from "antd/es/checkbox/Group";

export function updatedSliderToLocalStrage(updateValue: number[] | string[] | CheckboxValueType[], variableName: string, op: string, dispatch: AppDispatch,) {
    const existingFilterObjectString = localStorage.getItem('filterObject');
    let existingFilterObject: any = {};

    if (existingFilterObjectString) {
        existingFilterObject = JSON.parse(existingFilterObjectString);
    }
    const existingFilters: Filter[] = existingFilterObject.filter || [];
    const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === variableName);

    if (existingFilterIndex !== -1) {
        existingFilters[existingFilterIndex].searchTerm = updateValue as number[]
    } else {
        const newFilter: Filter = {
            varName: variableName,
            searchTerm: updateValue!,
            op: op
        };
        existingFilters.push(newFilter);
    }

    dispatch(setFilterObject(existingFilters));
    const filterObjectUpdate = {
        filter: existingFilters
    };

    const filterObjectString = JSON.stringify(filterObjectUpdate);
    localStorage.setItem('filterObject', filterObjectString);
}

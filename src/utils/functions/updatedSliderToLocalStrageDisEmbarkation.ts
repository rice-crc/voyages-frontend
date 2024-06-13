import { setFilterObject } from "@/redux/getFilterSlice";
import { AppDispatch } from "@/redux/store";
import { Filter } from "@/share/InterfaceTypes";
import { CheckboxValueType } from "antd/es/checkbox/Group";

export function updatedSliderToLocalStrageDisEmbarkation(updateValue: CheckboxValueType[], varName: string, dispatch: AppDispatch,) {

    const existingFilterObjectString = localStorage.getItem('filterObject');
    let existingFilterObject: any = {};
    if (!existingFilterObjectString) {
        existingFilterObject.filter = []
    }
    if (existingFilterObjectString) {
        existingFilterObject = JSON.parse(existingFilterObjectString);
    }

    const existingFilters: Filter[] = existingFilterObject.filter || [];

    const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

    if (existingFilterIndex !== -1) {
        existingFilters[existingFilterIndex].searchTerm = updateValue as string[]
    } else {
        const newFilter: Filter = {
            varName: varName,
            searchTerm: updateValue!,
            op: "in"
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
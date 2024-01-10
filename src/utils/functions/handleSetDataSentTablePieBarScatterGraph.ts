import { ENSALVERSTYLE, PASTHOMEPAGE, VOYAGESPAGE } from '@/share/CONST_DATA';
import {
    AutoCompleteOption,
    Filter,
    RangeSliderMinMaxInitialState,
    TYPESOFDATASET,
    TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';

export const handleSetDataSentTablePieBarScatterGraph = (
    filtersObj: Filter[],
    isChangeGeoTree: boolean,
    varName: string,
    styleName?: string,
    currentPage?: number,
    isChange?: boolean,
    styleNamePeople?: string,
    currentEnslavedPage?: number,
) => {
    const dataSend: { [key: string]: (string | number)[] | Filter[] } = {};
    dataSend['filter'] = filtersObj ? filtersObj : []

    // if ((styleName !== TYPESOFDATASET.allVoyages) && (styleNamePeople !== TYPESOFDATASETPEOPLE.allEnslaved) && (styleNamePeople !== ENSALVERSTYLE)) {
    //     for (const value of dataSetValue) {
    //         dataSend[dataSetKey] = [String(value)];
    //     }
    // }

    // if (inputSearchValue) {
    //     dataSend['global_search'] = [String(inputSearchValue)];
    // }
    // if (rangeValue[varName] && isChange && rangeValue && (currentPage === 2 || currentPage === 3 || currentPage === 4 || currentPage === 5 || currentPage === 6) || (currentEnslavedPage === 2)) {
    //     for (const rangKey in rangeValue) {
    //         dataSend[rangKey] = [rangeValue[rangKey][0], rangeValue[rangKey][1]];
    //     }
    // }

    // if (clusterNodeKeyVariable && clusterNodeValue) {
    //     dataSend[clusterNodeKeyVariable] = [clusterNodeValue]
    // }

    // if (autoCompleteValue && varName && (currentPage === 2 || currentPage === 3 || currentPage === 4 || currentPage === 5 || currentPage === 6) || (currentEnslavedPage === 2)) {
    //     for (const autoKey in autoCompleteValue) {
    //         for (const autoCompleteOption of autoCompleteValue[autoKey]) {
    //             if (typeof autoCompleteOption !== 'string') {
    //                 const { value } = autoCompleteOption;
    //                 dataSend[autoKey] = [value];
    //             }
    //         }
    //     }
    // }

    // if (isChangeGeoTree && varName && geoTreeValue && (currentPage === 2 || currentPage === 3 || currentPage === 4 || currentPage === 5 || currentPage === 6) || (currentEnslavedPage === 2)) {
    //     for (const keyValue in geoTreeValue) {
    //         if (Array.isArray(geoTreeValue[keyValue])) {
    //             dataSend[keyValue] = geoTreeValue[keyValue] as string[] | number[];
    //         }
    //     }
    // }

    return dataSend;
};

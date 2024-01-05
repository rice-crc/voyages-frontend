import {
    AutoCompleteOption,
    RangeSliderMinMaxInitialState,
    TYPESOFDATASET,
    TYPESOFDATASETPEOPLE,
    TreeSelectItem,
} from '@/share/InterfaceTypes';

export const handleSetDataSentMap = (
    autoCompleteValue: Record<string, string[] | AutoCompleteOption[]>,
    varName: string,
    isChangeGeoTree: boolean,
    dataSetValue: string[] | number[],
    dataSetKey: string,
    inputSearchValue: string,
    rangeValue: RangeSliderMinMaxInitialState,
    geoTreeValue: Record<string, string[] | TreeSelectItem[]>,
    isChange?: boolean,
    currentPage?: number,
    currentEnslavedPage?: number,
    styleName?: string,
    clusterNodeKeyVariable?: string,
    clusterNodeValue?: string,
    styleNamePeople?: string
) => {
    const dataSend: { [key: string]: (string | number)[] } = {};
    if (clusterNodeKeyVariable && clusterNodeValue) {
        dataSend[clusterNodeKeyVariable] = [clusterNodeValue];
    }

    if ((styleName !== TYPESOFDATASET.allVoyages) || (styleNamePeople !== TYPESOFDATASETPEOPLE.allEnslaved)) {
        for (const value of dataSetValue) {
            dataSend[dataSetKey] = [String(value)];
        }
    }

    if (inputSearchValue) {
        dataSend['global_search'] = [String(inputSearchValue)];
    }

    if (rangeValue[varName] && isChange && rangeValue && (currentPage === 7 || currentEnslavedPage === 3)) {
        for (const rangKey in rangeValue) {
            dataSend[rangKey] = [rangeValue[rangKey][0], rangeValue[rangKey][1]];
        }
    }

    if (autoCompleteValue && varName && (currentPage === 7 || currentEnslavedPage === 3)) {
        for (const autoKey in autoCompleteValue) {
            for (const autoCompleteOption of autoCompleteValue[autoKey]) {
                if (typeof autoCompleteOption !== 'string') {
                    const { label } = autoCompleteOption;
                    dataSend[autoKey] = [label];
                }
            }
        }
    }

    if (isChangeGeoTree && varName && geoTreeValue && (currentPage === 7) || (currentEnslavedPage === 3)) {
        for (const keyValue in geoTreeValue) {
            if (Array.isArray(geoTreeValue[keyValue])) {
                dataSend[keyValue] = geoTreeValue[keyValue] as string[] | number[];
            }
        }
    }

    return dataSend;
};

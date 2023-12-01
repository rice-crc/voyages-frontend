import {
    AutoCompleteOption,
    RangeSliderMinMaxInitialState,
    TreeSelectItem,
} from '@/share/InterfaceTypes';

export const handleSetDataSentMapGeoTree = (
    autoCompleteValue: Record<string, string[] | AutoCompleteOption[]>,
    isChangeGeoTree: boolean,
    geoTreeValue: Record<string, string[] | TreeSelectItem[]>,
    varName: string,
    rangeValue: RangeSliderMinMaxInitialState
) => {
    const dataSend: { [key: string]: (string | number)[] } = {};
    dataSend['geotree_valuefields'] = [varName];
    if (isChangeGeoTree && varName && geoTreeValue) {
        for (const keyValue in geoTreeValue) {
            if (Array.isArray(geoTreeValue[keyValue])) {
                if (varName !== keyValue) {
                    dataSend[keyValue] = geoTreeValue[keyValue] as string[] | number[];
                }
            }
        }
    }

    if (autoCompleteValue && varName) {
        for (const autoKey in autoCompleteValue) {
            const autoCompleteOption = autoCompleteValue[autoKey];
            if (typeof autoCompleteOption !== 'string') {
                for (const keyValue of autoCompleteOption) {
                    if (typeof keyValue === 'object' && 'label' in keyValue) {
                        dataSend[autoKey] = [keyValue.label];
                    }
                }
            }
        }
    }
    if (rangeValue && varName) {
        for (const rangKey in rangeValue) {
            dataSend[rangKey] = [rangeValue[rangKey][0], rangeValue[rangKey][1]];
        }
    }
    return dataSend;
};

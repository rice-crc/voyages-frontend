import { PASTHOMEPAGE, VOYAGESPAGE } from '@/share/CONST_DATA';
import {
    AutoCompleteOption,
    RangeSliderMinMaxInitialState,
    TYPESOFDATASET,
    TreeSelectItem,
} from '@/share/InterfaceTypes';

export const handleSetDataSentMap = (
    autoCompleteValue: Record<string, string[] | AutoCompleteOption[]>,
    isChangeAuto: boolean,
    isChangeGeoTree: boolean,
    dataSetValue: string[] | number[],
    dataSetKey: string,
    inputSearchValue: string,
    rang: RangeSliderMinMaxInitialState,
    geoTreeValue: Record<string, string[] | TreeSelectItem[]>,
    isChange?: boolean,
    currentPage?: number,
    pathName?: string,
    currentEnslavedPage?: number,
    styleName?: string,
    clusterNodeKeyVariable?: string,
    clusterNodeValue?: string
) => {
    const dataSend: { [key: string]: (string | number)[] } = {};

    if (clusterNodeKeyVariable && clusterNodeValue) {
        dataSend[clusterNodeKeyVariable] = [clusterNodeValue];
    }
    if (styleName !== TYPESOFDATASET.allVoyages) {
        for (const value of dataSetValue!) {
            dataSend[dataSetKey!] = [String(value)];
        }
    }
    if (inputSearchValue) {
        dataSend['global_search'] = [String(inputSearchValue)];
    }

    if (isChange && rang && currentPage === 7 && pathName === VOYAGESPAGE) {
        for (const rangKey in rang) {
            dataSend[rangKey] = [rang[rangKey][0], rang[rangKey][1]];
        }
    }

    if (
        isChange &&
        rang &&
        currentEnslavedPage === 3 &&
        pathName === PASTHOMEPAGE
    ) {
        for (const rangKey in rang) {
            dataSend[rangKey] = [rang[rangKey][0], rang[rangKey][1]];
        }
    }

    if (
        autoCompleteValue &&
        isChangeAuto &&
        currentPage === 7 &&
        pathName === VOYAGESPAGE
    ) {
        for (const autoKey in autoCompleteValue) {
            for (const autoCompleteOption of autoCompleteValue[autoKey]) {
                if (typeof autoCompleteOption !== 'string') {
                    const { label } = autoCompleteOption;

                    dataSend[autoKey] = [label];
                }
            }
        }
    }

    if (
        autoCompleteValue &&
        isChangeAuto &&
        currentEnslavedPage === 3 &&
        pathName === PASTHOMEPAGE
    ) {
        for (const autoKey in autoCompleteValue) {
            for (const autoCompleteOption of autoCompleteValue[autoKey]) {
                if (typeof autoCompleteOption !== 'string') {
                    const { label } = autoCompleteOption;
                    dataSend[autoKey] = [label];
                }
            }
        }
    }

    if (
        isChangeGeoTree &&
        geoTreeValue &&
        currentPage === 7 &&
        pathName === VOYAGESPAGE
    ) {
        for (const keyValue in geoTreeValue) {
            for (const keyGeoValue of geoTreeValue[keyValue]) {
                dataSend[keyValue] = [String(keyGeoValue)];
            }
        }
    }

    if (
        isChangeGeoTree &&
        geoTreeValue &&
        currentEnslavedPage === 3 &&
        pathName === PASTHOMEPAGE
    ) {
        for (const keyValue in geoTreeValue) {
            for (const keyGeoValue of geoTreeValue[keyValue]) {
                dataSend[keyValue] = [String(keyGeoValue)];
            }
        }
    }

    return dataSend;
};

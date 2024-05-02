import CustomCheckboxDisEmbarkationGroup from '@/components/SelectorComponents/SelectDrowdown/CustomCheckboxDisEmbarkationGroup';
import CustomCheckboxEmbarkationGroup from '@/components/SelectorComponents/SelectDrowdown/CustomCheckboxEmbarkationGroup';
import { setCheckedListDisEmbarkation, setCheckedListEmbarkation } from '@/redux/getEstimateAssessmentSlice';
import { setFilterObject } from '@/redux/getFilterSlice';
import { setKeyValueName } from '@/redux/getRangeSliderSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Filter, LabelFilterMeneList } from '@/share/InterfaceTypes';
import {
    disembarkationListData,
    embarkationListData,
} from '@/utils/languages/estimate_text';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';
import { Button } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Regions: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { checkedListEmbarkation, checkedListDisEmbarkation } = useSelector(
        (state: RootState) => state.getEstimateAssessment
    );
    const { languageValue } = useSelector((state: RootState) => state.getLanguages);
    const storedValue = localStorage.getItem("filterObject");

    useEffect(() => {
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            const filter: Filter[] = parsedValue.filter;
            dispatch(setFilterObject(filter));
        }
    }, [checkedListEmbarkation, checkedListDisEmbarkation]);

    const handleSetCheckedListEmbarkation = (label: string, list: CheckboxValueType[], varName: string) => {
        const newState: Record<string, CheckboxValueType[]> = { ...checkedListEmbarkation, [label]: list };
        dispatch(setCheckedListEmbarkation(newState));
        updatedSliderToLocalStrageEmbarkation(list, varName)
        return list;

    };


    const handleSelectAllEmbarkation = () => {
        const updatedList: Record<string, CheckboxValueType[]> = {};
        const updataCheckList: CheckboxValueType[] = []
        embarkationListData.forEach((group) => {
            updatedList[group.label] = group.options;
            group.options.forEach((value) => {
                updataCheckList.push(value)
            })
        });
        dispatch(setCheckedListEmbarkation(updatedList));
        updatedSliderToLocalStrageEmbarkation(updataCheckList, 'embarkation_region__name')
    };

    const handleDeselectAllEmbarkation = () => {
        const updatedList: Record<string, CheckboxValueType[]> = {};
        embarkationListData.forEach((group) => {
            updatedList[group.label] = [];
        });
        dispatch(setCheckedListEmbarkation(updatedList));
        updatedSliderToLocalStrageEmbarkation([], 'embarkation_region__name')
    };

    const handleSetCheckedListDisEmbarkation = (label: string, list: CheckboxValueType[], varName: string) => {
        const newState: Record<string, CheckboxValueType[]> = { ...checkedListDisEmbarkation, [label]: list };
        const updataCheckList: CheckboxValueType[] = []
        for (const key in newState) {
            updataCheckList.push(...newState[key]);
        }
        dispatch(setCheckedListDisEmbarkation(newState));
        updatedSliderToLocalStrageDisEmbarkation(updataCheckList, varName)
        return list;
    };

    const handleSelectAllDisEmbarkation = () => {
        const updatedList: Record<string, CheckboxValueType[]> = {};
        const updataCheckList: CheckboxValueType[] = []

        disembarkationListData.forEach((group) => {
            updatedList[group.label] = group.options;
            group.options.forEach((value) => {
                updataCheckList.push(value)
            })
        });

        dispatch(setCheckedListDisEmbarkation(updatedList));
        updatedSliderToLocalStrageDisEmbarkation(updataCheckList, 'disembarkation_region__name')
    };

    const handleDeselectAllDisEmbarkation = () => {
        const updatedList: Record<string, CheckboxValueType[]> = {};
        const updataCheckList: CheckboxValueType[] = []
        disembarkationListData.forEach((group) => {
            updatedList[group.label] = [];
        });
        dispatch(setCheckedListDisEmbarkation(updatedList));
        updatedSliderToLocalStrageDisEmbarkation(updataCheckList, 'disembarkation_region__name')
    };

    function updatedSliderToLocalStrageEmbarkation(updateValue: CheckboxValueType[], varName: string) {

        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilterObject: any = {};

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

    function updatedSliderToLocalStrageDisEmbarkation(updateValue: CheckboxValueType[], varName: string) {

        const existingFilterObjectString = localStorage.getItem('filterObject');
        let existingFilterObject: any = {};

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

    const translatedEstimates = translationLanguagesEstimatePage(languageValue)

    return (
        <>
            <h4>{translatedEstimates.regionesEmbarkation}</h4>
            {embarkationListData.map((group, index) => (
                <div key={`${group.label}-${index}`}>
                    <CustomCheckboxEmbarkationGroup
                        plainOptions={group.options}
                        label={group.label}
                        varName={group.varName}
                        show={group.show}
                        checkedList={checkedListEmbarkation[group.label] || []}
                        setCheckedList={(list: CheckboxValueType[]) =>
                            handleSetCheckedListEmbarkation(group.label, list, group.varName)
                        }
                    />
                </div>
            ))}
            <div className="reset-btn-estimate">
                <Button
                    onClick={handleSelectAllEmbarkation}
                    className='selected-all-btn'
                >
                    {translatedEstimates.selectAllBTN}
                </Button>
                <Button onClick={handleDeselectAllEmbarkation} className="deselec-btn">
                    {translatedEstimates.deselectAllBTN}
                </Button>
            </div>

            <br />
            <h4>{translatedEstimates.regionesDesEmbarkation}</h4>
            {disembarkationListData.map((group, index) => (
                <div key={`${group.label}-${index}`}>
                    <CustomCheckboxDisEmbarkationGroup
                        label={group.label}
                        varName={group.varName}
                        plainOptions={group.options}
                        show={group.show}
                        checkedList={checkedListDisEmbarkation[group.label] || []}
                        setCheckedList={(list: CheckboxValueType[]) =>
                            handleSetCheckedListDisEmbarkation(group.label, list, group.varName)
                        }
                    />
                </div>
            ))}
            <div className="reset-btn-estimate">
                <Button
                    onClick={handleSelectAllDisEmbarkation}
                    className='selected-all-btn'
                >
                    {translatedEstimates.selectAllBTN}
                </Button>
                <Button
                    onClick={handleDeselectAllDisEmbarkation}
                    className="deselec-btn"
                >
                    {translatedEstimates.deselectAllBTN}
                </Button>
            </div>
        </>
    );
};

export default Regions;

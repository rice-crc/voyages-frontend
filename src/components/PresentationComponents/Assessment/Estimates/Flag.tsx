import { useEffect } from 'react';

import { Button } from 'antd';
import Checkbox from 'antd/es/checkbox';
import '@/style/estimates.scss';
import { useDispatch, useSelector } from 'react-redux';

import {
  setOnChangeFlag,
  setSelectedFlags,
} from '@/redux/getEstimateAssessmentSlice';
import { setFilterObject } from '@/redux/getFilterSlice';
import { setKeyValueName } from '@/redux/getRangeSliderSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { FILTER_OBJECT_KEY } from '@/share/CONST_DATA';
import { CheckboxValueType, Filter } from '@/share/InterfaceTypes';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';
import { flagText } from '@/utils/languages/estimate_text';
const CheckboxGroup = Checkbox.Group;

const Flag = () => {
  const dispatch: AppDispatch = useDispatch();
  const varName = 'nation__name';
  const storedValue = localStorage.getItem(FILTER_OBJECT_KEY);
  const { changeFlag, selectedFlags } = useSelector(
    (state: RootState) => state.getEstimateAssessment,
  );
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  useEffect(() => {
    dispatch(setKeyValueName(varName));
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      const filter: Filter[] = parsedValue.filter;
      const filterByVarName =
        filter?.length > 0 &&
        filter.find((filterItem) => filterItem.varName === varName);

      if (filterByVarName) {
        const selectedFlags: string[] = filterByVarName.searchTerm as string[];
        dispatch(setSelectedFlags(selectedFlags));
        dispatch(setFilterObject(filter));
        return;
      }
    }
  }, [dispatch, storedValue, varName]);

  const onChangeFlag = (list: CheckboxValueType[]) => {
    dispatch(setOnChangeFlag(!changeFlag));
    dispatch(setSelectedFlags(list));
    updatedSliderToLocalStorage(list);
  };

  const handleResetAll = () => {
    const allFlags = flagText.map((value) => value);
    dispatch(setSelectedFlags(allFlags));
    dispatch(setOnChangeFlag(!changeFlag));
    updatedSliderToLocalStorage(allFlags);
  };

  function updatedSliderToLocalStorage(updateValue: CheckboxValueType[]) {
    const existingFilterObjectString = localStorage.getItem(FILTER_OBJECT_KEY);
    let existingFilterObject: any = {};

    if (existingFilterObjectString) {
      existingFilterObject = JSON.parse(existingFilterObjectString);
    }
    const existingFilters: Filter[] = existingFilterObject.filter || [];
    const existingFilterIndex = existingFilters.findIndex(
      (filter) => filter.varName === varName,
    );

    if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = updateValue;
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

  return (
    <>
      <CheckboxGroup
        options={flagText}
        defaultValue={selectedFlags}
        value={selectedFlags}
        onChange={onChangeFlag}
        style={{ display: 'flex', flexDirection: 'column' }}
      />
      <div className="reset-btn-estimate">
        <Button className="deselec-btn" onClick={handleResetAll}>
          {translatedEstimates.resetBTN}
        </Button>
      </div>
    </>
  );
};

export default Flag;

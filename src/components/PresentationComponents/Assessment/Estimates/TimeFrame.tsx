import { Button } from 'antd';
import { ChangeEvent, useEffect } from 'react';
import '@/style/estimates.scss';
import { CustomSliderTimeFrame, Input } from '@/styleMUI';
import { Filter } from '@/share/InterfaceTypes';
import { setFilterObject } from '@/redux/getFilterSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setKeyValueName } from '@/redux/getRangeSliderSlice';
import { setCurrentSliderValue } from '@/redux/getEstimateAssessmentSlice';
import { translationLanguagesEstimatePage } from '@/utils/functions/translationLanguages';

const TimeFrame = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentSliderValue } = useSelector(
    (state: RootState) => state.getEstimateAssessment
  );
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const min = currentSliderValue[0];
  const max = currentSliderValue[1];
  const varName = 'year';
  const defaultValue: number[] = [1501, 1866];
  const storedValue = localStorage.getItem('filterObject');

  useEffect(() => {
    dispatch(setKeyValueName(varName));
    dispatch(setCurrentSliderValue(defaultValue));
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      const filter: Filter[] = parsedValue.filter;

      const filterByVarName =
        filter?.length > 0 &&
        filter.find((filterItem) => filterItem.varName === varName);

      if (filterByVarName) {
        const rangeSliderLocal: number[] =
          filterByVarName.searchTerm as number[];
        dispatch(setCurrentSliderValue(rangeSliderLocal));
        dispatch(setFilterObject(filter));
        return;
      }
    }
  }, [dispatch, storedValue, varName]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    dispatch(setCurrentSliderValue(newValue as number[]));
    updatedSliderToLocalStrage(newValue as number[]);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedSliderValue = [...currentSliderValue];
    updatedSliderValue[name === 'start' ? 0 : 1] = Number(value);
    dispatch(setCurrentSliderValue(updatedSliderValue));
    updatedSliderToLocalStrage(updatedSliderValue as number[]);
  };

  const handleResetSlider = () => {
    dispatch(setCurrentSliderValue(defaultValue));
    updatedSliderToLocalStrage(defaultValue as number[]);
  };

  function updatedSliderToLocalStrage(updateValue: number[]) {
    const existingFilterObjectString = localStorage.getItem('filterObject');
    let existingFilterObject: any = {};

    if (existingFilterObjectString) {
      existingFilterObject = JSON.parse(existingFilterObjectString);
    }
    const existingFilters: Filter[] = existingFilterObject.filter || [];
    const existingFilterIndex = existingFilters.findIndex(
      (filter) => filter.varName === varName
    );

    if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = updateValue as number[];
    } else {
      const newFilter: Filter = {
        varName: varName,
        searchTerm: updateValue!,
        op: 'btw',
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
  const translatedEstimates = translationLanguagesEstimatePage(languageValue);

  return (
    <div>
      <div id="form:_idJsp7" className="__web-inspector-hide-shortcut__">
        <span className="sidebar-label-form">
          <span style={{ marginRight: 5 }}>
            {translatedEstimates.showDataFrom}
          </span>
          <span>
            <Input
              color="secondary"
              className="timeframe-input"
              name="start"
              value={
                currentSliderValue[0] !== undefined
                  ? currentSliderValue[0]
                  : defaultValue[0]
              }
              size="small"
              onChange={handleInputChange}
              inputProps={{
                step: max - min > 20 ? 10 : 1,
                min: min,
                max: max,
                type: 'number',
                'aria-labelledby': 'input-slider',
                position: 'left',
              }}
            />
            <span style={{ margin: '0 6px' }}>
              {translatedEstimates.toData}
            </span>
            <Input
              value={
                currentSliderValue[1] !== undefined
                  ? currentSliderValue[1]
                  : defaultValue[1]
              }
              size="small"
              className="timeframe-input"
              style={{ textAlign: 'center' }}
              onChange={handleInputChange}
              inputProps={{
                step: max - min > 20 ? 10 : 1,
                min: min,
                max: max,
                type: 'number',
                'aria-labelledby': 'input-slider',
                position: 'left',
              }}
            />
            <span className="time-frame-slider">
              <CustomSliderTimeFrame
                min={1501}
                max={1866}
                size="small"
                value={
                  currentSliderValue.length > 0
                    ? currentSliderValue
                    : defaultValue
                }
                onChange={handleSliderChange}
              />
            </span>
          </span>
        </span>
        <div className="text-description">
          {translatedEstimates.showDataDetails} {min ?? defaultValue[0]} -{' '}
          {max ?? defaultValue[1]}.
        </div>
        <div className="reset-btn-estimate">
          <Button className="deselec-btn" onClick={handleResetSlider}>
            {translatedEstimates.resetBTN}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeFrame;

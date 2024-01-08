import { useEffect, useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setRangeValue,
  setKeyValue,
  setIsChange,
  setRangeSliderValue,
} from '@/redux/getRangeSliderSlice';
import { Grid } from '@mui/material';
import { CustomSlider, Input } from '@/styleMUI';
import { AppDispatch, RootState } from '@/redux/store';
import {
  AutoCompleteInitialState,
  Filter,
  RangeSliderState,
  RangeSliderStateProps,
} from '@/share/InterfaceTypes';
import '@/style/Slider.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import { useRangSlider } from '@/hooks/useRangSlider';
import { setFilterObject } from '@/redux/getFilterSlice';

const RangeSlider = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);

  const { rangeValue, varName, rangeSliderMinMax } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );

  const { geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );

  const { autoCompleteValue } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );

  const rangeMinMax = rangeSliderMinMax?.[varName] ||
    rangeValue?.[varName] || [0, 0];
  const min = rangeValue?.[varName]?.[0] || 0;
  const max = rangeValue?.[varName]?.[1] || 0;
  const [currentSliderValue, setCurrentSliderValue] = useState<number | number[]>(rangeMinMax);

  const dataSend: RangeSliderStateProps = {
    varName: varName,
    filter: []
  };
  const { data, isLoading, isError } = useRangSlider(dataSend, styleName);

  useEffect(() => {
    if (!isLoading && !isError && data) {

      const { min, max } = data
      const initialValue: number[] = [
        parseInt(min),
        parseInt(max),
      ];
      dispatch(setKeyValue(varName))
      dispatch(
        setRangeValue({
          ...rangeValue,
          [varName]: initialValue as number[],
        })
      );
    }
  }, [data, isLoading, isError]);


  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;

    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;
    const filterByVarName = filter?.length > 0 && filter.find((filterItem) => filterItem.varName === varName);
    if (!filterByVarName) return;
    const minRange: number = filterByVarName.op === 'gte' ? filterByVarName.searchTerm as number : rangeMinMax[0]
    const maxRange: number = filterByVarName.op === 'lte' ? filterByVarName.searchTerm as number : rangeMinMax[1]

    const initialValue: number[] = [minRange, maxRange];
    console.log({ initialValue })
    setCurrentSliderValue(initialValue);

  }, [varName, styleName, filtersObj]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setCurrentSliderValue(newValue);
  };

  const handleSliderChangeMouseUp = () => {

    dispatch(setIsChange(true));
    dispatch(
      setRangeSliderValue({
        ...rangeSliderMinMax,
        [varName]: currentSliderValue as number[],
      })
    );

    const existingFilterObjectString = localStorage.getItem('filterObject');

    let existingFilterObject: any = {};

    if (existingFilterObjectString) {
      existingFilterObject = JSON.parse(existingFilterObjectString);
    }
    const existingFilters: Filter[] = existingFilterObject.filter || [];
    const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

    if (existingFilterIndex !== -1) { //&& existingFilterObjectIndex !== -1
      existingFilters[existingFilterIndex].searchTerm = rangeMinMax[0]!;
      existingFilters[existingFilterIndex].searchTerm = rangeMinMax[1]!;
    } else {

      const newFilter: Filter = {
        varName: varName,
        searchTerm: rangeMinMax[0]!,
        op: 'gte'
      };

      const newFilter2: Filter = {
        varName: varName,
        searchTerm: rangeMinMax[1]!,
        op: 'lte'
      };

      existingFilters.push(newFilter, newFilter2);
    }

    dispatch(setFilterObject(existingFilters));
    console.log({ existingFilters })

    const filterObjectUpdate = {
      ...geoTreeValue,
      filter: existingFilters
    };

    const filterObjectString = JSON.stringify(filterObjectUpdate);
    localStorage.setItem('filterObject', filterObjectString);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedSliderValue = [...rangeMinMax];
    updatedSliderValue[name === 'start' ? 0 : 1] = Number(value);
    dispatch(setIsChange(true));
    dispatch(
      setRangeSliderValue({
        ...rangeSliderMinMax,
        [varName]: updatedSliderValue,
      })
    );

    const filterObject = {
      filterObject: {
        ...rangeSliderMinMax,
        ...autoCompleteValue,
        ...geoTreeValue,
        [varName]: updatedSliderValue,
      },
    };
    const filterObjectString = JSON.stringify(filterObject);
    localStorage.setItem('filterObject', filterObjectString);
  };

  return (
    <Grid className="autocomplete-modal-box">
      <Input
        color="secondary"
        name="start"
        value={rangeMinMax[0]!}
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
      <Input
        name="end"
        value={rangeMinMax[1]}
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
      <CustomSlider
        size="small"
        min={min as number}
        max={max as number}
        value={rangeMinMax}
        onChange={handleSliderChange}
        onMouseUp={handleSliderChangeMouseUp}
      />
    </Grid>
  );
};

export default RangeSlider;

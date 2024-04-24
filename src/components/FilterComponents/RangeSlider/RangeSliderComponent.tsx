import { useEffect, useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setRangeValue,
  setKeyValueName,
  setIsChange,
  setRangeSliderValue,
} from '@/redux/getRangeSliderSlice';
import { Grid } from '@mui/material';
import { CustomSlider, Input } from '@/styleMUI';
import { AppDispatch, RootState } from '@/redux/store';
import {
  Filter,
  RangeSliderState,
  RangeSliderStateProps,
} from '@/share/InterfaceTypes';
import '@/style/Slider.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { fetchRangeVoyageSliderData } from '@/fetch/voyagesFetch/fetchRangeSliderData';
import { fetchPastEnslavedRangeSliderData } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedRangeSliderData';
import { fetchPastEnslaversRangeSliderData } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversRangeSliderData';

const RangeSlider = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName: styleNameRoute } = usePageRouter();
  const { styleName } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { rangeValue, varName, rangeSliderMinMax, isChange } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { labelVarName } = useSelector(
    (state: RootState) => state.getShowFilterObject
  );
  const rangeMinMax = rangeSliderMinMax?.[varName] || rangeValue?.[varName] || [0, 0.5];
  const min = rangeValue?.[varName]?.[0] || 0;
  const max = rangeValue?.[varName]?.[1] || 0;
  const [currentSliderValue, setCurrentSliderValue] = useState<number | number[]>(rangeMinMax);

  const filters = filtersDataSend(filtersObj, styleNameRoute!)
  const dataSend: RangeSliderStateProps = {
    varName: varName,
    filter: filters
  };

  const fetchRangeSliderData = async () => {
    try {
      let response;
      if (checkPagesRouteForVoyages(styleName!)) {
        response = await fetchRangeVoyageSliderData(dataSend);
      } else if (checkPagesRouteForEnslaved(styleName!)) {
        response = await fetchPastEnslavedRangeSliderData(dataSend);
      } else if (checkPagesRouteForEnslavers(styleName!)) {
        response = await fetchPastEnslaversRangeSliderData(dataSend);
      }
      if (response) {

        const { min, max, varName } = response
        const initialValue: number[] = [
          parseInt(min ?? 0),
          parseInt(max ?? 0),
        ];
        dispatch(setKeyValueName(varName))
        setCurrentSliderValue(initialValue);
        dispatch(
          setRangeValue({
            ...rangeSliderMinMax,
            [varName]: initialValue as number[],
          })
        );
        dispatch(
          setRangeValue({
            ...rangeValue,
            [varName]: initialValue as number[],
          })
        );
      }
    } catch (error) {
      console.log(`Error can't fetch range slider data: ${error}`)
    }
  }


  useEffect(() => {
    fetchRangeSliderData()
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;

    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;
    const filterByVarName = filter?.length > 0 && filter.find((filterItem) => filterItem.varName === varName);
    if (!filterByVarName) return;

    const rangSliderLocal: number[] = filterByVarName.searchTerm as number[]

    const initialValue: number[] = rangSliderLocal;
    setCurrentSliderValue(initialValue);
    dispatch(setFilterObject(filter));

  }, [varName, styleName]);

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
    updatedSliderToLocalStrage(currentSliderValue as number[])
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (value) {
      const updatedSliderValue = [...rangeMinMax];
      updatedSliderValue[name === 'start' ? 0 : 1] = Number(value);
      dispatch(setIsChange(!isChange));
      dispatch(
        setRangeSliderValue({
          ...rangeSliderMinMax,
          [varName]: updatedSliderValue,
        })
      );
      updatedSliderToLocalStrage(updatedSliderValue)

    }
    else {
      dispatch(
        setRangeSliderValue({
          ...rangeSliderMinMax,
          [varName]: [],
        })
      );
    }
  };

  function updatedSliderToLocalStrage(updateValue: number[]) {
    const existingFilterObjectString = localStorage.getItem('filterObject');

    let existingFilterObject: any = {};

    if (existingFilterObjectString) {
      existingFilterObject = JSON.parse(existingFilterObjectString);
    }
    const existingFilters: Filter[] = existingFilterObject.filter || [];
    const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

    if (existingFilterIndex !== -1) {
      existingFilters[existingFilterIndex].searchTerm = updateValue as number[]
    } else {
      const newFilter: Filter = {
        varName: varName,
        searchTerm: updateValue!,
        op: 'btw',
        label: labelVarName
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

  return (
    <Grid className="autocomplete-modal-box">
      <Input
        color="secondary"
        name="start"
        value={rangeMinMax[0] !== undefined ? rangeMinMax[0] : 0}
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
        value={rangeMinMax[1] !== undefined ? rangeMinMax[1] : 0}
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

import { useEffect, useState, ChangeEvent, useRef } from 'react';
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
  RangeSliderState,
} from '@/share/InterfaceTypes';
import '@/style/Slider.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';

const RangeSlider = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = usePageRouter();

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

  const [currentSliderValue, setCurrentSliderValue] = useState<
    number | number[]
  >(rangeMinMax);
  const effectOnce = useRef(false);

  const fetchRangeSlider = async () => {
    const dataSend: { [key: string]: (string | number)[] } = {
      aggregate_fields: [varName],
    };

    try {
      let response;
      if (checkPagesRouteForVoyages(styleName!)) {
        // response = await dispatch(fetchRangeSliderData(dataSend)).unwrap();
      } else if (checkPagesRouteForEnslaved(styleName!)) {
        // response = await dispatch(
        //   fetchPastEnslavedRangeSliderData(dataSend)
        // ).unwrap();
      } else if (checkPagesRouteForEnslavers(styleName!)) {
        // response = await dispatch(
        //   fetchPastEnslaversRangeSliderData(dataSend)
        // ).unwrap();
      }
      if (response) {
        // const initialValue: number[] = [
        //   parseInt(response[varName].min),
        //   parseInt(response[varName].max),
        // ];
        dispatch(setKeyValue(varName));
        dispatch(
          setRangeValue({
            ...rangeValue,
            // [varName]: initialValue as number[],
          })
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (!effectOnce.current) {
      fetchRangeSlider();
    }

    return () => {
      dispatch(setRangeValue({}));
    };
  }, [dispatch, varName, styleName, currentSliderValue]);

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      const { filterObject } = parsedValue;
      for (const rangKey in filterObject) {
        if (varName === rangKey) {
          const rangeMinMax = filterObject[rangKey];
          setCurrentSliderValue(rangeMinMax);
        }
      }
    }
  }, []);

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

    const filterObject = {
      filterObject: {
        ...rangeSliderMinMax,
        ...autoCompleteValue,
        ...geoTreeValue,
        [varName]: currentSliderValue as number[],
      },
    };
    const filterObjectString = JSON.stringify(filterObject);
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
    console.log({ updatedSliderValue })

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
        value={rangeMinMax[0]}
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

import { useEffect, useState, FunctionComponent, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setRangeValue,
  setKeyValue,
  setIsChange,
  setRangeSliderValue,
} from '@/redux/rangeSliderSlice';
import { Grid } from '@mui/material';
import { CustomSlider, Input } from '@/styleMUI';
import { AppDispatch, RootState } from '@/redux/store';
import {
  AutoCompleteInitialState,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import { fetchRangeSliderData } from '@/fetchAPI/voyagesApi/fetchRangeSliderData';
import { fetchPastEnslavedRangeSliderData } from '@/fetchAPI/pastEnslavedApi/fetchPastEnslavedRangeSliderData';
import { ALLENSLAVED, ALLVOYAGES } from '@/share/CONST_DATA';
import '@/style/Slider.scss';

const RangeSlider = () => {
  const dispatch: AppDispatch = useDispatch();

  const { rangeValue, varName, rangeSliderMinMax } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { pathName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { autoCompleteValue } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const [loading, setLoading] = useState(false);
  const rangeMinMax = rangeSliderMinMax?.[varName] ||
    rangeValue?.[varName] || [0, 0];

  const min = rangeValue?.[varName]?.[0] || 0;
  const max = rangeValue?.[varName]?.[1] || 0;

  const [currentSliderValue, setCurrentSliderValue] = useState<
    number | number[]
  >(rangeMinMax);

  useEffect(() => {
    const fetchRangeSlider = async () => {
      const formData: FormData = new FormData();
      formData.append('aggregate_fields', varName);
      try {
        let response;
        if (pathName === ALLVOYAGES) {
          response = await dispatch(fetchRangeSliderData(formData)).unwrap();
        } else if (pathName === ALLENSLAVED) {
          response = await dispatch(
            fetchPastEnslavedRangeSliderData(formData)
          ).unwrap();
        }
        if (response) {
          const initialValue: number[] = [
            response[varName].min,
            response[varName].max,
          ];
          dispatch(setKeyValue(varName));
          dispatch(
            setRangeValue({
              ...rangeValue,
              [varName]: initialValue as number[],
            })
          );
        }
      } catch (error) {
        console.log('error', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchRangeSlider();
  }, [dispatch, varName, pathName]);

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    console.log('storedValue', storedValue);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      const { rangeValue } = parsedValue;
      setCurrentSliderValue;
      for (const rangKey in rangeValue) {
        if (varName === rangKey) {
          const rangeMinMax = rangeValue[rangKey];
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
      rangeValue: { ...rangeSliderMinMax, [varName]: currentSliderValue },
      autoCompleteValue,
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
    dispatch(
      setRangeSliderValue({
        ...rangeSliderMinMax,
        [varName]: updatedSliderValue,
      })
    );
    const filterObject = {
      rangeValue: { ...rangeSliderMinMax, [varName]: updatedSliderValue },
      autoCompleteValue,
    };
    const filterObjectString = JSON.stringify(filterObject);
    localStorage.setItem('filterObject', filterObjectString);
  };
  console.log('rangeMinMax', rangeMinMax);

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
        min={min}
        max={max}
        value={rangeMinMax}
        onChange={handleSliderChange}
        onMouseUp={handleSliderChangeMouseUp}
      />
    </Grid>
  );
};

export default RangeSlider;

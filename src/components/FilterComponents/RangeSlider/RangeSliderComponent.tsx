/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, FunctionComponent } from 'react';

import { Grid ,  Input} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { fetchPastEnslavedRangeSliderData } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedRangeSliderData';
import { fetchPastEnslaversRangeSliderData } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversRangeSliderData';
import { fetchRangeVoyageSliderData } from '@/fetch/voyagesFetch/fetchRangeSliderData';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';
import {
  setRangeValue,
  setKeyValueName,
} from '@/redux/getRangeSliderSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { FILTER_OBJECT_KEY } from '@/share/CONST_DATA';
import {
  Filter,
  FilterObjectsState,
  RangeSliderStateProps,
} from '@/share/InterfaceTypes';
import '@/style/Slider.scss';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
interface RangeSliderProps {
  handleSliderChangeMouseUp: () => void
  setCurrentSliderValue: React.Dispatch<React.SetStateAction<number | number[]>>
  currentSliderValue: number | number[]
  minRange: number
  maxRange: number
}
const RangeSlider:FunctionComponent<RangeSliderProps> = ({
  setCurrentSliderValue,
  currentSliderValue,
  minRange:min,
  maxRange:max
}) => {
// const RangeSlider= () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { rangeValue, varName, rangeSliderMinMax, isPercent} = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );

  const filters = useMemo(
    () => filtersDataSend(filtersObj, styleName!),
    [filtersObj, styleName],
  );

  const newFilters = useMemo(() => {
    return filters === undefined
      ? undefined
      : filters!.map((filter) => {
        const { ...filteredFilter } = filter;
        return filteredFilter;
      });
  }, [filters]);

  const dataSend: RangeSliderStateProps = useMemo(() => {
    return {
      varName: varName,
      filter: newFilters || [],
    };
  }, [varName, newFilters]);

  const fetchRangeSliderData = useCallback(async () => {

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
        const { min, max, varName } = response;
        const rangMin = isPercent ? min * 100 : min || 0;
        const rangMax = isPercent ? max * 100 : max || 0;
        const initialValue: number[] = [Math.round(rangMin), Math.round(rangMax)];
        
        dispatch(setKeyValueName(varName));
        setCurrentSliderValue(initialValue);
        dispatch(
          setRangeValue({
            ...rangeSliderMinMax,
            [varName]: initialValue as number[],
          }),
        );
        dispatch(
          setRangeValue({
            ...rangeValue,
            [varName]: initialValue as number[],
          }),
        );
      }
    } catch (error) {
      console.log(`Error can't fetch range slider data: ${error}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, styleName]);

  useEffect(() => {
    fetchRangeSliderData();
    const storedValue = localStorage.getItem(FILTER_OBJECT_KEY);
    if (!storedValue) return;

    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;
    const filterByVarName =
      filter?.length > 0 &&
      filter.find((filterItem) => filterItem.varName === varName);
    if (!filterByVarName) return;

    const rangSliderLocal: number[] = filterByVarName.searchTerm as number[];

    // ✅  Convert back to percentage for display if isPercent is true
    const initialValue: number[] = isPercent 
      ? rangSliderLocal.map(v => v * 100)  // Convert 0-1 to 0-100
      : rangSliderLocal;
   
    setCurrentSliderValue(initialValue);
    dispatch(setFilterObject(filter));
  }, [varName, styleName, dispatch, fetchRangeSliderData, setCurrentSliderValue, isPercent]);


  return (
    <Grid
      className="autocomplete-modal-box"
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Input
          color="secondary"
          name="start"
          value={Array.isArray(currentSliderValue) ? currentSliderValue[0] : 0}
          size="small"
          onChange={(e) => {
            const value = Number(e.target.value);
            setCurrentSliderValue((prev) => [
              value,
              Array.isArray(prev) ? prev[1] : 0,
            ]);
          }}
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
          value={Array.isArray(currentSliderValue) ? currentSliderValue[1] : 0}
          size="small"
          onChange={(e) => {
            const value = Number(e.target.value);
            setCurrentSliderValue((prev) => [
              Array.isArray(prev) ? prev[0] : 0,
              value,
            ]);
          }}
          inputProps={{
            step: max - min > 20 ? 10 : 1,
            min: min,
            max: max,
            type: 'number',
            'aria-labelledby': 'input-slider',
            position: 'left',
          }}
        />
      </div>
    </Grid>
  );
};

export default RangeSlider;


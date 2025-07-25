/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Button } from '@mui/material';
import { fetchPastEnslavedRangeSliderData } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedRangeSliderData';
import { fetchPastEnslaversRangeSliderData } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversRangeSliderData';
import { fetchRangeVoyageSliderData } from '@/fetch/voyagesFetch/fetchRangeSliderData';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';
import {
  setRangeValue,
  setKeyValueName,
  setRangeSliderValue,
} from '@/redux/getRangeSliderSlice';
import { setIsViewButtonViewAllResetAll } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { allEnslavers, FILTER_OBJECT_KEY } from '@/share/CONST_DATA';
import {
  Filter,
  FilterObjectsState,
  RangeSliderStateProps,
  TYPESOFDATASET,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import { CustomSlider, Input } from '@/styleMUI';
import '@/style/Slider.scss';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';

const RangeSlider = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName: styleNameRoute } = usePageRouter();
  const { styleName } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { rangeValue, varName, rangeSliderMinMax, opsRoles } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const { labelVarName } = useSelector(
    (state: RootState) => state.getShowFilterObject,
  );

  const rangeMinMax = rangeSliderMinMax?.[varName] ||
    rangeValue?.[varName] || [0, 0.5];
  const min = rangeValue?.[varName]?.[0] || 0;
  const max = rangeValue?.[varName]?.[1] || 0;
  const [currentSliderValue, setCurrentSliderValue] = useState<
    number | number[]
  >(rangeMinMax);

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
        const initialValue: number[] = [parseInt(min ?? 0), parseInt(max ?? 0)];
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

    const initialValue: number[] = rangSliderLocal;
    setCurrentSliderValue(initialValue);
    dispatch(setFilterObject(filter));
  }, [varName, styleName, dispatch, fetchRangeSliderData]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setCurrentSliderValue(newValue);
  };

  const handleSliderChangeMouseUp = () => {
    dispatch(
      setRangeSliderValue({
        ...rangeSliderMinMax,
        [varName]: currentSliderValue as number[],
      }),
    );
    updatedSliderToLocalStrage(currentSliderValue as number[]);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    if (value) {
      const updatedSliderValue = [...rangeMinMax];
      updatedSliderValue[name === 'start' ? 0 : 1] = Number(value);
      dispatch(
        setRangeSliderValue({
          ...rangeSliderMinMax,
          [varName]: updatedSliderValue,
        }),
      );
      updatedSliderToLocalStrage(updatedSliderValue);
    } else {
      dispatch(
        setRangeSliderValue({
          ...rangeSliderMinMax,
          [varName]: [],
        }),
      );
    }
  };

  function updatedSliderToLocalStrage(updateValue: number[]) {
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
      existingFilters[existingFilterIndex].searchTerm = updateValue as number[];
      existingFilters[existingFilterIndex].op = opsRoles!;
    } else {
      const newFilter: Filter = {
        varName: varName,
        searchTerm: updateValue!,
        op: opsRoles!,
        label: labelVarName,
      };
      existingFilters.push(newFilter);
    }
    const filterObjectUpdate = {
      filter: existingFilters,
    };
    const filterObjectString = JSON.stringify(filterObjectUpdate);
    dispatch(setFilterObject(existingFilters));
    localStorage.setItem('filterObject', filterObjectString);
    if (
      (styleNameRoute === TYPESOFDATASET.allVoyages ||
        styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved ||
        styleNameRoute === allEnslavers) &&
      existingFilters.length > 0
    ) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    } else if (existingFilters.length > 1) {
      dispatch(setIsViewButtonViewAllResetAll(true));
    }
  }

  return (
    <Grid
      className="autocomplete-modal-box"
      style={{
        width: 450,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
      }}
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
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleSliderChangeMouseUp}
        sx={{
          minWidth: 60,
          fontWeight: 600,
          padding: '4px 12px',
          fontSize: '0.85rem',
          lineHeight: 1.2,
          textTransform: 'none',
        }}
      >
        Apply
      </Button>
    </Grid>
  );
};

export default RangeSlider;

{
  /* <CustomSlider
        size="small"
        min={min as number}
        max={max as number}
        value={rangeMinMax}
        onChange={handleSliderChange}
      /> */
}

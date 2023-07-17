import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import VOYAGE_BARGRAPH_OPTIONS from '@/utils/flatfiles/VOYAGE_BARGRAPH_OPTIONS.json';
import { Grid, SelectChangeEvent, Skeleton } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useGetOptionsQuery } from '@/fetchAPI/voyagesApi/fetchApiService';
import { SelectDropdown } from './SelectDropdown';
import { AggregationSumAverage } from './AggregationSumAverage';
import { fetchVoyageGraphGroupby } from '@/fetchAPI/voyagesApi/fetchVoyageGroupby';
import {
  PlotXYVar,
  VoyagesOptionProps,
  Options,
  RangeSliderState,
  AutoCompleteInitialState,
  CurrentPageInitialState,
  BargraphXYVar,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import { fetchOptionsFlat } from '@/fetchAPI/voyagesApi/fetchOptionsFlat';

function BarGraph() {
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const {
    data: options_flat,
    isSuccess,
    isLoading,
  } = useGetOptionsQuery(datas);
  const dispatch: AppDispatch = useDispatch();
  const {
    rangeSliderMinMax: rang,
    varName,
    isChange,
  } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState);
  const { autoCompleteValue, autoLabelName, isChangeAuto } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const { dataSetKey, dataSetValue, dataSetValueBaseFilter, styleName } =
    useSelector((state: RootState) => state.getDataSetCollection);

  const [optionFlat, setOptionsFlat] = useState<Options>({});
  const [width, height] = useWindowSize();
  const [showAlert, setAlert] = useState(false);
  const [barGraphSelectedX, setSelectedX] = useState<PlotXYVar[]>([]);
  const [barGraphSelectedY, setSelectedY] = useState<PlotXYVar[]>([]);
  const [barData, setBarData] = useState<Data[]>([]);
  const [chips, setChips] = useState<string[]>([
    VOYAGE_BARGRAPH_OPTIONS.y_vars[0].var_name,
  ]);

  const [barGraphOptions, setBarOptions] = useState<VoyagesOptionProps>({
    x_vars: VOYAGE_BARGRAPH_OPTIONS.x_vars[0].var_name,
    y_vars: VOYAGE_BARGRAPH_OPTIONS.y_vars[0].var_name,
  });
  const [aggregation, setAggregation] = useState<string>('sum');
  const VoyageBargraphOptions = useCallback(() => {
    Object.entries(VOYAGE_BARGRAPH_OPTIONS).forEach(
      ([key, value]: [string, BargraphXYVar[]]) => {
        if (key === 'x_vars') {
          setSelectedX(value);
        }
        if (key === 'y_vars') {
          setSelectedY(value);
        }
      }
    );
  }, []);

  useEffect(() => {
    VoyageBargraphOptions();
    let subscribed = true;
    fetchOptionsFlat(isSuccess, options_flat as Options, setOptionsFlat);

    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append('groupby_by', barGraphOptions.x_vars);
      const yfieldArr: string[] = [];
      if (currentPage === 3) {
        for (const chip of chips) {
          newFormData.append('groupby_cols', chip);
          yfieldArr.push(chip);
        }
      }
      newFormData.append('agg_fn', aggregation);
      newFormData.append('cachename', 'voyage_bar_and_donut_charts');

      if (styleName !== TYPESOFDATASET.allVoyages) {
        for (const value of dataSetValue) {
          newFormData.append(dataSetKey, String(value));
        }
      }
      if (isChange && rang[varName] && currentPage === 3) {
        newFormData.append(varName, String(rang[varName][0]));
        newFormData.append(varName, String(rang[varName][1]));
      }
      if (autoCompleteValue && varName && isChangeAuto) {
        for (let i = 0; i < autoLabelName.length; i++) {
          const label = autoLabelName[i];
          newFormData.append(varName, label);
        }
      }

      try {
        const data: Data[] = [];
        const response = await dispatch(
          fetchVoyageGraphGroupby(newFormData)
        ).unwrap();

        if (subscribed) {
          const keys = Object.keys(response);
          const values = Object.values(response);
          for (const [index, [key, value]] of Object.entries(
            response
          ).entries()) {
            if (key !== barGraphOptions.x_vars && Array.isArray(value)) {
              data.push({
                x: values[0] as number[],
                y: value as number[],
                type: 'bar',
                name: `aggregation: ${aggregation} label: ${VOYAGE_BARGRAPH_OPTIONS.y_vars[index].label}`,
              });
            }
          }
          setBarData(data);
          setBarOptions({
            x_vars: keys[0] || '',
            y_vars: keys[1] || '',
          });
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchData();
    return () => {
      subscribed = false;
    };
  }, [
    dispatch,
    options_flat,
    barGraphOptions.x_vars,
    barGraphOptions.y_vars,
    aggregation,
    rang,
    varName,
    isChange,
    autoCompleteValue,
    autoLabelName,
    chips,
    currentPage,
    isSuccess,
    dataSetValue,
    dataSetKey,
    styleName,
    dataSetValueBaseFilter,
    VoyageBargraphOptions,
  ]);

  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAggregation(event.target.value);
    },
    []
  );

  const handleChangeBarGraphOption = useCallback(
    (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setBarOptions((prevVoyageOption) => ({
        ...prevVoyageOption,
        [name]: value,
      }));
    },
    []
  );

  const handleChangeBarGraphChipYSelected = useCallback(
    (event: SelectChangeEvent<string[]>, name: string) => {
      const value = event.target.value;
      setChips(typeof value === 'string' ? value.split(',') : value);
      setBarOptions((prevVoyageOption) => ({
        ...prevVoyageOption,
        [name]: value,
      }));
    },
    []
  );

  const maxWidth =
    width > 1024
      ? width > 1440
        ? width * 0.88
        : width * 0.92
      : width === 1024
      ? width * 0.895
      : width === 768
      ? width * 0.95
      : width < 768
      ? width * 0.92
      : width * 0.75;
  if (isLoading) {
    <div className="Skeleton-loading">
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </div>;
  }

  return (
    <div>
      <SelectDropdown
        selectedX={barGraphSelectedX}
        chips={chips}
        selectedY={barGraphSelectedY}
        selectedOptions={barGraphOptions}
        handleChange={handleChangeBarGraphOption}
        handleChangeMultipleYSelected={handleChangeBarGraphChipYSelected}
        maxWidth={maxWidth}
        XFieldText={'X Field'}
        YFieldText={'Multi-Selector Y-Feild'}
        optionsFlatY={VOYAGE_BARGRAPH_OPTIONS.y_vars}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
        showAlert={showAlert}
        aggregatioOptions={barGraphOptions}
        optionFlat={optionFlat}
      />

      <Grid>
        <Plot
          data={barData}
          layout={{
            width: maxWidth,
            height: height * 0.45,
            title: `The ${aggregation} of ${
              optionFlat[barGraphOptions.x_vars]?.label || ''
            } vs <br> ${
              optionFlat[barGraphOptions.y_vars]?.label || ''
            } Bar Graph`,
            font: {
              family: 'Arial, sans-serif',
              size: 10,
              color: '#333333',
            },
            xaxis: {
              title: {
                text: optionFlat[barGraphOptions.x_vars]?.label || '',
              },
              fixedrange: true,
            },
            yaxis: {
              title: {
                text: optionFlat[barGraphOptions.y_vars]?.label || '',
              },
              fixedrange: true,
            },
          }}
          config={{ responsive: true }}
        />
      </Grid>
    </div>
  );
}

export default BarGraph;

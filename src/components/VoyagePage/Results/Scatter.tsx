import { useState, useEffect, useMemo, ChangeEvent, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import VOYAGE_SCATTER_OPTIONS from '@/utils/flatfiles/VOYAGE_SCATTER_OPTIONS.json';
import { Grid, SelectChangeEvent, Skeleton } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useGetOptionsQuery } from '@/fetchAPI/fetchApiService';
import { fetchVoyageGraphGroupby } from '@/fetchAPI/fetchVoyageGroupby';
import {
  PlotXYVar,
  VoyagesOptionProps,
  Options,
  RangeSliderState,
  AutoCompleteInitialState,
  CurrentPageInitialState,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import { fetchOptionsFlat } from '@/fetchAPI/fetchOptionsFlat';
import '@/style/page.scss';
import { SelectDropdown } from './SelectDropdown';
import { AggregationSumAverage } from './AggregationSumAverage';

function Scatter() {
  const datas = useSelector(
    (state: RootState | any) => state.getOptions?.value
  );
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
  const [scatterSelectedX, setSelectedX] = useState<PlotXYVar[]>([]);
  const [scatterSelectedY, setSelectedY] = useState<PlotXYVar[]>([]);
  const [scatterData, setScatterData] = useState<Data[]>([]);
  const [chips, setChips] = useState<string[]>([
    VOYAGE_SCATTER_OPTIONS.y_vars[0].var_name,
  ]);
  const [scatterOptions, setScatterOptions] = useState<VoyagesOptionProps>({
    x_vars: VOYAGE_SCATTER_OPTIONS.x_vars[0].var_name,
    y_vars: VOYAGE_SCATTER_OPTIONS.y_vars[0].var_name,
  });

  const [aggregation, setAggregation] = useState<string>('sum');

  const VoyageScatterOptions = useCallback(() => {
    Object.entries(VOYAGE_SCATTER_OPTIONS).forEach(
      ([key, value]: [string, PlotXYVar[]]) => {
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
    VoyageScatterOptions();
    let subscribed = true;
    fetchOptionsFlat(isSuccess, options_flat as Options, setOptionsFlat);

    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append('groupby_by', scatterOptions.x_vars);
      const yfieldArr: string[] = [];

      if (currentPage === 2) {
        for (const chip of chips) {
          newFormData.append('groupby_cols', chip);
          yfieldArr.push(chip);
        }
      }

      newFormData.append('agg_fn', aggregation);
      newFormData.append('cachename', 'voyage_xyscatter');

      if (styleName !== TYPESOFDATASET.allVoyages) {
        for (const value of dataSetValue) {
          newFormData.append(dataSetKey, String(value));
        }
      }
      if (isChange && rang[varName] && currentPage === 2) {
        newFormData.append(varName, String(rang[varName][0]));
        newFormData.append(varName, String(rang[varName][1]));
      }

      if (autoCompleteValue && varName && isChangeAuto) {
        for (const label of autoLabelName) {
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
            if (key !== scatterOptions.x_vars && Array.isArray(value)) {
              data.push({
                x: values[0] as number[],
                y: value as number[],
                type: 'scatter',
                mode: 'lines',
                line: { shape: 'spline' },
                name: `aggregation: ${aggregation} label: ${VOYAGE_SCATTER_OPTIONS.y_vars[index].label}`,
              });
            }
          }

          setScatterData(data);
          setScatterOptions({
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
    scatterOptions.x_vars,
    scatterOptions.y_vars,
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
    dataSetValueBaseFilter,
    styleName,
    VoyageScatterOptions,
  ]);

  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAggregation(event.target.value);
    },
    []
  );

  const handleChangeScatterOption = useCallback(
    (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setScatterOptions((prevOptions) => ({
        ...prevOptions,
        [name]: value,
      }));
    },
    []
  );

  const handleChangeScatterChipYSelected = useCallback(
    (event: SelectChangeEvent<string[]>, name: string) => {
      const value = event.target.value;
      setChips(typeof value === 'string' ? value.split(',') : value);
      setScatterOptions((prevOptions) => ({
        ...prevOptions,
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
      : width < 768
      ? width * 0.8
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
        selectedX={scatterSelectedX}
        selectedY={scatterSelectedY}
        chips={chips}
        selectedOptions={scatterOptions}
        handleChange={handleChangeScatterOption}
        handleChangeMultipleYSelected={handleChangeScatterChipYSelected}
        maxWidth={maxWidth}
        XFieldText="X Field"
        YFieldText="Multi-Selector Y-Feild"
        optionsFlatY={VOYAGE_SCATTER_OPTIONS.y_vars}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
        showAlert={showAlert}
        aggregatioOptions={scatterOptions}
        optionFlat={optionFlat}
      />
      <Grid>
        <Plot
          data={scatterData}
          layout={{
            width: maxWidth,
            height: height * 0.45,
            title: `The ${aggregation} of ${
              optionFlat[scatterOptions.x_vars]?.label || ''
            } vs  <br>${
              optionFlat[scatterOptions.y_vars]?.label || ''
            } Scatter Graph`,
            xaxis: {
              title: {
                text: optionFlat[scatterOptions.x_vars]?.label || '',
              },
              fixedrange: true,
            },
            yaxis: {
              title: {
                text: optionFlat[scatterOptions.y_vars]?.label || '',
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

export default Scatter;

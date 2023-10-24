import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import VOYAGE_SCATTER_OPTIONS from '@/utils/flatfiles/VOYAGE_SCATTER_OPTIONS.json';
import { Grid, SelectChangeEvent } from '@mui/material';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { useWindowSize } from '@react-hook/window-size';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import { fetchVoyageGraphGroupby } from '@/fetch/voyagesFetch/fetchVoyageGroupby';
import {
  PlotXYVar,
  VoyagesOptionProps,
  Options,
  RangeSliderState,
  AutoCompleteInitialState,
  CurrentPageInitialState,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import { fetchOptionsFlat } from '@/fetch/voyagesFetch/fetchOptionsFlat';
import '@/style/page.scss';
import { SelectDropdown } from '../../SelectorComponents/SelectDrowdown/SelectDropdown';
import { AggregationSumAverage } from '../../SelectorComponents/AggregationSumAverage/AggregationSumAverage';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';

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

  const { isChangeGeoTree, geoTreeValue, geoTreeSelectValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { autoCompleteValue, autoLabelName, isChangeAuto } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { dataSetKey, dataSetValue, styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  const [optionFlat, setOptionsFlat] = useState<Options>({});
  const [width, height] = useWindowSize();
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
  const maxWidth = maxWidthSize(width);
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
      const dataSend: { [key: string]: (string | number)[] } = {};
      const yfieldArr: string[] = [];

      dataSend['groupby_by'] = [scatterOptions.x_vars];
      dataSend['agg_fn'] = [aggregation];
      dataSend['cachename'] = ['voyage_xyscatter'];

      if (currentPage === 3) {
        for (const chip of chips) {
          dataSend['groupby_cols'] = [chip];
          yfieldArr.push(chip);
        }
      }

      if (inputSearchValue) {
        dataSend['global_search'] = [String(inputSearchValue)];
      }

      if (styleName !== TYPESOFDATASET.allVoyages) {
        for (const value of dataSetValue) {
          dataSend[dataSetKey] = [String(value)];
        }
      }
      if (isChange && rang && currentPage === 3) {
        for (const rangKey in rang) {
          dataSend[rangKey] = [rang[rangKey][0]];
          dataSend[rangKey] = [rang[rangKey][1]];
        }
      }

      if (autoCompleteValue && varName && currentPage === 3) {
        for (const autoKey in autoCompleteValue) {
          for (const autoCompleteOption of autoCompleteValue[autoKey]) {
            if (typeof autoCompleteOption !== 'string') {
              const { label } = autoCompleteOption;
              dataSend[autoKey] = [label];
            }
          }
        }
      }

      if (isChangeGeoTree && varName && geoTreeValue && currentPage === 3) {
        for (const keyValue in geoTreeValue) {
          for (const keyGeoValue of geoTreeValue[keyValue]) {
            dataSend[keyValue] = [String(keyGeoValue)];
          }
        }
      }

      try {
        const data: Data[] = [];
        const response = await dispatch(
          fetchVoyageGraphGroupby(dataSend)
        ).unwrap();

        if (subscribed) {
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
    styleName,
    geoTreeSelectValue,
    VoyageScatterOptions,
    geoTreeValue,
    inputSearchValue,
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

  if (isLoading) {
    <div className="loading-logo">
      <img src={LOADINGLOGO} />
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
            font: {
              family: 'Arial, sans-serif',
              size: maxWidth < 400 ? 7 : 10,
              color: '#333333',
            },
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

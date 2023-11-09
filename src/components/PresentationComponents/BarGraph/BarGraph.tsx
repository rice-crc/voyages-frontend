import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import VOYAGE_BARGRAPH_OPTIONS from '@/utils/flatfiles/VOYAGE_BARGRAPH_OPTIONS.json';
import { Grid, SelectChangeEvent, Skeleton } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import { SelectDropdown } from '../../SelectorComponents/SelectDrowdown/SelectDropdown';
import { AggregationSumAverage } from '../../SelectorComponents/AggregationSumAverage/AggregationSumAverage';
import { fetchVoyageGraphGroupby } from '@/fetch/voyagesFetch/fetchVoyageGroupby';
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
import { fetchOptionsFlat } from '@/fetch/voyagesFetch/fetchOptionsFlat';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';
import { handleSetDataSentTablePieBarScatterGraph } from '@/utils/functions/handleSetDataSentTablePieBarScatterGraph';

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

  const { dataSetKey, dataSetValue, styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { isChangeGeoTree, geoTreeValue, geoTreeSelectValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const [optionFlat, setOptionsFlat] = useState<Options>({});
  const [width, height] = useWindowSize();
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
  const maxWidth = maxWidthSize(width);
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

      const dataSend = handleSetDataSentTablePieBarScatterGraph(autoCompleteValue, isChangeGeoTree, dataSetValue, dataSetKey, inputSearchValue, geoTreeValue, varName, rang, styleName, currentPage, isChange, undefined, undefined)

      dataSend['groupby_by'] = [barGraphOptions.x_vars];
      dataSend['agg_fn'] = [aggregation];
      dataSend['cachename'] = ['voyage_bar_and_donut_charts'];

      const yfieldArr: string[] = [];

      if (currentPage === 4) {
        for (const chip of chips) {
          dataSend['groupby_cols'] = [chip];
          yfieldArr.push(chip);
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
    autoCompleteValue,
    autoLabelName,
    chips,
    currentPage,
    isSuccess,
    dataSetValue,
    dataSetKey,
    styleName,
    geoTreeSelectValue,
    VoyageBargraphOptions,
    geoTreeValue,
    inputSearchValue,
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
      />

      <Grid>
        <Plot
          data={barData}
          layout={{
            width: maxWidth,
            height: height * 0.45,
            title: `The ${aggregation} of ${optionFlat[barGraphOptions.x_vars]?.label || ''
              } vs <br> ${optionFlat[barGraphOptions.y_vars]?.label || ''
              } Bar Graph`,
            font: {
              family: 'Arial, sans-serif',
              size: maxWidth < 400 ? 7 : 10,
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

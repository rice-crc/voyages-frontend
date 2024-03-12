import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import VOYAGE_BARGRAPH_OPTIONS from '@/utils/flatfiles/VOYAGE_BARGRAPH_OPTIONS.json';
import { Grid, SelectChangeEvent, Skeleton } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import { SelectDropdown } from '../../SelectorComponents/SelectDrowdown/SelectDropdown';
import { AggregationSumAverage } from '../../SelectorComponents/AggregationSumAverage/AggregationSumAverage';
import {
  PlotXYVar,
  VoyagesOptionProps,
  Options,
  RangeSliderState,
  CurrentPageInitialState,
  BargraphXYVar,
  IRootFilterObjectScatterRequest,
} from '@/share/InterfaceTypes';
import { fetchOptionsFlat } from '@/fetch/voyagesFetch/fetchOptionsFlat';
import {
  getMobileMaxHeight,
  getMobileMaxWidth,
  maxWidthSize,
} from '@/utils/functions/maxWidthSize';
import { useGroupBy } from '@/hooks/useGroupBy';
import { formatYAxes } from '@/utils/functions/formatYAxesLine';

function BarGraph() {
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const {
    data: options_flat,
    isSuccess,
    isLoading,
  } = useGetOptionsQuery(datas);
  const { varName } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState);

  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const [optionFlat, setOptionsFlat] = useState<Options>({});
  const [width, height] = useWindowSize();
  const [barGraphSelectedX, setSelectedX] = useState<PlotXYVar[]>([]);
  const [barGraphSelectedY, setSelectedY] = useState<PlotXYVar[]>([]);
  const [title, setTitle] = useState<string>(barGraphSelectedX[0]?.label);
  const [barData, setBarData] = useState<Data[]>([]);
  const [xAxes, setXAxes] = useState<string>(VOYAGE_BARGRAPH_OPTIONS.x_vars[0].label);
  const [yAxes, setYAxes] = useState<string[]>([VOYAGE_BARGRAPH_OPTIONS.y_vars[0].label]);
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

  const dataSend: IRootFilterObjectScatterRequest = {
    groupby_by: barGraphOptions.x_vars,
    groupby_cols: [...chips],
    agg_fn: aggregation,
    cachename: 'voyage_bar_and_donut_charts',
    filter: filtersObj?.[0]?.searchTerm?.length > 0 ? filtersObj : [],
  };
  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue
  }

  const { data: response, isLoading: loading, isError } = useGroupBy(dataSend);
  useEffect(() => {
    VoyageBargraphOptions();
    fetchOptionsFlat(isSuccess, options_flat as Options, setOptionsFlat);
    if (!loading && !isError && response) {
      const values = Object.values(response);
      const data: Data[] = [];
      for (const [index, [key, value]] of Object.entries(response).entries()) {
        if (key !== barGraphOptions.x_vars && Array.isArray(value)) {
          data.push({
            x: values[0] as number[],
            y: value as number[],
            type: 'bar',
            mode: 'lines',
            line: { shape: 'spline' },
            name: `${VOYAGE_BARGRAPH_OPTIONS.y_vars[index].label}`,
          });
        }
      }
      setBarData(data);
    }
    return () => {
      setBarData([]);
    };
  }, [
    response,
    loading,
    isError,
    options_flat,
    barGraphOptions.x_vars,
    barGraphOptions.y_vars,
    aggregation,
    varName,
    chips,
    currentPage,
    isSuccess,
    styleName,
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

  if (isLoading) {
    <div className="Skeleton-loading">
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </div>;
  }

  return (
    <div className="mobile-responsive">
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
        setXAxes={setXAxes}
        setYAxes={setYAxes}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
      />

      <Grid style={{ maxWidth: maxWidth, border: '1px solid #ccc' }}>
        <Plot
          data={barData}
          layout={{
            width: getMobileMaxWidth(maxWidth - 5),
            height: getMobileMaxHeight(height),
            title: 'Bar Graph',
            font: {
              family: 'Arial, sans-serif',
              size: maxWidth < 400 ? 7 : 10,
              color: '#333333',
            },
            xaxis: {
              title: {
                text: xAxes || barGraphSelectedX[0]?.label
              },
              fixedrange: true,
            },
            yaxis: {
              title: {
                text: Array.isArray(yAxes) ? formatYAxes(yAxes) : yAxes
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

import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import VOYAGE_SCATTER_OPTIONS from '@/utils/flatfiles/VOYAGE_SCATTER_OPTIONS.json';
import { Grid, SelectChangeEvent } from '@mui/material';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { useWindowSize } from '@react-hook/window-size';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import {
  PlotXYVar,
  VoyagesOptionProps,
  RangeSliderState,
  CurrentPageInitialState,
  IRootFilterObjectScatterRequest,
} from '@/share/InterfaceTypes';
import '@/style/page.scss';
import { SelectDropdown } from '../../SelectorComponents/SelectDrowdown/SelectDropdown';
import { AggregationSumAverage } from '../../SelectorComponents/AggregationSumAverage/AggregationSumAverage';
import {
  getMobileMaxHeight,
  getMobileMaxWidth,
  maxWidthSize
} from '@/utils/functions/maxWidthSize';
import { useGroupBy } from '@/hooks/useGroupBy';
import { formatYAxes } from '@/utils/functions/formatYAxesLine';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { usePageRouter } from '@/hooks/usePageRouter';

function Scatter() {
  const datas = useSelector(
    (state: RootState | any) => state.getOptions?.value
  );
  const {
    data: options_flat,
    isSuccess,
    isLoading,
  } = useGetOptionsQuery(datas);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
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

  const { styleName: styleNameRoute } = usePageRouter();
  const [width, height] = useWindowSize();
  const [scatterSelectedX, setSelectedX] = useState<PlotXYVar[]>([]);
  const [scatterSelectedY, setSelectedY] = useState<PlotXYVar[]>([]);
  const [xAxes, setXAxes] = useState<string>(VOYAGE_SCATTER_OPTIONS.x_vars[0].label);
  const [yAxes, setYAxes] = useState<string[]>([VOYAGE_SCATTER_OPTIONS.y_vars[0].label]);
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
  const filters = filtersDataSend(filtersObj, styleNameRoute!)
  const dataSend: IRootFilterObjectScatterRequest = {
    groupby_by: scatterOptions.x_vars,
    groupby_cols: [...chips],
    agg_fn: aggregation,
    cachename: 'voyage_xyscatter',
    filter: filters || []
  };
  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue
  }
  const { data: response, isLoading: loading, isError } = useGroupBy(dataSend);

  useEffect(() => {
    VoyageScatterOptions();
    if (!loading && !isError && response) {
      const values = Object.values(response);
      const data: Data[] = [];
      for (const [index, [key, value]] of Object.entries(response).entries()) {
        if (key !== scatterOptions.x_vars && Array.isArray(value)) {
          data.push({
            x: values[0] as number[],
            y: value as number[],
            type: 'scatter',
            mode: 'lines',
            line: { shape: 'spline' },
            name: `${VOYAGE_SCATTER_OPTIONS.y_vars[index].label}`,
          });
        }
      }
      setScatterData(data);
    }
    return () => {
      setScatterData([]);
    };
  }, [
    response,
    loading,
    isError,
    options_flat,
    scatterOptions.x_vars,
    scatterOptions.y_vars,
    aggregation,
    varName,
    chips,
    currentPage,
    isSuccess,
    styleName,
    VoyageScatterOptions, styleNameRoute,
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
      for (const title of scatterSelectedX) {
        setXAxes(title.label);
      }
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
      const newYAxesTitles = scatterSelectedY.map((title) => title.label);
      setYAxes(newYAxesTitles);
    },
    []
  );


  return isLoading ? (<div className="loading-logo">
    <img src={LOADINGLOGO} />
  </div>) : (
    <div className="mobile-responsive">
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
        setXAxes={setXAxes}
        setYAxes={setYAxes}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
      />
      <Grid style={{ maxWidth: maxWidth, border: '1px solid #ccc' }}>
        <Plot
          data={scatterData}
          layout={{
            width: getMobileMaxWidth(maxWidth - 5),
            height: getMobileMaxHeight(height),
            title: 'Line Graph',
            font: {
              family: 'Arial, sans-serif',
              size: maxWidth < 400 ? 7 : 10,
              color: '#333333',
            },
            xaxis: {
              title: {
                text: xAxes || scatterSelectedX[0]?.label
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

export default Scatter;

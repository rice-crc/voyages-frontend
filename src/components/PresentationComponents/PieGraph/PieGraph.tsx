import { useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react';
import Plot from 'react-plotly.js';
import PIECHART_OPTIONS from '@/utils/flatfiles/VOYAGE_PIECHART_OPTIONS.json';
import { Grid, SelectChangeEvent } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import { SelectDropdown } from '../../SelectorComponents/SelectDrowdown/SelectDropdown';
import { AggregationSumAverage } from '../../SelectorComponents/AggregationSumAverage/AggregationSumAverage';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import NODATA from '@/assets/noData.png';
import {
  VoyagesOptionProps,
  Options,
  RangeSliderState,
  CurrentPageInitialState,
  PlotPIEX,
  PlotPIEY,
  IRootFilterObjectScatterRequest,
} from '@/share/InterfaceTypes';
import { fetchOptionsFlat } from '@/fetch/voyagesFetch/fetchOptionsFlat';
import {
  getMobileMaxHeight,
  getMobileMaxWidth,
  maxWidthSize,
} from '@/utils/functions/maxWidthSize';
import '@/style/homepage.scss';
import { useGroupBy } from '@/hooks/useGroupBy';
import { usePageRouter } from '@/hooks/usePageRouter';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';

function PieGraph() {
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const { data: options_flat, isSuccess } = useGetOptionsQuery(datas);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { clusterNodeKeyVariable, clusterNodeValue } =
    useSelector((state: RootState) => state.getNodeEdgesAggroutesMapData);

  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const [optionFlat, setOptionsFlat] = useState<Options>({});
  const [width, height] = useWindowSize();
  const [pieGraphSelectedX, setSelectedX] = useState<PlotPIEX[]>([]);
  const [pieGraphSelectedY, setSelectedY] = useState<PlotPIEY[]>([]);
  const [plotX, setPlotX] = useState<any[]>([]);
  const [plotY, setPlotY] = useState<any[]>([]);
  const [xAxes, setXAxes] = useState<string>(PIECHART_OPTIONS.x_vars[0].label);
  const [yAxes, setYAxes] = useState<string>(PIECHART_OPTIONS.y_vars[0].label);
  const maxWidth = maxWidthSize(width);
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const [pieGraphOptions, setPieOptions] = useState<VoyagesOptionProps>({
    x_vars: PIECHART_OPTIONS.x_vars[0].var_name,
    y_vars: PIECHART_OPTIONS.y_vars[0].var_name,
  });
  const [aggregation, setAggregation] = useState<string>('sum');
  const VoyagepieGraphOptions = () => {
    Object.entries(PIECHART_OPTIONS).forEach(
      ([key, value]: [string, PlotPIEX[]]) => {
        if (key === 'x_vars') {
          setSelectedX(value);
        }
        if (key === 'y_vars') {
          setSelectedY(value);
        }
      }
    );
  };
  const filters = filtersDataSend(filtersObj, styleNameRoute!, clusterNodeKeyVariable, clusterNodeValue)
  const dataSend: IRootFilterObjectScatterRequest = {
    groupby_by: pieGraphOptions.x_vars,
    groupby_cols: [pieGraphOptions.y_vars],
    agg_fn: aggregation,
    cachename: 'voyage_bar_and_donut_charts',
    filter: filters!,
  };

  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue;
  }

  const { data: response, isLoading: loading, isError } = useGroupBy(dataSend);

  useEffect(() => {
    VoyagepieGraphOptions();
    fetchOptionsFlat(isSuccess, options_flat as Options, setOptionsFlat);
    if (!loading && !isError && response) {
      const keys = Object.keys(response);
      if (keys[0]) {
        setPlotX(response[keys[0]]);
      }
      if (keys[1]) {
        setPlotY(response[keys[1]]);
      }
    }
    return () => {
      setPlotX([]);
      setPlotY([]);
    };
  }, [
    response,
    loading,
    isError,
    options_flat,
    pieGraphOptions.x_vars,
    pieGraphOptions.y_vars,
    aggregation,
    varName,
    currentPage,
    isSuccess,
    styleName, fetchOptionsFlat
  ]);

  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAggregation(event.target.value);
    },
    []
  );

  const handleChangeSingleSelect = useMemo(() => {
    return (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setPieOptions((prevVoygOption) => ({
        ...prevVoygOption,
        [name]: value,
      }));
    };
  }, [pieGraphOptions]);

  const isPlotYZeroAll = plotY.every((item) => item === 0);

  return (
    <div className="mobile-responsive">
      <SelectDropdown
        selectedX={pieGraphSelectedX}
        selectedY={pieGraphSelectedY}
        selectedOptions={pieGraphOptions}
        handleChange={handleChangeSingleSelect}
        graphType="PIE"
        maxWidth={maxWidth}
        XFieldText={'Sectors'}
        YFieldText={'Values'}
        optionsFlatY={PIECHART_OPTIONS.y_vars}
        setXAxes={setXAxes}
        setYAxesPie={setYAxes}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
      />
      {loading ? (
        <div className="loading-logo-display">
          <img src={LOADINGLOGO} />
        </div>
      ) : plotX.length > 0 && !isPlotYZeroAll ? (
        <Grid style={{ maxWidth: maxWidth, border: '1px solid #ccc' }}>
          <Plot
            className='pie-plot-container'
            data={[
              {
                labels: plotX,
                values: plotY,
                type: 'pie',
                mode: 'lines+markers',
                textinfo: 'label+percent',
                insidetextorientation: 'radial',
                hole: 0.1,
                textposition: 'inside',
                showlegend: maxWidth < 420 ? false : true,
              },
            ]}
            layout={{
              width: getMobileMaxWidth(maxWidth - 5),
              height: getMobileMaxHeight(height),
              title: `The ${aggregation} of ${xAxes || ''
                } vs <br> ${yAxes || ''
                } Pie Chart`,
              font: {
                family: 'Arial, sans-serif',
                size: maxWidth < 500 ? 8 : 12,
                color: '#333333',
              }
            }}
            config={{ responsive: true }}
          />
        </Grid>
      ) : (
        <div className="no-data-icon">
          <div>No Result</div>
          <img src={NODATA} />
        </div>
      )}
    </div>
  );
}

export default PieGraph;

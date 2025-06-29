/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react';

import { Grid, SelectChangeEvent } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import Plot from 'react-plotly.js';
import { useSelector } from 'react-redux';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import '@/style/homepage.scss';
import NoDataState from '@/components/NoResultComponents/NoDataState';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import { fetchOptionsFlat } from '@/fetch/voyagesFetch/fetchOptionsFlat';
import { useGroupBy } from '@/hooks/useGroupBy';
import { usePageRouter } from '@/hooks/usePageRouter';
import { RootState } from '@/redux/store';
import {
  VoyagesOptionProps,
  Options,
  FilterObjectsState,
  CurrentPageInitialState,
  PlotPIEX,
  PlotPIEY,
  IRootFilterObjectScatterRequest,
  LanguageKey,
} from '@/share/InterfaceTypes';
import PIECHART_OPTIONS from '@/utils/flatfiles/voyages/voyages_piechart_options.json';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';

import { RadioSelected } from '../../SelectorComponents/RadioSelected/RadioSelected';
import { SelectDropdown } from '../../SelectorComponents/SelectDrowdown/SelectDropdown';

function PieGraph() {
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const { data: options_flat, isSuccess } = useGetOptionsQuery(datas);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );

  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection,
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState,
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch,
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const [width, height] = useWindowSize();
  const [pieGraphSelectedX, setSelectedX] = useState<PlotPIEX[]>([]);
  const [pieGraphSelectedY, setSelectedY] = useState<PlotPIEY[]>([]);
  const [plotX, setPlotX] = useState<any[]>([]);
  const [plotY, setPlotY] = useState<any[]>([]);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const lang = languageValue as LanguageKey;
  const [xAxes, setXAxes] = useState<string>(
    PIECHART_OPTIONS.x_vars[0].label[lang],
  );
  const [yAxes, setYAxes] = useState<string>(
    PIECHART_OPTIONS.y_vars[0].label[lang],
  );
  const maxWidth = maxWidthSize(width);
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const [pieGraphOptions, setPieOptions] = useState<VoyagesOptionProps>({
    x_vars: PIECHART_OPTIONS.x_vars[0].var_name || '',
    y_vars: PIECHART_OPTIONS.y_vars[0].var_name || '',
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
      },
    );
  };

  const filters = filtersDataSend(
    filtersObj,
    styleNameRoute!,
    clusterNodeKeyVariable,
    clusterNodeValue,
  );
  const newFilters =
    filters !== undefined &&
    filters!.map((filter) => {
      const { ...filteredFilter } = filter;
      return filteredFilter;
    });
  const dataSend: IRootFilterObjectScatterRequest = {
    groupby_by: pieGraphOptions.x_vars,
    groupby_cols: [pieGraphOptions.y_vars],
    agg_fn: aggregation,
    cachename: 'voyage_bar_and_donut_charts',
    filter: newFilters || [],
  };

  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue;
  }

  const { data: response, isLoading: loading, isError } = useGroupBy(dataSend);

  // Calculate appropriate dimensions for the pie chart
  const getChartDimensions = () => {
    const showLegend = maxWidth >= 768;
    const legendWidth = showLegend ? 200 : 0; // Estimated legend width
    const padding = 40; // Padding for the container

    const availableWidth = maxWidth - padding;
    const chartWidth = showLegend
      ? availableWidth - legendWidth
      : availableWidth;

    // Ensure minimum width for readability
    const finalWidth = Math.max(chartWidth, 300);
    const chartHeight = Math.min(height * 0.58, finalWidth * 0.8);

    return {
      width: finalWidth,
      height: chartHeight,
      showLegend,
    };
  };

  useEffect(() => {
    VoyagepieGraphOptions();
    fetchOptionsFlat(isSuccess, options_flat as Options);
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
    styleName,
    lang,
  ]);

  useEffect(() => {
    if (pieGraphSelectedX.length > 0 && pieGraphSelectedY.length > 0) {
      setPieOptions({
        x_vars: PIECHART_OPTIONS.x_vars[0].var_name,
        y_vars: PIECHART_OPTIONS.y_vars[0].var_name,
      });
    }
  }, [pieGraphSelectedX, pieGraphSelectedY]);

  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAggregation(event.target.value);
    },
    [],
  );

  const handleChangeSingleSelect = useMemo(() => {
    return (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setPieOptions((prevVoygOption) => ({
        ...prevVoygOption,
        [name]: value,
      }));
    };
  }, []);

  const isPlotYZeroAll = plotY.every((item) => item === 0);
  const {
    width: chartWidth,
    height: chartHeight,
    showLegend,
  } = getChartDimensions();
  console.log({ chartWidth, chartHeight });

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
        setXAxes={setXAxes}
        setYAxesPie={setYAxes}
        aggregation={aggregation}
      />
      <RadioSelected
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
      />
      {loading ? (
        <div className="loading-logo-display">
          <img src={LOADINGLOGO} alt="loading" />
        </div>
      ) : plotX.length > 0 && !isPlotYZeroAll ? (
        <Grid
          style={{
            maxWidth: maxWidth,
            border: '1px solid #ccc',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Plot
            className="pie-plot-container"
            data={[
              {
                labels: plotX,
                values: plotY,
                type: 'pie',
                mode: 'lines+markers',
                textinfo: 'label+percent',
                insidetextorientation: 'radial',
                outsidetextfont: {
                  size: 14,
                  color: '#333',
                  family: 'Arial, sans-serif',
                },
                hole: 0.1,
                textposition: 'inside',
                showlegend: showLegend,
              },
            ]}
            layout={{
              width: chartWidth,
              height: chartHeight,
              title: {
                text: `The ${aggregation} of ${xAxes || ''} vs <br>${yAxes || ''} Pie Chart`,
                x: 0.5,
                xanchor: 'center',
              },
              font: {
                family: 'Arial, sans-serif',
                size: maxWidth < 500 ? 10 : 14,
                color: '#333333',
              },
              autosize: true,
              legend: {
                orientation: showLegend ? 'v' : 'h',
                x: showLegend ? 1.02 : 0.5,
                y: showLegend ? 0.5 : -0.1,
                xanchor: showLegend ? 'left' : 'center',
                yanchor: showLegend ? 'middle' : 'top',
              },
            }}
            config={{
              responsive: true,
              displayModeBar: false,
            }}
          />
        </Grid>
      ) : (
        <div className="no-data-icon">
          <NoDataState text="" />
        </div>
      )}
    </div>
  );
}

export default PieGraph;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';

import { SelectChangeEvent } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import Plot from 'react-plotly.js';
import { useSelector } from 'react-redux';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import '@/style/homepage.scss';
import NoDataState from '@/components/NoResultComponents/NoDataState';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import { fetchOptionsFlat } from '@/fetch/voyagesFetch/fetchOptionsFlat';
import { useFetchPieCharts } from '@/hooks/useFetchPieCharts';
import { RootState } from '@/redux/store';
import {
  VoyagesOptionProps,
  Options,
  FilterObjectsState,
  CurrentPageInitialState,
  PlotPIEX,
  PlotPIEY,
  IRootFilterObjectRequest,
  LanguageKey,
} from '@/share/InterfaceTypes';
import PIECHART_OPTIONS from '@/utils/flatfiles/voyages/voyages_piechart_options.json';
import {
  chartHeightCustom,
  chartWidthCustom,
} from '@/utils/functions/chartWidth';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';

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
    agg_fn: PIECHART_OPTIONS.y_vars[0].agg_fn || '',
  });

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

  const filters = useMemo(
    () =>
      filtersDataSend(
        filtersObj,
        styleName!,
        clusterNodeKeyVariable,
        clusterNodeValue,
      ),
    [filtersObj, styleName, clusterNodeKeyVariable, clusterNodeValue],
  );

  const newFilters = useMemo(() => {
    return filters?.map(({ ...rest }) => rest) || [];
  }, [filters]);

  const dataSend: IRootFilterObjectRequest = useMemo(() => {
    return {
      groupby: {
        by: pieGraphOptions.x_vars,
        vals: pieGraphOptions.y_vars,
        agg_fn: pieGraphOptions.agg_fn,
      },
      filter: newFilters || [],
    };
  }, [
    newFilters,
    pieGraphOptions.agg_fn,
    pieGraphOptions.x_vars,
    pieGraphOptions.y_vars,
  ]);

  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue;
  }

  const {
    data: response,
    isLoading: loading,
    isError,
  } = useFetchPieCharts(dataSend);

  const chartWidth = useMemo(
    () => chartWidthCustom(width, maxWidth),
    [width, maxWidth],
  );
  const chartHeight = useMemo(() => chartHeightCustom(height), [height]);

  const showLegend = maxWidth >= 768;

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
        agg_fn: PIECHART_OPTIONS.y_vars[0].agg_fn,
      });
    }
  }, [pieGraphSelectedX, pieGraphSelectedY]);

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
      />
      {loading ? (
        <div className="loading-logo-display">
          <img src={LOADINGLOGO} alt="loading" />
        </div>
      ) : plotX.length > 0 && !isPlotYZeroAll ? (
        <div
          style={{
            width: '100%',
            maxWidth: chartWidth,
            height: chartHeight,
            minHeight: 500,
            border: '1px solid #ccc',
            marginTop: 18,
            overflow: 'auto',
            position: 'relative',
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
                text: `The ${xAxes || ''} vs <br>${yAxes || ''} Pie Chart`,
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
        </div>
      ) : (
        <div className="no-data-icon">
          <NoDataState text="" />
        </div>
      )}
    </div>
  );
}

export default PieGraph;

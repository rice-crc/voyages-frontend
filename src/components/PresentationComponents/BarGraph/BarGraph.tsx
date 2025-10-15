import { useState, useEffect, useCallback, useMemo } from 'react';

import { SelectChangeEvent, Skeleton } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import { Data } from 'plotly.js';
import Plot from 'react-plotly.js';
import { useSelector } from 'react-redux';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import NoDataState from '@/components/NoResultComponents/NoDataState';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import { useFetchLineAndBarcharts } from '@/hooks/useFetchLineAndBarcharts';
import { RootState } from '@/redux/store';
import {
  PlotXYVar,
  VoyagesOptionProps,
  CurrentPageInitialState,
  LanguageKey,
  IRootFilterLineAndBarRequest,
} from '@/share/InterfaceTypes';
import VOYAGE_BARGRAPH_OPTIONS from '@/utils/flatfiles/voyages/voyages_bargraph_options.json';
import {
  chartHeightCustom,
  chartWidthCustom,
} from '@/utils/functions/chartWidth';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { formatYAxes } from '@/utils/functions/formatYAxesLine';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';

import { SelectDropdown } from '../../SelectorComponents/SelectDrowdown/SelectDropdown';

function BarGraph() {
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const {
    data: options_flat,
    isSuccess,
    isLoading,
  } = useGetOptionsQuery(datas);

  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState,
  );
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection,
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch,
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const lang = languageValue as LanguageKey;

  const [error, setError] = useState(false);
  const [width, height] = useWindowSize();
  const [barGraphSelectedX, setSelectedX] = useState<PlotXYVar[]>([]);
  const [barGraphSelectedY, setSelectedY] = useState<PlotXYVar[]>([]);
  const [barData, setBarData] = useState<Data[]>([]);
  const [xAxes, setXAxes] = useState<string>(
    VOYAGE_BARGRAPH_OPTIONS.x_vars[0].label[lang],
  );
  const [yAxes, setYAxes] = useState<string[]>([
    VOYAGE_BARGRAPH_OPTIONS.y_vars[0].label[lang],
  ]);
  const [chips, setChips] = useState<string[]>([
    `${VOYAGE_BARGRAPH_OPTIONS.y_vars[0].var_name}__AGG__${VOYAGE_BARGRAPH_OPTIONS.y_vars[0].agg_fn}`,
  ]);
  const [barGraphOptions, setBarOptions] = useState<VoyagesOptionProps>({
    x_vars: VOYAGE_BARGRAPH_OPTIONS.x_vars[0].var_name,
    y_vars: VOYAGE_BARGRAPH_OPTIONS.y_vars[0].var_name,
    agg_fn: VOYAGE_BARGRAPH_OPTIONS.y_vars[0].agg_fn || '',
  });

  const maxWidth = maxWidthSize(width);
  const chartWidth = useMemo(
    () => chartWidthCustom(width, maxWidth),
    [width, maxWidth],
  );
  const chartHeight = useMemo(() => chartHeightCustom(height), [height]);

  const VoyageBargraphOptions = useCallback(() => {
    Object.entries(VOYAGE_BARGRAPH_OPTIONS).forEach(([key, value]) => {
      if (key === 'x_vars') {
        setSelectedX(value as PlotXYVar[]);
      }
      if (key === 'y_vars') {
        setSelectedY(value as PlotXYVar[]);
      }
    });
  }, []);

  // Memoized values
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

  const dataSend: IRootFilterLineAndBarRequest = useMemo(() => {
    return {
      groupby: {
        by: barGraphOptions.x_vars,
        agg_series: chips.map((chip) => {
          const [varName, aggFn] = chip.split('__AGG__');
          return {
            vals: varName,
            agg_fn: aggFn || 'sum',
          };
        }),
      },
      filter: newFilters || [],
    };
  }, [barGraphOptions.x_vars, chips, newFilters]);

  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue;
  }

  const {
    data: response,
    isLoading: loading,
    isError,
  } = useFetchLineAndBarcharts(dataSend);

  // CHANGED: Complete rewrite of the data processing logic
  useEffect(() => {
    VoyageBargraphOptions();
    if (!loading && !isError && response) {
      const data: Data[] = [];

      // Find x-axis data - handle both regular and binned variables
      const cleanXVar = barGraphOptions.x_vars.replace(/__bins__\d+$/, '');
      const xVarKey = Object.keys(response).find(
        (key) => key === barGraphOptions.x_vars || key === cleanXVar,
      );

      const xData = xVarKey ? response[xVarKey] : [];

      // Create a bar for each selected y-variable
      chips.forEach((chip) => {
        const [varName, aggFn] = chip.split('__AGG__');
        const yDataKey = Object.keys(response).find((key) => {
          // Skip the x-axis key
          if (key === xVarKey) return false;

          // Check if key matches varName exactly or starts with varName
          return key === varName || key.startsWith(varName);
        });

        const yVar = VOYAGE_BARGRAPH_OPTIONS.y_vars.find(
          (y) => y.var_name === varName && y.agg_fn === aggFn,
        );

        // Find the corresponding data in response
        const yData = yDataKey ? response[yDataKey] : null;
        if (yVar && yData && Array.isArray(yData)) {
          data.push({
            x: xData as number[],
            y: yData as number[],
            type: 'bar',
            mode: 'lines',
            line: { shape: 'spline' },
            name: yVar.label[lang],
          });
        }
      });
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
    chips,
    currentPage,
    isSuccess,
    styleName,
    VoyageBargraphOptions,
    lang,
  ]);

  const handleChangeBarGraphOption = useCallback(
    (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setBarOptions((prevVoyageOption) => ({
        ...prevVoyageOption,
        [name]: value,
      }));
    },
    [],
  );

  const handleChangeBarGraphChipYSelected = useCallback(
    (event: SelectChangeEvent<string[]>, name: string) => {
      const value = event.target.value;
      if (value.length === 0) {
        setError(true);
      } else {
        setError(false);
      }
      setChips(typeof value === 'string' ? value.split(',') : value);
      setBarOptions((prevVoyageOption) => ({
        ...prevVoyageOption,
        [name]: value,
      }));
    },
    [],
  );

  if (isLoading) {
    return (
      <div className="Skeleton-loading">
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
      </div>
    );
  }

  return (
    <div
      className="mobile-responsive"
      style={{ width: '100%', overflow: 'hidden' }}
    >
      <SelectDropdown
        selectedX={barGraphSelectedX}
        chips={chips}
        selectedY={barGraphSelectedY}
        selectedOptions={barGraphOptions}
        handleChange={handleChangeBarGraphOption}
        handleChangeMultipleYSelected={handleChangeBarGraphChipYSelected}
        maxWidth={maxWidth}
        XFieldText={'X Field'}
        YFieldText={'Multi-Selector Y-Field'}
        setXAxes={setXAxes}
        setYAxes={setYAxes}
        error={error}
      />

      {loading || yAxes.length === 0 ? (
        <div className="loading-logo-graph">
          <img src={LOADINGLOGO} alt="loading" />
        </div>
      ) : yAxes.length > 0 ? (
        <div
          style={{
            width: '100%',
            maxWidth: chartWidth,
            height: chartHeight,
            minHeight: 600,
            border: '1px solid #ccc',
            marginTop: 18,
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <Plot
            data={barData}
            layout={{
              width: chartWidth,
              height: chartHeight,
              title: {
                text: 'Bar Graph',
                x: 0.5,
                xanchor: 'center',
              },
              font: {
                family: 'Arial, sans-serif',
                size: width < 400 ? 8 : width < 768 ? 10 : 12,
                color: '#333333',
              },
              xaxis: {
                title: {
                  text: xAxes || barGraphSelectedX[0]?.label[lang],
                  font: {
                    size: width < 400 ? 10 : 12,
                  },
                },
                fixedrange: true,
                tickangle: width < 768 ? -45 : 0,
                tickfont: {
                  size: width < 400 ? 8 : 10,
                },
              },
              yaxis: {
                title: {
                  text: Array.isArray(yAxes) ? formatYAxes(yAxes) : yAxes[lang],
                  font: {
                    size: width < 400 ? 10 : 12,
                  },
                },
                fixedrange: true,
                tickfont: {
                  size: width < 400 ? 8 : 10,
                },
              },
              showlegend: true,
              margin: {
                l: width < 768 ? 50 : 60,
                r: width < 768 ? 20 : 30,
                t: width < 768 ? 40 : 50,
                b: width < 768 ? 80 : 100,
              },
              autosize: false,
            }}
            config={{
              responsive: false,
              displayModeBar: false,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
            useResizeHandler={true}
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

export default BarGraph;

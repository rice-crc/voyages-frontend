import { useState, useEffect, useCallback, useMemo } from 'react';

import { SelectChangeEvent } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import { Data } from 'plotly.js';
import Plot from 'react-plotly.js';
import { useSelector } from 'react-redux';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import '@/style/page.scss';
import NoDataState from '@/components/NoResultComponents/NoDataState';
import { useGetOptionsQuery } from '@/fetch/voyagesFetch/fetchApiService';
import { useFetchLineAndBarcharts } from '@/hooks/useFetchLineAndBarcharts';
import { usePageRouter } from '@/hooks/usePageRouter';
import { RootState } from '@/redux/store';
import {
  PlotXYVar,
  VoyagesOptionProps,
  FilterObjectsState,
  CurrentPageInitialState,
  LanguageKey,
  IRootFilterLineAndBarRequest,
} from '@/share/InterfaceTypes';
import VOYAGE_SCATTER_OPTIONS from '@/utils/flatfiles/voyages/voyages_scatter_options.json';
import {
  chartHeightCustom,
  chartWidthCustom,
} from '@/utils/functions/chartWidth';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { formatYAxes } from '@/utils/functions/formatYAxesLine';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';

import { SelectDropdown } from '../../SelectorComponents/SelectDrowdown/SelectDropdown';

function Scatter() {
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const {
    data: options_flat,
    isSuccess,
    isLoading,
  } = useGetOptionsQuery(datas);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const [error, setError] = useState(false);
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

  const { styleName: styleNameRoute } = usePageRouter();
  const [width, height] = useWindowSize();
  const [scatterSelectedX, setSelectedX] = useState<PlotXYVar[]>([]);
  const [scatterSelectedY, setSelectedY] = useState<PlotXYVar[]>([]);
  const [xAxes, setXAxes] = useState<string>(
    VOYAGE_SCATTER_OPTIONS.x_vars[0].label[lang],
  );
  const [yAxes, setYAxes] = useState<string[]>([
    VOYAGE_SCATTER_OPTIONS.y_vars[0].label[lang],
  ]);
  const [scatterData, setScatterData] = useState<Data[]>([]);
  const [chips, setChips] = useState<string[]>([
    VOYAGE_SCATTER_OPTIONS.y_vars[0].var_name,
  ]);
  const [scatterOptions, setScatterOptions] = useState<VoyagesOptionProps>({
    x_vars: VOYAGE_SCATTER_OPTIONS.x_vars[0].var_name,
    y_vars: VOYAGE_SCATTER_OPTIONS.y_vars[0].var_name,
    agg_fn: VOYAGE_SCATTER_OPTIONS.y_vars[0].agg_fn || '',
  });
  const maxWidth = maxWidthSize(width);
  const chartWidth = useMemo(
    () => chartWidthCustom(width, maxWidth),
    [width, maxWidth],
  );
  const chartHeight = useMemo(() => chartHeightCustom(height), [height]);

  const VoyageScatterOptions = useCallback(() => {
    Object.entries(VOYAGE_SCATTER_OPTIONS).forEach(
      ([key, value]: [string, PlotXYVar[]]) => {
        if (key === 'x_vars') {
          setSelectedX(value);
        }
        if (key === 'y_vars') {
          setSelectedY(value);
        }
      },
    );
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
        by: scatterOptions.x_vars,
        agg_series: chips.map((chip) => {
          const yVar = VOYAGE_SCATTER_OPTIONS.y_vars.find(
            (y) => y.var_name === chip,
          );
          return {
            vals: chip,
            agg_fn: yVar?.agg_fn || 'sum',
          };
        }),
      },
      filter: newFilters || [],
    };
  }, [chips, newFilters, scatterOptions.x_vars]);

  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue;
  }

  const {
    data: response,
    isLoading: loading,
    isError,
  } = useFetchLineAndBarcharts(dataSend);

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
            name: `${VOYAGE_SCATTER_OPTIONS.y_vars[index].label[lang]}`,
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
    varName,
    chips,
    currentPage,
    isSuccess,
    styleName,
    VoyageScatterOptions,
    styleNameRoute,
    lang,
  ]);

  const handleChangeScatterOption = useCallback(
    (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setScatterOptions((prevOptions) => ({
        ...prevOptions,
        [name]: value,
      }));
      for (const title of scatterSelectedX) {
        setXAxes(title.label[lang]);
      }
    },
    [scatterSelectedX, lang],
  );

  const handleChangeScatterChipYSelected = useCallback(
    (event: SelectChangeEvent<string[]>, name: string) => {
      const value = event.target.value;
      if (value.length === 0) {
        setError(true);
      } else {
        setError(false);
      }
      setChips(typeof value === 'string' ? value.split(',') : value);
      setScatterOptions((prevOptions) => ({
        ...prevOptions,
        [name]: value,
      }));
      const newYAxesTitles = scatterSelectedY.map((title) => title.label[lang]);
      setYAxes(newYAxesTitles);
    },
    [lang, scatterSelectedY],
  );

  return (
    <div className="mobile-responsive"
    style={{
      height: '80vh',
      overflowY: 'auto',
    }}
    >
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
        setXAxes={setXAxes}
        setYAxes={setYAxes}
        error={error}
      />

      {isLoading ? (
        <div className="loading-logo-graph">
          <img src={LOADINGLOGO} alt="loading" />
        </div>
      ) : yAxes.length > 0 ? (
        <div
          style={{
            width: '100%',
            maxWidth: chartWidth,
            border: '1px solid #ccc',
            marginTop: 18,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Plot
            data={scatterData}
            layout={{
              width: chartWidth,
              height: chartHeight,
              title: {
                text: 'Line Graph',
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
                  text: xAxes || scatterSelectedX[0]?.label[lang],
                },
                fixedrange: true,
              },
              yaxis: {
                title: {
                  text: Array.isArray(yAxes) ? formatYAxes(yAxes) : yAxes,
                },
                fixedrange: true,
              },
              showlegend: false,
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

export default Scatter;

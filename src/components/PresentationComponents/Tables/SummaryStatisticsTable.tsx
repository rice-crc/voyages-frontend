import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@mui/material';
import { useWindowSize } from '@react-hook/window-size';
import { useDispatch, useSelector } from 'react-redux';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchSummaryStatisticsTable } from '@/fetch/voyagesFetch/fetchSummaryStatisticsTable';
import { usePageRouter } from '@/hooks/usePageRouter';
import { AppDispatch, RootState } from '@/redux/store';
import {
  LabelFilterMeneList,
  FilterObjectsState,
  SummaryStatisticsTableRequest,
} from '@/share/InterfaceTypes';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import {
  getColorBoxShadow,
  getColorBTNVoyageDatasetBackground,
  getColorHoverBackground,
  getHeaderColomnColor,
} from '@/utils/functions/getColorStyle';
import {
  getMobileMaxHeightTable,
  maxWidthSize,
} from '@/utils/functions/maxWidthSize';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import { downLoadText } from '@/utils/languages/title_pages';

const SummaryStatisticsTable = () => {
  const dispatch: AppDispatch = useDispatch();

  const [mode, setMode] = useState('html');

  const [summaryData, setSummaryData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  const effectOnce = useRef(false);
  const { styleName: styleNameRoute } = usePageRouter();
  const { autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList,
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch,
  );

  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );

  const { isFilter } = useSelector((state: RootState) => state.getFilter);

  const filters = filtersDataSend(
    filtersObj,
    styleNameRoute!,
    clusterNodeKeyVariable,
    clusterNodeValue,
  );
  const newFilters = useMemo(() => {
    return filters?.map(({ ...rest }) => rest) || [];
  }, [filters]);

  const dataSend: SummaryStatisticsTableRequest = useMemo(() => {
    return {
      mode: mode,
      filter: newFilters || [],
    };
  }, [newFilters, mode]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (inputSearchValue) {
        dataSend['global_search'] = inputSearchValue;
      }
      try {
        const response = await dispatch(
          fetchSummaryStatisticsTable(dataSend),
        ).unwrap();
        if (response) {
          const { data } = response;
          setSummaryData(data.data);
          setLoading(false);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    if (!effectOnce.current) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    isFilter,
    filtersObj,
    varName,
    inputSearchValue,
    styleNameRoute,
    autoLabelName,
  ]);

  const percentageString = '96%';
  const [width, height] = useWindowSize();
  const maxWidth = maxWidthSize(width);

  const [style, setStyle] = useState({
    width: percentageString,
    height: 400,
  });

  const containerStyle = useMemo(
    () => ({ width: percentageString, height: height }),
    [height],
  );

  useEffect(() => {
    setStyle({
      width: percentageString,
      height: getMobileMaxHeightTable(height / 1.2),
    });
    const headerColor = getHeaderColomnColor(styleNameRoute!);
    document.documentElement.style.setProperty(
      '--header-color-summary',
      headerColor,
    );
  }, [width, height, maxWidth, styleNameRoute]);

  const handleButtonExportCSV = useCallback(() => {
    const filename = 'summary_table_data';
    setMode('csv');
    const table = document.querySelector('table');
    if (!table) return;

    const rows = table.querySelectorAll('tr:has(td),tr:has(th)');
    const tmpColDelim = String.fromCharCode(11);
    const tmpRowDelim = String.fromCharCode(0);
    const colDelim = '","';
    const rowDelim = '"\r\n"';

    // Grab text from table into CSV formatted string
    const csvRows = [...rows].map((row) => {
      const cols = row.querySelectorAll('td,th');
      const csvCols = [...cols].map((col) => {
        const text = col.textContent?.trim() ?? '';
        return text.replace(/"/g, '""');
      });
      return csvCols.join(tmpColDelim);
    });

    const csv =
      '"' +
      csvRows
        .join(tmpRowDelim)
        .split(tmpRowDelim)
        .join(rowDelim)
        .split(tmpColDelim)
        .join(colDelim) +
      '"';

    const csvData = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);

    const link = document.createElement('a');
    link.href = csvData;
    link.download = filename;
    link.target = '_blank';
    link.click();
    setMode('html');
  }, []);

  let DownloadCSVExport = '';
  for (const header of downLoadText.title) {
    DownloadCSVExport = (header.label as LabelFilterMeneList)[languageValue];
  }

  return (
    <>
      <div className="summary-box">
        <div style={containerStyle} className="ag-theme-alpine">
          <div style={style} className="summary-box-content">
            <div className="button-export-csv-summary">
              <Button
                onClick={handleButtonExportCSV}
                style={{
                  boxShadow: getColorBoxShadow(styleNameRoute!),
                }}
                sx={{
                  backgroundColor: getColorBTNVoyageDatasetBackground(
                    styleNameRoute!,
                  ),
                  boxShadow: getColorBoxShadow(styleNameRoute!),
                  '&:hover': {
                    backgroundColor: getColorHoverBackground(styleNameRoute!),
                  },
                }}
              >
                {DownloadCSVExport}
              </Button>
            </div>
            {!summaryData && loading ? (
              <div className="loading-logo-sumarytable">
                <img src={LOADINGLOGO} alt="loading" />
              </div>
            ) : (
              <div className="summary-table-container">
                <div className="summary-table">
                  <div
                    dangerouslySetInnerHTML={{ __html: summaryData ?? null }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryStatisticsTable;

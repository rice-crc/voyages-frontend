import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useWindowSize } from '@react-hook/window-size';
import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import CustomHeaderSummaryTable from '@/components/NavigationComponents/Header/CustomHeaderSummaryTable';
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

  const [summaryData, setSummaryData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [rowData, setRowData] = useState<Record<string, string | number>[]>([]);
  const gridRef = useRef<AgGridReact>(null);
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

  const filters = useMemo(
    () =>
      filtersDataSend(
        filtersObj,
        styleNameRoute!,
        clusterNodeKeyVariable,
        clusterNodeValue,
      ),
    [filtersObj, styleNameRoute, clusterNodeKeyVariable, clusterNodeValue],
  );

  const newFilters = useMemo(() => {
    return filters?.map(({ ...rest }) => rest) || [];
  }, [filters]);

  const dataSend: SummaryStatisticsTableRequest = useMemo(() => {
    return {
      mode: 'html',
      filter: newFilters || [],
    };
  }, [newFilters]);

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
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: 'summary_table_data.csv',
      });
    }
  }, []);

  let DownloadCSVExport = '';
  for (const header of downLoadText.title) {
    DownloadCSVExport = (header.label as LabelFilterMeneList)[languageValue];
  }

  // Base button styles
  const baseButtonStyle = {
    backgroundColor: getColorBTNVoyageDatasetBackground(styleNameRoute!),
    boxShadow: getColorBoxShadow(styleNameRoute!),
    border: 'none',
    color: '#ffffff',
    padding: '0 10px',
    height: 28,
  };

  // Event handlers for hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorHoverBackground(styleNameRoute!);
    target.style.color = '#ffffff';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorBTNVoyageDatasetBackground(
      styleNameRoute!,
    );
    target.style.color = '#ffffff';
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorHoverBackground(styleNameRoute!);
    target.style.color = '#ffffff';
    target.style.outline = 'none';
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = getColorBTNVoyageDatasetBackground(
      styleNameRoute!,
    );
    target.style.color = '#ffffff';
  };

  // Parse HTML table to AG Grid format
  const parseHTMLTable = useCallback((htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');

    if (!table) return { columns: [], rows: [] };

    // Extract headers
    const headerRow = table.querySelector('thead tr');
    const headers: string[] = [];
    if (headerRow) {
      headerRow.querySelectorAll('th').forEach((th) => {
        headers.push(th.textContent?.trim() || '');
      });
    }

    // Create column definitions
    const columns: ColDef[] = headers.map((header, index) => {
      const field = `col${index}`;
      const isFirstColumn = index === 0;

      const colDef: ColDef = {
        field,
        headerName: header,
        sortable: true,
        resizable: true,
        flex: isFirstColumn ? 2 : 1,
        wrapText: true,
        autoHeight: true,
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: isFirstColumn ? 'flex-start' : 'flex-end',
          paddingLeft: isFirstColumn ? '20px' : '8px',
          paddingRight: '8px',
          borderRight: '0.5px solid #dee2e6',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: '1.4',
        },
        headerClass: 'summary-grid-header',
        valueFormatter: (params) => {
          if (params.value === null || params.value === undefined) return '';
          const num = parseFloat(String(params.value).replace(/,/g, ''));
          if (!isNaN(num) && !isFirstColumn) {
            return num.toLocaleString('en-US', {
              maximumFractionDigits: 2,
            });
          }
          return params.value;
        },
      };

      // Only add custom header for non-first columns
      if (!isFirstColumn) {
        colDef.headerComponent = CustomHeaderSummaryTable;
      }

      return colDef;
    });

    // Extract rows
    const tbody = table.querySelector('tbody');
    const rows: Record<string, string | number>[] = [];
    if (tbody) {
      tbody.querySelectorAll('tr').forEach((tr) => {
        const row: Record<string, string | number> = {};
        tr.querySelectorAll('td, th').forEach((cell, index) => {
          const text = cell.textContent?.trim() || '';
          const num = parseFloat(text.replace(/,/g, ''));
          row[`col${index}`] = !isNaN(num) && index !== 0 ? num : text;
        });
        rows.push(row);
      });
    }

    return { columns, rows };
  }, []);

  // Parse HTML data when it changes
  useEffect(() => {
    if (summaryData) {
      const { columns, rows } = parseHTMLTable(summaryData);
      setColumnDefs(columns);
      setRowData(rows);
    }
  }, [summaryData, parseHTMLTable]);

  const defaultColDef = useMemo(
    () => ({
      sortable: false,
      resizable: true,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // sortable: true,
      // filter: false,
      // resizable: true,
      wrapText: true,
      autoHeight: true,
      headerComponent: CustomHeaderSummaryTable,
    }),
    [],
  );

  return (
    <>
      <div className="summary-box">
        <div style={containerStyle} className="ag-theme-alpine">
          <div style={style} className="summary-box-content">
            <div className="button-export-csv-summary">
              <Button
                onClick={handleButtonExportCSV}
                style={baseButtonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                {DownloadCSVExport}
              </Button>
            </div>
            {!summaryData && loading ? (
              <div className="loading-logo-sumarytable">
                <img src={LOADINGLOGO} alt="loading" />
              </div>
            ) : (
              <div className="summary-table-container ag-theme-alpine">
                <AgGridReact
                  ref={gridRef}
                  columnDefs={columnDefs}
                  rowData={rowData}
                  theme="legacy"
                  domLayout="autoHeight"
                  defaultColDef={defaultColDef}
                  suppressCellFocus={true}
                  suppressRowHoverHighlight={false}
                  enableCellTextSelection={true}
                  headerHeight={40}
                  suppressMenuHide={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryStatisticsTable;

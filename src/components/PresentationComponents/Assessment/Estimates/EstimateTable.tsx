/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';

import { SelectChangeEvent } from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useDispatch, useSelector } from 'react-redux';

import '@/style/estimates.scss';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import '@/style/table.scss';
import { SelectDropdownEstimateTable } from '@/components/SelectorComponents/SelectDrowdown/SelectDropdownEstimateTable';
import { fetchEstimateCrosstabsTables } from '@/fetch/estimateFetch/fetchEstimateCrosstabsTables';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setFilterObject } from '@/redux/getFilterSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ESTIMATES } from '@/share/CONST_DATA';
import {
  EstimateCellVar,
  EstimateColumnVar,
  EstimateOptionProps,
  EstimateRowVar,
  EstimateTablesPropsRequest,
  Filter,
  FilterObjectsState,
} from '@/share/InterfaceTypes';
import ESTIMATE_OPTIONS from '@/utils/flatfiles/estimates/estimates.json';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';

const EstimateTable = () => {
  const dispatch: AppDispatch = useDispatch();
  const { currentBlockName, endpointPathEstimate, styleName } = usePageRouter();
  const aggregation = 'sum';
  const {
    currentSliderValue,
    changeFlag,
    checkedListEmbarkation,
    checkedListDisEmbarkation,
  } = useSelector((state: RootState) => state.getEstimateAssessment);

  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [rowVars, setSelectRowValues] = useState<EstimateRowVar[]>([]);
  const [columnVars, setSelectColumnValue] = useState<EstimateColumnVar[]>([]);
  const [cellVars, setSelectCellValue] = useState<EstimateCellVar[]>([]);
  const [mode, setMode] = useState('html');

  const [estimateValueOptions, setEstimateValueOptions] =
    useState<EstimateOptionProps>({
      rows: ESTIMATE_OPTIONS.row_vars[8].rows,
      binsize: ESTIMATE_OPTIONS.row_vars[8].binsize!,
      rows_label: ESTIMATE_OPTIONS.row_vars[8].rows_label,
      label: ESTIMATE_OPTIONS.row_vars[8].label,
      column_vars: ESTIMATE_OPTIONS.column_vars[1].cols,
      cell_vars: ESTIMATE_OPTIONS.cell_vars[1].vals,
    });

  const EstimateTableOptions = useCallback(() => {
    Object.entries(ESTIMATE_OPTIONS).forEach(([key, value]) => {
      if (key === 'row_vars' && Array.isArray(value)) {
        const pivotRowVars: EstimateRowVar[] = (value as EstimateRowVar[]).map(
          (item: EstimateRowVar) => {
            return {
              rows: item.rows,
              binsize: item.binsize!,
              rows_label: item.rows_label,
              label: item.label,
            };
          },
        );
        setSelectRowValues(pivotRowVars);
      } else if (key === 'column_vars' && Array.isArray(value)) {
        const estimateColumnVars: EstimateColumnVar[] = (
          value as EstimateColumnVar[]
        ).map((item: any) => ({
          cols: item,
          label: item.label,
        }));
        setSelectColumnValue(estimateColumnVars);
      } else if (key === 'cell_vars' && Array.isArray(value)) {
        const estimateCellVars: EstimateCellVar[] = (
          value as EstimateCellVar[]
        ).map((item: any) => ({
          vals: item.vals,
          label: item.label,
        }));
        setSelectCellValue(estimateCellVars);
      }
    });
  }, []);

  const { rows, binsize, column_vars, cell_vars } = estimateValueOptions;

  const onlyYearRows = rows.filter(
    (row) => row.startsWith('year_') && row.length > 5,
  );
  const updatedRowsValue = rows.join('').replace(/_(\d+)$/, '');

  const filters = filtersDataSend(filtersObj, styleName!);
  const newFilters =
    filters !== undefined &&
    filters!.map((filter) => {
      const { ...filteredFilter } = filter;
      return filteredFilter;
    });
  const dataSend: EstimateTablesPropsRequest = {
    cols: column_vars,
    rows: onlyYearRows.length > 0 ? [updatedRowsValue] : rows,
    binsize: binsize!,
    agg_fn: aggregation,
    vals: cell_vars,
    mode: mode,
    filter: newFilters || [],
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        fetchEstimateCrosstabsTables(dataSend),
      ).unwrap();

      if (response) {
        setData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    EstimateTableOptions();
    if (!currentBlockName && endpointPathEstimate === ESTIMATES) {
      fetchData();
    } else if (currentBlockName === 'tables') {
      fetchData();
    }
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;
    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;
    dispatch(setFilterObject(filter));
  }, [
    estimateValueOptions,
    estimateValueOptions.rows,
    estimateValueOptions.binsize,
    estimateValueOptions.column_vars,
    estimateValueOptions.cell_vars,
    mode,
    varName,
    currentSliderValue,
    changeFlag,
    checkedListEmbarkation,
    checkedListDisEmbarkation,
    endpointPathEstimate,
  ]);

  const handleButtonExportCSV = useCallback(() => {
    const filename = 'estimates_table_data';
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
  }, [mode, data]);

  const handleChangeOptions = useCallback(
    (
      event: SelectChangeEvent<string[]>,
      name: string,
      options?: EstimateRowVar[],
    ) => {
      const value = event.target.value as string[];
      if (name === 'row_vars' && options) {
        const selectedRow = options.find(
          (row) => row.rows.join('') === [...value].join(''),
        );
        if (selectedRow) {
          setEstimateValueOptions((prevVoyageOption) => ({
            ...prevVoyageOption,
            rows: selectedRow.rows,
            binsize: selectedRow.binsize ?? null,
            rows_label: selectedRow.rows_label ?? '',
            label: selectedRow.label ?? '',
          }));
        }
      } else {
        setEstimateValueOptions((prevVoyageOption) => ({
          ...prevVoyageOption,
          [name]: value,
        }));
      }
    },
    [setEstimateValueOptions],
  );

  return (
    <>
      {!loading && !data ? (
        <div className="loading-logo-graph">
          <img src={LOADINGLOGO} alt="loading" />
        </div>
      ) : (
        <div className="estimate-table-card">
          <SelectDropdownEstimateTable
            selectedEstimateTablesOptions={estimateValueOptions}
            selectRowValue={rowVars}
            selectColumnValue={columnVars}
            selectCellValue={cellVars}
            handleChangeOptions={handleChangeOptions}
            handleButtonExportCSV={handleButtonExportCSV}
          />
          <div className="estimate-table-container">
            <div className="estimate-table">
              <div
                dangerouslySetInnerHTML={{ __html: data !== null ? data : '' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstimateTable;

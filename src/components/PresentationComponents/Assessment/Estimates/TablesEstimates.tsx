import { useState, useEffect, useCallback, useRef } from 'react';
import { SelectChangeEvent } from '@mui/material';
import ESTIMATE_OPTIONS from '@/utils/flatfiles/estimates.json';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import '@/style/estimates.scss';

import {
    EstimateCellVar,
    EstimateColumnVar,
    EstimateOptionProps,
    EstimateRowVar,
    EstimateTablesPropsRequest,
    Filter,
    RangeSliderState,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';

import { fetchEstimateCrosstabsTables } from '@/fetch/estimateFetch/fetchEstimateCrosstabsTables';
import { SelectDropdownEstimateTable } from '@/components/SelectorComponents/SelectDrowdown/SelectDropdownEstimateTable';
import { setFilterObject } from '@/redux/getFilterSlice';

const TablesEstimates = () => {
    const dispatch: AppDispatch = useDispatch();
    const aggregation = 'sum';
    const {
        currentSliderValue,
        changeFlag,
        checkedListEmbarkation,
        checkedListDisEmbarkation,
    } = useSelector((state: RootState) => state.getEstimateAssessment);

    const { filtersObj } = useSelector((state: RootState) => state.getFilter);
    const { varName } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );


    const [data, setData] = useState<string>('');
    const [rowVars, setSelectRowValues] = useState<EstimateRowVar[]>([]);
    const [columnVars, setSelectColumnValue] = useState<EstimateColumnVar[]>([]);
    const [cellVars, setSelectCellValue] = useState<EstimateCellVar[]>([]);
    const [estimateValueOptions, setEstimateValueOptions] =
        useState<EstimateOptionProps>({
            rows: ESTIMATE_OPTIONS.row_vars[0].rows,
            binsize: ESTIMATE_OPTIONS.row_vars[0].binsize!,
            rows_label: ESTIMATE_OPTIONS.row_vars[0].rows_label,
            label: ESTIMATE_OPTIONS.row_vars[0].label,
            column_vars: ESTIMATE_OPTIONS.column_vars[1].cols,
            cell_vars: ESTIMATE_OPTIONS.cell_vars[0].vals,
        });
    const [mode, setMode] = useState('html');

    const EstimateTableOptions = useCallback(() => {
        Object.entries(ESTIMATE_OPTIONS).forEach(([key, value]) => {
            if (key === 'row_vars' && Array.isArray(value)) {
                const pivotRowVars: EstimateRowVar[] = (value as EstimateRowVar[]).map(
                    (item: EstimateRowVar) => ({
                        rows: item.rows,
                        binsize: item.binsize!,
                        rows_label: item.rows_label,
                        label: item.label,
                    })
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
        (row) => row.startsWith('year_') && row.length > 5
    );
    const updatedRowsValue = rows.join('').replace(/_(\d+)$/, '');

    const dataSend: EstimateTablesPropsRequest = {
        cols: column_vars,
        rows: onlyYearRows.length > 0 ? [updatedRowsValue] : rows,
        binsize: binsize!,
        agg_fn: aggregation,
        vals: cell_vars,
        mode: mode,
        filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : [],
    };

    const fetchData = async () => {
        try {
            const response = await dispatch(
                fetchEstimateCrosstabsTables(dataSend)
            ).unwrap();

            if (response) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        EstimateTableOptions();
        fetchData();

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
    ]);

    const handleButtonExportCSV = useCallback(() => {

        const table = document.querySelector('.estimate-table');

        if (!table) {
            console.error('Table element not found');
            return;
        }

        // Extract table data
        const rows = Array.from(table.querySelectorAll('tr'));

        // Create CSV content
        const csvContent = rows
            .map((row) =>
                Array.from(row.children)
                    .map((cell) => cell.textContent)
                    .join(',')
            )
            .join('\n');

        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'estimates_table_data.csv';

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);

        setMode('csv');
    }, [mode]);

    const handleChangeOptions = useCallback(
        (
            event: SelectChangeEvent<string[]>,
            name: string,
            options?: EstimateRowVar[]
        ) => {
            const value = event.target.value as string[];
            if (name === 'row_vars' && options) {
                const selectedRow = options.find(
                    (row) => row.rows.join('') === value.join('')
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
        [setEstimateValueOptions]
    );

    return (
        <div className="estimate-table-card">
            <SelectDropdownEstimateTable
                selectedPivottablesOptions={estimateValueOptions}
                selectRowValue={rowVars}
                selectColumnValue={columnVars}
                selectCellValue={cellVars}
                handleChangeOptions={handleChangeOptions}
                handleButtonExportCSV={handleButtonExportCSV}
                setMode={setMode}
            />
            <div className="estimate-table-container">
                <div className="estimate-table" >
                    <div dangerouslySetInnerHTML={{ __html: data ?? null }} />
                </div>
            </div>
        </div>
    );
};

export default TablesEstimates;

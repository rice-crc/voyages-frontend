import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';
import { SelectChangeEvent } from '@mui/material';
import ESTIMATE_OPTIONS from '@/utils/flatfiles/estimates.json';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import ReactHtmlParser from 'html-react-parser';

import {
    EstimateCellVar,
    EstimateColumnVar,
    EstimateOptionProps,
    EstimateRowVar,
    EstimateTablesPropsRequest,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';

import { fetchEstimateCrosstabsTables } from '@/fetch/estimateFetch/fetchEstimateCrosstabsTables';
import { SelectDropdownEstimateTable } from '@/components/SelectorComponents/SelectDrowdown/SelectDropdownEstimateTable';

const TablesEstimates = () => {
    const dispatch: AppDispatch = useDispatch();
    const effectOnce = useRef(false);
    const aggregation = 'sum'
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<string>('');
    const [rowVars, setSelectRowValues] = useState<EstimateRowVar[]>([]);
    const [columnVars, setSelectColumnValue] = useState<EstimateColumnVar[]>([]);
    const [cellVars, setSelectCellValue] = useState<EstimateCellVar[]>([]);
    const [estimateValueOptions, setEstimateValueOptions] = useState<EstimateOptionProps>({
        rows: ESTIMATE_OPTIONS.row_vars[0].rows,
        binsize: ESTIMATE_OPTIONS.row_vars[0].binsize!,
        rows_label: ESTIMATE_OPTIONS.row_vars[0].rows_label,
        label: ESTIMATE_OPTIONS.row_vars[0].label,
        column_vars: ESTIMATE_OPTIONS.column_vars[1].cols,
        cell_vars: ESTIMATE_OPTIONS.cell_vars[0].vals
    });
    const [mode, setMode] = useState('html')

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
                const estimateCellVars: EstimateCellVar[] = (value as EstimateCellVar[]).map(
                    (item: any) => ({
                        vals: item.vals,
                        label: item.label,
                    })
                );
                setSelectCellValue(estimateCellVars);
            }
        });
    }, []);

    const { rows, binsize, column_vars, cell_vars } = estimateValueOptions;
    const onlyYearRows = rows.filter(row => row.startsWith("year_") && row.length > 5);
    const updatedRowsValue = rows.join('').replace(/_(\d+)$/, '');

    const dataSend: EstimateTablesPropsRequest = {
        cols: column_vars,
        rows: onlyYearRows.length > 0 ? [updatedRowsValue] : rows,
        binsize: binsize!,
        agg_fn: aggregation,
        vals: cell_vars,
        mode: mode,
        filter: [],
    };

    const fetchData = async () => {

        try {
            const response = await dispatch(
                fetchEstimateCrosstabsTables(dataSend)
            ).unwrap();

            if (response) {
                setData(response.data.data)
            }
        } catch (error) {
            console.log('error', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!effectOnce.current) {
            EstimateTableOptions();
            fetchData();
        }
    }, [
        estimateValueOptions.rows,
        estimateValueOptions.binsize,
        estimateValueOptions.column_vars,
        estimateValueOptions.cell_vars,
        mode
    ]);
    console.log({ data })


    const handleChangeOptions = useCallback(
        (
            event: SelectChangeEvent<string[]>,
            name: string,
            options?: EstimateRowVar[]
        ) => {
            setMode('html')
            const value = event.target.value as string[];
            if (name === 'row_vars' && options) {
                const selectedRow = options.find((row) => row.rows.join('') === value.join(''));
                if (selectedRow) {
                    setEstimateValueOptions((prevVoyageOption) => ({
                        ...prevVoyageOption,
                        rows: selectedRow.rows,
                        binsize: selectedRow.binsize ?? null,
                        rows_label: selectedRow.rows_label ?? '',
                        label: selectedRow.label ?? ''
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

    const handleButtonExportCSV = useCallback(() => {
        setMode('csv')
    }, [mode])

    return (
        <div className="estimate-table-card">
            <SelectDropdownEstimateTable
                selectedPivottablesOptions={estimateValueOptions}
                selectRowValue={rowVars}
                selectColumnValue={columnVars}
                selectCellValue={cellVars}
                handleChangeOptions={handleChangeOptions}
                handleButtonExportCSV={handleButtonExportCSV}
            />
            <div className='estimate-table-container'>
                <div className='estimate-table'>
                    {data ? ReactHtmlParser(data) : null}
                </div>
            </div>
        </div>
    );
};

export default TablesEstimates;

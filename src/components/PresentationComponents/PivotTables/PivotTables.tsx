import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useRef,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Pagination, SelectChangeEvent } from '@mui/material';
import VOYAGE_PIVOT_OPTIONS from '@/utils/flatfiles/VOYAGE_PIVOT_OPTIONS.json';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useWindowSize } from '@react-hook/window-size';
import { getMobileMaxHeightPivotTable, getMobileMaxWidth, maxWidthSize } from '@/utils/functions/maxWidthSize';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchPivotCrosstabsTables } from '@/fetch/voyagesFetch/fetchPivotCrosstabsTables';
import {
  setRowPivotTableData,
  setPivotTablColumnDefs,
} from '@/redux/getPivotTablesDataSlice';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  PivotTablesPropsRequest,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';
import CustomHeaderPivotTable from '../../NavigationComponents/Header/CustomHeaderPivotTable';
import { AggregationSumAverage } from '@/components/SelectorComponents/AggregationSumAverage/AggregationSumAverage';
import {
  PivotRowVar,
  PivotColumnVar,
  PivotCellVar,
  PivotTablesProps,
} from '@/share/InterfaceTypes';
import { SelectDropdownPivotable } from '../../SelectorComponents/SelectDrowdown/SelectDropdownPivotable';
import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { getRowHeightPivotTable } from '@/utils/functions/getRowHeightTable';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { CustomTablePagination } from '@/styleMUI';
import { getColorBTNVoyageDatasetBackground, getColorBoxShadow, getColorHoverBackground } from '@/utils/functions/getColorStyle';
import { PivotColumnDef, RowDataPivotTable, StatePivotRowData } from '@/share/InterfaceTypePivotTable';

const PivotTables = () => {
  const dispatch: AppDispatch = useDispatch();
  const effectOnce = useRef(false);

  const [aggregation, setAggregation] = useState<string>('sum');
  const gridRef = useRef<AgGridReact>(null);
  const { columnDefs, rowData } = useSelector(
    (state: RootState) => state.getPivotTablesData
  );

  const { autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const [totalResultsCount, setTotalResultsCount] = useState(0);

  const {
    rangeSliderMinMax: rang,
    varName,
    isChange,
  } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowVars, setSelectRowValues] = useState<PivotRowVar[]>([]);
  const [columnVars, setSelectColumnValue] = useState<PivotColumnVar[]>([]);
  const [cellVars, setSelectCellValue] = useState<PivotCellVar[]>([]);
  const [pivotValueOptions, setPivotValueOptions] = useState<PivotTablesProps>({
    row_vars: VOYAGE_PIVOT_OPTIONS.row_vars[0].rows,
    rows_label: VOYAGE_PIVOT_OPTIONS.row_vars[0].rows_label,
    binsize: VOYAGE_PIVOT_OPTIONS.row_vars[0].binsize,
    column_vars: VOYAGE_PIVOT_OPTIONS.column_vars[0].columns,
    cell_vars: VOYAGE_PIVOT_OPTIONS.cell_vars[0].value_field,
  });

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    getRowsPerPage(window.innerWidth, window.innerHeight)
  );
  const [width, height] = useWindowSize();
  const maxWidth = maxWidthSize(width);
  const topPosition = createTopPositionVoyages(currentPage, inputSearchValue);

  const [style, setStyle] = useState({
    width: maxWidth,
    height: height,
  });


  const components = useMemo(
    () => ({
      agColumnHeader: (props: any) => {
        return <div className='pivot-table-header'>
          <CustomHeaderPivotTable
            setTotalResultsCount={setTotalResultsCount}
            columns={column_vars}
            rows={updatedRowsValue}
            rows_label={updatedRowsLabel}
            agg_fn={aggregation}
            binsize={binsize!}
            value_field={cell_vars}
            offset={offset}
            limit={rowsPerPage}
            filter={filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : []}
            setPage={setPage}
            page={page}
            {...props} />
        </div>

      }
    }),
    []
  );

  useEffect(() => {
    setStyle({
      width: getMobileMaxWidth(maxWidth),
      height: getMobileMaxHeightPivotTable(height),
    });
  }, [width, maxWidth,]);

  const defaultColDef = useMemo(() => {
    return {
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);


  const VoyagePivotTableOptions = useCallback(() => {
    Object.entries(VOYAGE_PIVOT_OPTIONS).forEach(([key, value]) => {
      if (key === 'row_vars' && Array.isArray(value)) {
        const pivotRowVars: PivotRowVar[] = (value as PivotRowVar[]).map((item: PivotRowVar) => ({
          rows: item.rows,
          binsize: item.binsize,
          rows_label: item.rows_label,
          label: item.label,
        }));
        setSelectRowValues(pivotRowVars);
      } else if (key === 'column_vars' && Array.isArray(value)) {
        const pivotColumnVars: PivotColumnVar[] = (value as PivotColumnVar[]).map((item: any) => ({
          columns: item.columns,
          label: item.label,
        }));
        setSelectColumnValue(pivotColumnVars);
      } else if (key === 'cell_vars' && Array.isArray(value)) {
        const pivotCellVars: PivotCellVar[] = (value as PivotCellVar[]).map((item: any) => ({
          value_field: item.value_field,
          label: item.label,
        }));
        setSelectCellValue(pivotCellVars);
      }
    });

  }, []);
  const {
    row_vars, rows_label, binsize,
    column_vars,
    cell_vars,
  } = pivotValueOptions;
  const updatedRowsValue = row_vars.replace(/_(\d+)$/, '');
  const updatedRowsLabel = rows_label.replace(/_(\d+)$/, '');

  const dataSend: PivotTablesPropsRequest = {
    columns: column_vars,
    rows: updatedRowsValue,
    rows_label: updatedRowsLabel,
    agg_fn: aggregation,
    binsize: binsize!,
    value_field: cell_vars,
    offset: offset,
    limit: rowsPerPage,
    filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : [],
  }
  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue
  }

  const fetchData = async () => {

    setLoading(true);
    try {
      const response = await dispatch(
        fetchPivotCrosstabsTables(dataSend)
      ).unwrap();

      if (response) {
        const { tablestructure, data, metadata } = response.data
        dispatch(setPivotTablColumnDefs(tablestructure));
        dispatch(setRowPivotTableData(data));
        setTotalResultsCount(metadata.total_results_count)
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!effectOnce.current) {
      VoyagePivotTableOptions();
    }
    if (!effectOnce.current) {
      fetchData();
    }
    const handleResize = () => {
      setRowsPerPage(getRowsPerPage(window.innerWidth, window.innerHeight));
    };


    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [
    pivotValueOptions.cell_vars,
    pivotValueOptions.column_vars,
    pivotValueOptions.row_vars,
    pivotValueOptions.rows_label,
    pivotValueOptions.binsize,
    aggregation,
    varName,
    rang,
    currentPage,
    autoLabelName,
    geoTreeValue,
    isChange,
    styleName,
    inputSearchValue,
    rowsPerPage,
    page,
  ]);

  const gridOptions = useMemo(
    () => ({
      headerHeight: 35,
      suppressHorizontalScroll: false,
      onGridReady: (params: any) => {
        const { columnApi } = params;
        columnApi.autoSizeColumns();

      },
    }),
    []
  );
  const getRowRowStyle = () => {
    return {
      fontSize: 13,
      fontWeight: 500,
      color: '#000',
      fontFamily: `Roboto`,
      paddingLeft: '20px',
    };
  };
  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAggregation(event.target.value);
    },
    []
  );

  const handleChangeOptions = useCallback(
    (event: SelectChangeEvent<string>, name: string, options?: PivotRowVar[]) => {
      const value = event.target.value;

      if (name === 'row_vars' && options) {
        const selectedRow = options.find((row) => row.rows === value);
        if (selectedRow) {
          setPivotValueOptions((prevVoyageOption) => ({
            ...prevVoyageOption,
            [name]: selectedRow.rows,
            binsize: selectedRow.binsize ?? null,
            rows_label: selectedRow.rows_label ?? '',
            label: selectedRow.label ?? '',
          }));
        }
      } else {
        setPivotValueOptions((prevVoyageOption) => ({
          ...prevVoyageOption,
          [name]: value,
        }));
      }
    },
    [setPivotValueOptions]
  );

  const newRowsData = rowData.slice(0, -1).map((row) => {
    return Object.entries(row).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        acc[key] = value.toLocaleString('en-US');
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as RowDataPivotTable);
  });

  const handleButtonExportCSV = useCallback(() => {
    (gridRef.current as AgGridReact<any>).api.exportDataAsCsv();
  }, []);

  const handleChangePage = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage);
      setOffset((prev) => prev + rowsPerPage)
    },
    [page]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      setRowsPerPage(parseInt(value));
    },
    [page, rowsPerPage]
  );

  const pageCount = Math.ceil(
    totalResultsCount && rowsPerPage ? totalResultsCount / rowsPerPage : 1
  );
  const handleChangePagePagination = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage - 1);
      setOffset((prev) => prev + rowsPerPage)
    },
    [page]
  );


  return (
    <div className="mobile-responsive">
      <div className="ag-theme-alpine grid-container">
        <div>
          <SelectDropdownPivotable
            selectedPivottablesOptions={pivotValueOptions}
            selectRowValue={rowVars}
            selectColumnValue={columnVars}
            selectCellValue={cellVars}
            handleChangeOptions={handleChangeOptions}
          />
          <span className="tableContainer">
            <AggregationSumAverage
              handleChange={handleChangeAggregation}
              aggregation={aggregation}
            />
            <div className="button-export-csv"
            >
              <Button onClick={handleButtonExportCSV}
                style={{

                  boxShadow: getColorBoxShadow(styleName!)
                }}
                sx={{
                  backgroundColor: getColorBTNVoyageDatasetBackground(styleName!),
                  boxShadow: getColorBoxShadow(styleName!),
                  '&:hover': {
                    backgroundColor: getColorHoverBackground(styleName!),
                  },
                }}
              >
                Download CSV Export file
              </Button>
            </div>
          </span>

          <CustomTablePagination
            disablescrolllock={true.toString()}
            component="span"
            count={totalResultsCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[8, 10, 15, 20, 25, 30, 45, 50, 100]}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}

          />
          < AgGridReact
            domLayout={'autoHeight'}
            ref={gridRef}
            rowData={newRowsData}
            columnDefs={columnDefs as any}
            suppressMenuHide={true}
            animateRows={true}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            getRowHeight={getRowHeightPivotTable}
            paginationPageSize={rowsPerPage}
            components={components}
            getRowStyle={getRowRowStyle}
            enableBrowserTooltips={true}
            tooltipShowDelay={0}
            tooltipHideDelay={1000}
          />
          <div className="pagination-div">
            <Pagination
              color="primary"
              count={pageCount}
              page={page + 1}
              onChange={handleChangePagePagination}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PivotTables;

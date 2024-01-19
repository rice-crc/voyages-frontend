import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useRef,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { Pagination, SelectChangeEvent } from '@mui/material';
import VOYAGE_PIVOT_OPTIONS from '@/utils/flatfiles/VOYAGE_PIVOT_OPTIONS.json';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useWindowSize } from '@react-hook/window-size';
import { getMobileMaxHeightTable, getMobileMaxWidth, maxWidthSize } from '@/utils/functions/maxWidthSize';
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
  MedatadataProps,
  PivotTablesPropsRequest,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';
import CustomHeader from '../../NavigationComponents/Header/CustomHeader';
import { AggregationSumAverage } from '@/components/SelectorComponents/AggregationSumAverage/AggregationSumAverage';

import {
  PivotRowVar,
  PivotColumnVar,
  PivotCellVar,
  PivotTablesProps,
} from '@/share/InterfaceTypes';
import { SelectDropdownPivotable } from '../../SelectorComponents/SelectDrowdown/SelectDropdownPivotable';
import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { getRowHeightTable } from '@/utils/functions/getRowHeightTable';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { CustomTablePagination } from '@/styleMUI';

const PivotTables = () => {
  const dispatch: AppDispatch = useDispatch();
  const effectOnce = useRef(false);
  const [aggregation, setAggregation] = useState<string>('sum');
  const gridRef = useRef<AgGridReact>(null);
  const { columnDefs, rowData } = useSelector(
    (state: RootState) => state.getPivotTablesData
  );

  const { autoCompleteValue, autoLabelName } = useSelector(
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
  const { isChangeGeoTree, geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const components = useMemo(() => {
    return {
      agColumnHeader: CustomHeader,
    };
  }, []);
  const [width] = useWindowSize();
  const maxWidth = maxWidthSize(width);
  const topPosition = createTopPositionVoyages(currentPage, inputSearchValue);


  useEffect(() => {
    setStyle({
      width: getMobileMaxWidth(maxWidth),
      // height: getMobileMaxHeightTable(height),
    });
  }, [width, maxWidth,]);
  const limit = 10
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
  const [style, setStyle] = useState({
    width: maxWidth
  });
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

  useEffect(() => {
    let subscribed = true;
    if (!effectOnce.current) {
      VoyagePivotTableOptions();
    }
    const {
      row_vars, rows_label, binsize,
      column_vars,
      cell_vars,
    } = pivotValueOptions;

    const updatedRowsValue = row_vars.replace(/_(\d+)$/, '');
    const updatedRowsLabel = rows_label.replace(/_(\d+)$/, '');

    const fetchData = async () => {
      const dataSend: PivotTablesPropsRequest = {
        columns: column_vars,
        rows: updatedRowsValue,
        rows_label: updatedRowsLabel,
        agg_fn: aggregation,
        binsize: binsize!,
        value_field: cell_vars,
        offset: offset,
        limit: limit,
        filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : [],
      }
      setLoading(true);
      try {
        const response = await dispatch(
          fetchPivotCrosstabsTables(dataSend)
        ).unwrap();

        if (response && subscribed) {
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
    if (!effectOnce.current) {
      fetchData();
    }
    return () => {
      dispatch(setPivotTablColumnDefs([]));
      dispatch(setRowPivotTableData([]));
      subscribed = false;
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
          // Set the PivotTablesProps object based on the selected row
          setPivotValueOptions((prevVoyageOption) => ({
            ...prevVoyageOption,
            [name]: selectedRow.rows,
            binsize: selectedRow.binsize ?? null,
            rows_label: selectedRow.rows_label ?? '',
            label: selectedRow.label ?? '',
          }));
        }
      } else {
        // For other options (column_vars, cell_vars), update the state directly
        setPivotValueOptions((prevVoyageOption) => ({
          ...prevVoyageOption,
          [name]: value,
        }));
      }
    },
    [setPivotValueOptions]
  );


  const newRowsData = rowData.slice(0, -1);
  const pinnedBottomRowData: any[] = [rowData[rowData.length - 1]];

  const handleButtonExportCSV = useCallback(() => {
    (gridRef.current as AgGridReact<any>).api.exportDataAsCsv();
  }, []);

  const handleChangePage = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage);
      setOffset((prev) => prev + limit)
    },
    [page]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      setRowsPerPage(parseInt(value));
      setPage(0);
    },
    [page, limit]
  );
  console.log({ limit })
  const pageCount = Math.ceil(
    totalResultsCount && rowsPerPage ? totalResultsCount / rowsPerPage : 1
  );
  const handleChangePagePagination = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage - 1);
      setOffset((prev) => prev + limit)
    },
    [page]
  );
  return (
    <div
      style={{ marginTop: topPosition }}
    >
      <div className="ag-theme-alpine grid-container" style={style}>
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
          <div className="button-export-csv">
            <button onClick={handleButtonExportCSV}>
              Download CSV Export file
            </button>
          </div>
        </span>
        <div  >
          <CustomTablePagination
            component="div"
            count={totalResultsCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 8, 12, 10, 15, 20, 25, 30, 45, 50, 100]}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        < AgGridReact
          ref={gridRef}
          rowData={newRowsData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          getRowHeight={getRowHeightTable}
          tooltipShowDelay={0}
          tooltipHideDelay={1000}
          paginationPageSize={10}
          components={components}
          getRowStyle={getRowRowStyle}
          enableBrowserTooltips={true}
          suppressMenuHide={true}
          animateRows={true}
          domLayout="autoHeight"
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
  );
};

export default PivotTables;

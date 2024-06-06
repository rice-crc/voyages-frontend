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
import {
  setRowPivotTableData,
  setPivotTablColumnDefs,
  setOffset,
  setPivotValueOptions,
  setAggregation,
  setRowsPerPage,
  setTotalResultsCount,
} from '@/redux/getPivotTablesDataSlice';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  LabelFilterMeneList,
  PivotTableResponse,
  PivotTablesPropsRequest,
  FilterObjectsState,
} from '@/share/InterfaceTypes';
import '@/style/table.scss';
import CustomHeaderPivotTable from '../../NavigationComponents/Header/CustomHeaderPivotTable';
import { RadioSelected } from '@/components/SelectorComponents/RadioSelected/RadioSelected';
import {
  PivotRowVar,
  PivotColumnVar,
  PivotCellVar,
} from '@/share/InterfaceTypes';
import { SelectDropdownPivotable } from '../../SelectorComponents/SelectDrowdown/SelectDropdownPivotable';
import { getRowHeightPivotTable } from '@/utils/functions/getRowHeightTable';
import { CustomTablePagination } from '@/styleMUI';
import { getColorBTNVoyageDatasetBackground, getColorBoxShadow, getColorHoverBackground, getHeaderColomnColor } from '@/utils/functions/getColorStyle';
import { usePageRouter } from '@/hooks/usePageRouter';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { fetchPivotCrosstabsTables } from '@/fetch/voyagesFetch/fetchPivotCrosstabsTables';
import { downLoadText } from '@/utils/languages/title_pages';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { customValueFormatter } from '@/utils/functions/customValueFormatter';


const PivotTables = () => {
  const dispatch: AppDispatch = useDispatch();
  const effectOnce = useRef(false);
  const gridRef = useRef<AgGridReact>(null);

  const { languageValue } = useSelector((state: RootState) => state.getLanguages);

  const { autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const {
    rangeSliderMinMax: rang,
    varName,
    isChange,
  } = useSelector((state: RootState) => state.rangeSlider as FilterObjectsState);
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
  const { styleName: styleNameRoute } = usePageRouter();
  const { clusterNodeKeyVariable, clusterNodeValue } =
    useSelector((state: RootState) => state.getNodeEdgesAggroutesMapData);
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { columnDefs, rowData, totalResultsCount, offset, pivotValueOptions, aggregation, rowsPerPage } = useSelector(
    (state: RootState) => state.getPivotTablesData
  );

  const [rowVars, setSelectRowValues] = useState<PivotRowVar[]>([]);
  const [columnVars, setSelectColumnValue] = useState<PivotColumnVar[]>([]);
  const [cellVars, setSelectCellValue] = useState<PivotCellVar[]>([]);
  const [page, setPage] = useState<number>(0);
  const [width, height] = useWindowSize();
  const maxWidth = maxWidthSize(width);

  const [style, setStyle] = useState({
    width: maxWidth,
    height: height,
  });


  const components = useMemo(
    () => ({
      agColumnHeader: (props: any) => {
        return <div className='pivot-table-header'>
          <CustomHeaderPivotTable
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
  }, [width, maxWidth]);

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

  const filters = filtersDataSend(filtersObj, styleNameRoute!, clusterNodeKeyVariable, clusterNodeValue)
  const newFilters = filters !== undefined && filters!.map(filter => {
    const { label, title, ...filteredFilter } = filter;
    return filteredFilter;
  });

  const dataSend: PivotTablesPropsRequest = {
    columns: column_vars,
    rows: updatedRowsValue,
    rows_label: updatedRowsLabel,
    agg_fn: aggregation,
    binsize: binsize!,
    value_field: cell_vars,
    offset: offset,
    limit: rowsPerPage,
    filter: newFilters || [],
  }


  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue
  }


  const fetchData = async () => {
    try {
      const response = await dispatch(
        fetchPivotCrosstabsTables(dataSend)
      ).unwrap();

      if (response) {
        const { tablestructure, data, metadata } = response.data as PivotTableResponse
        tablestructure.forEach(structure => {
          if (structure.children) {
            structure.children.forEach(child => {
              if (child.field === 'Year range') { // DO WE NEED TO Handle the condition here?
                child.type = 'leftAligned'
                child.cellClass = 'ag-left-aligned-cell'
              } else if (child.field === 'All') { // DO WE NEED TO Handle the condition here? 
                child.type = 'rightAligned'
                child.cellClass = 'ag-right-aligned-cell'
                child.valueFormatter = (params: any) => customValueFormatter(params)
              }
            });
          } else {
            structure.type = 'rightAligned'
            structure.cellClass = 'ag-right-aligned-cell'
            // We will need to check if the valueFromatter will be comma or percent
            structure.valueFormatter = (params: any) => customValueFormatter(params)
          }
        });
        dispatch(setPivotTablColumnDefs(tablestructure));
        dispatch(setRowPivotTableData(data));
        dispatch(setTotalResultsCount(metadata.total_results_count))
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    if (!effectOnce.current) {
      VoyagePivotTableOptions();
    }
    if (!effectOnce.current) {
      fetchData();
    }
    const headerColor = getHeaderColomnColor(styleNameRoute!);

    document.documentElement.style.setProperty(
      '--pagination-table--',
      headerColor
    );
    const handleResize = () => {
      dispatch(setRowsPerPage(getRowsPerPage(window.innerWidth, window.innerHeight)));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [
    filtersObj,
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

  const getRowStyle = () => {
    return {
      fontSize: 13,
      color: '#000',
      fontFamily: 'sans-serif',
      paddingLeft: '20px',
    };
  };

  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setAggregation(event.target.value));
    },
    []
  );

  const handleChangeOptions = useCallback(
    (event: SelectChangeEvent<string>, name: string, options?: PivotRowVar[]) => {
      const value = event.target.value;
      if (name === 'row_vars' && options) {
        const selectedRow = options.find((row) => row.rows === value);
        if (selectedRow) {
          dispatch(setPivotValueOptions({
            ...pivotValueOptions,
            [name]: selectedRow.rows,
            binsize: selectedRow.binsize ?? null,
            rows_label: selectedRow.rows_label ?? '',
            label: selectedRow.label ?? '',
          }));
        }
      } else {
        dispatch(setPivotValueOptions({
          ...pivotValueOptions,
          [name]: value,
        }));
      }
    },
    [dispatch, pivotValueOptions]
  );

  // Define a helper function to format numbers as strings with commas
  const formatNumber = (number: number) => {
    if (typeof number === 'number') {
      return number.toLocaleString('en-US');
    }
    return number;
  };
  // const formatNumber = (value: string | number): string => {
  //   if (typeof value === 'number') {
  //     return value.toLocaleString('en-US');
  //   }
  //   return value;
  // };

  const handleButtonExportCSV = useCallback(() => {
    (gridRef.current as AgGridReact<any>).api.exportDataAsCsv();
  }, []);

  const handleChangePage = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage);
      const newOffset = newPage > page ? offset + rowsPerPage : offset - rowsPerPage;
      dispatch(setOffset(newOffset >= 0 ? newOffset : 0))
    },
    [page, rowsPerPage, offset]
  );

  const handleChangeRowsPerPage =
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      const newRowsPerPage = parseInt(value);
      dispatch(setRowsPerPage(newRowsPerPage));
    }

  const pageCount = Math.ceil(
    totalResultsCount && rowsPerPage ? totalResultsCount / rowsPerPage : 1
  );

  const handleChangePagePagination = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage - 1);
      if (newPage === 0 || newPage === 1) {
        dispatch(setOffset(0));
      } else {
        const newOffset = newPage > page ? offset + rowsPerPage : offset - rowsPerPage;
        dispatch(setOffset(newOffset));
      }
    },
    [page, rowsPerPage, offset]
  );

  let DownloadCSVExport = ''
  for (const header of downLoadText.title) {
    DownloadCSVExport = (header.label as LabelFilterMeneList)[languageValue];
  }


  const newRowsData = rowData.slice(0, -1)
  const totalItemData = rowData.slice(-1)

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
            aggregation={aggregation}
          />
          <span className="tableContainer">
            <RadioSelected
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
                {DownloadCSVExport}
              </Button>
            </div>
          </span>

          <CustomTablePagination
            disablescrolllock={true.toString()}
            component="span"
            className="pivot-table-pagination"
            count={totalResultsCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[8, 10, 15, 20, 25, 30, 45, 50, 100]}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}

          />
          <AgGridReact
            domLayout={'autoHeight'}
            ref={gridRef}
            pinnedBottomRowData={totalItemData}
            rowData={newRowsData}
            columnDefs={columnDefs as any}
            suppressMenuHide={true}
            animateRows={true}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            getRowHeight={getRowHeightPivotTable}
            paginationPageSize={rowsPerPage}
            components={components}
            getRowStyle={getRowStyle}
            enableBrowserTooltips={true}
            tooltipShowDelay={0}
            tooltipHideDelay={1000}
            groupDefaultExpanded={-1}
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

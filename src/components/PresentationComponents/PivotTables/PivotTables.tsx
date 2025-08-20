/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useRef,
} from 'react';

import { Button, Pagination } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  ModuleRegistry,
  AllCommunityModule, // or AllEnterpriseModule
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';

import { RadioSelected } from '@/components/SelectorComponents/RadioSelected/RadioSelected';
import { fetchPivotCrosstabsTables } from '@/fetch/voyagesFetch/fetchPivotCrosstabsTables';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  setRowPivotTableData,
  setPivotTablColumnDefs,
  setOffset,
  setPivotValueOptions,
  setAggregation,
  setRowsPerPage,
  setTotalResultsCount,
} from '@/redux/getPivotTablesDataSlice';
import { AppDispatch, RootState } from '@/redux/store';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  LabelFilterMeneList,
  PivotTableResponse,
  PivotTablesPropsRequest,
  FilterObjectsState,
  PivotRowVar,
  PivotColumnVar,
  PivotCellVar,
} from '@/share/InterfaceTypes';
import VOYAGE_PIVOT_OPTIONS from '@/utils/flatfiles/voyages/voyages_pivot_options.json';
import { customValueFormatter } from '@/utils/functions/customValueFormatter';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import {
  getColorBTNVoyageDatasetBackground,
  getColorBoxShadow,
  getColorHoverBackground,
  getHeaderColomnColor,
} from '@/utils/functions/getColorStyle';
import { getRowHeightPivotTable } from '@/utils/functions/getRowHeightTable';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import '@/style/table.scss';
import { downLoadText } from '@/utils/languages/title_pages';

import CustomHeaderPivotTable from '../../NavigationComponents/Header/CustomHeaderPivotTable';
import { SelectDropdownPivotable } from '../../SelectorComponents/SelectDrowdown/SelectDropdownPivotable';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register the module
ModuleRegistry.registerModules([
  AllCommunityModule, // or AllEnterpriseModule
]);

const PivotTables = () => {
  const dispatch: AppDispatch = useDispatch();
  const effectOnce = useRef(false);
  const gridRef = useRef<AgGridReact>(null);

  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  const { autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState,
  );
  const { rangeSliderMinMax: rang, varName } = useSelector(
    (state: RootState) => state.rangeSlider as FilterObjectsState,
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState,
  );
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection,
  );
  const { geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData,
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch,
  );
  const { styleName: styleNameRoute } = usePageRouter();
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData,
  );
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const {
    columnDefs,
    rowData,
    totalResultsCount,
    offset,
    pivotValueOptions,
    aggregation,
    rowsPerPage,
  } = useSelector((state: RootState) => state.getPivotTablesData);

  const [rowVars, setSelectRowValues] = useState<PivotRowVar[]>([]);
  const [columnVars, setSelectColumnValue] = useState<PivotColumnVar[]>([]);
  const [cellVars, setSelectCellValue] = useState<PivotCellVar[]>([]);
  const [page, setPage] = useState<number>(1); // Ant Design Pagination starts from 1

  const components = useMemo(
    () => ({
      agColumnHeader: (props: any) => {
        return (
          <div className="pivot-table-header">
            <CustomHeaderPivotTable {...props} />
          </div>
        );
      },
    }),
    [],
  );

  // Enhanced defaultColDef with better configuration
  const defaultColDef = useMemo(() => {
    return {
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      maxWidth: 300,
      suppressMenu: false,
      cellDataType: false,
      valueGetter: undefined,
      cellRenderer: undefined,
      cellStyle: {
        textAlign: 'right',
        paddingRight: '8px',
      },
    };
  }, []);

  const VoyagePivotTableOptions = useCallback(() => {
    Object.entries(VOYAGE_PIVOT_OPTIONS).forEach(([key, value]) => {
      if (key === 'row_vars' && Array.isArray(value)) {
        const pivotRowVars: PivotRowVar[] = (value as PivotRowVar[]).map(
          (item: PivotRowVar) => ({
            rows: item.rows,
            binsize: item.binsize,
            rows_label: item.rows_label,
            label: item.label,
          }),
        );
        setSelectRowValues(pivotRowVars);
      } else if (key === 'column_vars' && Array.isArray(value)) {
        const pivotColumnVars: PivotColumnVar[] = (
          value as PivotColumnVar[]
        ).map((item: any) => ({
          columns: item.columns,
          label: item.label,
        }));
        setSelectColumnValue(pivotColumnVars);
      } else if (key === 'cell_vars' && Array.isArray(value)) {
        const pivotCellVars: PivotCellVar[] = (value as PivotCellVar[]).map(
          (item: any) => ({
            value_field: item.value_field,
            label: item.label,
          }),
        );
        setSelectCellValue(pivotCellVars);
      }
    });
  }, []);

  const { row_vars, rows_label, binsize, column_vars, cell_vars } =
    pivotValueOptions;
  const updatedRowsValue = row_vars.replace(/_(\d+)$/, '');
  const updatedRowsLabel = rows_label.replace(/_(\d+)$/, '');

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

  const dataSend: PivotTablesPropsRequest = useMemo(() => {
    const baseDataSend = {
      columns: column_vars,
      rows: updatedRowsValue,
      rows_label: updatedRowsLabel,
      agg_fn: aggregation,
      binsize: binsize!,
      value_field: cell_vars,
      offset: offset,
      limit: rowsPerPage,
      filter: newFilters || [],
    };
    if (inputSearchValue) {
      (baseDataSend as any)['global_search'] = inputSearchValue!;
    }

    return baseDataSend;
  }, [
    column_vars,
    updatedRowsValue,
    updatedRowsLabel,
    aggregation,
    binsize,
    cell_vars,
    offset,
    rowsPerPage,
    newFilters,
    inputSearchValue,
  ]);

  const processColumnDefs = useCallback((tablestructure: any[]) => {
    return tablestructure.map((structure) => {
      const processedStructure = { ...structure };
      
      if (structure.children) {
        processedStructure.children = structure.children.map((child:any) => {
          const processedChild = { ...child };
          
          if (child.field === 'Africa__West Central Africa and St. Helena') {
            // Simple cell renderer that just shows the value
            processedChild.cellRenderer = (params: any) => {
              // Get the value directly from data if params.value is undefined
              let value = params.value;
              if (value === undefined || value === null) {
                value = params.data?.['Africa__West Central Africa and St. Helena'];
              }
              return value !== null && value !== undefined 
                ? Number(value).toLocaleString('en-US')
                : '0';
            };
          
            // Don't use valueFormatter for this column
            delete processedChild.valueFormatter;
            
          } else  if (child.field === 'Year range') {
            processedChild.type = 'leftAligned';
            processedChild.cellClass = 'ag-left-aligned-cell';
            processedChild.pinned = 'left';
            processedChild.width = 120;
          } else if (child.field === 'All') {
            processedChild.type = 'rightAligned';
            processedChild.cellClass = 'ag-right-aligned-cell';
            processedChild.valueFormatter = (params: any) =>
              customValueFormatter(params);
          } else {
            processedChild.type = 'rightAligned';
            processedChild.cellClass = 'ag-right-aligned-cell';
            processedChild.valueFormatter = (params: any) =>
              customValueFormatter(params);
          }
          
          return processedChild;
        });
      } else {
        // Handle direct columns (not nested in children)
        if (processedStructure.field === 'Africa__West Central Africa and St. Helena') {
          processedStructure.cellStyle = {
            textAlign: 'right',
            color: '#000000',
            fontWeight: 'bold',
            padding: '4px 8px'
          };
          
          processedStructure.cellRenderer = (params: any) => {
            let value = params.value;
            if (value === undefined || value === null) {
              value = params.data?.['Africa__West Central Africa and St. Helena'];
            }
            
            return value !== null && value !== undefined ? String(value) : '0';
          };
          
          delete processedStructure.valueFormatter;
          
        } else if (processedStructure.field === 'Year range') {
          processedStructure.type = 'leftAligned';
          processedStructure.cellClass = 'ag-left-aligned-cell';
          processedStructure.pinned = 'left';
          processedStructure.width = 120;
        } else {
          processedStructure.type = 'rightAligned';
          processedStructure.cellClass = 'ag-right-aligned-cell';
          processedStructure.valueFormatter = (params: any) =>
            customValueFormatter(params);
        }
      }
      
      return processedStructure;
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await dispatch(
        fetchPivotCrosstabsTables(dataSend),
      ).unwrap();

      if (response) {
        const { tablestructure, data, metadata } =
          response.data as PivotTableResponse;
        
        const processedColumns = processColumnDefs(tablestructure);
        
        dispatch(setPivotTablColumnDefs(processedColumns));
        dispatch(setRowPivotTableData(data));
        dispatch(setTotalResultsCount(metadata.total_results_count));
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [dispatch, dataSend, processColumnDefs]);

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
      headerColor,
    );
    const handleResize = () => {
      dispatch(
        setRowsPerPage(getRowsPerPage(window.innerWidth, window.innerHeight)),
      );
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    inputSearchValue,
    rowsPerPage,
    page,
    styleNameRoute,
    VoyagePivotTableOptions,
    dispatch,
  ]);

  useEffect(() => {
    if (effectOnce.current) {
      fetchData();
    }
  }, [fetchData]);

  // Enhanced grid options
  const gridOptions = useMemo(
    () => ({
      headerHeight: 35,
      suppressHorizontalScroll: false,
      suppressRowVirtualisation: false,
      suppressColumnVirtualisation: false,
      animateRows: true,
      enableCellTextSelection: true,
      ensureDomOrder: true,
    }),
    [],
  );

  // Enhanced row style function
  const getRowStyle = (params: any) => {
    return {
      fontSize: 13,
      color: '#000',
      fontFamily: 'sans-serif',
      paddingLeft: '20px',
      backgroundColor: params.node.rowIndex % 2 === 0 ? '#ffffff' : '#f9f9f9',
    };
  };

  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setAggregation(event.target.value));
    },
    [dispatch],
  );

  const handleChangeOptions = useCallback(
    (
      value: string | string[],
      name: string,
      options?: PivotRowVar[],
    ) => {
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
      } else if (name === 'column_vars') {
        dispatch(setPivotValueOptions({
          ...pivotValueOptions,
          [name]: Array.isArray(value) ? value : [value],
        }));
      } else {
        dispatch(setPivotValueOptions({
          ...pivotValueOptions,
          [name]: value,
        }));
      }
    },
    [dispatch, pivotValueOptions],
  );

  const handleButtonExportCSV = useCallback(() => {
    (gridRef.current as AgGridReact<any>).api.exportDataAsCsv();
  }, []);

  const handleChangePage = useCallback(
    (newPage: number, pageSize: number) => {
      setPage(newPage);
      const newOffset = (newPage - 1) * pageSize;
      dispatch(setOffset(newOffset >= 0 ? newOffset : 0));
    },
    [dispatch],
  );

  const handleChangePageSize = useCallback(
    (current: number, size: number) => {
      dispatch(setRowsPerPage(size));
      setPage(1);
      dispatch(setOffset(0));
    },
    [dispatch],
  );

  let DownloadCSVExport = '';
  for (const header of downLoadText.title) {
    DownloadCSVExport = (header.label as LabelFilterMeneList)[languageValue];
  }

  // Enhanced data processing with validation
  const newRowsData = useMemo(() => {
    const slicedData = rowData.slice(0, -1);
    return slicedData;
  }, [rowData]);

  const totalItemData = useMemo(() => {
    const lastRow = rowData.slice(-1);
    return lastRow;
  }, [rowData]);

  // Force grid refresh when data changes
  useEffect(() => {
    if (gridRef.current && newRowsData.length > 0) {
      const gridApi = gridRef.current.api;
      const columnApi = (gridRef.current as any).columnApi;
      
      setTimeout(() => {
        gridApi?.refreshCells({ force: true });
        columnApi?.autoSizeAllColumns();
        
        // Force specific column width
        columnApi?.setColumnWidth('Africa__West Central Africa and St. Helena', 200);
      }, 100);
    }
  }, [newRowsData]);

  // // Debug button for testing
  // const DebugButton = () => (
  //   <div style={{ margin: '10px', display: 'flex', gap: '10px' }}>
  //     <Button onClick={() => {
  //       const gridApi = gridRef.current?.api;
  //       const columnApi = (gridRef.current as any)?.columnApi;
        
  //       console.log('=== GRID DEBUG INFO ===');
  //       console.log('Total columns:', columnApi?.getAllColumns()?.length);
  //       console.log('Visible columns:', columnApi?.getAllDisplayedColumns()?.length);
        
  //       const targetColumn = columnApi?.getColumn('Africa__West Central Africa and St. Helena');
  //       console.log('Target column:', {
  //         exists: !!targetColumn,
  //         visible: targetColumn?.isVisible(),
  //         width: targetColumn?.getActualWidth(),
  //         left: targetColumn?.getLeft(),
  //         field: targetColumn?.getColDef()?.field
  //       });
        
  //       // Get actual row data from grid
  //       const allRowData: any[] = [];
  //       gridApi?.forEachNode((node) => {
  //         console.log({node: node.data})
  //         allRowData.push(node.data);
  //       });
        
  //       console.log('Grid row data:', allRowData[0]);
  //       console.log('Grid target field value:', allRowData[0]?.['Africa__West Central Africa and St. Helena']);
        
  //       // Force refresh
  //       gridApi?.refreshCells({ force: true });
  //       columnApi?.autoSizeAllColumns();
  //     }}>
  //       Debug Grid
  //     </Button>
      
  //     <Button onClick={() => {
  //       console.log('Current newRowsData:', newRowsData);
  //       console.log('Current totalItemData:', totalItemData);
  //       console.log('Current columnDefs:', columnDefs);
  //     }}>
  //       Log Current State
  //     </Button>
  //   </div>
  // );

  return (
    <div className="mobile-responsive">
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column' as const,
        }}
      >
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
          <div className="button-export-csv">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleButtonExportCSV}
              style={{
                backgroundColor: getColorBTNVoyageDatasetBackground(styleName!),
                borderColor: getColorBTNVoyageDatasetBackground(styleName!),
                boxShadow: getColorBoxShadow(styleName!),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = getColorHoverBackground(styleName!);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = getColorBTNVoyageDatasetBackground(styleName!);
              }}
            >
              {DownloadCSVExport}
            </Button>
          </div>
        </span>
        
        {/* Add debug button in development */}
        {/* {process.env.NODE_ENV === 'development' && <DebugButton />} */}
        
        <div
          className="ag-theme-alpine grid-container ag-theme-balham"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            maxHeight: '75vh',
          }}
        >
          <AgGridReact
            theme="legacy"
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
            // debug={process.env.NODE_ENV === 'development'}
            // onCellValueChanged={(params) => {
            //   console.log('Cell value changed:', params);
            // }}
            suppressPropertyNamesCheck={true}
          />
          
          <div style={{ marginTop: 16, textAlign: 'center', display: 'flex', alignContent:'center', justifyContent:'flex-end' }}>
            <Pagination
              current={page}
              total={totalResultsCount}
              pageSize={rowsPerPage}
              pageSizeOptions={['5', '10', '15', '20', '25', '30', '45', '50', '100']}
              showSizeChanger={true}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              onChange={handleChangePage}
              onShowSizeChange={handleChangePageSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PivotTables;
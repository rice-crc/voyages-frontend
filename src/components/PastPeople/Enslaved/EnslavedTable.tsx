import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import CustomHeader from '../../FcComponents/CustomHeader';
import { generateRowsData } from '@/utils/functions/generateRowsData';
import { setColumnDefs, setRowData, setData } from '@/redux/getTableSlice';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getBreakPoints';
import { useWindowSize } from '@react-hook/window-size';
import { Pagination, Skeleton, TablePagination } from '@mui/material';
import { ColumnSelector } from '@/components/FcComponents/ColumnSelectorTable/ColumnSelector';
import {
  ColumnDef,
  StateRowData,
  TableCellStructureInitialStateProp,
  VoyageOptionsGropProps,
  VoyageTableCellStructure,
} from '@/share/InterfaceTypesTable';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  RangeSliderState,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import { ICellRendererParams } from 'ag-grid-community';
import TABLE_FLAT from '@/utils/flatfiles/voyage_table_cell_structure__updated21June.json';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetchAPI/fetchEnslavedOptionsList';

const EnslavedTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { columnDefs, data, rowData } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
  );
  const { rangeSliderMinMax: rang, varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { autoCompleteValue, autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { visibleColumnCells } = useSelector(
    (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
  );
  const {
    dataSetKey,
    dataSetValue,
    dataSetValueBaseFilter,
    styleName,
    tableFlatfile: tableFileName,
  } = useSelector((state: RootState) => state.getPeopleDataSetCollection);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    getRowsPerPage(window.innerWidth, window.innerHeight)
  );

  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const gridRef = useRef<any>(null);
  const [tablesCell, setTableCell] = useState<VoyageTableCellStructure[]>(
    TABLE_FLAT.cell_structure
  );

  const [width, height] = useWindowSize();
  const maxWidth =
    width > 1024
      ? width > 1440
        ? width * 0.88
        : width * 0.92
      : width === 1024
      ? width * 0.895
      : width < 768
      ? width * 0.8
      : width * 0.75;
  const [style, setStyle] = useState({
    width: maxWidth,
    height: height * 0.62,
  });

  const containerStyle = useMemo(
    () => ({ width: maxWidth, height: height * 0.7 }),
    [maxWidth, height]
  );

  useEffect(() => {
    const loadTableCellStructure = async () => {
      try {
        // Need to refactor later
        if (styleName === TYPESOFDATASETPEOPLE.allEnslaved) {
          const response = await import(
            '@/utils/flatfiles/enslaved_table_cell_structure.json'
          );
          setTableCell(response.default.cell_structure);
        } else if (tableFileName === TYPESOFDATASETPEOPLE.africanOrigins) {
          const response = await import(
            '@/utils/flatfiles/african_origins_table_cell_structure.json'
          );
          setTableCell(response.default.cell_structure);
        } else if (tableFileName === TYPESOFDATASETPEOPLE.texas) {
          const response = await import(
            '@/utils/flatfiles/texas_table_cell_structure.json'
          );
          setTableCell(response.default.cell_structure);
        }
      } catch (error) {
        console.error('Failed to load table cell structure:', error);
      }
    };

    loadTableCellStructure();
  }, [tableFileName]);

  useEffect(() => {
    if (tablesCell.length > 0) {
      const visibleColumns = tablesCell
        .filter((cell: any) => cell.visible)
        .map((cell: any) => cell.colID);
      dispatch(setVisibleColumn(visibleColumns));
    }
  }, [tablesCell, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setRowsPerPage(getRowsPerPage(window.innerWidth, window.innerHeight));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setStyle({
      width: maxWidth,
      height: height * 0.65,
    });
  }, [width, height, maxWidth]);

  const saveDataToLocalStorage = useCallback(
    (data: VoyageOptionsGropProps[], visibleColumnCells: string[]) => {
      localStorage.setItem('data', JSON.stringify(data));
      localStorage.setItem(
        'visibleColumnCells',
        JSON.stringify(visibleColumnCells)
      );
    },
    []
  );

  useEffect(() => {
    saveDataToLocalStorage(data, visibleColumnCells);
  }, [data]);

  useEffect(() => {
    let subscribed = true;
    const fetchData = async () => {
      setLoading(true);
      const newFormData: FormData = new FormData();
      newFormData.append('results_page', String(page + 1));
      newFormData.append('results_per_page', String(rowsPerPage));
      // if (rang[varName] && currentPage === 5) {
      //   newFormData.append(varName, String(rang[varName][0]));
      //   newFormData.append(varName, String(rang[varName][1]));
      // }

      // if (autoCompleteValue && varName) {
      //   for (let i = 0; i < autoLabelName.length; i++) {
      //     const label = autoLabelName[i];
      //     newFormData.append(varName, label);
      //   }
      // }

      if (styleName !== TYPESOFDATASETPEOPLE.allEnslaved) {
        // console.log('dataSetValue-->', dataSetValue);
        for (const value of dataSetValue) {
          // console.log('value-->', value);
          // console.log('dataSetKey-->', dataSetKey);
          newFormData.append(dataSetKey, String(value));
        }
      }

      try {
        const response = await dispatch(
          fetchEnslavedOptionsList(newFormData)
        ).unwrap();
        if (subscribed) {
          setTotalResultsCount(Number(response.headers.total_results_count));

          dispatch(setData(response.data));
          saveDataToLocalStorage(response.data, visibleColumnCells);
        }
      } catch (error) {
        console.log('error', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      subscribed = false;
    };
  }, [
    dispatch,
    rowsPerPage,
    page,
    currentPage,
    varName,
    rang,
    autoCompleteValue,
    autoLabelName,
    dataSetValue,
    dataSetKey,
    dataSetValueBaseFilter,
    styleName,
    saveDataToLocalStorage,
    visibleColumnCells,
  ]);

  useEffect(() => {
    if (data.length > 0) {
      const finalRowData = generateRowsData(data, tableFileName);
      const newColumnDefs: ColumnDef[] = tablesCell.map(
        (value: VoyageTableCellStructure) => {
          const columnDef = {
            headerName: value.header_label,
            field: value.colID,
            // change this line
            // width: value.colID === 'voyage_sources' ? 300 : 200,
            sortable: true,
            autoHeight: true,
            wrapText: true,
            sortingOrder: value.order_by,
            headerTooltip: value.header_label,
            tooltipField: value.colID,
            hide: !visibleColumnCells.includes(value.colID),
            filter: true,
            cellRenderer: (params: ICellRendererParams) => {
              const values = params.value;
              if (Array.isArray(values)) {
                const style: CSSProperties = {
                  backgroundColor: '#e5e5e5',
                  borderRadius: '8px',
                  padding: '0px 10px',
                  height: '25px',
                  whiteSpace: 'nowrap',
                  width: value.colID === 'voyage_sources' ? 240 : 145,
                  overflow: 'hidden',
                  textOverflow:
                    value.colID === 'voyage_sources' ? 'inherit' : 'ellipsis',
                  margin: '5px 0',
                  textAlign: 'center',
                  lineHeight: '25px',
                  fontSize: '13px',
                };
                const renderedValues = values.map(
                  (value: string, index: number) => (
                    <span key={`${index}-${value}`}>
                      <div style={style}>{`${value}\n`}</div>
                    </span>
                  )
                );
                return <div>{renderedValues}</div>;
              } else {
                return (
                  <div className="div-value">
                    <div className="value">{values}</div>
                  </div>
                );
              }
            },
            valueGetter: (params: ICellRendererParams) => {
              const finalData: string[] = [];
              const data = params.data;
              const fields = value.cell_val.fields;
              const firstData = data[fields[0].var_name];
              const joinDelimiter: string | undefined = value.cell_val.join;
              if (value.cell_type === 'literal') {
                return data[fields[0].var_name] ?? '--';
              } else if (
                value.cell_type === 'literal-concat' &&
                Array.isArray(firstData)
              ) {
                for (let i = 0; i < firstData?.length; i++) {
                  const dataResult = [];
                  for (let j = 0; j < fields.length; j++) {
                    const fieldName = fields[j].var_name;
                    const fieldValue = data[fieldName][i];
                    dataResult.push(String(fieldValue));
                  }
                  finalData.push(dataResult.join(joinDelimiter));
                }
                return finalData.length !== 0 ? finalData : '--';
              } else if (value.cell_type === 'literal-concat') {
                let dataValue: string = '';
                for (let i = 0; i < fields.length; i++) {
                  const fieldName = fields[i].var_name;
                  const fieldValue = data[fieldName];
                  if (fieldValue !== null) {
                    dataValue += fieldValue + ',';
                  }
                }
                const result = dataValue.substring(0, dataValue.length - 1);
                return result;
              }
            },
          };
          return columnDef;
        }
      );
      console.log('visibleColumnCells-->', visibleColumnCells);
      dispatch(setColumnDefs(newColumnDefs));
      dispatch(setRowData(finalRowData as Record<string, any>[]));
    }
  }, [data, visibleColumnCells, dispatch]); //

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    }),
    []
  );

  const components = useMemo(
    () => ({
      agColumnHeader: CustomHeader,
    }),
    []
  );

  const getRowRowStyle = useCallback(
    () => ({
      fontSize: 13,
      fontWeight: 500,
      color: '#000',
      fontFamily: 'Roboto',
      paddingLeft: '20px',
    }),
    []
  );

  const handleColumnVisibleChange = useCallback(
    (params: any) => {
      const { columnApi } = params;
      const allColumns = columnApi.getAllColumns();
      const visibleColumns = allColumns
        .filter((column: any) => column.isVisible())
        .map((column: any) => column.getColId());

      dispatch(setVisibleColumn(visibleColumns));
    },
    [dispatch]
  );
  // console.log('visibleColumns-->', visibleColumnCells);

  const gridOptions = useMemo(
    () => ({
      headerHeight: 40,
      suppressHorizontalScroll: true,
      onGridReady: (params: any) => {
        const { columnApi } = params;
        columnApi.autoSizeColumns();
      },
    }),
    []
  );

  const handleChangePage = useCallback((event: any, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value));
      setPage(0);
    },
    []
  );

  const handleChangePagePagination = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage - 1);
    },
    []
  );

  return (
    <div>
      {loading ? (
        <div className="Skeleton-loading">
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </div>
      ) : (
        <div style={containerStyle} className="ag-theme-alpine grid-container">
          <div style={style}>
            <span className="tableContainer">
              <ColumnSelector />
              <TablePagination
                component="div"
                count={totalResultsCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 12, 15, 20, 25, 30, 45, 50, 100]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </span>

            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              onColumnVisible={handleColumnVisibleChange}
              gridOptions={gridOptions}
              columnDefs={columnDefs}
              suppressMenuHide={true}
              animateRows={true}
              paginationPageSize={rowsPerPage}
              defaultColDef={defaultColDef}
              components={components}
              getRowStyle={getRowRowStyle}
              enableBrowserTooltips={true}
              tooltipShowDelay={0}
              tooltipHideDelay={1000}
            />
            <div className="pagination-div">
              <Pagination
                color="primary"
                count={Math.ceil(totalResultsCount / rowsPerPage)}
                page={page + 1}
                onChange={handleChangePagePagination}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnslavedTable;

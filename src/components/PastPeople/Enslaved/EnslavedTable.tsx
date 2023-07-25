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
import CustomHeader from '../../FunctionComponents/CustomHeader';
import { generateRowsData } from '@/utils/functions/generateRowsData';
import { setColumnDefs, setRowData, setData } from '@/redux/getTableSlice';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { useWindowSize } from '@react-hook/window-size';
import { Pagination, Skeleton, TablePagination } from '@mui/material';
import {
  ColumnDef,
  StateRowData,
  TableCellStructureInitialStateProp,
  TableCellStructure,
} from '@/share/InterfaceTypesTable';
import {
  AutoCompleteInitialState,
  RangeSliderState,
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved_table_cell_structure.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/african_origins_table_cell_structure.json';
import TEXAS_TABLE from '@/utils/flatfiles/texas_table_cell_structure.json';
import { ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetchAPI/pastEnslavedApi/fetchPastEnslavedOptionsList';
import ButtonDropdownSelectorEnslaved from './ColumnSelectorEnslavedTable/ButtonDropdownSelectorEnslaved';
import { generateColumnDef } from '@/utils/functions/generateColumnDef';

const EnslavedTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { columnDefs, data, rowData, loading } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
  );
  const { rangeSliderMinMax: rang, varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { autoCompleteValue, autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const { visibleColumnCells } = useSelector(
    (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
  );
  const {
    dataSetKeyPeople,
    dataSetValuePeople,
    dataSetValueBaseFilter,
    styleNamePeople,
    tableFlatfile: tableFileName,
  } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    getRowsPerPage(window.innerWidth, window.innerHeight)
  );
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const gridRef = useRef<any>(null);
  const [tablesCell, setTableCell] = useState<TableCellStructure[]>([]);
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
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
        // ** TODO Need to refactor later
        if (styleNamePeople === TYPESOFDATASETPEOPLE.allEnslaved) {
          setTableCell(ENSLAVED_TABLE.cell_structure);
        } else if (styleNamePeople === TYPESOFDATASETPEOPLE.africanOrigins) {
          setTableCell(AFRICANORIGINS_TABLE.cell_structure);
        } else if (styleNamePeople === TYPESOFDATASETPEOPLE.texas) {
          setTableCell(TEXAS_TABLE.cell_structure);
        }
      } catch (error) {
        console.error('Failed to load table cell structure:', error);
      }
    };
    loadTableCellStructure();
  }, [tableFileName, styleNamePeople]);

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
    (data: Record<string, any>[], visibleColumnCells: string[]) => {
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
      const newFormData: FormData = new FormData();
      newFormData.append('results_page', String(page + 1));
      newFormData.append('results_per_page', String(rowsPerPage));

      if (rang[varName] && currentEnslavedPage === 2) {
        newFormData.append(varName, String(rang[varName][0]));
        newFormData.append(varName, String(rang[varName][1]));
      }

      if (autoCompleteValue && varName) {
        for (let i = 0; i < autoLabelName.length; i++) {
          const label = autoLabelName[i];
          newFormData.append(varName, label);
        }
      }

      if (styleNamePeople !== TYPESOFDATASETPEOPLE.allEnslaved) {
        for (const value of dataSetValuePeople) {
          newFormData.append(dataSetKeyPeople, String(value));
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
    currentEnslavedPage,
    varName,
    rang,
    autoCompleteValue,
    autoLabelName,
    dataSetValuePeople,
    dataSetKeyPeople,
    dataSetValueBaseFilter,
    styleNamePeople,
    visibleColumnCells,
  ]);

  useEffect(() => {
    if (data.length > 0) {
      const finalRowData = generateRowsData(data, tableFileName);
      const newColumnDefs: ColumnDef[] = tablesCell.map(
        (value: TableCellStructure) =>
          generateColumnDef(value, visibleColumnCells)
      );
      dispatch(setColumnDefs(newColumnDefs));
      dispatch(setRowData(finalRowData as Record<string, any>[]));
    }
  }, [data, visibleColumnCells, dispatch]);

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
              <ButtonDropdownSelectorEnslaved />
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

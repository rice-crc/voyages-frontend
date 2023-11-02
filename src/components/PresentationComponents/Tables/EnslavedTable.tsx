import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import CustomHeader from '../../NavigationComponents/Header/CustomHeader';
import { setData, setRowData } from '@/redux/getTableSlice';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { useWindowSize } from '@react-hook/window-size';
import { Pagination, TablePagination } from '@mui/material';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import {
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
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import ButtonDropdownSelectorColumnEnslaved from '../../SelectorComponents/ButtonComponents/ButtonDropdownSelectorColumnEnslaved';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';
import ModalNetworksGraph from '@/components/PresentationComponents/NetworkGraph/ModalNetworksGraph';
import CardModal from '@/components/PresentationComponents/Cards/CardModal';
import { updateColumnDefsAndRowData } from '@/utils/functions/updateColumnDefsAndRowData';
import { createTopPositionEnslavedPage } from '@/utils/functions/createTopPositionEnslavedPage';

const EnslavedTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { columnDefs, data, rowData } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
  );
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
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
    styleNamePeople,
    tableFlatfile: tableFileName,
  } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  const { isChangeGeoTree, geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const [loading, setLoading] = useState<boolean>(false);
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
  const maxWidth = maxWidthSize(width);
  const [style, setStyle] = useState({
    width: maxWidth,
    height: height * 0.62,
  });
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
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
    const fetchData = async () => {
      const dataSend: { [key: string]: (string | number)[] } = {};

      dataSend['results_page'] = [page + 1];
      dataSend['results_per_page'] = [rowsPerPage];

      if (inputSearchValue) {
        dataSend['global_search'] = [String(inputSearchValue)];
      }
      if (rang[varName] && currentEnslavedPage === 2) {
        for (const rangKey in rang) {
          dataSend[rangKey] = [rang[rangKey][0]];
          dataSend[rangKey] = [rang[rangKey][1]];
        }
      }

      if (autoCompleteValue && varName) {
        for (const autoKey in autoCompleteValue) {
          for (const autoCompleteOption of autoCompleteValue[autoKey]) {
            if (typeof autoCompleteOption !== 'string') {
              const { label } = autoCompleteOption;
              dataSend[autoKey] = [label];
            }
          }
        }
      }

      if (styleNamePeople !== TYPESOFDATASETPEOPLE.allEnslaved) {
        for (const value of dataSetValuePeople) {
          dataSend[dataSetKeyPeople] = [String(value)];
        }
      }

      if (isChangeGeoTree && varName && geoTreeValue) {
        for (const keyValue in geoTreeValue) {
          for (const keyGeoValue of geoTreeValue[keyValue]) {
            dataSend[keyValue] = [String(keyGeoValue)];
          }
        }
      }
      setLoading(true)
      try {
        const response = await dispatch(
          fetchEnslavedOptionsList(dataSend)
        ).unwrap();
        if (response) {
          setTotalResultsCount(Number(response.headers.total_results_count));
          dispatch(setData(response.data));
          saveDataToLocalStorage(response.data, visibleColumnCells);
          setLoading(false)
        }
      } catch (error) {
        console.log('error', error);
        setLoading(false)
      }
    };
    fetchData();
    return () => {
      dispatch(setData([]));
      dispatch(setRowData([]));
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
    styleNamePeople,
    visibleColumnCells,
    geoTreeValue,
    inputSearchValue,
    styleNamePeople,
  ]);

  useEffect(() => {
    updateColumnDefsAndRowData(
      data,
      visibleColumnCells,
      dispatch,
      tableFileName,
      tablesCell
    );
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
  }, [page]);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value));
      setPage(0);
    },
    [page]
  );

  const handleChangePagePagination = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage - 1);
    },
    [page]
  );
  const topPosition = createTopPositionEnslavedPage(
    currentEnslavedPage,
    isFilter
  );
  return (
    <div style={{ marginTop: topPosition }}>
      <div style={containerStyle} className="ag-theme-alpine grid-container">
        <div style={style}>
          <span className="tableContainer">
            <ButtonDropdownSelectorColumnEnslaved />
            <TablePagination
              component="div"
              count={totalResultsCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 45, 50, 100]}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </span>
          {loading ? (
            <div className="loading-logo">
              <img src={LOADINGLOGO} />
            </div>
          ) : (
            <>
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
              </div></>
          )}
        </div>
      </div>
      <div>
        <ModalNetworksGraph />
      </div>
      <div>
        <CardModal />
      </div>
    </div>
  );
};

export default EnslavedTable;

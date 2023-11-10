import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers_table_cell_structure.json';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import CustomHeader from '../../NavigationComponents/Header/CustomHeader';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import {
  StateRowData,
  TableCellStructureInitialStateProp,
} from '@/share/InterfaceTypesTable';
import { setData } from '@/redux/getTableSlice';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import { useWindowSize } from '@react-hook/window-size';
import { Pagination, TablePagination } from '@mui/material';
import {
  AutoCompleteInitialState,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import ButtonDropdownSelectorEnslavers from '../../SelectorComponents/ButtonComponents/ButtonDropdownSelectorColumnEnslavers';
import { getMobileMaxHeightTable, getMobileMaxWidth, maxWidthSize } from '@/utils/functions/maxWidthSize';
import ModalNetworksGraph from '@/components/PresentationComponents/NetworkGraph/ModalNetworksGraph';
import CardModal from '@/components/PresentationComponents/Cards/CardModal';
import { updateColumnDefsAndRowData } from '@/utils/functions/updateColumnDefsAndRowData';
import { createTopPositionEnslaversPage } from '@/utils/functions/createTopPositionEnslaversPage';
import { handleSetDataSentTablePieBarScatterGraph } from '@/utils/functions/handleSetDataSentTablePieBarScatterGraph';
import { getRowHeightTable } from '@/utils/functions/getRowHeightTable';

const EnslaversTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const tablesCell = ENSLAVERS_TABLE.cell_structure;
  const { columnDefs, data, rowData } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
  );
  const { rangeSliderMinMax: rang, varName, isChange } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { autoCompleteValue, autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { visibleColumnCells } = useSelector(
    (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
  );
  const { isChangeGeoTree, geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { dataSetKeyPeople: dataSetKeyEnslavers, dataSetValuePeople: dataSetValueEnslavers, styleNamePeople: styleEnlsavers, tableFlatfileEnslavers } = useSelector(
    (state: RootState) => state.getEnslaverDataSetCollections
  );
  const [page, setPage] = useState<number>(0);
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState(
    getRowsPerPage(window.innerWidth, window.innerHeight)
  );


  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const gridRef = useRef<any>(null);

  const [width, height] = useWindowSize();
  const maxWidth = maxWidthSize(width);
  const [style, setStyle] = useState({
    width: maxWidth,
    height: height,
  });

  const containerStyle = useMemo(
    () => ({ width: maxWidth, height: height * 0.7 }),
    []
  );

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
      width: getMobileMaxWidth(maxWidth),
      height: getMobileMaxHeightTable(height),
    });
  }, [width, height, maxWidth]);
  const saveDataToLocalStorage = (
    data: Record<string, any>[],
    visibleColumnCells: string[]
  ) => {
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem(
      'visibleColumnCells',
      JSON.stringify(visibleColumnCells)
    );
  };

  useEffect(() => {
    saveDataToLocalStorage(data, visibleColumnCells);
  }, [data]);

  useEffect(() => {
    let subscribed = true;
    const fetchData = async () => {

      const dataSend = handleSetDataSentTablePieBarScatterGraph(autoCompleteValue, isChangeGeoTree, dataSetValueEnslavers, dataSetKeyEnslavers, inputSearchValue, geoTreeValue, varName, rang, undefined, undefined, isChange, styleEnlsavers, currentEnslaversPage)

      dataSend['results_page'] = [String(page + 1)];
      dataSend['results_per_page'] = [String(rowsPerPage)];

      setLoading(true)
      try {
        const response = await dispatch(
          fetchEnslaversOptionsList(dataSend)
        ).unwrap();
        if (response && subscribed) {
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
      subscribed = false;
    };
  }, [
    dispatch,
    rowsPerPage,
    page,
    currentEnslaversPage,
    varName,
    rang,
    autoCompleteValue,
    autoLabelName,
    dataSetValueEnslavers,
    dataSetValueEnslavers,
    styleEnlsavers,
    geoTreeValue,
    inputSearchValue,
  ]);

  useEffect(() => {
    const visibleColumns = tablesCell
      .filter((cell) => cell.visible)
      .map((cell) => cell.colID);
    dispatch(setVisibleColumn(visibleColumns));
  }, [dispatch]);

  useEffect(() => {
    updateColumnDefsAndRowData(
      data,
      visibleColumnCells,
      dispatch,
      tableFlatfileEnslavers,
      ENSLAVERS_TABLE.cell_structure
    );
  }, [data, visibleColumnCells, dispatch]);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
      initialWidth: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    };
  }, []);

  const components = useMemo(() => {
    return {
      agColumnHeader: CustomHeader,
    };
  }, []);

  const getRowRowStyle = () => {
    return {
      fontSize: 13,
      fontWeight: 500,
      color: '#000',
      fontFamily: `Roboto`,
      paddingLeft: '20px',
    };
  };

  const handleColumnVisibleChange = (params: any) => {
    const { columnApi } = params;
    const allColumns = columnApi.getAllColumns();
    const visibleColumns = allColumns
      .filter((column: any) => column.isVisible())
      .map((column: any) => column.getColId());

    dispatch(setVisibleColumn(visibleColumns));
  };
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

  const handleChangePage = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage);
    },
    [page]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value));
      setPage(0);
    },
    [page, rowsPerPage]
  );

  const handleChangePagePagination = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage - 1);
    },
    [page]
  );
  const topPosition = createTopPositionEnslaversPage(
    currentEnslaversPage,
    isFilter
  );
  return (
    <div style={{ marginTop: topPosition }}>
      <div style={containerStyle} className="ag-theme-alpine grid-container">
        <div style={style}>
          <span className="tableContainer">
            <ButtonDropdownSelectorEnslavers />
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
                getRowHeight={getRowHeightTable}
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

export default EnslaversTable;

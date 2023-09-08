import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import TABLE_FLAT from '@/utils/flatfiles/voyage_table_cell_structure__updated21June.json';
import { fetchVoyageOptionsAPI } from '@/fetchAPI/voyagesApi/fetchVoyageOptionsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import CustomHeader from '../../FunctionComponents/CustomHeader';
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
  CurrentPageInitialState,
  RangeSliderState,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import { ColumnSelector } from '@/components/FunctionComponents/ColumnSelectorTable/ColumnSelector';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';
import ModalNetworksGraph from '@/components/FunctionComponents/NetworkGraph/ModalNetworksGraph';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { VOYAGESTABLEFILE } from '@/share/CONST_DATA';
import CardModal from '@/components/FunctionComponents/Cards/CardModal';
import { updateColumnDefsAndRowData } from '@/utils/functions/updateColumnDefsAndRowData';

const VoyagesTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const tablesCell = TABLE_FLAT.cell_structure;
  const { columnDefs, data, rowData, loading } = useSelector(
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
  const { dataSetKey, dataSetValue, styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { isChangeGeoTree, geoTreeValue, geoTreeSelectValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const [page, setPage] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState(
    getRowsPerPage(window.innerWidth, window.innerHeight)
  );

  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const gridRef = useRef<any>(null);

  const [width, height] = useWindowSize();
  const maxWidth = maxWidthSize(width);
  const [style, setStyle] = useState({
    width: maxWidth,
    height: height * 0.62,
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
      width: maxWidth,
      height: height * 0.65,
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
  const fetchData = async () => {
    const newFormData: FormData = new FormData();
    newFormData.append('results_page', String(page + 1));
    newFormData.append('results_per_page', String(rowsPerPage));

    if (currentPage === 5) {
      for (const rangKey in rang) {
        newFormData.append(rangKey, String(rang[rangKey][0]));
        newFormData.append(rangKey, String(rang[rangKey][1]));
      }
    }

    if (autoCompleteValue && varName) {
      for (const autoKey in autoCompleteValue) {
        for (const autoCompleteOption of autoCompleteValue[autoKey]) {
          if (typeof autoCompleteOption !== 'string') {
            const { label } = autoCompleteOption;
            console.log('autoKey', autoKey);
            newFormData.append(autoKey, label);
          }
        }
      }
    }

    if (styleName !== TYPESOFDATASET.allVoyages) {
      for (const value of dataSetValue) {
        newFormData.append(dataSetKey, String(value));
      }
    }

    if (isChangeGeoTree && varName && geoTreeValue) {
      for (const keyValue in geoTreeValue) {
        for (const keyGeoValue of geoTreeValue[keyValue]) {
          newFormData.append(keyValue, String(keyGeoValue));
        }
      }
    }

    try {
      const response = await dispatch(
        fetchVoyageOptionsAPI(newFormData)
      ).unwrap();
      if (response) {
        setTotalResultsCount(Number(response.headers.total_results_count));
        dispatch(setData(response.data));
        saveDataToLocalStorage(response.data, visibleColumnCells);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    let subscribed = true;
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
    styleName,
    geoTreeValue,
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
      VOYAGESTABLEFILE,
      tablesCell
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

  return (
    <div>
      {loading ? (
        <div className="loading-logo">
          <img src={LOADINGLOGO} />
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
                rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 45, 50, 100]}
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
      <div>
        <ModalNetworksGraph />
      </div>
      <div>
        <CardModal />
      </div>
    </div>
  );
};

export default VoyagesTable;

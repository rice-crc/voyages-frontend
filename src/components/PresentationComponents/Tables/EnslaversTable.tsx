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
  TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { ENSLAVERS_TABLE_FILE } from '@/share/CONST_DATA';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import ButtonDropdownSelectorEnslavers from '../../SelectorComponents/ButtonComponents/ButtonDropdownSelectorColumnEnslavers';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';
import ModalNetworksGraph from '@/components/PresentationComponents/NetworkGraph/ModalNetworksGraph';
import CardModal from '@/components/PresentationComponents/Cards/CardModal';
import { updateColumnDefsAndRowData } from '@/utils/functions/updateColumnDefsAndRowData';

const EnslaversTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const tablesCell = ENSLAVERS_TABLE.cell_structure;
  const { columnDefs, data, rowData, loading } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
  );
  const { rangeSliderMinMax: rang, varName } = useSelector(
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
  const { isChangeGeoTree, geoTreeValue, geoTreeSelectValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const { dataSetKeyPeople, dataSetValuePeople, styleNamePeople } = useSelector(
    (state: RootState) => state.getEnslaverDataSetCollections
  );
  const [page, setPage] = useState<number>(0);
  const { currentEnslaversPage } = useSelector(
    (state: RootState) => state.getScrollEnslaversPage
  );
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

  useEffect(() => {
    let subscribed = true;
    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append('results_page', String(page + 1));
      newFormData.append('results_per_page', String(rowsPerPage));

      if (inputSearchValue) {
        newFormData.append('global_search', String(inputSearchValue));
      }
      if (rang[varName] && currentEnslaversPage === 2) {
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

              newFormData.append(autoKey, label);
            }
          }
        }
      }
      if (styleNamePeople !== TYPESOFDATASETPEOPLE.allEnslavers) {
        for (const value of dataSetValuePeople) {
          newFormData.append(dataSetKeyPeople, String(value));
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
          fetchEnslaversOptionsList(newFormData)
        ).unwrap();
        if (response && subscribed) {
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
    dataSetValuePeople,
    dataSetKeyPeople,
    styleNamePeople,
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
      ENSLAVERS_TABLE_FILE,
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

  return (
    <div>
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

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
import CustomHeaderTable from '../../NavigationComponents/Header/CustomHeaderTable';
import { setData, setPage } from '@/redux/getTableSlice';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { Pagination } from '@mui/material';
import {
  StateRowData,
  TableCellStructureInitialStateProp,
  TableCellStructure,
} from '@/share/InterfaceTypesTable';
import {
  CurrentPageInitialState,
  TableListPropsRequest,
} from '@/share/InterfaceTypes';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import ModalNetworksGraph from '@/components/PresentationComponents/NetworkGraph/ModalNetworksGraph';
import CardModal from '@/components/PresentationComponents/Cards/CardModal';
import { getRowHeightTable } from '@/utils/functions/getRowHeightTable';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { CustomTablePagination } from '@/styleMUI';
import ButtonDropdownColumnSelector from '@/components/SelectorComponents/ButtonComponents/ButtonDropdownColumnSelector';
import { useTableCellStructure } from '@/hooks/useTableCellStructure';
import { getHeaderColomnColor } from '@/utils/functions/getColorStyle';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import useDataTableProcessingEffect from '@/hooks/useDataTableProcessingEffect';
import { useOtherTableCellStructure } from '@/hooks/useOtherTableCellStructure';
import TableDownloadButtons from '@/components/SelectorComponents/ButtonComponents/TableDownloadButtons';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });

const Tables: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { styleName: styleNameRoute, currentBlockName } = usePageRouter();
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);
  const { textFilter } = useSelector(
    (state: RootState) => state.getShowFilterObject
  );

  const { textFilterValue } = useSelector(
    (state: RootState) => state.autoCompleteList
  );
  const { reloadTable } = useSelector(
    (state: RootState) => state.getSaveSearch
  );

  const { viewAll } = useSelector(
    (state: RootState) => state.getShowFilterObject
  );
  const { visibleColumnCells } = useSelector(
    (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
  );
  const { columnDefs, data, rowData, page } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
  );

  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const gridRef = useRef<any>(null);
  const [tablesCell, setTableCell] = useState<TableCellStructure[]>([]);

  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );
  // Voyages States
  const { tableFlatfileVoyages } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  // Enslaved States
  const { tableFlatfileEnslaved } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  // Enslavers States
  const { tableFlatfileEnslavers } = useSelector(
    (state: RootState) => state.getEnslaverDataSetCollections
  );

  const [rowsPerPage, setRowsPerPage] = useState(
    getRowsPerPage(window.innerWidth, window.innerHeight)
  );

  const otherTableCellStrructure = useOtherTableCellStructure(styleNameRoute!);
  const [sortColumn, setSortColumn] = useState<string[]>(
    otherTableCellStrructure?.default_order_by
      ? [otherTableCellStrructure?.default_order_by]
      : []
  );
  const {
    data: tableCellStructure,
    isLoading,
    isError,
  } = useTableCellStructure(styleNameRoute);

  useEffect(() => {
    if (!isLoading && !isError && tableCellStructure) {
      setTableCell(tableCellStructure as TableCellStructure[]);
    }

    // Get stored visible columns with safe parsing
    const storedValueVisibleColumns = localStorage.getItem('visibleColumns');
    let parsedValue = null;

    if (storedValueVisibleColumns) {
      try {
        parsedValue = JSON.parse(storedValueVisibleColumns);
        // Validate that parsed value is an array
        if (!Array.isArray(parsedValue)) {
          parsedValue = null;
        }
      } catch (error) {
        console.error('Invalid JSON in visibleColumns:', error);
        // Remove invalid data from localStorage
        localStorage.removeItem('visibleColumns');
      }
    }

    if (parsedValue) {
      dispatch(setVisibleColumn(parsedValue));
    } else if (tablesCell.length > 0) {
      const visibleColumns = tablesCell
        .filter((cell: any) => cell.visible)
        .map((cell: any) => cell.colID);
      dispatch(setVisibleColumn(visibleColumns));
      const visibleColumnsString = JSON.stringify(visibleColumns);
      localStorage.setItem('visibleColumns', visibleColumnsString);
    }

    const headerColor = getHeaderColomnColor(styleNameRoute!);
    document.documentElement.style.setProperty('--pagination-table--', headerColor);

    const handleResize = () => {
      setRowsPerPage(getRowsPerPage(window.innerWidth, window.innerHeight));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [
    dispatch,
    isLoading,
    isError,
    tablesCell,
    tableCellStructure,
    styleNameRoute,
    data,
  ]);

  const filters = filtersDataSend(
    filtersObj,
    styleNameRoute!,
    clusterNodeKeyVariable,
    clusterNodeValue
  );

  const newFilters =
    filters !== undefined &&
    filters!.map((filter) => {
      const { label, title, ...filteredFilter } = filter;
      return filteredFilter;
    });

  const dataSend: TableListPropsRequest = {
    filter: newFilters || [],
    page: Number(page + 1),
    page_size: Number(rowsPerPage),
  };

  useEffect(() => {
    const fetchDataTable = async () => {
      let response;
      if (inputSearchValue) {
        dataSend['global_search'] = inputSearchValue;
      }
      if (sortColumn) {
        dataSend['order_by'] = sortColumn;
      }
      try {
        if (checkPagesRouteForVoyages(styleNameRoute!)) {
          response = await dispatch(fetchVoyageOptionsAPI(dataSend)).unwrap();
        } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
          response = await dispatch(
            fetchEnslavedOptionsList(dataSend)
          ).unwrap();
        } else if (checkPagesRouteForEnslavers(styleNameRoute!)) {
          response = await dispatch(
            fetchEnslaversOptionsList(dataSend)
          ).unwrap();
        }
        if (response) {
          const { count, results } = response.data;
          setTotalResultsCount(() => Number(count));
          dispatch(setData(results));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchDataTable();
    return () => {
      if (!textFilter) {
        dispatch(setData([]));
      }
    };
  }, [
    dispatch,
    filtersObj,
    reloadTable,
    rowsPerPage,
    page,
    currentPage,
    currentEnslavedPage,
    inputSearchValue,
    currentBlockName,
    textFilterValue,
    styleNameRoute,
  ]);

  // Call the custom hook to Process Table Data
  useDataTableProcessingEffect(
    data,
    visibleColumnCells,
    tableFlatfileVoyages,
    tableFlatfileEnslaved,
    tableFlatfileEnslavers,
    tablesCell
  );


  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true
    }),
    []
  );

  const components = useMemo(
    () => ({
      agColumnHeader: (props: any) => {
        return (
          <CustomHeaderTable
            pageSize={rowsPerPage}
            setSortColumn={setSortColumn}
            {...props}
          />
        );
      },
    }),
    [rowsPerPage, setSortColumn] // Add dependencies here
  );

  const getRowRowStyle = useCallback(
    () => ({
      fontSize: '0.8rem',
      fontWeight: 500,
      color: '#000',
      fontFamily: 'sans-serif',
    }),
    []
  );

  const handleColumnVisibleChange = useCallback(
    (params: any) => {
      const allColumns = params.api.getColumns(); //* getAllColumns - removed, use api.getColumns instead. https://www.ag-grid.com/react-data-grid/upgrading-to-ag-grid-31/
      const visibleColumns = allColumns && allColumns.filter((column: any) => column.isVisible())
        .map((column: any) => column.getColId());
      dispatch(setVisibleColumn(visibleColumns));
      const visibleColumnsString = JSON.stringify(visibleColumns);
      localStorage.setItem('visibleColumns', visibleColumnsString);
    },
    [dispatch]
  );

  const gridOptions = useMemo(
    () => ({
      headerHeight: 35,
      suppressHorizontalScroll: true,
      onGridReady: (params: any) => {
        const { columnApi } = params;
        columnApi?.autoSizeColumns();
      },
    }),
    []
  );

  const handleChangePage = (event: any, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newPageSize = parseInt(event.target.value);
      setRowsPerPage(newPageSize);
      dispatch(setPage(0));
    },
    [dispatch]
  );

  const handleChangePagePagination = (event: any, newPage: number) => {
    dispatch(setPage(newPage - 1));
  };

  const pageCount = Math.ceil(
    totalResultsCount && rowsPerPage ? totalResultsCount / rowsPerPage : 1
  );
  // sx={{
  //   width: '100%',
  //   overflowY: 'auto',
  //   maxHeight: 'calc(100vh - 220px)',
  // }}
  return (
    <>
      <div
        className={!viewAll ? 'mobile-responsive' : 'mobile-responsive-view'}
      >
        <div className="ag-theme-alpine grid-container ag-theme-balham" style={{
          height: 'calc(90vh - 220px)', width: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto',
        }}>
          <span className="tableContainer">
            <ButtonDropdownColumnSelector />
            <div className="tableContainer">
              <CustomTablePagination
                component="div"
                count={totalResultsCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 8, 10, 12, 15, 20, 25, 30, 45, 50, 100]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <TableDownloadButtons
                data={rowData}
                columnDefs={columnDefs}
                filename={`${styleNameRoute}-table-data`}
              />
            </div>
          </span>
          <AgGridReact
            key={`grid-${rowsPerPage}`}
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            suppressMenuHide={true}
            animateRows={true}
            onColumnVisible={handleColumnVisibleChange}
            gridOptions={gridOptions}
            getRowHeight={getRowHeightTable}
            paginationPageSize={rowsPerPage}
            defaultColDef={defaultColDef}
            components={components}
            getRowStyle={getRowRowStyle}
            enableBrowserTooltips={true}
            tooltipShowDelay={0}
            tooltipHideDelay={1000}
            rowModelType="clientSide"
          />
        </div>
        <div className="pagination-div">
          <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={handleChangePagePagination}
          />
        </div>
      </div>
      <ModalNetworksGraph />
      <CardModal />
    </>
  );
};

export default Tables;

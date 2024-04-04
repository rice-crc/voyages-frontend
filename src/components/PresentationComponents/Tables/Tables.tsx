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
import { setColumnDefs, setData, setRowData } from '@/redux/getTableSlice';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getRowsPerPage';
import { Pagination } from '@mui/material';
import {
    StateRowData,
    TableCellStructureInitialStateProp,
    TableCellStructure,
    ColumnDef,
} from '@/share/InterfaceTypesTable';
import {
    CurrentPageInitialState,
    RangeSliderState,
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
import { generateRowsData } from '@/utils/functions/generateRowsData';
import { generateColumnDef } from '@/utils/functions/generateColumnDef';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';


const Tables: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { styleName: styleNameRoute, currentBlockName } = usePageRouter();
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);

    const { varName, isChange } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { visibleColumnCells } = useSelector(
        (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
    );

    const { columnDefs, data, rowData } = useSelector(
        (state: RootState) => state.getTableData as StateRowData
    );

    const { autoLabelName } = useSelector(
        (state: RootState) => state.autoCompleteList
    );

    const [totalResultsCount, setTotalResultsCount] = useState(0);
    const gridRef = useRef<any>(null);
    const [tablesCell, setTableCell] = useState<TableCellStructure[]>([]);

    const { inputSearchValue } = useSelector(
        (state: RootState) => state.getCommonGlobalSearch
    );


    const { isChangeGeoTree } = useSelector(
        (state: RootState) => state.getGeoTreeData
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

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(
        getRowsPerPage(window.innerWidth, window.innerHeight)
    );

    const {
        data: tableCellStructure,
        isLoading,
        isError,
    } = useTableCellStructure(styleNameRoute);

    useEffect(() => {
        if (!isLoading && !isError && tableCellStructure) {
            setTableCell(tableCellStructure);
        }
        if (tablesCell.length > 0) {
            const visibleColumns = tablesCell
                .filter((cell: any) => cell.visible)
                .map((cell: any) => cell.colID);
            dispatch(setVisibleColumn(visibleColumns));
        }

        const headerColor = getHeaderColomnColor(styleNameRoute!);

        document.documentElement.style.setProperty(
            '--pagination-table--',
            headerColor
        );
        const handleResize = () => {
            setRowsPerPage(getRowsPerPage(window.innerWidth, window.innerHeight));
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch, isLoading, isError, tablesCell, tableCellStructure, styleNameRoute!]);

    // set filters object to send to request data
    const filters = filtersDataSend(filtersObj, styleNameRoute!)
    const dataSend: TableListPropsRequest = {
        filter: filters,
        page: Number(page + 1),
        page_size: Number(rowsPerPage),
    };
    if (inputSearchValue) {
        dataSend['global_search'] = inputSearchValue;
    }

    useEffect(() => {
        const fetchDataTable = async () => {
            let response;
            if (inputSearchValue) {
                dataSend['global_search'] = inputSearchValue;
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
    }, [
        dispatch, filtersObj,
        rowsPerPage,
        page,
        currentPage,
        currentEnslavedPage,
        varName,
        inputSearchValue,
        isChange,
        isChangeGeoTree,
        autoLabelName,
        currentBlockName,
    ]);

    useEffect(() => {
        const tableFileName = checkPagesRouteForVoyages(styleNameRoute!)
            ? tableFlatfileVoyages
            : checkPagesRouteForEnslaved(styleNameRoute!)
                ? tableFlatfileEnslaved
                : checkPagesRouteForEnslavers(styleNameRoute!)
                    ? tableFlatfileEnslavers
                    : null;
        if (data.length > 0) {
            const finalRowData = generateRowsData(data, tableFileName!);


            const newColumnDefs: ColumnDef[] = tablesCell.map(
                (value: TableCellStructure) =>
                    generateColumnDef(value, visibleColumnCells)
            );
            dispatch(setColumnDefs(newColumnDefs));
            dispatch(setRowData(finalRowData as Record<string, any>[]));
        } else {
            dispatch(setRowData([]));
        }
        // Ensure to return undefined if there's no cleanup needed
        return undefined;
    }, [
        data,
        visibleColumnCells,
        dispatch,
        tableFlatfileVoyages,
        tableFlatfileEnslaved,
        tableFlatfileEnslavers, tablesCell
    ]);

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            resizable: true,
            filter: true,
            initialWidth: 220,
            wrapHeaderText: true,
            autoHeaderHeight: true,
        }),
        []
    );

    const components = useMemo(
        () => ({
            agColumnHeader: (props: any) => {
                return (
                    <CustomHeaderTable
                        page={page}
                        pageSize={rowsPerPage}
                        setPage={setPage}
                        {...props}
                    />
                );
            },
        }),
        []
    );

    const getRowRowStyle = useCallback(
        () => ({
            fontSize: 13,
            fontWeight: 500,
            color: '#000',
            fontFamily: 'sans-serif',
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

    const handleChangePage = useCallback(
        (event: any, newPage: number) => {
            setPage(newPage);
        },
        [page]
    );

    const handleChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setRowsPerPage(parseInt(event.target.value));
        },
        [page]
    );

    const handleChangePagePagination = useCallback(
        (event: any, newPage: number) => {
            setPage(newPage - 1);
        },
        []
    );

    const pageCount = Math.ceil(
        totalResultsCount && rowsPerPage ? totalResultsCount / rowsPerPage : 1
    );

    return (
        <div className="mobile-responsive">
            <div className="ag-theme-alpine grid-container">
                <span className="tableContainer">
                    <ButtonDropdownColumnSelector />
                    <CustomTablePagination
                        component="div"
                        count={totalResultsCount}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 8, 10, 15, 20, 25, 30, 45, 50, 100]}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </span>
                <>
                    <AgGridReact
                        domLayout={'autoHeight'}
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
                    />
                    <div className="pagination-div">
                        <Pagination
                            color="primary"
                            count={pageCount}
                            page={page + 1}
                            onChange={handleChangePagePagination}
                        />
                    </div>
                </>
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

export default Tables;

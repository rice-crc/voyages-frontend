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
import { Pagination } from '@mui/material';
import {
    StateRowData,
    TableCellStructureInitialStateProp,
    TableCellStructure,
} from '@/share/InterfaceTypesTable';
import {
    CurrentPageInitialState,
    Filter,
    RangeSliderState,
    TableListPropsRequest,
} from '@/share/InterfaceTypes';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import {
    getMobileMaxHeightTable,
    getMobileMaxWidth,
    maxWidthSize,
} from '@/utils/functions/maxWidthSize';
import ModalNetworksGraph from '@/components/PresentationComponents/NetworkGraph/ModalNetworksGraph';
import CardModal from '@/components/PresentationComponents/Cards/CardModal';
import { updateColumnDefsAndRowData } from '@/utils/functions/updateColumnDefsAndRowData';
import {
    createTopPositionEnslavedPage,
    createTopPositionEnslaversPage,
} from '@/utils/functions/createTopPositionEnslavedPage';
import { getRowHeightTable } from '@/utils/functions/getRowHeightTable';
import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
    checkPagesRouteForEnslaved,
    checkPagesRouteForEnslavers,
    checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { CustomTablePagination } from '@/styleMUI';
import ButtonDropdownColumnSelector from '@/components/SelectorComponents/ButtonComponents/ButtonDropdownColumnSelector';
import { setFilterObject } from '@/redux/getFilterSlice';
import { useTableCellStructure } from '@/hooks/useTableCellStructure';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';


const Tables: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { styleName: styleNameRoute } = usePageRouter();
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

    const [totalResultsCount, setTotalResultsCount] = useState(0);
    const gridRef = useRef<any>(null);
    const [tablesCell, setTableCell] = useState<TableCellStructure[]>([]);

    const { isChangeAuto } = useSelector(
        (state: RootState) => state.autoCompleteList
    );


    const { inputSearchValue } = useSelector(
        (state: RootState) => state.getCommonGlobalSearch
    );

    const { isChangeGeoTree } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );
    // Voyages States
    const { tableFlatfileVoyages } =
        useSelector((state: RootState) => state.getDataSetCollection);
    const { currentPage } = useSelector(
        (state: RootState) => state.getScrollPage as CurrentPageInitialState
    );

    // Enslaved States
    const { styleNamePeople, tableFlatfileEnslaved } = useSelector(
        (state: RootState) => state.getPeopleEnlavedDataSetCollection
    );
    const { currentEnslavedPage } = useSelector(
        (state: RootState) => state.getScrollEnslavedPage
    );

    // Enslavers States
    const { tableFlatfileEnslavers } =
        useSelector((state: RootState) => state.getEnslaverDataSetCollections);

    const { currentEnslaversPage } = useSelector(
        (state: RootState) => state.getScrollEnslaversPage
    );

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(
        getRowsPerPage(window.innerWidth, window.innerHeight)
    );

    const [width, height] = useWindowSize();
    const maxWidth = maxWidthSize(width);
    const [style, setStyle] = useState({
        width: maxWidth,
        height: height - 280,
    });

    const containerStyle = useMemo(
        () => ({ width: maxWidth, height: height * 0.7 }),
        [maxWidth, height]
    );

    const {
        data: tableCellStructure,
        isLoading,
        isError,
    } = useTableCellStructure(styleNameRoute);

    useEffect(() => {
        if (!isLoading && !isError && tableCellStructure) {
            setTableCell(tableCellStructure)
        }

    }, [tablesCell, isLoading, isError, isChangeAuto, isChangeGeoTree, isChange]);

    useEffect(() => {
        if (tablesCell.length > 0) {
            const visibleColumns = tablesCell
                .filter((cell: any) => cell.visible)
                .map((cell: any) => cell.colID);
            dispatch(setVisibleColumn(visibleColumns));
        }

        const handleResize = () => {
            setRowsPerPage(getRowsPerPage(window.innerWidth, window.innerHeight));
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch, tablesCell, tablesCell, tableCellStructure]);

    const dataSend: TableListPropsRequest = {
        filter: filtersObj[0]?.searchTerm?.length > 0 ? filtersObj : [],
        page: Number(page + 1),
        page_size: Number(rowsPerPage),
    };
    if (inputSearchValue) {
        dataSend['global_search'] = [inputSearchValue]
    }
    useEffect(() => {
        let subscribed = true;
        const fetchData = async () => {
            let response;
            try {
                if (checkPagesRouteForVoyages(styleNameRoute!)) {
                    response = await dispatch(fetchVoyageOptionsAPI(dataSend)).unwrap();
                } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
                    response = await dispatch(fetchEnslavedOptionsList(dataSend)).unwrap()
                } else if (checkPagesRouteForEnslavers(styleNameRoute!)) {
                    response = await dispatch(fetchEnslaversOptionsList(dataSend)).unwrap();
                }

                if (subscribed && response) {
                    const { count, results } = response.data;
                    setTotalResultsCount(Number(count));
                    dispatch(setData(results));
                    saveDataToLocalStorage(results, visibleColumnCells);

                }
            } catch (error) {
                console.log('error', error);

            }
        };
        fetchData();
        return () => {
            subscribed = false;
            dispatch(setData([]));
            dispatch(setRowData([]));
        };
    }, [
        dispatch,
        rowsPerPage,
        page,
        currentPage,
        currentEnslavedPage,
        varName,
        visibleColumnCells,
        inputSearchValue,
        styleNamePeople,
        isChangeAuto, isChange, isChangeGeoTree
    ]);

    useEffect(() => {
        const storedValue = localStorage.getItem('filterObject');
        if (!storedValue) return;

        const parsedValue = JSON.parse(storedValue);
        const filter: Filter[] = parsedValue.filter;
        if (!filter) return;

        dispatch(setFilterObject(filter));
        setStyle({
            width: getMobileMaxWidth(maxWidth),
            height: getMobileMaxHeightTable(height),
        });
        saveDataToLocalStorage(data, visibleColumnCells);
    }, [width, height, maxWidth, data]);

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
        const tableFileName = checkPagesRouteForVoyages(styleNameRoute!)
            ? tableFlatfileVoyages
            : checkPagesRouteForEnslaved(styleNameRoute!)
                ? tableFlatfileEnslaved
                : checkPagesRouteForEnslavers(styleNameRoute!)
                    ? tableFlatfileEnslavers
                    : null;

        updateColumnDefsAndRowData(
            data,
            visibleColumnCells,
            dispatch,
            tableFileName!,
            tablesCell
        );
    }, [
        data,
        visibleColumnCells,
        dispatch,
        tableFlatfileVoyages,
        tableFlatfileEnslaved,
        tableFlatfileEnslavers,
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
                return <CustomHeader page={page} pageSize={rowsPerPage} {...props} />;
            },

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
        [page]
    );

    const handleChangePagePagination = useCallback(
        (event: any, newPage: number) => {
            setPage(newPage - 1);
        },
        [page]
    );

    let topPositionPage = 0;
    if (checkPagesRouteForVoyages(styleNameRoute!)) {
        topPositionPage = createTopPositionVoyages(currentPage, inputSearchValue!);
    } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
        topPositionPage = createTopPositionEnslavedPage(
            currentEnslavedPage,
            inputSearchValue!
        );
    } else {
        topPositionPage = createTopPositionEnslaversPage(
            currentEnslaversPage,
            inputSearchValue!
        );
    }
    const pageCount = Math.ceil(
        totalResultsCount && rowsPerPage ? totalResultsCount / rowsPerPage : 1
    );

    return (
        <div style={{ marginTop: topPositionPage }} className="mobile-responsive">
            <div style={containerStyle} className="ag-theme-alpine grid-container">
                <div style={style}>
                    <span className="tableContainer">
                        <ButtonDropdownColumnSelector />
                        <CustomTablePagination
                            component="div"
                            count={totalResultsCount}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 12, 10, 15, 20, 25, 30, 45, 50, 100]}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </span>
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
                                count={pageCount}
                                page={page + 1}
                                onChange={handleChangePagePagination}
                            />
                        </div>
                    </>
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

export default Tables;



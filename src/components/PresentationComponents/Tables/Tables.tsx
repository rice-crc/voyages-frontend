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
    AutoCompleteInitialState, CurrentPageInitialState,
    RangeSliderState,
    TYPESOFDATASETPEOPLE,
} from '@/share/InterfaceTypes';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved_table_cell_structure.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/african_origins_table_cell_structure.json';
import TEXAS_TABLE from '@/utils/flatfiles/texas_table_cell_structure.json';
import VOYAGESTABLE_FLAT from '@/utils/flatfiles/voyage_table_cell_structure__updated21June.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers_table_cell_structure.json';
import { fetchVoyageOptionsAPI } from '@/fetch/voyagesFetch/fetchVoyageOptionsAPI';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import { fetchEnslavedOptionsList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedOptionsList';
import { getMobileMaxHeightTable, getMobileMaxWidth, maxWidthSize } from '@/utils/functions/maxWidthSize';
import ModalNetworksGraph from '@/components/PresentationComponents/NetworkGraph/ModalNetworksGraph';
import CardModal from '@/components/PresentationComponents/Cards/CardModal';
import { updateColumnDefsAndRowData } from '@/utils/functions/updateColumnDefsAndRowData';
import { createTopPositionEnslavedPage, createTopPositionEnslaversPage } from '@/utils/functions/createTopPositionEnslavedPage';
import { handleSetDataSentTablePieBarScatterGraph } from '@/utils/functions/handleSetDataSentTablePieBarScatterGraph';
import { getRowHeightTable } from '@/utils/functions/getRowHeightTable';
import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { usePageRouter } from '@/hooks/usePageRouter';
import { fetchEnslaversOptionsList } from '@/fetch/pastEnslaversFetch/fetchPastEnslaversOptionsList';
import { checkPagesRouteForEnslaved, checkPagesRouteForEnslavers, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { ENSALVERSTYLE } from '@/share/CONST_DATA';
import { CustomTablePagination } from '@/styleMUI';
import ButtonDropdownColumnSelector from '@/components/SelectorComponents/ButtonComponents/ButtonDropdownColumnSelector';

const Tables: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { styleName: styleNameRoute } = usePageRouter()

    const { rangeSliderMinMax: rang, varName, isChange } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { autoCompleteValue, autoLabelName } = useSelector(
        (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
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

    const { inputSearchValue } = useSelector(
        (state: RootState) => state.getCommonGlobalSearch
    );

    const { isChangeGeoTree, geoTreeValue } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );
    // Voyages States
    const { dataSetKey, dataSetValue, styleName, tableFlatfileVoyages, dataSetValueBaseFilter } = useSelector(
        (state: RootState) => state.getDataSetCollection
    );
    const { currentPage } = useSelector(
        (state: RootState) => state.getScrollPage as CurrentPageInitialState
    );

    // Enslaved States
    const {
        dataSetKeyPeople,
        dataSetValuePeople,
        styleNamePeople,
        tableFlatfileEnslaved
    } = useSelector(
        (state: RootState) => state.getPeopleEnlavedDataSetCollection
    );
    const { currentEnslavedPage } = useSelector(
        (state: RootState) => state.getScrollEnslavedPage
    );

    // Enslavers States
    const { dataSetKeyPeople: dataSetKeyEnslavers, dataSetValuePeople: dataSetValueEnslavers, styleNamePeople: styleEnlsavers, tableFlatfileEnslavers } = useSelector(
        (state: RootState) => state.getEnslaverDataSetCollections
    );

    const { currentEnslaversPage } = useSelector(
        (state: RootState) => state.getScrollEnslaversPage
    );

    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(
        getRowsPerPage(window.innerWidth, window.innerHeight)
    );


    const [width, height] = useWindowSize();
    const maxWidth = maxWidthSize(width);
    const [style, setStyle] = useState({
        width: maxWidth,
        height: height,
    });

    const containerStyle = useMemo(
        () => ({ width: maxWidth, height: height * 0.7 }),
        [maxWidth, height]
    );


    useEffect(() => {
        const loadTableCellStructure = async () => {
            try {
                if (checkPagesRouteForVoyages(styleNameRoute!)) {
                    setTableCell(VOYAGESTABLE_FLAT.cell_structure);
                } else if (styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved) {
                    setTableCell(ENSLAVED_TABLE.cell_structure);
                } else if (styleNameRoute === TYPESOFDATASETPEOPLE.africanOrigins) {
                    setTableCell(AFRICANORIGINS_TABLE.cell_structure);
                } else if (styleNameRoute === TYPESOFDATASETPEOPLE.texas) {
                    setTableCell(TEXAS_TABLE.cell_structure);
                } else if (styleNameRoute === ENSALVERSTYLE) {
                    setTableCell(ENSLAVERS_TABLE.cell_structure);
                }
            } catch (error) {
                console.error('Failed to load table cell structure:', error);
            }
        };
        loadTableCellStructure();
    }, [tableFlatfileEnslaved, styleNamePeople, styleName, styleNameRoute, styleEnlsavers, tableFlatfileEnslavers, tableFlatfileVoyages]);

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
            width: getMobileMaxWidth(maxWidth),
            height: getMobileMaxHeightTable(height),
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
            let dataSend: Record<string, any> = {};
            if (checkPagesRouteForVoyages(styleNameRoute!)) {
                dataSend = handleSetDataSentTablePieBarScatterGraph(autoCompleteValue, isChangeGeoTree, dataSetValue, dataSetKey, inputSearchValue, geoTreeValue, varName, rang, styleName, currentPage, isChange, undefined, undefined)
            } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
                dataSend = handleSetDataSentTablePieBarScatterGraph(autoCompleteValue, isChangeGeoTree, dataSetValuePeople, dataSetKeyPeople, inputSearchValue, geoTreeValue, varName, rang, undefined, undefined, isChange, styleNamePeople, currentEnslavedPage)
            } else if (checkPagesRouteForEnslavers(styleNameRoute!)) {
                dataSend = handleSetDataSentTablePieBarScatterGraph(autoCompleteValue, isChangeGeoTree, dataSetValueEnslavers, dataSetKeyEnslavers, inputSearchValue, geoTreeValue, varName, rang, undefined, undefined, isChange, styleEnlsavers, currentEnslaversPage)
            }

            dataSend['results_page'] = [String(page + 1)];
            dataSend['results_per_page'] = [String(rowsPerPage)];

            setLoading(true)
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
        rang,
        autoCompleteValue,
        autoLabelName,
        visibleColumnCells,
        geoTreeValue,
        inputSearchValue,
        dataSetValue,
        dataSetKey,
        dataSetValueBaseFilter,
        styleName,
        dataSetValuePeople,
        dataSetKeyPeople,
        styleNamePeople,
        styleEnlsavers,
        dataSetKeyEnslavers,
        dataSetKeyEnslavers

    ]);

    useEffect(() => {
        const tableFileName =
            checkPagesRouteForVoyages(styleNameRoute!)
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
    }, [data, visibleColumnCells, dispatch, tableFlatfileVoyages, tableFlatfileEnslaved, tableFlatfileEnslavers, dataSetKey, dataSetValue,]);


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

    let topPositionPage = 0;
    if (checkPagesRouteForVoyages(styleNameRoute!)) {
        topPositionPage = createTopPositionVoyages(currentPage, inputSearchValue!);
    } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {

        topPositionPage = createTopPositionEnslavedPage(currentEnslavedPage, inputSearchValue!)
    } else {
        topPositionPage = createTopPositionEnslaversPage(currentEnslaversPage, inputSearchValue!);
    }

    return (
        <div style={{ marginTop: topPositionPage }} className='mobile-responsive'>
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
                                count={Math.ceil(totalResultsCount / rowsPerPage)}
                                page={page + 1}
                                onChange={handleChangePagePagination}
                            />
                        </div></>
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

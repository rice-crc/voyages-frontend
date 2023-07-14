import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import TABLE_FLAT from '@/utils/flatfiles/voyage_table_cell_structure__updated21June.json';
import { fetchVoyageOptionsPagination } from '@/fetchAPI/voyagesApi/fetchVoyageOptionsPagination';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import CustomHeader from '../../FunctionComponents/CustomHeader';
import { generateRowsData } from '@/utils/functions/generateRowsData';
import {
  ColumnDef,
  StateRowData,
  TableCellStructureInitialStateProp,
  VoyageOptionsGropProps,
  VoyageTableCellStructure,
} from '@/share/InterfaceTypesTable';
import { setColumnDefs, setRowData, setData } from '@/redux/getTableSlice';
import { ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '@/style/table.scss';
import { useWindowSize } from '@react-hook/window-size';
import { Pagination, Skeleton, TablePagination } from '@mui/material';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  RangeSliderState,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import { ColumnSelector } from '@/components/FunctionComponents/ColumnSelectorTable/ColumnSelector';
import { setVisibleColumn } from '@/redux/getColumnSlice';
import { getRowsPerPage } from '@/utils/functions/getBreakPoints';
import { hasValueGetter } from '@/utils/functions/hasValueGetter';

const VoyagesTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const tablesCell = TABLE_FLAT.cell_structure;
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
  const { dataSetKey, dataSetValue, dataSetValueBaseFilter, styleName } =
    useSelector((state: RootState) => state.getDataSetCollection);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState(
    getRowsPerPage(window.innerWidth, window.innerHeight)
  );

  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const gridRef = useRef<any>(null);

  const [width, height] = useWindowSize();
  const maxWidth =
    width > 1024
      ? width > 1440
        ? width * 0.88
        : width * 0.92
      : width === 1024
      ? width * 0.895
      : width === 768
      ? width * 0.95
      : width < 768
      ? width * 0.92
      : width * 0.75;
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
    data: VoyageOptionsGropProps[],
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
      setLoading(true);
      const newFormData: FormData = new FormData();
      newFormData.append('results_page', String(page + 1));
      newFormData.append('results_per_page', String(rowsPerPage));
      if (rang[varName] && currentPage === 5) {
        newFormData.append(varName, String(rang[varName][0]));
        newFormData.append(varName, String(rang[varName][1]));
      }

      if (autoCompleteValue && varName) {
        for (let i = 0; i < autoLabelName.length; i++) {
          const label = autoLabelName[i];
          newFormData.append(varName, label);
        }
      }

      if (styleName !== TYPESOFDATASET.allVoyages) {
        for (const value of dataSetValue) {
          newFormData.append(dataSetKey, String(value));
        }
      }

      try {
        const response = await dispatch(
          fetchVoyageOptionsPagination(newFormData)
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
  ]);
  useEffect(() => {
    const visibleColumns = tablesCell
      .filter((cell) => cell.visible)
      .map((cell) => cell.colID);
    dispatch(setVisibleColumn(visibleColumns));
  }, [dispatch]);

  useEffect(() => {
    if (data.length > 0) {
      const finalRowData = generateRowsData(data);
      const newColumnDefs: ColumnDef[] = tablesCell.map(
        (value: VoyageTableCellStructure) => {
          const columnDef = {
            headerName: value.header_label,
            field: value.colID,
            width: value.colID === 'voyage_sources' ? 300 : 200,
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
                    value.colID === 'voyage_sources' ? 'inherit' : 'ellipsis', // "ellipsis",
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
            valueGetter: (params: ICellRendererParams) =>
              hasValueGetter(params, value),
          };
          return columnDef;
        }
      );
      dispatch(setColumnDefs(newColumnDefs));
      dispatch(setRowData(finalRowData as Record<string, any>[]));
    }
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

export default VoyagesTable;

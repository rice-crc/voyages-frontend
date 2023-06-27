import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import TABLE_FLAT from "@/utils/voyage_table_cell_structure__updated21June.json";
import { fetchVoyageOptionsPagination } from "@/fetchAPI/fetchVoyageOptionsPagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CustomHeader from "../../fcComponets/customHeader";
import { generateRowsData } from "@/utils/generateRowsData";
import {
  ColumnDef,
  StateRowData,
  TableCellStructureInitialStateProp,
  VoyageOptionsGropProps,
  VoyageTableCellStructure,
} from "@/share/InterfaceTypesTable";
import { setColumnDefs, setRowData, setData } from "@/redux/getTableSlice";
import { ICellRendererParams, ITooltipParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/style/table.scss";
import { useWindowSize } from "@react-hook/window-size";
import { Pagination, Skeleton, TablePagination } from "@mui/material";
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  RangeSliderState,
} from "@/share/InterfaceTypes";
import ColumnSelector from "@/components/fcComponets/ColumnSelectorTable/ColumnSelector";
import { setVisibleColumn } from "@/redux/getColumnSlice";

const Table: React.FC = () => {
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
    // height: "calc(100vh - 200px)",
  });

  const containerStyle = useMemo(
    () => ({ width: maxWidth, height: height * 0.7 }),
    []
  );

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const gridRef = useRef<any>(null);

  const saveDataToLocalStorage = (
    data: VoyageOptionsGropProps[],
    visibleColumnCells: string[]
  ) => {
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem(
      "visibleColumnCells",
      JSON.stringify(visibleColumnCells)
    );
  };

  const fetchDataFromLocalStorage = () => {
    const storedData = localStorage.getItem("data");
    const storedVisibleColumnCells = localStorage.getItem("data");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // console.log("parsedData", parsedData);
      // Do something with the retrieved data
    }
  };

  useEffect(() => {
    saveDataToLocalStorage(data, visibleColumnCells);
  }, [data]);

  useEffect(() => {
    fetchDataFromLocalStorage();
  }, []);

  useEffect(() => {
    let subscribed = true;
    const fetchData = async () => {
      setLoading(true);
      const newFormData: FormData = new FormData();
      newFormData.append("results_page", String(page + 1));
      newFormData.append("results_page", String(page + 1));
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
        console.log("error", error);
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
            sortable: true,
            sortingOrder: value.order_by,
            headerTooltip: value.header_label,
            hide: !visibleColumnCells.includes(value.colID),
            filter: true,
            cellRenderer: (params: ICellRendererParams) => {
              const values = params.value;
              if (Array.isArray(values)) {
                const style: CSSProperties = {
                  backgroundColor: "#e5e5e5",
                  borderRadius: "8px",
                  padding: "0px 10px 5px 10px",
                  height: "25px",
                  whiteSpace: "nowrap",
                  width: "160px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: "5px 0",
                  textAlign: "center",
                  lineHeight: "25px",
                  fontSize: "13px",
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
            valueGetter: (params: ICellRendererParams) => {
              const finalData: string[] = [];
              const data = params.data;
              const fields = value.cell_val.fields;
              const firstData = data[fields[0].var_name];
              const joinDelimiter: string | undefined = value.cell_val.join;
              if (value.cell_type === "literal") {
                return data[fields[0].var_name] ?? "--";
              } else if (
                value.cell_type === "literal-concat" &&
                Array.isArray(firstData)
              ) {
                for (let i = 0; i < firstData?.length; i++) {
                  const dataResult = [];
                  for (let j = 0; j < fields.length; j++) {
                    const fieldName = fields[j].var_name;
                    const fieldValue = data[fieldName][i];
                    dataResult.push(String(fieldValue));
                  }
                  finalData.push(dataResult.join(joinDelimiter));
                }
                return finalData.length !== 0 ? finalData : "--";
              } else if (value.cell_type === "literal-concat") {
                let dataValue: string = "";
                for (let i = 0; i < fields.length; i++) {
                  const fieldName = fields[i].var_name;
                  const fieldValue = data[fieldName];
                  if (fieldValue !== null) {
                    dataValue += fieldValue + ",";
                  }
                }
                const result = dataValue.substring(0, dataValue.length - 1);
                return result;
              }
            },
          };
          return columnDef;
        }
      );
      dispatch(setColumnDefs(newColumnDefs));
      dispatch(setRowData(finalRowData));
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
      color: "#000",
      fontFamily: `Roboto`,
      paddingLeft: "20px",
    };
  };

  const getRowHeight = (params: any) => {
    const data = params.data;
    const lineHeight = 32.5;
    let numLines = 1.2;
    Object.values(data).forEach((value) => {
      if (Array.isArray(value)) {
        if (value.length > numLines) {
          numLines = value.length;
        }
      }
    });
    return numLines * lineHeight;
  };

  const gridOptions = useMemo(
    () => ({
      getRowHeight,
      headerHeight: 40,
      suppressHorizontalScroll: true,
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
  const handleColumnVisibleChange = (params: any) => {
    const { columnApi } = params;
    const allColumns = columnApi.getAllColumns();
    const visibleColumns = allColumns
      .filter((column: any) => column.isVisible())
      .map((column: any) => column.getColId());

    dispatch(setVisibleColumn(visibleColumns));
  };

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
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ColumnSelector />
              <TablePagination
                component="div"
                count={totalResultsCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[10, 15, 20, 25]}
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

export default Table;

import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import TABLE_FLAT from "@/utils/voyage_table_cell_structure__updated.json";
import { fetchVoyageOptionsPagination } from "@/fetchAPI/fetchVoyageOptionsPagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import CustomHeader from "../../fcComponets/customHeader";
import { generateRowsData } from "@/utils/generateRowsData";
import {
  ColumnDef,
  StateRowData,
  VoyageTableCellStructure,
} from "@/share/InterfaceTypesTable";
import { setColumnDefs, setRowData, setData } from "@/redux/getTableSlice";
import CustomTooltip from "../../fcComponets/CustomTooltip";
import { ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/style/table.scss";
import { useWindowSize } from "@react-hook/window-size";
import { Pagination, Skeleton } from "@mui/material";
import { CustomTablePagination } from "@/styleMUI";

const Table: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { columnDefs, data, rowData } = useSelector(
    (state: RootState) => state.getTableData as StateRowData
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
      ? width * 0.92
      : width * 0.95;
  const [style, setStyle] = useState({
    width: maxWidth,
    height: height * 0.6,
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

  useEffect(() => {
    let subscribed = true;
    const fetchData = async () => {
      setLoading(true);
      const newFormData: FormData = new FormData();
      newFormData.append("results_page", String(page + 1));
      newFormData.append("results_page", String(page + 1));
      try {
        const response = await dispatch(
          fetchVoyageOptionsPagination(newFormData)
        ).unwrap();
        if (subscribed) {
          setTotalResultsCount(response.headers.total_results_count);
          dispatch(setData(response.data));
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
  }, [dispatch, rowsPerPage, page]);

  useEffect(() => {
    if (data.length > 0) {
      const finalRowData = generateRowsData(data);
      const columns: ColumnDef[] = [];
      const tablesCell = TABLE_FLAT.cell_structure;

      tablesCell.forEach((value: VoyageTableCellStructure) => {
        const columnDef = {
          headerName: value.header_label,
          field: value.colID,
          sortingOrder: value.order_by,
          cellRenderer: (params: ICellRendererParams) => {
            const values = params.value;
            if (Array.isArray(values)) {
              const style: CSSProperties = {
                backgroundColor: "#e5e5e5",
                borderRadius: "8px",
                padding: "4px 6px",
                margin: "5px",
                whiteSpace: "pre-line",
              };
              const renderedValues = values.map(
                (value: string, index: number) => (
                  <span key={`${index}-${value}`} style={style}>
                    {`${value}\n`}
                  </span>
                )
              );
              return <div>{renderedValues}</div>;
            } else {
              return values;
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
          sortable: true,
          resizable: true,
          filter: true,
          tooltipComponent: CustomTooltip,
        };
        columns.push(columnDef);
      });
      dispatch(setColumnDefs(columns));
      dispatch(setRowData(finalRowData));
    }
  }, [data]);

  const defaultColDef = useMemo(() => {
    return {
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    };
  }, []);

  const components = useMemo(() => {
    return {
      agColumnHeader: CustomHeader,
    };
  }, []);

  const getRowRowStyle = () => {
    return {
      fontSize: 14,
      fontWeight: 500,
      color: "#000",
      fontFamily: `Roboto`,
      paddingLeft: "20px",
    };
  };

  const getRowHeight = (params: any) => {
    const data = params.data;
    const lineHeight = 42;
    let numLines = 1;
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
      setRowsPerPage(parseInt(event.target.value, 10));
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
    <div style={containerStyle}>
      {loading ? (
        <div className="Skeleton-loading">
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </div>
      ) : (
        <>
          <div
            className="ag-theme-alpine"
            style={{ height: "calc(100% - 25px)" }}
          >
            <CustomTablePagination
              count={totalResultsCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 15, 20, 25]}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <div style={style}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                gridOptions={gridOptions}
                columnDefs={columnDefs}
                suppressMenuHide={true}
                animateRows={true}
                paginationPageSize={rowsPerPage}
                defaultColDef={defaultColDef}
                components={components}
                getRowStyle={getRowRowStyle}
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
        </>
      )}
    </div>
  );
};

export default Table;
